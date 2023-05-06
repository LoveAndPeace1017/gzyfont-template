import React, {Component} from 'react';
import { Row, Col, DatePicker, Form, Input } from 'antd';
import {EllipsisOutlined} from '@ant-design/icons';
import {SelectDept} from 'pages/auxiliary/dept';
import {SelectEmployee} from 'pages/auxiliary/employee';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);

export default class BaseInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            depId: ''
        }
    }

    componentDidMount() {
        this.props.getRef(this);
    }

    openModal = (type) => {
        this.setState({
            [type]: true
        })
    };

    closeModal = (type) => {
        this.setState({
            [type]: false
        })
    };

    //部门选择
    handleDeptChange = (value) => {
        const {setFieldsValue} = this.props.formRef.current;
        this.setState({depId: value});
        //选择部门后人员下拉选项变动
        setFieldsValue({ departmentId: value, employeeId: null, employeeName: null });
    };

    // 选择员工
    handleEmployeeChange = (employeeId) => {
        const {setFieldsValue} = this.props.formRef.current;
        setFieldsValue({ employeeId });
    };

    render() {
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            }
        };

        return (
            <React.Fragment>
                <Row>
                    <Col span={8}>
                        <Form.Item
                            label="请购日期"
                            name={"requestDate"}
                            {...formItemLayout}
                            rules={[{ type: 'object',required: true,message: "该项为必填项"}]}
                        >
                            <DatePicker className={"gb-datepicker"}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            name="departmentName"
                            label={'请购部门'}
                            rules={[{required: true,message: "该项为必填项"}]}
                        >
                            <SelectDept
                                handleDeptChange={this.handleDeptChange}
                                showEmployeeVisible={true}
                                showEdit={true}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            name="employeeName"
                            label={'请购人'}
                            rules={[{required: true,message: "该项为必填项"}]}
                        >
                            <SelectEmployee
                                depId={this.state.depId}
                                handleEmployeeChange={this.handleEmployeeChange}
                                showVisible={true}
                                showEdit={true}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <div style={{display: "none"}}>
                    <Form.Item name="departmentId">
                        <Input type="hidden"/>
                    </Form.Item>
                    <Form.Item name="employeeId">
                        <Input type="hidden"/>
                    </Form.Item>
                </div>
            </React.Fragment>
        );
    }
}
