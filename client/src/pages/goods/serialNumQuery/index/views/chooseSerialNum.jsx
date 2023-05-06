import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Table, Button, Input, Modal, message } from "antd";
const { TextArea } = Input;
const confirm = Modal.confirm;
import moment from 'moment-timezone';
import intl from 'react-intl-universal';
moment.tz.setDefault("Asia/Shanghai");
import Icon from 'components/widgets/icon';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

import * as constants from 'utils/constants';

/**
 *  选择序列号弹层内容
 *
 * @visibleName chooseSerialNum(物品联想选择)
 * @author jinb
 *
 */

class ChooseSerialNum extends Component {
    constructor(props){
        super(props);
        let serialNumber = props.serialNumber ? props.serialNumber.split(',') : [];
        console.log(serialNumber, 'serialNumber');
        this.state = {
            repeatSerialNum: [], // 存放重复序列号
            serialNumber
        }
    }

    // 添加序列号
    addSerialNum = (value) => {
        const {form: {getFieldValue, setFieldsValue}} = this.props;
        let {serialNumber} = this.state;
        let serialText = getFieldValue('serialText') || value;  // value为扫码枪识别的值 ，如果输入框有值，直接去输入框值
        let serialList = serialText.split(',');
        let repeatSerialNums = [];

        for(var i = 0; i < serialList.length; i++){
            let curSerialNum = serialList[i].replace(/\s+/g,"");
            if(!curSerialNum) continue;
            if(serialNumber.indexOf(curSerialNum)=== -1){
                serialNumber.push(curSerialNum);
            } else {
                repeatSerialNums.push(curSerialNum);
            }
        }

        if(repeatSerialNums.length > 0){
            message.error(intl.get("goods.serialNumQuery.content1")+` ${repeatSerialNums.join('、')}`)
        } else {
            this.setState({serialNumber});
            setFieldsValue({serialText: ''}); // 清空
        }
    };

    //扫码录单
    handleScan = (e) => {
        e.preventDefault();
        let serialText = e.target.value;
        if(serialText.replace(/\s+/g,"")) {
            this.addSerialNum(serialText);
        }
    };

    // 删除当前序列号
    deleteSerialNum = (idx) => {
        let {serialNumber} = this.state;
        serialNumber.splice(idx, 1);
        this.setState({serialNumber});
    };

    // 处理序列号数据
    dealSerialData = (data) => {
        if(!data && data.length===0) return [];
        return data.map((item, idx) => {
            let out = {};
            out.serial = idx+1;
            out.serialNum = item;
            return out;
        })
    };

    render() {
        const {form: {getFieldDecorator}} = this.props;
        let {serialNumber} = this.state;

        const columns = [
            {title: intl.get("goods.serialNumQuery.serial"),dataIndex: 'serial',key: 'serial', width: constants.TABLE_COL_WIDTH.SERIAL},
            {title: intl.get("goods.serialNumQuery.serialNum"),dataIndex: 'serialNum', render:(text) => <span className={cx('clip')} title={text}>{text}</span>},
            {title: intl.get("goods.serialNumQuery.ope"),dataIndex: 'ope',
                width: 200,
                render: (ope,data, idx) => (
                    <React.Fragment>
                        <a  onClick={()=>this.deleteSerialNum(idx)}>{intl.get('common.confirm.delete')}</a>
                    </React.Fragment>
                ),}
        ];

        //表单宽度
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 2},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 22},
            }
        };

        return (
            <React.Fragment>
                <div className={cx("mul-account")}>
                    <Form>
                        <Form.Item
                            {...formItemLayout}
                            label={intl.get("goods.serialNumQuery.serialText")}
                        >
                            {getFieldDecorator('serialText')(
                                <TextArea rows={4}
                                      onPressEnter={this.handleScan}
                                      placeholder={intl.get("goods.serialNumQuery.placeHolder")}
                                />
                            )}
                            <span>
                                <Icon type="info-circle" style={{fontSize: '14px', marginRight: '8px', color: '#1890ff'}} theme="filled"/>
                                <span style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#666'
                                }}>{intl.get("goods.serialNumQuery.content2")}</span>
                            </span>
                        </Form.Item>

                        <Button onClick={this.addSerialNum}  type="primary" className={cx("btn-confirm")}>{intl.get('common.confirm.okText')}</Button>
                    </Form>

                    <Table dataSource={this.dealSerialData(serialNumber)}
                                    className={cx("tb-account")}
                                    columns={columns}
                                    pagination={false}
                                    footerOpe={false}
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default Form.create()(ChooseSerialNum)