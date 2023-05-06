import React, {Component} from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, message, Select } from 'antd';
import {connect} from 'react-redux';
import intl from 'react-intl-universal';
import defaultOptions from 'utils/validateOptions';
import {bindActionCreators} from "redux";

import {asyncAddCustomField, asyncFetchCustomFieldList} from '../actions'

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
                sm: {span: 10},
            }
        };

        getFieldDecorator('type', {
            initialValue: this.props.type
        });

        getFieldDecorator('id', {
            initialValue: this.props.id
        });

        return (
            <Form>
                <Form.Item
                    {...formItemLayout}
                    label={intl.get("auxiliary.customField.propName")}
                >
                    {getFieldDecorator('propName', {
                        ...defaultOptions,
                        initialValue: this.props.customFieldName,
                        rules: [
                            {
                                required: true,
                                message: intl.get("auxiliary.customField.validate1")
                            },
                            {
                                max: 20,
                                message: intl.get("auxiliary.customField.validate2")
                            },
                            // {
                            //     validator: (rules, val, callback) => {
                            //         this.props.asyncCheckName('dept', val, function(res) {
                            //             if (res.data && res.data.retCode !== 0 && res.data.retMsg) {
                            //                 callback('信息已有该字段，请核对后再提交！')
                            //             }
                            //             else {
                            //                 callback();
                            //             }
                            //         }, function(error) {
                            //             callback(error);
                            //         })
                            //     }
                            // }
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
            this.props.asyncAddCustomField('edit',values, (res) => {
                if (res.data.retCode === '0') {
                    //重新获取列表数据
                    this.props.asyncFetchCustomFieldList(this.props.type);
                    message.success(intl.get('common.confirm.success'));
                    this.props.form.resetFields();
                    this.props.onClose();
                }
                else {
                    message.error(res.data.retMsg+res.data.retValidationMsg.msg[0].msg)
                }
            })
        })
    };

    render() {
        const titleName = this.props.customFieldName? intl.get("auxiliary.customField.editor"):intl.get("auxiliary.customField.add");
        return (
            <Modal
                title={titleName}
                visible={this.props.visible}
                onCancel={this.closeModal}
                width={800}
                onOk={this.handleCreate}
                confirmLoading={this.props.addCustomField.get('isFetching')}
                destroyOnClose={true}
            >
                <FormContent {...this.props}/>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        addCustomField: state.getIn(['auxiliaryCustomField', 'addCustomField'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncAddCustomField,
        asyncFetchCustomFieldList
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Add))
