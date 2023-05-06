import React, {Component} from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, message, Select } from 'antd';
import {connect} from 'react-redux';

import defaultOptions from 'utils/validateOptions';
import {bindActionCreators} from "redux";
import intl from 'react-intl-universal';
import {asyncFetchExpressList, asyncAddExpress} from "../actions";
import {reducer as auxiliaryExpress} from "../index";


class FormContent extends Component {

    render() {
        const {getFieldDecorator} = this.props.form;
        const labelName = intl.get('auxiliary.bill.incomeName');

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
                                message: intl.get('auxiliary.bill.validate1')
                            },
                            {
                                max: 20,
                                message: intl.get('auxiliary.bill.validate2')
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
                title={this.props.id?intl.get('auxiliary.bill.editor'):intl.get('auxiliary.bill.add')}
                visible={this.props.visible}
                onCancel={this.closeModal}
                width={800}
                onOk={this.handleCreate}
                confirmLoading={this.props.addBill.get('isFetching')}
                destroyOnClose={true}
            >
                <FormContent {...this.props}/>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        addBill: state.getIn(['auxiliaryBill', 'addBill'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncAddExpress,
        asyncFetchExpressList
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Add))
