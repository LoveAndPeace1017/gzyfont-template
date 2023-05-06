import React, {Component} from 'react';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, message, Select ,Col, Row, Form, Button} from 'antd';
import {connect} from 'react-redux';
import intl from 'react-intl-universal';
import defaultOptions from 'utils/validateOptions';
import Fold from 'components/business/fold';
import {bindActionCreators} from "redux";
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {asyncFetchWorkCenterList, asyncAddWorkCenter} from "../actions";
import {SelectEmployeeIdFix} from 'pages/auxiliary/employee';
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
            <Form name={"workCenter"} ref={this.props.formRef} onFinish={this.onFinish}>
                <Row>
                    <Col span={22}>
                        <Form.Item
                            {...formItemLayout}
                            name={"caCode"}
                            label={"工作中心编号"}
                            initialValue={this.props.id?this.props.data.caCode:''}
                            rules={[
                                {
                                    required: true,
                                    message: "工作中心编号为必填项"
                                },
                                {
                                    max: 20,
                                    message: "工作中心编号最多可以输入20个字符"
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
                            initialValue={this.props.id?this.props.data.caName:''}
                            name={"caName"}
                            rules={[
                                {
                                    required: true,
                                    message: "工作中心名称为必填项"
                                },
                                {
                                    max: 20,
                                    message: "工作中心编号最多可以输入20个字符"
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
                            label={"负责人"}
                            name={"officerId"}
                            initialValue={this.props.id?this.props.data.officerId:null}
                            rules={[
                                {
                                    required: true,
                                    message: "负责人为必填项"
                                }
                            ]}
                        >
                            <SelectEmployeeIdFix width={366}/>
                        </Form.Item>
                    </Col>
                </Row>

                <div className={cx("worker-title")}>
                    工人明细
                </div>

                <Form.List
                        name="employeeId"
                        initialValue={this.props.id?this.props.data.employeeId:['']}
                    >
                    {
                        (fields, { add, remove }, { errors }) => (
                            <React.Fragment>
                             {fields.map((field, index) => (
                                <Row key={index}>
                                    <Col span={22}>
                                        <Form.Item
                                            {...formItemLayout}
                                            {...field}
                                            label={"部门员工"}
                                            key={field.key}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "部门员工为必填项"
                                                },
                                                {
                                                    validator: (rules, val,callback) => {
                                                        /*let employeeId = this.props.formRef.current.getFieldValue('employeeId')|| [];
                                                        employeeId.indexOf(val)!== -1 && employeeId.splice(employeeId.indexOf(val),1);
                                                        if(employeeId.indexOf(val) !== -1){
                                                            callback('存在重复的工人');
                                                        }else{
                                                            callback();
                                                        }*/
                                                        let employeeId = this.props.formRef.current.getFieldValue('employeeId')|| [];
                                                        let time = 0;
                                                        employeeId.forEach((item)=>{
                                                            if(item === val){
                                                                time = time+1;
                                                            }
                                                        });
                                                        if(time>=2){
                                                            callback('存在重复的工人');
                                                        }else{
                                                            callback();
                                                        }
                                                    }
                                                }

                                            ]}
                                        >
                                            <SelectEmployeeIdFix showVisible={true} width={366}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={2}>

                                        <div className={cx("field-ope")}>
                                            {fields.length < 20 ?
                                                <PlusCircleOutlined onClick={() => {add()}} /> : ""}
                                            {fields.length > 1 ?
                                                <MinusCircleOutlined style={{marginLeft: "10px"}} onClick={() => {remove(field.name)}} /> : ""}
                                        </div>
                                    </Col>
                                </Row>
                             ))}
                            </React.Fragment>
                        )
                    }
                    </Form.List>

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
            this.props.asyncAddWorkCenter(this.props.id?'edit':'add', values, (res) => {
                console.log(res,'ressss');
                if (res.data.retCode === '0') {
                    //重新获取列表数据
                    this.props.asyncFetchWorkCenterList();
                    this.props.callback && this.props.callback(values.caCode);
                    message.success(this.props.id?'修改成功！':'新增成功！');
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
                title={this.props.id?"修改工作中心":"新建工作中心"}
                visible={this.props.visible}
                onCancel={this.closeModal}
                width={1000}
                onOk={this.handleCreate}
                confirmLoading={this.props.addWorkCenter.get('isFetching')}
                destroyOnClose={true}
            >
                <FormContent formRef={this.formRef} {...this.props}/>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        addWorkCenter: state.getIn(['auxiliaryWorkCenter', 'addWorkCenter'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchWorkCenterList,
        asyncAddWorkCenter
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Add)
