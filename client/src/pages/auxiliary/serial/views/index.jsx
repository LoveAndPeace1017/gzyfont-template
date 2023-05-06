import React, {Component} from 'react';
import _ from "lodash";
import { Form, Button, message, Table, Input, Select} from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {asyncFetchSerialList, asyncAddSerial} from "../actions";
import defaultOptions from 'utils/validateOptions';
import {getNowFormatDate} from 'utils/format';
import intl from 'react-intl-universal';
import classNames from "classnames/bind";
import auxStyles from "../../styles/index.scss";
const cxAux = classNames.bind(auxStyles);
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);
const {Column} = Table;
const {Option} = Select;

class Index extends Component {
    formRef = React.createRef();

    state={
        serialList: null,  // 列表数据
        isFetching: true
    };

    handleSubmit = () => {
        this.formRef.current.validateFields().then((values)=>{
            this.props.asyncAddSerial(values, (res) => {
                if (res.data.retCode === '0') {
                    this.getList();
                    message.success('操作成功！');
                }
                else {
                    message.error(res.data.retMsg);
                }
            })
        })
    };

    componentDidMount() {
        this.getList();
    }

    getList = () => {
        this.props.asyncFetchSerialList(null, (serialList) => {
            let prefix = {}, date = {};
            if(serialList && serialList.length > 0){
                _.forEach(serialList, (list) => {
                    prefix[list.module] = list.prefix;
                    date[list.module] = list.date;
                })
            }
            this.setState({ serialList, isFetching: false }, () => {
                this.formRef.current.setFieldsValue({
                    prefix, date
                })
            });
        });
    };

    render() {
        const { serialList, isFetching } = this.state;

        return (
            <React.Fragment>
                <Form ref={this.formRef}>
                    <div className={cxAux("aux-list")}>
                        <Table
                            dataSource={serialList}
                            pagination={false}
                            loading={isFetching}
                            className={cxAux("tb-aux")}
                            scroll={{y:1000}}
                        >
                            <Column
                                title={intl.get("auxiliary.serial.name")}
                                dataIndex="name"
                                key="name"
                                width="18%"
                                render={(name) => (
                                    <React.Fragment>
                                        {intl.get(name)}
                                    </React.Fragment>
                                )}
                            />
                            <Column
                                title={intl.get("auxiliary.serial.prefix")}
                                dataIndex="prefix"
                                key="prefix"
                                width="21%"
                                render={(prefix, record)=>(
                                    <React.Fragment>
                                        <Form.Item
                                            className={cx("prefix-item")}
                                            {...defaultOptions}
                                            name={['prefix', record.module]}
                                            rules={[{required: true, message: "前缀为必填项！"}, {max: 15, message: "前缀不能超过15个字符!"}]}
                                        >
                                            <Input
                                                maxLength={15}
                                                className={cx("prefix-inp")}
                                            />
                                        </Form.Item>
                                        <span className={cx("split")}>-</span>
                                    </React.Fragment>
                                )}
                            />
                            <Column
                                title={intl.get("auxiliary.serial.date")}
                                dataIndex="date"
                                key="date"
                                width="21%"
                                render={(date, record)=>(
                                    <React.Fragment>
                                        <Form.Item
                                            className={cx("date")}
                                            {...defaultOptions}
                                            name={['date', record.module]}
                                        >
                                            <Select
                                                className={cx('date-select')}
                                                onChange={(value)=>this.props.changeDate(module, value)}
                                            >
                                                <Option key={getNowFormatDate({format:'YY-MM'})} >{getNowFormatDate({format:'YY-MM'})}</Option>
                                                <Option key={getNowFormatDate({format:'YY-MM-DD'})}>{getNowFormatDate({format:'YY-MM-DD'})}</Option>
                                            </Select>
                                        </Form.Item>
                                        <span className={cx("split")}>-</span>
                                    </React.Fragment>
                                )}
                            />
                            <Column
                                title={intl.get("auxiliary.serial.serial")}
                                dataIndex="serial"
                                key="serial"
                                width="12%"
                            />
                            <Column
                                title={intl.get("auxiliary.serial.preview")}
                                dataIndex="preview"
                                key="preview"
                                width="28%"
                                render={(preview, record) => (
                                    <React.Fragment>
                                        {`${record.prefix}-${record.date}-${record.serial}`}
                                    </React.Fragment>
                                )}
                            />
                        </Table>
                    </div>
                    <div className={cx("aux-serial-ope")}>
                        <Button
                            type="default"
                            onClick={this.props.onClose}
                        >{intl.get('common.confirm.cancelText')}</Button>
                        <Button
                            type="primary"
                            loading={this.props.addSerial.get('isFetching')}
                            onClick={this.handleSubmit}
                        >{intl.get('common.confirm.save')}</Button>
                    </div>
                </Form>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        addSerial: state.getIn(['auxiliarySerial', 'addSerial'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchSerialList,
        asyncAddSerial
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)
