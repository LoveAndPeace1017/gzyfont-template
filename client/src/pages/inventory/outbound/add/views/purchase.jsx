import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { Col, Row, Input, Form } from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import defaultOptions from 'utils/validateOptions';

import {SelectDeliveryAddress} from 'components/business/deliveryAddress';
import {SelectSupplier} from 'pages/supplier/index'
import {actions as supplierAddActions} from 'pages/supplier/add'

import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);

class OtherInfo extends Component {

    state={
        open: false
    };

    //选择供应商后，带入联系人联系电话以及客户交货地址
    handleSelectSupplier=(supplierCode, isInit)=>{
        this.setState({
            supplierCode
        });
        this.props.asyncShowSupplierForSelect(supplierCode, data =>{
            if(data.retCode === '0'){
                if(!isInit){
                    //带入客户联系人和联系电话
                    const contacterName = data.data.contacterName;
                    const mobile = data.data.mobile;
                    this.props.formRef.current.setFieldsValue({
                        supplierContacterName: contacterName,
                        supplierTelNo: mobile
                    });
                }

            }
        });
    };

    handleSupplierBlur=(existSupplier)=>{
        this.props.formRef.current.setFieldsValue({
            supplier: {
                key: existSupplier.key,
                label: existSupplier.label
            }
        });
        this.handleSelectSupplier(existSupplier.key)
    };

    componentDidMount() {
        this.props.getRef(this);
    }

    render() {
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
        let supplier = this.props.formRef.current.getFieldValue('supplier');
        console.log('purchase:',supplier);

        return (
            <React.Fragment>
                <Row>
                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            {...defaultOptions}
                            name="supplier"
                            label={intl.get("outbound.add.purchase.supplier")}

                        >
                            <SelectSupplier
                                maxLength={80}
                                onSelect={(value)=>this.handleSelectSupplier(value.key)}
                                onBlur={this.handleSupplierBlur}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            {...defaultOptions}
                            name="supplierContacterName"
                            label={intl.get("outbound.add.purchase.supplierContacterName")}
                        >
                            <Input maxLength={20}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            {...defaultOptions}
                            name="supplierTelNo"
                            label={intl.get("outbound.add.purchase.supplierTelNo")}
                        >
                            <Input maxLength={50}/>
                        </Form.Item>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    suggestCustomer: state.getIn(['saleAdd', 'suggestCustomer'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncShowSupplier: supplierAddActions.asyncShowSupplier,
        asyncShowSupplierForSelect: supplierAddActions.asyncShowSupplierForSelect,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(OtherInfo)