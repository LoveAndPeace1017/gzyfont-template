import React, {Component} from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Col, Input, Modal, Row, message } from 'antd';

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {asyncFetchOpenAppletsMall} from '../actions'
import Icon from 'components/widgets/icon';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const cx = classNames.bind(styles);

class CompleteComInfo extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading:false,
        }
    }

    onOk = ()=>{
        const _this = this;
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            this.props.asyncFetchOpenAppletsMall(values, (data) => {
                if (data.retCode === '0') {

                    this.props.onClose();

                    //重新获取列表数据
                    Modal.success({
                        title: '您的申请已提交，工作人员会与您联系~',
                        iconType: <Icon type="check-circle-fill" />,
                        okText: '知道了',
                        onOk(close){
                            close();
                            _this.props.okCallback && _this.props.okCallback();
                            _this.props.refresh && _this.props.refresh()
                        }
                    })
                }
                else {
                    Modal.error({
                        title: '提示信息',
                        content: res.data.retMsg
                    });
                }
            })
        })

    };

    onCancel=()=>{
        this.props.onClose();
        this.props.refresh && this.props.refresh();
    };

    render(){
        const { getFieldDecorator} = this.props.form;
        const accountInfo = this.props.currentAccountInfo.get('data');
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 10 },
            }
        };
        return(
                <Modal
                    {...this.props}
                    title={"申请开通"}
                    okButtonProps={{
                        'ga-data':'open-applets-pre-ok'
                    }}
                    cancelButtonProps={{
                        'ga-data':'open-applets-pre-cancel'
                    }}
                    onOk={this.onOk}
                    onCancel={this.onCancel}
                    okText={"开通"}
                    cancelText={"取消"}
                    confirmLoading={this.props.openAppletsMall.get('isFetching')}
                    className={"list-pop"}
                    destroyOnClose={true}
                    width={800}
                >
                    <div className={cx("applets-pre-wrap")}>
                        <Form>
                            <Form.Item
                                label="联系人"
                                {...formItemLayout}
                            >
                                {
                                    getFieldDecorator("mallContacter", {
                                        initialValue: accountInfo.get('comContacts'),
                                        rules: [
                                            {
                                                required: true,
                                                message: '联系人为必填'
                                            }
                                        ]
                                    })(
                                        <Input maxLength={25}/>
                                    )
                                }
                            </Form.Item>
                            <Form.Item
                                label="手机号码"
                                {...formItemLayout}
                            >
                                {
                                    getFieldDecorator("mallPhone", {
                                        initialValue: accountInfo.get('mobilePhone'),
                                        rules: [
                                            {
                                                required: true,
                                                message: '手机号码为必填'
                                            }
                                        ]
                                    })(
                                        <Input maxLength={20}/>
                                    )
                                }
                            </Form.Item>
                        </Form>
                    </div>
                </Modal>
        )
    }
}

const mapStateToProps = (state) => ({
    currentAccountInfo: state.getIn(['commonInfo', 'currentAccountInfo']),
    openAppletsMall: state.getIn(['mallHome', 'openAppletsMall'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchOpenAppletsMall
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CompleteComInfo))


