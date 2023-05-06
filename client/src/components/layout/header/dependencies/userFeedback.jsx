import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Col, Row, Modal, Spin, Input, Radio, message, InputNumber } from 'antd';
import {actions as commonActions} from 'components/business/commonRequest/index';

import '../styles/index.scss';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import defaultOptions from 'utils/validateOptions';

const {TextArea} = Input;
const cx = classNames.bind(styles);

class UserFeedback extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }

    }

    onOk = () => {
        if (this.state.loading) {
            return;
        }

        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                });
                this.props.asyncPostFeedback(values, (data) => {
                    this.setState({
                        loading: false
                    });
                    if (data.retCode == 0) {
                        message.success('提交成功');
                        this.props.onCancel();
                    } else {
                        message.error('提交失败');
                    }
                });
            }

        });
    };

    render() {
        const {
            accountInfo,
            form: {getFieldDecorator}
        } = this.props;

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
            <Modal
                title={'建议反馈'}
                visible={this.props.visible}
                onCancel={this.props.onCancel}
                width={800}
                maskClosable={false}
                destroyOnClose={true}
                onOk={this.onOk}
                okButtonProps={{loading: this.state.loading}}
                className={cx("list-pop")}
            >
                <div>
                    <Row style={{padding: '10px 15px 0px 15px'}}>
                        <Form.Item>为了提供更好的服务，期待您宝贵的使用反馈。客服热线：400-6979-890（转1）。</Form.Item>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                label="反馈内容"
                                required={true}
                                {...otherFormItemLayout}
                            >
                                {
                                    getFieldDecorator("content", {
                                        ...defaultOptions,
                                        rules: [
                                            {
                                                required: true,
                                                message: '反馈内容为必填项！'
                                            }
                                        ]
                                    })(
                                        <TextArea rows={5} maxLength={500} placeholder="在这里填写您的宝贵意见哦"/>
                                    )
                                }
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={24}>
                            <Form.Item
                                label="公司名称"
                                required={true}
                                style={{}}
                                {...otherFormItemLayout}
                            >
                                {
                                    getFieldDecorator("comName", {
                                        ...defaultOptions,
                                        initialValue: accountInfo && (accountInfo.getIn(['data', 'comName']) === 'N/A' ? '' : accountInfo.getIn(['data', 'comName'])),
                                        rules: [
                                            {
                                                required: true,
                                                message: '公司名称为必填'
                                            }
                                        ]
                                    })(
                                        <Input style={{width: '40%'}} maxLength={80} placeholder="请输入公司名称"/>
                                    )
                                }
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={8}>
                            <Form.Item
                                label="联系人"
                                required={true}
                                {...formItemLayout}
                            >
                                {
                                    getFieldDecorator("contactName", {
                                        ...defaultOptions,
                                        initialValue: accountInfo && (accountInfo.getIn(['data', 'comContacts']) === 'N/A' ? '' : accountInfo.getIn(['data', 'comContacts'])),
                                        rules: [
                                            {
                                                required: true,
                                                message: '联系人为必填'
                                            }
                                        ]
                                    })(
                                        <Input maxLength={25} placeholder="填写姓名"/>
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col span={8} offset={1}>
                            <Form.Item>
                                {
                                    getFieldDecorator("contactGender", {
                                        initialValue: 0
                                    })(
                                        <Radio.Group>
                                            <Radio value={0}>先生</Radio>
                                            <Radio value={1}>女士</Radio>
                                        </Radio.Group>
                                    )
                                }
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                label="联系电话"
                                required={true}
                                {...otherFormItemLayout}
                            >
                                {
                                    getFieldDecorator("contactMobile", {
                                        validateFirst: true,
                                        validateTrigger: 'onBlur',
                                        initialValue: accountInfo && accountInfo.getIn(['data', 'mobilePhone']),
                                        rules: [
                                            {
                                                required: true,
                                                message: '手机号码为必填'
                                            },
                                            {
                                                pattern: new RegExp(/^1[0-9]{10}$/, "g"),
                                                message: '手机号格式不正确'
                                            }
                                        ]
                                    })(
                                        <Input style={{width: '40%'}} maxLength={11} placeholder="填写手机号码"/>
                                    )
                                }
                            </Form.Item>
                        </Col>
                    </Row>

                </div>
            </Modal>
        );
    }
}


const mapStateToProps = (state) => ({
    accountInfo: state.getIn(['commonInfo', 'currentAccountInfo'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncPostFeedback: commonActions.asyncPostFeedback,
    }, dispatch)
};

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(UserFeedback));
