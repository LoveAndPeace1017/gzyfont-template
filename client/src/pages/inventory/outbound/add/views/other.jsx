import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { Col, Row, Input, Form } from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import defaultOptions from 'utils/validateOptions';

import {SelectDeliveryAddress} from 'components/business/deliveryAddress';
import {SelectCustomer} from 'pages/customer/index';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);

class OtherInfo extends Component {


    state={
        open: false
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
                            label={intl.get("outbound.add.other.useDepartment")}
                        >
                            <Input maxLength={80} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            {...defaultOptions}
                            name="usePerson"
                            label={intl.get("outbound.add.other.usePerson")}
                        >
                            <Input maxLength={25}/>
                        </Form.Item>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    suggestCustomer: state.getIn(['saleAdd', 'suggestCustomer'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({}, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(OtherInfo)