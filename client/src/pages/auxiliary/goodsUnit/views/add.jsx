import React, {Component} from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, message, Alert } from 'antd';
import {connect} from 'react-redux';
import intl from 'react-intl-universal';
import defaultOptions from 'utils/validateOptions';
import {bindActionCreators} from "redux";

import {asyncAddGoodsUnit, asyncFetchGoodsUnitList} from '../actions';
import {actions as auxiliaryDeptActions} from 'pages/auxiliary/dept';

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

        getFieldDecorator('id',{
            initialValue: this.props.goodsUnitId
        });

        return (
            <Form>
                <Form.Item
                    {...formItemLayout}
                    label={intl.get("auxiliary.goodsUnit.paramName")}
                >
                    {getFieldDecorator('paramName', {
                        ...defaultOptions,
                        initialValue: this.props.goodsUnitName,
                        rules: [
                            {
                                required: true,
                                message: intl.get("auxiliary.goodsUnit.validate1")
                            },
                            {
                                max: 10,
                                message: intl.get("auxiliary.goodsUnit.validate2")
                            },
                            // {
                            //     validator: (rules, val, callback) => {
                            //         this.props.asyncCheckName('prod','unit', val, function(res) {
                            //             if (res.data && res.data.retCode !== 0 && res.data.retMsg) {
                            //                 callback('该名称已存在！')
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
                        <Input maxLength={10}/>
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

    handleCreate = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            this.props.asyncAddGoodsUnit('add', values, (res) => {
                if (res.data.retCode === '0') {
                    //重新获取列表数据
                    this.props.asyncFetchGoodsUnitList();
                    this.props.callback && this.props.callback(values.paramName);
                    message.success(intl.get('common.confirm.success'));
                    this.props.form.resetFields();
                    this.props.onClose();
                }
                else {
                    alert(res.data.retMsg+res.data.retValidationMsg.msg[0].msg)
                }
            })
        })
    };

    render() {
        return (
            <Modal
                title={intl.get("auxiliary.goodsUnit.new")}
                visible={this.props.visible}
                onCancel={this.props.onClose}
                width={800}
                onOk={this.handleCreate}
                confirmLoading={this.props.addGoodsUnit.get('isFetching')}
                destroyOnClose={true}
            >
                <FormContent {...this.props}/>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        addGoodsUnit: state.getIn(['auxiliaryGoodsUnit', 'addGoodsUnit'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncAddGoodsUnit,
        asyncCheckName:auxiliaryDeptActions.asyncCheckName,
        asyncFetchGoodsUnitList
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Add))
