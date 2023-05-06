import React, {Component} from 'react'
import {connect} from "react-redux";
import {Modal} from "antd";

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import {bindActionCreators} from "redux";
import {actions as commonActions} from "components/business/commonRequest";

const cx = classNames.bind(styles);


/**
 * 判断商城是否到期
 *
 */
export default function withMallExpired(WrappedComponent){
    const mapStateToProps = state => ({
        onlineMallInfo: state.getIn(['commonInfo', 'onlineMallInfo'])
    });

    const mapDispatchToProps = dispatch => {
        return bindActionCreators({
            asyncFetchOnlineMall: commonActions.asyncFetchOnlineMall
        }, dispatch)
    };

    return connect(mapStateToProps, mapDispatchToProps)(
        class MallExpiredHoc extends Component {
            constructor(props) {
                super(props);
            }

            componentDidMount(){
                this.props.asyncFetchOnlineMall();
            }

            handleClick=(e)=>{
                const {onlineMallInfo} =this.props;
                const accountInfoData = onlineMallInfo.getIn(['data', 'data']);
                const vipState = accountInfoData.get('vipState');
                if(vipState === 'EXPIRED'){
                    e.preventDefault();
                    Modal.info({
                        title: '订货商城服务已到期，欢迎续约继续使用。',
                        content: <span className={cx("expired-tips")}>详询客服400-6979-890（转1）或 18402578025（微信同号）,<a target="_blank" href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true">立即续约</a></span>
                    })
                }
            };

            render() {
                return (
                    <WrappedComponent {...this.props} mallExpiredJudge={this.handleClick}/>
                );
            }
        }
    )


}
