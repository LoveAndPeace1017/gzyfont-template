import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { Col, Row, Input, Select, Form } from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {fromJS} from "immutable";
import defaultOptions from 'utils/validateOptions';

import {AddressAdd} from 'pages/auxiliary/deliveryAddress';
import Auxiliary from 'pages/auxiliary';
import {actions as addressAction} from "pages/auxiliary/deliveryAddress";
import {SelectDeliveryAddress} from 'components/business/deliveryAddress';
import {SelectProject} from 'pages/auxiliary/project'
import {SelectCustomer} from 'pages/customer/index';

import {actions as customerShowActions} from 'pages/customer/add/index';

const {Option} = Select;
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);

class OtherInfo extends Component {


    state={
        open: false,
        deliveryAddrData:[]
    };

    //选择客户后，带入联系人联系电话以及客户交货地址
    handleSelectCustomer=(customerNo, callback)=>{
        this.props.onChangeCustomerNo(customerNo);
        this.setState({
            customerNo
        });
        customerNo && this.props.asyncShowCustomerForSelect(customerNo, data =>{
            if(data.retCode === '0'){
                //带入客户联系人和联系电话
                let customer = data.data;
                this.props.formRef.current.setFieldsValue({
                    customerContacterName: customer.contacterName,
                    customerTelNo: customer.telNo,
                    deliveryAddress: ''/*,
                    customerOrderNo: customer.customerOrderNo==null?'--':customer.customerOrderNo*/
                });
                //设置客户交货地址列表
                const customerAddressList = customer.customerAddressList;
                this.setState({
                    deliveryAddrData: fromJS(customerAddressList)
                });
                callback && callback(fromJS(customerAddressList));
            }
        });
    };

    handleCustomerBlur=(existCustomer)=>{
        this.props.formRef.current.setFieldsValue({
            customer: {
                key: existCustomer.key,
                label: existCustomer.label
            }
        });
        this.handleSelectCustomer(existCustomer.key)
    };

    componentDidMount() {
        this.props.getRef(this);
    }

    openModal = (type, auxiliaryKey, auxiliaryTabKey) => {
        this.setState({
            [type]: true,
            auxiliaryKey,
            auxiliaryTabKey
        })
    };

    closeModal = (type) =>{
        this.setState({
            [type]: false
        })
    };

    handleSearch = (value) => {
        if(value) {
            this.props.formRef.current.setFieldsValue({deliveryAddress: value});
        }
    };

    render() {

        console.log(this.state.deliveryAddrData, 'deliveryAddrData');
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
                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            {...defaultOptions}
                            name="customer"
                            label={intl.get("outbound.add.sale.customer")}
                        >
                            <SelectCustomer
                                maxLength={80}
                                placeholder={intl.get("outbound.add.sale.customerMessage")}
                                onSelect={(value)=>this.handleSelectCustomer(value.key)}
                                onChange={(value)=>!value.key?this.handleSelectCustomer(value.key):this.props.onChangeCustomerNo(null)}
                                onBlur={this.handleCustomerBlur}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            {...defaultOptions}
                            name="customerContacterName"
                            label={intl.get("outbound.add.sale.customerContacterName")}
                        >
                            <Input maxLength={20}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            {...defaultOptions}
                            name="customerTelNo"
                            label={intl.get("outbound.add.sale.customerTelNo")}
                        >
                            <Input maxLength={50}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            {...defaultOptions}
                            name="deliveryAddress"
                            label={intl.get("outbound.add.sale.deliveryAddress")}
                        >
                            <Select
                                allowClear
                                showSearch
                                onSearch={this.handleSearch}
                                style={{minWidth: '200px'}}
                                placeholder={'选择交货地址'}
                            >
                                {
                                    this.state.deliveryAddrData && this.state.deliveryAddrData.map(item => (
                                        <Option key={item.get('recId')}
                                                value={item.get('provinceCode')
                                                + ' ' + item.get('provinceText')
                                                + ' ' + item.get('cityCode')
                                                + ' ' + item.get('cityText')
                                                + ' ' + item.get('address')}
                                        >{item.get('provinceText') + ' ' + item.get('cityText') + ' ' + item.get('address')}</Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            {...defaultOptions}
                            name="customerOrderNo"
                            label={intl.get("outbound.add.sale.customerOrderNo")}
                        >
                            <Input disabled={true} maxLength={20}/>
                        </Form.Item>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    suggestCustomer: state.getIn(['saleAdd', 'suggestCustomer']),
    customerInfo: state.getIn(['customerEdit', 'customerInfo'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncShowCustomer: customerShowActions.asyncShowCustomer,
        asyncShowCustomerForSelect: customerShowActions.asyncShowCustomerForSelect,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(OtherInfo)