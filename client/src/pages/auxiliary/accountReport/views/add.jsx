import React, {Component} from 'react';
import { Modal, Input, message, Select, Form, Tabs, Radio} from 'antd';
import {connect} from 'react-redux';
import {SelectDept} from 'pages/auxiliary/dept';
import {SelectEmployee} from 'pages/auxiliary/employee';
import {bindActionCreators} from "redux";

import {asyncFetchAccountReportList, asyncAddAccountReport} from '../actions';
import moment from "moment-timezone/index";

const {TabPane} = Tabs;


class FormContent extends Component {

    state = {
        depId: ''
    }

    //部门选择
    handleDeptChange = (value) => {
        const {setFieldsValue} = this.props.formRef.current;
        setFieldsValue({ employeeId: null });
        this.setState({depId: value});
    };

    render() {
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

        //校验的正则
        const regLetterOrNum = /^[0-9a-zA-Z]+$/;  //数字或者字母
        const regLetterAndNum = /^(?!\d+$)[\da-zA-Z]+$/; //数字和字母组合

        return (
            <Form ref={this.props.formRef} >
                <Form.Item
                    {...formItemLayout}
                    label={"账号"}
                    name="account"
                    rules={[
                        {
                            required: true,
                            message: "账号为必填项"
                        },
                        {
                            min: 6,
                            message: '请输入6-20位字母、数字或组合'
                        },
                        {
                            max: 20,
                            message: '请输入6-20位字母、数字或组合'
                        },
                        {
                            validator: (rules, val, callback) => {
                                if (val && val.length >= 11 && !regLetterAndNum.test(val)) {
                                    callback('用户名需同时包含数字和字母');
                                }
                                if (val && !regLetterOrNum.test(val)) {
                                    callback('请输入6-20位字母、数字或组合');
                                }
                                callback();
                            }
                        },
                    ]}
                >
                    <Input maxLength={20} placeholder={"6-20位字母、数字或组合"}/>
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label={"密码"}
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "密码为必填项"
                        },
                        {
                            min: 6,
                            message: '请输入6-20位字母、数字或组合'
                        },
                        {
                            max: 20,
                            message: '请输入6-20位字母、数字或组合'
                        },
                        {
                            validator: (rules, val, callback) => {
                                if (val && val.length >= 11 && !regLetterAndNum.test(val)) {
                                    callback('密码需同时包含数字和字母');
                                }
                                if (val && !regLetterOrNum.test(val)) {
                                    callback('请输入6-20位字母、数字或组合');
                                }
                                callback();
                            }
                        },
                    ]}
                >
                    <Input maxLength={20} placeholder={"6-20位字母、数字或组合"}/>
                </Form.Item>

                <Form.Item label="部门员工" {...formItemLayout} required={true}>
                    <Form.Item
                        name="departmentId"
                        rules={[{ required: true, message: "部门为必填项" }]}
                        style={{ display: 'inline-block' }}
                    >
                        <SelectDept
                            handleDeptChange={this.handleDeptChange}
                            placeholder={"部门"}
                            width={"158px"}
                            showEdit={true}
                        />
                    </Form.Item>

                    <Form.Item
                        name="employeeId"
                        rules={[{ required: true, message: "员工为必填项" }]}
                        style={{ display: 'inline-block'}}
                    >
                        <SelectEmployee
                            width={"158px"}
                            valueType={"id"}
                            depId={this.state.depId}
                            showVisible={true}
                            placeholder={"员工"}
                            showEdit={true}
                        />
                    </Form.Item>

                </Form.Item>

                <Form.Item
                    {...formItemLayout}
                    label="类型"
                    name="type"
                    required={true}
                    initialValue={1}
                >
                    <Radio.Group>
                        <Radio value={1}>报工</Radio>
                        <Radio value={0}>报工+质检</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>
        )
    }
}

class EditorFormContent extends Component {

    state = {
        depId: '',
        tabKey: 'edit'
    }

    //部门选择
    handleDeptChange = (value) => {
        const {setFieldsValue} = this.props.formRef.current;
        setFieldsValue({ employeeId: null });
        this.setState({depId: value});
    };
    tabChange=(tabKey)=>{
        this.setState({
            tabKey
        });
    }

    render() {
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

        let data = this.props.data;

        //校验的正则
        const regLetterOrNum = /^[0-9a-zA-Z]+$/;  //数字或者字母
        const regLetterAndNum = /^(?!\d+$)[\da-zA-Z]+$/; //数字和字母组合

        return (
            <>
                <Tabs onChange={this.tabChange}>
                    <TabPane
                        tab={"修改信息"}
                        destroyInactiveTabPane={true}
                        key="edit"
                    >
                        {
                            this.state.tabKey === 'edit'?(
                                <Form ref={this.props.formRef} >
                                    <Form.Item
                                        {...formItemLayout}
                                        label={"账号"}
                                        initialValue={data.account}
                                        name="account"
                                    >
                                        <Input disabled maxLength={20}/>
                                    </Form.Item>

                                    <Form.Item label="部门员工" {...formItemLayout} required={true}>
                                        <Form.Item
                                            name="departmentId"
                                            rules={[{ required: true, message: "部门为必填项" }]}
                                            initialValue={data.departmentName}
                                            style={{ display: 'inline-block' }}
                                        >
                                            <SelectDept
                                                handleDeptChange={this.handleDeptChange}
                                                width={"150px"}
                                                placeholder={"部门"}
                                                showEdit={true}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="employeeId"
                                            rules={[{ required: true, message: "员工为必填项" }]}
                                            initialValue={data.employeeId}
                                            style={{ display: 'inline-block'}}
                                        >
                                            <SelectEmployee
                                                width={"150px"}
                                                valueType={"id"}
                                                depId={this.state.depId||data.departmentId}
                                                showVisible={true}
                                                placeholder={"员工"}
                                                showEdit={true}
                                            />
                                        </Form.Item>

                                    </Form.Item>

                                    <Form.Item
                                        {...formItemLayout}
                                        label="类型"
                                        name="type"
                                        required={true}
                                        initialValue={data.type}
                                    >
                                        <Radio.Group>
                                            <Radio value={1}>报工</Radio>
                                            <Radio value={0}>报工+质检</Radio>
                                        </Radio.Group>
                                    </Form.Item>

                                </Form>
                            ):null
                        }
                    </TabPane>
                    <TabPane
                        tab={"重置密码"}
                        key="reset"
                    >
                        {
                            this.state.tabKey === 'reset'?(
                                <Form ref={this.props.formRef} >
                                    <Form.Item
                                        {...formItemLayout}
                                        label={"账号"}
                                        initialValue={data.account}
                                        name="account"
                                    >
                                        <Input disabled maxLength={20}/>
                                    </Form.Item>
                                    <Form.Item
                                        {...formItemLayout}
                                        label={"新密码"}
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message: "密码为必填项"
                                            },
                                            {
                                                min: 6,
                                                message: '请输入6-20位字母、数字或组合'
                                            },
                                            {
                                                max: 20,
                                                message: '请输入6-20位字母、数字或组合'
                                            },
                                            {
                                                validator: (rules, val, callback) => {
                                                    if (val && val.length >= 11 && !regLetterAndNum.test(val)) {
                                                        callback('密码需同时包含数字和字母');
                                                    }
                                                    if (val && !regLetterOrNum.test(val)) {
                                                        callback('请输入6-20位字母、数字或组合');
                                                    }
                                                    callback();
                                                }
                                            },
                                        ]}
                                    >
                                        <Input maxLength={20} placeholder={"6-20位字母、数字或组合"}/>
                                    </Form.Item>
                                    <Form.Item
                                        {...formItemLayout}
                                        label={"确认密码"}
                                        name="confirmPassword"
                                        rules={[
                                            {
                                                required: true,
                                                message: "密码为必填项"
                                            },
                                            {
                                                validator: (rules, val, callback) => {
                                                    let {getFieldValue} = this.props.formRef.current;
                                                    if (val !== getFieldValue('password')) {
                                                        callback("密码与确认密码必须一致");
                                                    }
                                                    callback();
                                                }
                                            },
                                        ]}
                                    >
                                        <Input maxLength={20} placeholder={"6-20位字母、数字或组合"}/>
                                    </Form.Item>

                                </Form>
                            ):null
                        }
                    </TabPane>
                </Tabs>
            </>
        )
    }
}

class Add extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
    }

    closeModal = () => {
        this.props.onClose();
    };


    handleCreate = () => {
        this.formRef.current.validateFields().then((values)=>{
            const oper = this.props.id ? 'edit' : 'add';
            console.log(values,'values');
            this.props.asyncAddAccountReport(oper, values, (res) => {
                if(res.data.retCode === '0'){
                    //重新获取列表数据
                    this.props.asyncFetchAccountReportList();
                    this.props.callback && this.props.callback(values.paramName);
                    message.success(this.props.id ? "修改成功" : "新建成功");
                    this.formRef.current.resetFields();
                    //一个组件在一个页面出现两次，清掉第二次的值
                    // this.props.deptInfoRef.setState({
                    //     value: undefined
                    // });
                    this.props.onClose();

                }else{
                    message.error(res.data.retMsg);
                }
            });

        });
    };


    render() {
        return (
            <Modal
                title={this.props.id?"修改报工账号":"新建报工账号"}
                visible={this.props.visible}
                onCancel={this.closeModal}
                width={800}
                onOk={this.handleCreate}
                confirmLoading={this.props.addAccountReport.get('isFetching')}
                destroyOnClose={this.props.id}
            >
                {
                    this.props.id?<EditorFormContent formRef={this.formRef} {...this.props}/>:<FormContent formRef={this.formRef} {...this.props}/>
                }
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        addAccountReport: state.getIn(['auxiliaryAccountReport', 'addAccountReport'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncAddAccountReport,
        asyncFetchAccountReportList
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Add)
