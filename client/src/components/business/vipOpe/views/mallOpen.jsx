import React, {Component} from 'react'
import intl from 'react-intl-universal';
import {connect} from "react-redux";
import {Modal} from "antd";

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import CompleteComInfo from "components/business/completeComInfo";
import {bindActionCreators} from "redux";
import {asyncFetchOpenMall} from '../actions'
const cx = classNames.bind(styles);
import PropTypes from 'prop-types';

const mapStateToProps = state => ({
    currentAccountInfo: state.getIn(['commonInfo', 'currentAccountInfo']),
    openMall: state.getIn(['vipOpe', 'openMall'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchOpenMall
    }, dispatch)
};

/**
 * 开通商城操作
 *
 * @visibleName MallOpen（开通商城操作）
 * @author guozhaodong
 */
@connect(mapStateToProps, mapDispatchToProps)
export default class MallOpen extends Component {
    static propTypes = {
        /**
         * 是否显示
         **/
        visible: PropTypes.bool,
        /**
         * 关闭方法
         **/
        onClose: PropTypes.func,
        /**
         * 商城成功开通回调
         **/
        openSuccCallback: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    openMall=()=>{
        const {currentAccountInfo} =this.props;
        const accountInfo = currentAccountInfo.get('data');
        const _this = this;
        this.props.asyncFetchOpenMall({
            companyContacts: accountInfo.get('comContacts'),
            mobilePhone: accountInfo.get('mobilePhone')
        },(res)=>{
            if(res && res.retCode === '0'){
                this.props.openSuccCallback && this.props.openSuccCallback();
            }else{
                Modal.error({
                    title: intl.get("components.vipOpe.mallOpen.warningTip"),
                    content: res.retMsg
                });
            }
        })
    };

    render() {
        return (
            <React.Fragment>
                <CompleteComInfo
                    title={intl.get("components.vipOpe.mallOpen.openTip")}
                    tips={<div className={cx("open-tips")}>{intl.get("components.vipOpe.mallOpen.message1")} <a target="_blank" href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true">{intl.get("components.vipOpe.mallOpen.message2")}</a>{intl.get("components.vipOpe.mallOpen.message3")}</div> }
                    visible={this.props.visible}
                    onCancel={this.props.onClose}
                    okCallback={()=>{
                        this.props.onClose();
                        this.openMall();
                    }}
                    loadingCallBack={this.props.openMall.get('isFetching')}
                />
            </React.Fragment>
        );
    }
}
