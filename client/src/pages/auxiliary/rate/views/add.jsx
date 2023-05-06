import React, {Component} from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, message, Select } from 'antd';
import {connect} from 'react-redux';
import intl from 'react-intl-universal';
import defaultOptions from 'utils/validateOptions';
import {bindActionCreators} from "redux";

import {asyncFetchExpressList, asyncAddExpress} from "../actions";



class FormContent extends Component {
    checkTax = (rule, value, callback) => {
        if (value/1 >=0 && value/1<=100) {
            callback();
            return;
        }
        callback(intl.get("auxiliary.rate.validate1"));
    };
    render() {
        const {getFieldDecorator} = this.props.form;
        const labelName = intl.get("auxiliary.rate.paramName");

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
                                message: intl.get("auxiliary.rate.validate2")
                            },
                            {
                                validator: this.checkTax
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
            if (err) {
                return;
            }
            const oper = this.props.id ? 'edit' : 'add';
            this.props.asyncAddExpress(oper, values, (res) => {
                if (res.data.retCode === '0') {
                    //重新获取列表数据
                    this.props.asyncFetchExpressList(this.props.type);
                    this.props.callback && this.props.callback(values.paramName);
                    message.success(intl.get('common.confirm.success'));
                    this.props.form.resetFields();
                    this.props.onClose();
                }
                else {
                    message.error(res.data.retMsg+res.data.retValidationMsg.msg[0].msg);
                }
            })
        })
    };

    render() {
        return (
            <Modal
                title={this.props.id?intl.get("auxiliary.rate.editor"):intl.get("auxiliary.rate.new")}
                visible={this.props.visible}
                onCancel={this.closeModal}
                width={800}
                onOk={this.handleCreate}
                confirmLoading={this.props.addRate.get('isFetching')}
                destroyOnClose={true}
            >
                <FormContent {...this.props}/>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        addRate: state.getIn(['auxiliaryRate', 'addRate'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncAddExpress,
        asyncFetchExpressList
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Add))
