import React, {Component} from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, Select, message } from 'antd';
import intl from 'react-intl-universal';
import {connect} from 'react-redux';

import defaultOptions from 'utils/validateOptions';
import {bindActionCreators} from "redux";

import {asyncSendEmail} from '../actions';
import {actions as supplierAddActions} from 'pages/supplier/add'


class FormContent extends Component {
    componentDidMount() {
        this.props.asyncShowSupplier(this.props.supplierCode);
    }

    render() {

        const {form: {getFieldDecorator}, supplierInfo, billInfo} = this.props;

        //表单宽度
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 10},
            }
        };

        const supplierData = supplierInfo && supplierInfo.getIn(['data', 'data']);

        return (
            <Form>
                <Form.Item
                    {...formItemLayout}
                    label={intl.get("purchase.show.sendEmail2Supplier.email")}
                >
                    {getFieldDecorator('supplierEmail', {
                        ...defaultOptions,
                        initialValue: supplierData&&supplierData.get('email'),
                        rules: [
                            {
                                required: true,
                                message: intl.get("purchase.show.sendEmail2Supplier.emailMessage1")
                            },
                            {
                                type: "email",
                                message: intl.get("purchase.show.sendEmail2Supplier.emailMessage2")
                            }
                        ]
                    })(
                        <Input placeholder="" maxLength={50}/>
                    )}
                </Form.Item>
                <div style={{display:'none'}}>
                    {
                        getFieldDecorator('supplierName', {
                            initialValue: supplierData&&supplierData.get('name')
                        })(<Input type="hidden"/>)
                    }
                    {
                        getFieldDecorator('supplierContactName', {
                            initialValue: supplierData&&supplierData.get('contacterName')
                        })(<Input type="hidden"/>)
                    }
                    {
                        getFieldDecorator('supplierTel', {
                            initialValue: supplierData&&supplierData.get('mobile')
                        })(<Input type="hidden"/>)
                    }
                </div>
                <Form.Item
                    {...formItemLayout}
                    label={intl.get("purchase.show.sendEmail2Supplier.ourName")}
                >
                    {getFieldDecorator('buyerComName', {
                        ...defaultOptions,
                        initialValue: billInfo&&billInfo.get('ourName'),
                        rules: [
                            {
                                required: true,
                                message: intl.get("purchase.show.sendEmail2Supplier.ourNameMessage")
                            }
                        ]
                    })(
                        <Input placeholder="" maxLength={80}/>
                    )}
                </Form.Item>
                <div style={{display:'none'}}>
                    {
                        getFieldDecorator('buyerContactName', {
                            initialValue: billInfo&&billInfo.get('ourContacterName')
                        })(<Input type="hidden"/>)
                    }
                    {
                        getFieldDecorator('buyerTel', {
                            initialValue: billInfo&&billInfo.get('ourTelNo')
                        })(<Input type="hidden"/>)
                    }
                </div>
            </Form>
        )
    }
}

class sendEmail2Supplier extends Component {

    constructor(props) {
        super(props);
    }

    closeModal = () => {
        this.props.onClose();
    };

    handleCreate = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }

            this.props.asyncSendEmail(this.props.billNo, values, (res) => {

                if (res.data.retCode === '0') {
                    message.success(intl.get("purchase.show.sendEmail2Supplier.sendEmailSuccess"));
                    this.props.form.resetFields();
                    this.props.onClose();
                }
                else {
                    alert(res.data.retMsg)
                }
            })
        })
    };


    render() {
        return (
            <Modal
                title={intl.get("purchase.show.sendEmail2Supplier.sendEmailText")}
                visible={this.props.visible}
                onCancel={this.closeModal}
                width={800}
                onOk={this.handleCreate}
                confirmLoading={this.props.sendEmail.get('isFetching')}
                destroyOnClose={true}
            >
                <FormContent {...this.props}/>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        sendEmail: state.getIn(['purchaseDetail', 'sendEmail']),
        supplierInfo: state.getIn(['supplierEdit', 'supplierInfo'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncSendEmail,
        asyncShowSupplier: supplierAddActions.asyncShowSupplier
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(sendEmail2Supplier))
