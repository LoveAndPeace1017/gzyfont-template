import React, {Component} from 'react';
import {Form, Modal, Input, message, Alert } from 'antd';
import {connect} from 'react-redux';
import intl from 'react-intl-universal';
import defaultOptions from 'utils/validateOptions';
import {bindActionCreators} from "redux";

import {asyncAddProject,  asyncFetchProjectList, asyncCheckName} from '../actions'

class FormContent extends Component {
    render() {
        const {formRef} = this.props;

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

        /*getFieldDecorator('id', {
            initialValue: this.props.projectId
        });*/

        return (
            <Form ref={formRef}>
                {
                    this.props.projectId ? (
                        <Form.Item
                            {...formItemLayout}
                            wrapperCol={{
                                xs: {span: 24},
                                sm: {span: 12},
                            }}
                            colon={false}
                            label={<React.Fragment/>}
                        >
                            <Alert message={intl.get("auxiliary.project.tip1")} type="info" showIcon/>
                        </Form.Item>
                    ) : null
                }
                <Form.Item
                    {...formItemLayout}
                    label={intl.get("auxiliary.project.projectName")}
                    name={"projectName"}
                    initialValue={this.props.projectName}
                    rules={[
                        {
                            required: true,
                            message: intl.get("auxiliary.project.validate1")
                        },
                        {
                            max: 30,
                            message: intl.get("auxiliary.project.validate2")
                        },
                        {
                            validator: (rules, val, callback) => {
                                this.props.asyncCheckName({params:{name: val, layerName: 'projects', recId: this.props.projectId}}, function(res) {
                                    if (res.data.retCode !== '0') {
                                        callback(intl.get("auxiliary.project.validate3"));
                                    }
                                    else {
                                        callback();
                                    }
                                }, function(error) {
                                    callback(error);
                                })
                            }
                        }
                    ]}
                >
                    <Input maxLength={30}/>
                </Form.Item>
                <Form.Item name="id" initialValue={this.props.projectId}>
                    <Input type="hidden"/>
                </Form.Item>
            </Form>
        )
    }
}

class Add extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
    }

    handleCreate = () => {
        this.formRef.current.validateFields().then((values)=>{
            const oper = this.props.projectId ? 'edit' : 'add';
            this.props.asyncAddProject(oper, values, (res) => {

                if (res.data.retCode === '0') {
                    //重新获取列表数据
                    this.props.asyncFetchProjectList();
                    this.props.callback && this.props.callback(values.projectName, res.data.data);
                    message.success(intl.get('common.confirm.success'));
                    this.formRef.current.resetFields();
                    this.props.onClose();
                }
                else {
                    message.error(res.data.retMsg);
                }
            })
        });

    };

    render() {
        const titleName = this.props.projectId ? intl.get("auxiliary.project.editor") : intl.get("auxiliary.project.new");
        return (
            <Modal
                title={titleName}
                visible={this.props.visible}
                onCancel={this.props.onClose}
                width={800}
                onOk={this.handleCreate}
                confirmLoading={this.props.addProject.get('isFetching')}
                destroyOnClose={true}
            >
                <FormContent formRef={this.formRef} {...this.props}/>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        addProject: state.getIn(['auxiliaryProject', 'addProject'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncAddProject,
        asyncFetchProjectList,
        asyncCheckName
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Add)
