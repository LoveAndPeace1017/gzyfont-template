import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, message, Select, Input } from 'antd';
import {connect} from 'react-redux';
import {asyncFetchLanguageList, asyncSwitchLanguage} from "../actions";
import defaultOptions from 'utils/validateOptions';
import {emit} from 'utils/emit';
import {getCookie,setCookie,setDomainCookie} from 'utils/cookie';
import {bindActionCreators} from "redux";


class FormContent extends Component {
    componentDidMount() {
        this.props.asyncFetchLanguageList();
    }

    render() {
        const {languageList} = this.props;
        const {getFieldDecorator} = this.props.form;

        //表单宽度
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 10},
            }
        };

        return(
            <Form>
                <Form.Item
                    {...formItemLayout}
                    label={intl.get('components.switchLanguage.index.switchLanguage')}
                >
                    {
                        getFieldDecorator('configValue', {
                            ...defaultOptions,
                            initialValue: languageList && languageList.get('data')
                        })(
                            <Select
                                showSearch
                                style={{ width: 200 }}
                            >
                                <Select.Option value="zhCN" key="zhCN">简体中文</Select.Option>
                                <Select.Option value="enUS" key="enUS">English</Select.Option>
                                {/*<Select.Option value="zhTW" key="zhTW">繁體</Select.Option>*/}
                            </Select>
                        )
                    }
                </Form.Item>
            </Form>
        )
    }
}

class SwitchLanguage extends Component {
    constructor(props) {
        super(props);
    }

    closeModal = () => {
        this.props.onClose();
    };

    handleCreate = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            this.props.asyncSwitchLanguage({...values}, (res) => {
                if (res && res.retCode === '0') {
                    //重新获取列表数据
                    message.success(intl.get('components.switchLanguage.index.operateSuccessMessage'));
                    setDomainCookie('language',values.configValue);
                    // 发送消息
                    emit.emit('change_language', values.configValue);
                    this.props.form.resetFields();
                    this.props.onClose();
                }
                else {
                    message.error(res.retMsg+res.retValidationMsg.msg[0].msg);
                }
            })
        })
    };

    render() {
        return (
            <Modal
                title={intl.get('components.switchLanguage.index.switchLanguage')}
                visible={this.props.visible}
                onCancel={this.closeModal}
                width={800}
                onOk={this.handleCreate}
                // confirmLoading={this.props.addTimeCard.get('isFetching')}
                destroyOnClose={true}
            >
                <FormContent {...this.props}/>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        languageList: state.getIn(['languageInfo', 'language'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchLanguageList,
        asyncSwitchLanguage
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(SwitchLanguage))
