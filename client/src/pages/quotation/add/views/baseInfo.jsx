import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { Row, Col, Input, DatePicker, Form, Checkbox} from 'antd';
import defaultOptions from 'utils/validateOptions';
import {getCookie} from 'utils/cookie';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {SelectUnit} from 'pages/auxiliary/goodsUnit';
import {SelectCustomer} from 'pages/customer/index';
import {SelectCurrency} from 'pages/auxiliary/multiCurrency';
import {SelectDeliveryAddress} from 'components/business/deliveryAddress';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);

class BaseInfo extends Component {
    state = {
        useSystemCode: true,
        quotationDisabled: false
    };

    componentDidMount() {
        this.props.getRef(this);
    }

    setProdNo = (e) => {
        this.setState({
            useSystemCode: e.target.checked
        },()=>{
            const {setFieldsValue} = this.props.formRef.current;
            setFieldsValue({
                displayBillNo:''
            });
        });
    };

    // 当币种发生变化时
    handleCurrencyChange = (value, option) => {
        let currency = option.currency;
        let quotationDisabled = false;
        let {paramValue: quotation, paramModule} = currency;
        const {setFieldsValue} = this.props.formRef.current;
        setFieldsValue({ quotation });
        if(paramModule === 'CurrencyDefault'){  // 默认币种不可以修改牌价
            quotationDisabled = true;
        }
        this.setState({ quotationDisabled });
        this.props.handleQuotationOnChange(quotation*1);
    };

    // 当牌价发生改变时
    handleBlurQuotation = (e) => {
        let quotation = e.target.value;
        this.props.handleQuotationOnChange(quotation*1);
    };

    render() {
        let priceDecimalNum = getCookie("priceDecimalNum");
        const {match, currencyVipFlag} = this.props;

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
            <Row>
                {
                    match.params.id?null:(
                        <Col span={8}>
                            <>
                                <div className={cx("input-prodNo")}>
                                    <Form.Item
                                        {...formItemLayout}
                                        label={"报价单号"}
                                        name="displayBillNo"
                                        rules={[
                                            {
                                                required: !this.state.useSystemCode,
                                                message: "报价单号为必填项"
                                            }
                                        ]}
                                    >
                                        <Input maxLength={140} disabled={this.state.useSystemCode}/>
                                    </Form.Item>
                                </div>
                                <Checkbox onChange={this.setProdNo} className={cx("ck-prodNo")} checked={this.state.useSystemCode}>{intl.get("goods.add.ckProdNo")}</Checkbox>
                            </>
                        </Col>
                    )
                }

                <Col span={8}>
                    <Form.Item
                        {...formItemLayout}
                        label={"报价日期"}
                        name="quotationDate"
                        initialValue={moment()}
                        rules={[
                            {
                                type: 'object',
                                required: true,
                                message: "报价日期为必填项"
                            }
                        ]}
                    >
                        <DatePicker />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        {...defaultOptions}
                        {...formItemLayout}
                        label={intl.get("sale.add.baseInfo.warehouseName")}
                        name="warehouseName"
                    >
                        <SelectDeliveryAddress isWareHouses={true} showEdit={true} />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={8}>
                    <Form.Item
                        {...defaultOptions}
                        {...formItemLayout}
                        label={intl.get("sale.add.baseInfo.customer")}
                        name="customer"
                        rules={[
                            {
                                validator: (rules, val, callback) => {
                                    if(val && val.label && val.label.length>80){
                                        callback(intl.get("sale.add.baseInfo.customerMessage"))
                                    }else{
                                        callback();
                                    }
                                }
                            }
                        ]}
                    >
                        <SelectCustomer
                            maxLength={80}
                            placeholder={intl.get("sale.add.baseInfo.customerPlaceholder")}
                            onSelect={(value)=>this.props.handleSelectCustomer(value.key)}
                            onChange={(value)=>!value.key?this.props.handleSelectCustomer(value.key):null}
                            onBlur={(existCustomer)=>this.props.handleSelectCustomer(existCustomer.key)}
                        />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        {...defaultOptions}
                        {...formItemLayout}
                        label={intl.get("sale.add.baseInfo.customerContacterName")}
                        name="customerContacterName"
                    >
                        <Input maxLength={25}/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        {...defaultOptions}
                        {...formItemLayout}
                        label={intl.get("sale.add.baseInfo.customerTelNo")}
                        name="customerTelNo"
                    >
                        <Input maxLength={50}/>
                    </Form.Item>
                </Col>
            </Row>
            {
                currencyVipFlag === 'true' && (
                    <Row>
                        <Col span={8}>
                            <Form.Item
                                {...defaultOptions}
                                {...formItemLayout}
                                label={'币种'}
                                name="currencyId"
                            >
                                <SelectCurrency onChange={this.handleCurrencyChange} showEdit={true}  showVisible={true}/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                {...defaultOptions}
                                {...formItemLayout}
                                label={'牌价'}
                                name="quotation"
                                rules={
                                    [{
                                        required: 'true',
                                        message: '该项为必填项'
                                    },
                                    {
                                        validator: (rules, value, callback) => {
                                            let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ priceDecimalNum +'})?$/');
                                            if(!value){
                                                callback('该项为必填项');
                                            } else if (value && !reg.test(value)) {
                                                callback(`整数部分不能超过10位，小数点后不能超过${priceDecimalNum}位`);
                                            }
                                            callback();
                                        }
                                    }]
                                }
                            >
                                <Input maxLength={50} disabled={this.state.quotationDisabled} onBlur={(e) => this.handleBlurQuotation(e)}/>
                            </Form.Item>
                        </Col>
                    </Row>
                )
            }
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    suggestCustomer: state.getIn(['saleAdd', 'suggestCustomer'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({

    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(BaseInfo)