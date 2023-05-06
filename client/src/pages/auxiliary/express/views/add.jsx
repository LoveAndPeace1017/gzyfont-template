import React, {Component} from 'react';
import { Modal, Input, message, Form, Select } from 'antd';
import {connect} from 'react-redux';
import defaultOptions from 'utils/validateOptions';
import {bindActionCreators} from "redux";

import {asyncFetchExpressList, asyncAddExpress,asyncFetchExpressSelectInfo} from "../actions";
import {reducer as auxiliaryExpress} from "../index";
const {Option} = Select;

class Add extends Component {
    formRef = React.createRef();

    //表单宽度
    static formItemLayout = {
        labelCol: {
            xs: {span: 24},
            sm: {span: 8},
        },
        wrapperCol: {
            xs: {span: 24},
            sm: {span: 10},
        }
    };

    componentDidMount() {
        this.loadInfo();
    }

    constructor(props) {
        super(props);
        this.state = {
            expressInfo: []
        }
    }

    closeModal = () => {
        this.props.onClose();
    };

    loadInfo = ()=> {
        this.props.asyncFetchExpressSelectInfo((data)=>{
            if(data.data.retCode === "0"){
                this.setState({
                    expressInfo: data.data.data || []
                });
            }
           console.log('info',data);
        });

    }

    handleCreate = () => {
        this.formRef.current.validateFields().then((values)=>{
            const oper = this.props.id ? 'edit' : 'add';
            this.props.asyncAddExpress(oper, values, (res) => {
                if (res.data.retCode === '0') {
                    //重新获取列表数据
                    this.props.asyncFetchExpressList(this.props.type||'express');
                    this.props.callback && this.props.callback(values.paramName);
                    message.success('操作成功!');
                    this.formRef.current.resetFields();
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
                title={this.props.id ? "修改物流公司名称" : "新建物流公司名称"}
                visible={this.props.visible}
                onCancel={this.closeModal}
                width={800}
                onOk={this.handleCreate}
                confirmLoading={this.props.addExpress.get('isFetching')}
                destroyOnClose={true}
            >
                <Form ref={this.formRef}>
                    <Form.Item
                        {...defaultOptions}
                        {...Add.formItemLayout}
                        label={'物流公司'}
                        initialValue={this.props.incomeName}
                        name={'paramName'}
                        rules={[{required: true, message: "物流公司名称为必填项！"}]}
                    >
                        <Select
                            allowClear
                            style={{minWidth: '200px'}}
                            placeholder={"请选择快递公司"}
                        >
                            {
                                this.state.expressInfo && this.state.expressInfo.map((item,index) => (
                                    <Option key={index}
                                            value={item}>{item}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item name="id" initialValue={this.props.id}>
                        <Input type="hidden"/>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        addExpress: state.getIn(['auxiliaryExpress', 'addExpress'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncAddExpress,
        asyncFetchExpressList,
        asyncFetchExpressSelectInfo
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Add)
