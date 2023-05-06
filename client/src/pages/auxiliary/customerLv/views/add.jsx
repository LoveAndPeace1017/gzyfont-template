import React, {Component} from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, message, Alert } from 'antd';
import {connect} from 'react-redux';
import intl from 'react-intl-universal';
import defaultOptions from 'utils/validateOptions';
import {bindActionCreators} from "redux";

import {asyncAddCustomerLv,asyncFetchCustomerLvList, asyncCheckName} from '../actions';

class FormContent extends Component {
    render() {
        const {form: {getFieldDecorator}} = this.props;

        //表单宽度
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 12},
            }
        };

        getFieldDecorator('recId',{
            initialValue: this.props.customerLvId
        });

        return (
            <Form>
                <Form.Item
                    {...formItemLayout}
                    label={intl.get("auxiliary.customerLv.name")}
                >
                    {getFieldDecorator('name', {
                        ...defaultOptions,
                        initialValue: this.props.customerLvName,
                        rules: [
                            {
                                required: true,
                                message: intl.get("auxiliary.customerLv.validate1")
                            },
                            {
                                max: 30,
                                message: intl.get("auxiliary.customerLv.validate2")
                            },
                            {
                                validator: (rules, val, callback) => {
                                    this.props.asyncCheckName({params:{name: val, layerName: 'customerLevel', recId: this.props.customerLvId}}, function(res) {
                                        if (res.data.retCode !== '0') {
                                            callback(intl.get("auxiliary.customerLv.validate3"))
                                        }
                                        else {
                                            callback();
                                        }
                                    }, function(error) {
                                        callback(error);
                                    })
                                }
                            }
                        ],
                    })(
                        <Input maxLength={30}/>
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label={intl.get("auxiliary.customerLv.percentage")}
                >
                    {getFieldDecorator('percentage', {
                        ...defaultOptions,
                        initialValue: this.props.discount,
                        rules: [
                            {
                                required: true,
                                message: intl.get("auxiliary.customerLv.validate4")
                            },
                            {
                                validator: (rules, val, callback) => {
                                    let pattern = new RegExp(/^((?!0)\d{1,2}|100)$/);
                                    if(!pattern.test(val)){
                                        callback(intl.get("auxiliary.customerLv.validate5"))
                                    }
                                    callback();
                                }
                            }
                        ],
                    })(
                        <Input maxLength={30} placeholder={intl.get("auxiliary.customerLv.placeholder")}/>
                    )}
                </Form.Item>
            </Form>
        );
    }
}

class Add extends Component {

    constructor(props) {
        super(props);
    }

    handleCreate = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const oper = this.props.customerLvId ? 'edit' : 'add';
            this.props.asyncAddCustomerLv(oper, values, (res) => {
                if (res.data.retCode === '0') {
                    //重新获取列表数据
                    const id = res.data.data && res.data.data.id;
                    message.success(intl.get('common.confirm.success'));
                    this.props.form.resetFields();
                    this.props.onClose();
                    this.props.asyncFetchCustomerLvList();
                    this.props.callback && this.props.callback(id);

                }
                else {
                    alert(res.data.retMsg)
                }
            })
        })
    };

    render() {
        const titleName = this.props.customerLvId ? intl.get("auxiliary.customerLv.editor"):intl.get("auxiliary.customerLv.new");
        return (
            <Modal
                title={titleName}
                visible={this.props.visible}
                onCancel={this.props.onClose}
                width={800}
                onOk={this.handleCreate}
                confirmLoading={this.props.addCustomerLv.get('isFetching')}
                destroyOnClose={true}
            >
                <FormContent {...this.props}/>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        addCustomerLv: state.getIn(['auxiliaryCustomerLv', 'addCustomerLv'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncAddCustomerLv,
        asyncCheckName,
        asyncFetchCustomerLvList
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Add))
