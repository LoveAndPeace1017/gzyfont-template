import React, {Component} from 'react';
import { Input, Col, Row, Form} from 'antd';
const {TextArea} = Input;
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);

class OtherInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

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

        const otherFormItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: '2d66'},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: '21d33'},
            }
        };

        return (
            <React.Fragment>
                <Row>
                    <Col span={24}>
                        <Form.Item
                            {...formItemLayout}
                            {...otherFormItemLayout}
                            name="remarks"
                            label={'备注'}
                        >
                            <TextArea rows={4} maxLength={2000} />
                        </Form.Item>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}


export default OtherInfo