import React, {Component} from 'react';
import { Form, Modal, Input, message, Alert, Select} from 'antd';
import {connect} from 'react-redux';
import intl from 'react-intl-universal';
import defaultOptions from 'utils/validateOptions';
import {bindActionCreators} from "redux";
import {getCookie} from 'utils/cookie';
import {asyncFetchSmsNotifyList,asyncAddSmsNotify} from "../actions";
import {asyncFetchSubAccountList} from "../../../account/index/actions";
const Option  = Select.Option;

class FormContent extends Component {

    state = {
        type: '生产单'
    }

    typeChange = (type) =>{
        this.setState({
            type
        });
    }


    render() {
        const {formRef,subAccountList} = this.props;

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

        const subAccountListData = subAccountList.getIn(['data', 'data']);

        /*getFieldDecorator('id',{
            initialValue: this.props.goodsUnitId
        });*/

        return (
            <Form ref={formRef}>
                <Form.Item
                    {...formItemLayout}
                    label={"单据类型"}
                    name={"notifyModule"}
                    initialValue={this.props.notifyModule}
                    rules={[
                        {
                            required: true,
                            message: "单据类型为必填项"
                        }
                    ]}
                >
                    <Select onChange={this.typeChange}>
                        <Option value={"销售订单"}>销售订单</Option>
                        <Option value={"生产单"}>生产单</Option>
                    </Select>
                </Form.Item>


                <Form.Item
                    {...formItemLayout}
                    label={"触发条件"}
                    name={"notifyAction"}
                    initialValue={this.props.notifyAction}
                    rules={[
                        {
                            required: true,
                            message: "触发条件为必填项"
                        }
                    ]}
                >
                    <Select>
                        {
                            this.state.type === '生产单'?(
                                <>
                                    <Option value={"新建完成"}>新建完成</Option>
                                </>
                            ):(
                                <>
                                    <Option value={"新建完成"}>新建完成</Option>
                                    <Option value={"审批通过"}>审批通过</Option>
                                </>
                            )
                        }
                    </Select>
                </Form.Item>

                <Form.Item
                    {...formItemLayout}
                    label={"通知人"}
                    name={"notifyUsers"}
                    rules={[
                        {
                            required: true,
                            message: "通知人为必填项"
                        }
                    ]}
                >
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: 250 }}
                        placeholder="选择通知人"
                    >
                        {
                            <Option key={getCookie('uid')}
                                    value={getCookie('uid')}>
                                主账号
                            </Option>
                        }
                        {
                            subAccountListData && subAccountListData.map(employee =>
                                (
                                    <Option key={employee.get('userIdEnc')}
                                            value={employee.get('userIdEnc')}>
                                        {employee.get('loginName')+'-'+employee.get('userName')}
                                    </Option>
                                ))
                        }
                    </Select>

                </Form.Item>

                <Form.Item name="id" initialValue={this.props.id}>
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

    componentDidMount() {
        this.props.asyncFetchSubAccountList();
    }

    handleCreate = () => {
        this.formRef.current.validateFields().then((values)=>{
            const oper = this.props.id ? 'edit' : 'add';
            let notifyUsers = values.notifyUsers || [];
            let dealNotifyUsers = [];
            notifyUsers.forEach((item)=>{
                dealNotifyUsers.push({
                    userIdEnc: item
                })
            });
            values.notifyUsers = dealNotifyUsers;
            this.props.asyncAddSmsNotify(oper, values, (res) => {
                if (res.data.retCode === '0') {
                    //重新获取列表数据
                    this.props.asyncFetchSmsNotifyList();
                    this.props.callback && this.props.callback(values.paramName);
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
        return (
            <Modal
                title={this.props.id?'修改通知':'新建通知'}
                visible={this.props.visible}
                onCancel={this.props.onClose}
                width={800}
                onOk={this.handleCreate}
                confirmLoading={this.props.addSmsNotify.get('isFetching')}
                destroyOnClose={true}
            >
                <FormContent {...this.props} formRef={this.formRef}/>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        addSmsNotify: state.getIn(['auxiliarySmsNotify', 'addSmsNotify']),
        subAccountList: state.getIn(['accountIndex', 'subAccountList']),
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncAddSmsNotify,
        asyncFetchSmsNotifyList,
        asyncFetchSubAccountList
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Add)
