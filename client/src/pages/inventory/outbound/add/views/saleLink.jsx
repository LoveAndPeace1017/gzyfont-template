import React, {Component} from 'react';
import { Col, Row, Input, Form } from 'antd';
import {SelectEmployeeFix} from 'pages/auxiliary/employee';
import defaultOptions from 'utils/validateOptions';

export default class SaleLink extends Component {
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
                            name="ourName"
                            label={'销售方'}
                        >
                            <Input maxLength={25} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            {...defaultOptions}
                            name="ourContacterName"
                            label={'销售员'}
                        >
                            <SelectEmployeeFix
                                showSearch={true}
                                showFullSize={true}
                                showVisible={true}
                                width={200}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            {...defaultOptions}
                            name="ourMobile"
                            label={'销售员联系电话'}
                        >
                            <Input maxLength={25}/>
                        </Form.Item>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

