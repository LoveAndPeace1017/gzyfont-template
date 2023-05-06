import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { Col, Row, Form } from 'antd';
import defaultOptions from 'utils/validateOptions';

import {SelectDept} from 'pages/auxiliary/dept';
import {SelectEmployee} from 'pages/auxiliary/employee';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);

class OtherInfo extends Component {
    state = {
        depId: ''
    };
    //部门选择
    handleDeptChange = (value) => {
        const {setFieldsValue} = this.props.formRef.current;
        //选择部门后人员下拉选项变动
        this.setState({depId: value});
        setFieldsValue({ usePerson: null });
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
                            {...formItemLayout}
                            {...defaultOptions}
                            name="useDepartment"
                            label={intl.get("outbound.add.inner.useDepartment")}
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
                            {...defaultOptions}
                            name="usePerson"
                            label={intl.get("outbound.add.inner.usePerson")}
                        >
                            <SelectEmployee
                                depId={this.state.depId}
                                showVisible={true}
                                showEdit={true}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

export default OtherInfo