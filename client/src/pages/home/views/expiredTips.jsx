import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Menu, Dropdown, Modal, Tabs, message, Row, Col, Input } from 'antd';
import {Link} from 'react-router-dom';
import styles from "../styles/index.scss";
import Icon from 'components/widgets/icon';
import {asyncFetchVipData} from '../actions'
import {getCookie,setCookie} from 'utils/cookie';
import classNames from "classnames/bind";
import {actions as commonActions} from 'components/business/commonRequest/index';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import intl from 'react-intl-universal';
import {asyncFetchCooperatorList} from "../../cooperator/home/index/actions";
import moment from "moment/moment";
import {
    ExclamationCircleOutlined
} from '@ant-design/icons';
const cx = classNames.bind(styles);

class expiredTips extends Component {
    constructor(props) {
        super(props);
    }


    componentDidMount() {
        this.props.asyncFetchVipData((data)=>{
            if(data.data && data.data.vipState != 'NOT_OPEN'){
                let endTime = data.data.endTime;
                //到期日期存入cookie方便存取
                let formatDate =  moment(new Date(endTime)).format("YYYY.MM.DD");
                //如果不是赠送的服务，添加cookie
                if(!data.data.present){
                    setCookie('getCookieExpiredTipFormatDate',formatDate);
                }else{
                    setCookie('getCookieExpiredTipFormatDate','');
                }
                //剩余的vip到期天数
                let days = moment(moment(new Date(endTime)).format("YYYY-MM-DD")).diff(moment(new Date()).format("YYYY-MM-DD"),'days')+1;
                let cookieDays = getCookie('getCookieExpiredTipDays');
                //如果天数小于3且cookie里的天数和算出的天数不一样，则显示提示框
                if(days<=3 && days>0 && days!=cookieDays){
                    let content = (<div>
                        <p>{intl.get("home.expiredTips.tip1")}：{getCookie('mainUserName')}{intl.get("home.expiredTips.tip2")}{days}{intl.get("home.expiredTips.tip3")}</p>
                        <p>{intl.get("home.expiredTips.tip4")}</p>
                        <p style={{paddingLeft:65}}>{intl.get("home.expiredTips.tip5")}</p>
                        <p><a style={{color:'#0066dd'}} target="_blank" href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true">{intl.get("home.expiredTips.yes")}</a></p>
                    </div>);
                    Modal.warning({
                        title: intl.get("common.confirm.title"),
                        icon: <ExclamationCircleOutlined/>,
                        content: content,
                        onOk: function(){
                            setCookie('getCookieExpiredTipDays',days);
                        }
                    })
                }
            }
        });
    }

    render(){
        return(
            <React.Fragment>

            </React.Fragment>
        )
    }
}




const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchVipData
    }, dispatch)
};


export default withRouter(
    connect(null,mapDispatchToProps)(expiredTips)
)



