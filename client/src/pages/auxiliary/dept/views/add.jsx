import React, {Component} from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, message, Alert } from 'antd';
import {connect} from 'react-redux';
import intl from 'react-intl-universal';
import defaultOptions from 'utils/validateOptions';
import {bindActionCreators} from "redux";

import {asyncAddDept, asyncFetchDeptList, asyncCheckName} from '../actions';

import styles from "../styles/index.scss";
import classNames from "classnames/bind";


const cx = classNames.bind(styles);

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

        getFieldDecorator('recId', {
            initialValue: this.props.recId
        });
        getFieldDecorator('id', {
            initialValue: this.props.id
        });

        return (
            <Form>
                {
                    this.props.recId ? (
                        <Form.Item
                            {...formItemLayout}
                            wrapperCol={{
                                xs: {span: 24},
                                sm: {span: 12},
                            }}
                            colon={false}
                            label={<React.Fragment/>}
                        >
                            <Alert message={intl.get("auxiliary.dept.tip1")} type="info" showIcon/>
                        </Form.Item>
                    ) : null
                }
                <Form.Item
                    {...formItemLayout}
                    label={intl.get("auxiliary.dept.name")}
                >
                    {getFieldDecorator('name', {
                        ...defaultOptions,
                        initialValue: this.props.deptName,
                        rules: [
                            {
                                required: true,
                                message: intl.get("auxiliary.dept.validate1")
                            },
                            {
                                max: 10,
                                message: intl.get("auxiliary.dept.validate2")
                            },
                            {
                                validator: (rules, val, callback) => {
                                    this.props.asyncCheckName({params:{name: val, layerName: 'departs', recId: this.props.id}}, function(res) {
                                        if (res.data.data && res.data.retCode === '0') {
                                            callback(intl.get("auxiliary.dept.validate3"))
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

    closeModal = () => {
        this.props.onClose();
    };

    handleCreate = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const oper = this.props.recId ? 'edit' : 'add';
            this.props.asyncAddDept(oper, values, (res) => {
                if (res.data.retCode === '0') {
                    //重新获取列表数据
                    this.props.asyncFetchDeptList();
                    message.success(intl.get('common.confirm.success'));
                    this.props.form.resetFields();
                    this.props.onClose();
                    const {id, name} = res.data.data;
                    this.props.callback && this.props.callback({key: id, label: name});
                }
                else {
                    alert(res.data.retMsg)
                }
            })
        })
    };

    render() {
        const titleName = this.props.recId ? intl.get("auxiliary.dept.editor") : intl.get("auxiliary.dept.add");
        return (
            <Modal
                title={titleName}
                visible={this.props.visible}
                onCancel={this.closeModal}
                width={800}
                onOk={this.handleCreate}
                confirmLoading={this.props.addDept.get('isFetching')}
                destroyOnClose={true}
            >
                <FormContent {...this.props}/>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        addDept: state.getIn(['auxiliaryDept', 'addDept'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncAddDept,
        asyncFetchDeptList,
        asyncCheckName
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Add))
