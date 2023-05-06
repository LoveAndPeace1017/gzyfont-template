import React, {Component} from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, message, Select } from 'antd';
import {connect} from 'react-redux';
import intl from 'react-intl-universal';
import defaultOptions from 'utils/validateOptions';
import {bindActionCreators} from "redux";

import {asyncAddPay, asyncFetchPayList} from '../actions';


class FormContent extends Component {

    render() {
        const {getFieldDecorator} = this.props.form;
        const labelName = intl.get("auxiliary.orderType.paramName");

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
        getFieldDecorator('id', {
            initialValue: this.props.id
        });

        return (
            <Form>
                <Form.Item
                    {...formItemLayout}
                    label={labelName}
                >
                    {getFieldDecorator('paramName', {
                        ...defaultOptions,
                        initialValue: this.props.incomeName,
                        rules: [
                            {
                                required: true,
                                message: intl.get("auxiliary.orderType.validate1")
                            },
                            {
                                max: 20,
                                message: intl.get("auxiliary.orderType.validate2")
                            }
                        ],
                    })(
                        <Input maxLength={20}/>
                    )}
                </Form.Item>
            </Form>
        )
    }
}

class Add extends Component {

    constructor(props) {
        super(props);
    }

    closeModal = () => {
        this.props.onClose();
    };

    handleCreate = () => {
        this.props.form.validateFields((err, values) => {
            console.log(values);
            if (err) {
                return;
            }
            const oper = this.props.id ? 'edit' : 'add';
            this.props.asyncAddPay(oper, values, (res) => {
                if (res.data.retCode === '0') {
                    //重新获取列表数据
                    console.log(this.props.type);
                    this.props.asyncFetchPayList(this.props.type);
                    this.props.callback && this.props.callback(values.paramName);
                    message.success(intl.get('common.confirm.success'));
                    this.props.form.resetFields();
                    this.props.onClose();
                }
                else {
                    alert(res.data.retMsg+res.data.retValidationMsg.msg[0].msg);
                }
            })
        })
    };

    render() {
        return (
            <Modal
                title={this.props.id?intl.get("auxiliary.orderType.editor"):intl.get("auxiliary.orderType.add")}
                visible={this.props.visible}
                onCancel={this.closeModal}
                width={800}
                onOk={this.handleCreate}
                confirmLoading={this.props.addIncome.get('isFetching')}
                destroyOnClose={true}
            >
                <FormContent {...this.props}/>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        addIncome: state.getIn(['auxiliaryOrderType', 'addOrderType'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncAddPay,
        asyncFetchPayList
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Add))
