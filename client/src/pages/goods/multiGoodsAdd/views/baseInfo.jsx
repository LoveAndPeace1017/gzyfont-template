import React, {Component} from 'react';
/*import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';*/
import { Col, Input, Checkbox, Select, TreeSelect, Row,Form} from 'antd';
import {AddPkgOpen} from 'components/business/vipOpe';
const Option = Select.Option;
import defaultOptions from 'utils/validateOptions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Icon from 'components/widgets/icon';
import {SelectUnit} from 'pages/auxiliary/goodsUnit';
import MultiUnit from 'components/business/multiUnit';
import intl from 'react-intl-universal';
import {SelectGoodsCate} from 'pages/auxiliary/category';
import Auxiliary from 'pages/auxiliary';
import {AuthInput} from 'components/business/authMenu';
import {formatCurrency, removeCurrency} from 'utils/format';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);


class BaseInfo extends Component {

    state = {
        useSystemCode: true,
        auxiliaryVisible: false,
        auxiliaryKey: '',
        equalProdVisible: false
    };

    handleClose(type) {
        this.setState({
            [type]: false
        })
    }

    closeEqualTip = ()=>{
        this.setState({
            equalProdVisible: false
        });
    };


    componentDidMount() {
    }


    render() {

        const {initBaseInfo} = this.props;
        let {setFieldsValue, getFieldValue} = this.props.formRef.current;

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            }
        };

        return (
            <React.Fragment>
                <div className={cx('baseInfo')}>
                    <Row>
                        <Col span={8}>
                            <div style={{display: this.state.equalProdVisible ? 'block' : 'none'}} className={cx("equalProd")}>
                                <Icon onClick={this.closeEqualTip} type="close"/>
                                {intl.get("goods.add.tip1")}
                            </div>
                            <Form.Item
                                label={intl.get("goods.add.name")}
                                {...formItemLayout}
                                name={"name"}
                                initialValue={initBaseInfo && initBaseInfo.get("name")}
                                rules={[{
                                    required: true,
                                    message: intl.get("goods.add.validate2")
                                },
                                    {
                                        max: 100,
                                        message: intl.get("goods.add.validate3")
                                    },
                                    {
                                        validator: (rules, val, callback) => {

                                            this.props.asyncFetchCheckName(val,(data)=>{
                                                this.setState({
                                                    equalProdVisible: data.retCode != '0'
                                                })
                                            });

                                            callback()

                                        }
                                    }]}
                            >
                                <Input maxLength={100} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label={intl.get("goods.add.unit")}
                                {...formItemLayout}
                                name={"unit"}
                                initialValue={initBaseInfo && initBaseInfo.get("unit")}
                                rules={[{
                                    required: true,
                                    message: intl.get("goods.add.validate4")
                                }]}
                            >
                                <SelectUnit showEdit={true} carryDefaultValue={false}/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label={intl.get("goods.add.category")}
                                {...formItemLayout}
                                name={"category"}
                                initialValue = {{
                                    value: initBaseInfo ? initBaseInfo.get("categoryCode") : '',
                                    label: initBaseInfo ? initBaseInfo.get("categoryName") : ''
                                }}
                            >
                                <SelectGoodsCate hideCnGroup/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <Form.Item
                                label={intl.get("goods.add.brand")}
                                {...formItemLayout}
                                name={"brand"}
                                initialValue ={initBaseInfo && initBaseInfo.get("brand")}
                            >
                                <Input maxLength={30}/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label={intl.get("goods.add.produceModel")}
                                {...formItemLayout}
                                name={"produceModel"}
                                initialValue={initBaseInfo && initBaseInfo.get("produceModel")}
                            >
                                <Input maxLength={100}/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label={'保质期管理'}
                                {...formItemLayout}
                                name={"expirationFlag"}
                                initialValue={false}
                            >
                                <Select onChange={(val) => this.setState({val: 1})}>
                                    <Option value={false}>关闭</Option>
                                    <Option value={true}>
                                        <AddPkgOpen
                                            cancelCallback={() => {
                                                setFieldsValue({expirationFlag: false})
                                                //触发重新渲染，没实际的逻辑功能
                                                this.setState({val: 1})
                                            }}
                                            source={'batchShelfLeft'}
                                            render={() => (
                                                <React.Fragment>
                                                    开启
                                                </React.Fragment>
                                            )}
                                        />
                                    </Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    {
                        getFieldValue('expirationFlag')=== true && (
                            <Row>
                                <Col span={8}>
                                    <Form.Item
                                        label={'保质期（天）'}
                                        {...formItemLayout}
                                        name={"expirationDay"}
                                        initialValue={initBaseInfo && initBaseInfo.get("expirationDay")}
                                        rules={[
                                            {
                                                validator: (rules, val, callback) => {
                                                    if(val){
                                                        if(!/^[1-9]+[0-9]*$/.test(val)){
                                                            callback('该项必须为正整数');
                                                        } else {
                                                            callback();
                                                        }
                                                    } else {
                                                        callback();
                                                    }
                                                }
                                            }
                                        ]}
                                    >
                                        <Input maxLength={5} placeholder={'请输入保质期'}/>
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item
                                        label={'报警天数'}
                                        {...formItemLayout}
                                        name={"alarmDay"}
                                        initialValue={initBaseInfo && initBaseInfo.get("alarmDay")}
                                        rules={[
                                            {
                                                validator: (rules, val, callback) => {
                                                    if(val){
                                                        if(!/^[1-9]+[0-9]*$/.test(val)){
                                                            callback('该项必须为正整数');
                                                        } else {
                                                            callback();
                                                        }
                                                    } else {
                                                        callback();
                                                    }
                                                }
                                            }
                                        ]}
                                    >
                                        <Input maxLength={5} placeholder={'请输入报警天数'}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        )
                    }

                    <Row>
                        <Col span={8}>
                            <Form.Item
                                label={'辅助单位'}
                                {...formItemLayout}
                                name={"unitFlag"}
                                initialValue={0}
                            >
                                <Select onChange={(val) => this.props.changeUnitFn(getFieldValue('unitFlag'))}>
                                    <Option value={0}>关闭</Option>
                                    <Option value={1}>开启</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                {...formItemLayout}
                                name="purchaseLead"
                                rules={[
                                    {
                                        validator: (rules, val, callback) => {
                                            if (val) {
                                                let reg = eval('/^0|[1-9]\\d{0,9}$/');
                                                if (val && (!reg.test(val) || val.indexOf('.')>=0)) {
                                                    callback(`必须为正整数`);
                                                } else {
                                                    callback();
                                                }
                                            } else {
                                                callback();
                                            }
                                        }
                                    }
                                ]}
                                label={intl.get("goods.add.purchaseLead")}
                            >
                                <Input maxLength={10} />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/*辅助资料弹层*/}
                    <Auxiliary
                        defaultKey={this.state.auxiliaryKey}
                        visible={this.state.auxiliaryVisible}
                        onClose={this.handleClose.bind(this, 'auxiliaryVisible')}
                    />
                </div>
            </React.Fragment>

        );
    }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({}, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(BaseInfo)