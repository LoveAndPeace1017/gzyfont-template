import React, {Component} from 'react';
import { Row, Col, DatePicker, Form, Input } from 'antd';
import {EllipsisOutlined} from '@ant-design/icons';
import defaultOptions from 'utils/validateOptions';
import {SelectDept} from 'pages/auxiliary/dept';
import {SelectEmployee} from 'pages/auxiliary/employee';
import {SelectSupplier} from 'pages/supplier/index';
import {SelectProjectById as SelectProject} from 'pages/auxiliary/project';

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
        let { formItemLayout, produceType } = this.props;

        return (
            <React.Fragment>
                <Row>
                    <Col span={8}>
                        <Form.Item
                            label="单据日期"
                            name={"orderDate"}
                            {...formItemLayout}
                            rules={[{ type: 'object',required: true,message: "该项为必填项"}]}
                        >
                            <DatePicker className={"gb-datepicker"}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="项目"
                            name={"projectCode"}
                            {...formItemLayout}
                            {...defaultOptions}
                        >
                            <SelectProject showEdit={true} showSearch={true} showVisible={true}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="交付期限"
                            name={"deliveryDeadlineDate"}
                            {...formItemLayout}
                            {...defaultOptions}
                        >
                            <DatePicker className={"gb-datepicker"}/>
                        </Form.Item>
                    </Col>
                </Row>
                {
                    produceType === 0 && (
                        <Row>
                            <Col span={8}>
                                <Form.Item
                                    {...formItemLayout}
                                    name="departmentName"
                                    label={'生产部门'}
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
                                    label={'生产人'}
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
                    )
                }
                {
                    produceType === 1 && (
                        <Row>
                            <Col span={8}>
                                <Form.Item
                                    {...formItemLayout}
                                    {...defaultOptions}
                                    name="supplier"
                                    label={'供应商'}
                                >
                                    <SelectSupplier
                                        maxLength={80}
                                        onSelect={(value)=>this.props.handleSelectSupplier(value.key)}
                                        onBlur={(existSupplier)=>this.props.handleSelectSupplier(existSupplier.key)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    {...formItemLayout}
                                    {...defaultOptions}
                                    name="contacterName"
                                    label={'联系人'}
                                >
                                    <Input maxLength={25}/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    {...formItemLayout}
                                    {...defaultOptions}
                                    name="contacterTelNo"
                                    label={'联系电话'}
                                >
                                    <Input maxLength={50}/>
                                </Form.Item>
                            </Col>
                        </Row>
                    )
                }

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
