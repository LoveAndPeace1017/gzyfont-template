import React, {Component} from 'react';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, message, Select ,Col, Row, Form, Button} from 'antd';
import {connect} from 'react-redux';
import intl from 'react-intl-universal';
import defaultOptions from 'utils/validateOptions';
import Fold from 'components/business/fold';
import {bindActionCreators} from "redux";
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {asyncFetchWorkProcedureList, asyncAddWorkProcedure} from "../actions";
import {SelectEmployeeIdFix} from 'pages/auxiliary/employee';
import {SelectWorkCenter} from 'pages/auxiliary/workCenter';
import { FormInstance } from 'antd/lib/form';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);


class FormContent extends Component {

    onFinish = (values) => {
        console.log(values);
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

        return (
            <React.Fragment>
            <Form name={"workProcedure"} ref={this.props.formRef} onFinish={this.onFinish}>
                <Row>
                    <Col span={22}>
                        <Form.Item
                            {...formItemLayout}
                            name={"processCode"}
                            label={"工序编号"}
                            initialValue={this.props.id?this.props.data.processCode:''}
                            rules={[
                                {
                                    required: true,
                                    message: "工序编号为必填项"
                                },
                                {
                                    max: 20,
                                    message: "工序编号最多可以输入20个字符"
                                }
                            ]}
                        >
                            <Input disabled={this.props.id} maxLength={20}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <Form.Item
                            {...formItemLayout}
                            label={"名称"}
                            name={"processName"}
                            initialValue={this.props.id?this.props.data.processName:''}
                            rules={[
                                {
                                    required: true,
                                    message: "工序名称为必填项"
                                },
                                {
                                    max: 20,
                                    message: "工序名称最多可以输入20个字符"
                                }
                            ]}
                        >
                            <Input maxLength={20}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <Form.Item
                            {...formItemLayout}
                            label={"单位工时产能"}
                            initialValue={this.props.id?this.props.data.productivity:''}
                            name={"productivity"}
                            rules={[
                                {
                                    validator: (rules, val, callback) => {
                                        if(val&&!/^(0|[1-9]\d{0,9})(\.\d{1,3})?$/.test(val)){
                                            callback("整数不能超过10位小数不能超过3位");
                                        }else{
                                            callback();
                                        }
                                    }
                                }
                            ]}
                        >
                            <Input maxLength={14}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <Form.Item
                            {...formItemLayout}
                            label={"默认工作中心"}
                            name={"caCode"}
                            initialValue={this.props.id?this.props.data.caCode:null}
                        >
                            <SelectWorkCenter showEdit={true} width={366}/>
                        </Form.Item>
                    </Col>
                </Row>

            </Form>
            </React.Fragment>
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
            console.log(values,'values');
            this.props.asyncAddWorkProcedure(this.props.id?'edit':'add', values, (res) => {
                console.log(res,'ressss');
                if (res.data.retCode === '0') {
                    //重新获取列表数据
                    this.props.asyncFetchWorkProcedureList();
                    message.success(this.props.id?'修改成功！':'新增成功！');
                    this.props.callback && this.props.callback(values);
                    this.closeModal();
                }
                else {
                    message.error(res.data.retMsg);
                }
            })

        })
        /*this.props.form.validateFields((err, values) => {
            console.log(values);
            if (err) {
                return;
            }
            const oper = this.props.id ? 'edit' : 'add';
            this.props.asyncAddPay(oper, values, (res) => {
                if (res.data.retCode === '0') {
                    //重新获取列表数据
                    console.log(this.props.type);
                    this.props.asyncFetchPayList(this.props.type);
                    this.props.callback && this.props.callback(values.paramName);
                    message.success(intl.get('common.confirm.success'));
                    this.props.form.resetFields();
                    this.props.onClose();
                }
                else {
                    alert(res.data.retMsg+res.data.retValidationMsg.msg[0].msg);
                }
            })
        })*/
    };

    render() {
        return (
            <Modal
                title={this.props.id?"修改工序":"新建工序"}
                visible={this.props.visible}
                onCancel={this.closeModal}
                width={1000}
                onOk={this.handleCreate}
                confirmLoading={this.props.addWorkProcedure.get('isFetching')}
                destroyOnClose={true}
            >
                <FormContent formRef={this.formRef} {...this.props}/>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        addWorkProcedure: state.getIn(['auxiliaryWorkProcedure', 'addWorkProcedure'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchWorkProcedureList,
        asyncAddWorkProcedure
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Add)
