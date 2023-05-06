import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Modal, message } from 'antd';

import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);

import {actions as commonActions} from 'components/business/commonRequest/index';
import PropTypes from "prop-types";

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

/**
 * 完善公司信息
 *
 * @visibleName CompleteComInfo（完善公司信息）
 * @author qiumingsheng
 */
class CompleteComInfo extends Component{

    static propTypes = {
        /** 是否显示 */
        visible: PropTypes.bool,
        /** 取消回调函数 */
        onCancel:PropTypes.func,
        /** 确定回调函数 */
        okCallback:PropTypes.func,
        /** 是否现在加载图标 */
        loadingCallBack: PropTypes.bool,
        tips: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.node
        ]),
        title: PropTypes.string,
        className: PropTypes.string
    };

    static defaultProps={
        title: intl.get("components.completeComInfo.index.completeComInfo"),
        tips: <Form.Item
            label={<React.Fragment/>}
            colon={false}
            {...formItemLayout}
            className={cx("text")}
        >
            {intl.get("components.completeComInfo.index.completeComInfoContent")}
        </Form.Item>,
        className: ''
    };

    constructor(props){
        super(props);
        this.state = {
            loading:false,
        }
    }

    onOk = ()=>{
        const {currentAccountInfo } = this.props;
        const accountInfo = currentAccountInfo.get('data');
        if(accountInfo && accountInfo.get('mainUserFlag')){
            this.props.form.validateFields((err, values) => {
                if (err) {
                    return;
                }
                let _this = this;
                this.props.asyncCompleteComInfo(values, (res) => {
                    if (res.retCode == '0') {
                        //重新获取列表数据
                        this.props.asyncGetComInfo();
                        if(_this.props.okCallback){
                            _this.props.okCallback();
                        }
                        message.success(intl.get("components.completeComInfo.index.operateSuccessMessage"));
                    }
                    else {
                        Modal.error({
                            title: intl.get("components.completeComInfo.index.warningTip"),
                            content: res.retMsg
                        });
                    }
                })
            })
        }else{
            Modal.error({
                title: intl.get("components.completeComInfo.index.warningTip"),
                content: intl.get("components.completeComInfo.index.onlyMainAccountOperate")
            })
        }


    };

    render(){
        const { form:{getFieldDecorator}, currentAccountInfo } = this.props;
        const accountInfo = currentAccountInfo.get('data');
        return(
                <Modal
                    {...this.props}
                    title={this.props.title}
                    okButtonProps={{
                        'ga-data':'complete-com-info-ok'
                    }}
                    cancelButtonProps={{
                        'ga-data':'complete-com-info-cancel'
                    }}
                    onOk={this.onOk}
                    okText={intl.get("components.completeComInfo.index.okText")}
                    cancelText={intl.get("components.completeComInfo.index.cancelText")}
                    confirmLoading={
                        this.props.currentAccountInfo.get('isFetching') &&
                        (this.props.loadingCallBack === undefined ? true: this.props.loadingCallBack)
                    }
                    className={"list-pop "+this.props.className}
                    destroyOnClose={true}
                    width={800}
                >
                    <div className={cx("complete-wrap")}>
                        <Form>
                            {this.props.tips}
                            <Form.Item
                                label={intl.get("components.completeComInfo.index.comName")}
                                {...formItemLayout}
                            >
                                {
                                    getFieldDecorator("companyName", {
                                        initialValue: accountInfo && accountInfo.get('comName') !=='N/A'? accountInfo.get('comName'):'',
                                        rules: [
                                            {
                                                required: true,
                                                message: intl.get("components.completeComInfo.index.comNameMessage")
                                            }
                                        ]
                                    })(
                                        <Input maxLength={80}/>
                                    )
                                }
                            </Form.Item>
                            <Form.Item
                                label={intl.get("components.completeComInfo.index.companyContacts")}
                                {...formItemLayout}
                            >
                                {
                                    getFieldDecorator("companyContacts", {
                                        initialValue: accountInfo && accountInfo.get('comContacts') !=='N/A' ? accountInfo.get('comContacts'): '',
                                        rules: [
                                            {
                                                required: true,
                                                message: intl.get("components.completeComInfo.index.companyContactsMessage")
                                            }
                                        ]
                                    })(
                                        <Input maxLength={25}/>
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
    currentAccountInfo: state.getIn(['commonInfo', 'currentAccountInfo'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncCompleteComInfo:commonActions.asyncCompleteComInfo,
        asyncGetComInfo: commonActions.asyncGetComInfo
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CompleteComInfo))


