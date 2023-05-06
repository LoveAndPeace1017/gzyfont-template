import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { Row, Col, Input, DatePicker, Form } from 'antd';
import defaultOptions from 'utils/validateOptions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {SelectCustomer} from 'pages/customer/index'

import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);

class BaseInfo extends Component {

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
            <Row>
                <Col span={8}>
                    <Form.Item
                        {...formItemLayout}
                        {...defaultOptions}
                        name="infoTitle"
                        label={intl.get("inquiry.add.baseInfo.infoTitle")}
                        rules={[
                            {
                                required: true,
                                message: intl.get("inquiry.add.baseInfo.infoTitleMessage")
                            }
                        ]}
                    >
                        <Input maxLength={30}/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        {...formItemLayout}
                        name="effectiveTime"
                        label={intl.get("inquiry.add.baseInfo.effectiveTime")}
                        rules={[
                            {
                                type: 'object',
                                required: true,
                                message: intl.get("inquiry.add.baseInfo.effectiveTimeMessage")
                            }
                        ]}
                    >
                        <DatePicker disabledDate={(current)=> current && (current < moment().endOf('day') || current > moment().add(180, 'days'))}/>
                    </Form.Item>
                </Col>
            </Row>
        );
    }
}

const mapStateToProps = (state) => ({
    suggestCustomer: state.getIn(['inquiryAdd', 'suggestCustomer'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({

    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(BaseInfo)