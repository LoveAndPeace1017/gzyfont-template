import React, { Component } from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { message, Modal, Radio, Button, Input } from 'antd';
const { TextArea } = Input;
const RadioGroup = Radio.Group;
import intl from 'react-intl-universal';

import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {asyncOperateApprove} from "../actions";
const cx = classNames.bind(styles);

/**
 *  反驳操作
 * @visibleName RejectApprove
 * @author jinbo
 */
class RejectApprove extends Component {
    constructor(props) {
        super(props);
        this.state={
            rejectApproveVisible: false
        };
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

    onOk = () => {
        const {form: {getFieldValue}} = this.props;
        let backType = getFieldValue('backType') || "0";
        let reason = getFieldValue('reason') || '';
        if(reason.replace(/\s+/g,"")===''){
            message.error(intl.get("components.approve.rejectApprove.messageError"));
            return false;
        }
        this.props.asyncOperateApprove({operate: 1, backType, reason,approveTask:this.props.approveTask,billNo:this.props.billNo,type:this.props.type}, (res) => {
            if(res && res.data.retCode === "0"){
                // 重新刷新详情页
                this.props.okCallback();
                this.closeModal('rejectApproveVisible');
            } else {
                message.error(res.data.retMsg);
            }
        })
    };


    render() {
        const {form: {getFieldDecorator}} = this.props;

        //表单宽度
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 2},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 22},
            }
        };

        return (
            <React.Fragment>
                <div onClick={() => this.openModal('rejectApproveVisible')}  className={cx('rejectContent')}>
                    {this.props.render(this)}
                </div>
                <Modal
                    className={cx('rejectModal')}
                    title={intl.get("components.approve.rejectApprove.tipTitle")}
                    width={520}
                    visible={this.state.rejectApproveVisible}
                    onOk={this.onOk}
                    onCancel={() => this.closeModal('rejectApproveVisible')}
                >
                    <div>
                        <Form>
                            <Form.Item
                                {...formItemLayout}
                                label={""}
                            >
                                {getFieldDecorator('backType', {
                                    // ...defaultOptions,
                                    initialValue: "1"
                                })(
                                    <RadioGroup>
                                        <Radio key={1} value={"1"}>{intl.get("components.approve.rejectApprove.rejectWay1")}</Radio>
                                        <Radio key={0} value={"0"}>{intl.get("components.approve.rejectApprove.rejectWay2")}</Radio>
                                    </RadioGroup>
                                )}
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                label={""}
                            >
                                {getFieldDecorator('reason', {
                                    // ...defaultOptions,
                                })(
                                    <TextArea maxLength={1000} rows={4}
                                              placeholder={intl.get("components.approve.rejectApprove.placeholder")}
                                    />
                                )}
                            </Form.Item>
                        </Form>
                    </div>
                </Modal>
            </React.Fragment>

        );
    }
}


const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncOperateApprove
    }, dispatch)
};

export default connect(null, mapDispatchToProps)(Form.create()(RejectApprove));





