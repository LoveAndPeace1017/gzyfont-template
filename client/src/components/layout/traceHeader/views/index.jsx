import React, { Component } from 'react';
import {Layout,Modal} from "antd";
import {Link} from 'react-router-dom';
import Icon from 'components/widgets/icon';
import InviteModal from 'components/widgets/invite';
import logo from '../images/logo1.png';
import erwei from '../images/erwei.png';
import out from '../images/out.png';
import person from '../images/person.png';
import qr_code from '../images/qr_code.png';

import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {getCookie,setCookie} from 'utils/cookie';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
const AntdHeader = Layout.Header;
const cx = classNames.bind(styles);
import {actions as commonActions} from 'components/business/commonRequest/index';


class CooperatorHeader extends Component {
	constructor(props){
		super(props);
		this.state = {
            addFriendVisible: false,
		}
	}

	componentDidMount() {

	}
    //咨询客服
    askPeople = ()=>{
        window.open('https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true');
	}
    //退出登录
    logout = ()=>{
        Modal.confirm({
            title: "提示信息",
            okText: "确定",
            cancelText: "取消",
            content: "确定退出吗？",
            onOk() {
                window.location.href = '/logout/trace'
            },
            onCancel() {
            },
        });
	}

	render() {

		return(
			<AntdHeader className={cx('header')}>
				<div className={cx('header-hd')}>
					<h1 className={cx('logo')}>
						<Link to="/">
							<img src={logo} alt="百卓优采云进销存" />
						</Link>
					</h1>
					<span className={cx("logo-title")}>丨订单追踪云平台</span>
                    <div  className={cx('header-menu')}>
                        <span className={cx("down-app")}>
							<img src={erwei} alt="tp"/>
							<div className={cx("er-wei")}>
								<img src={qr_code} alt="tp"/>
							     <h3>扫码下载移动端</h3>
							</div>
						</span>
                        <span onClick={this.askPeople}><img src={person} alt="tp"/></span>
                        <span onClick={this.logout}><img src={out} alt="tp"/></span>
                    </div>
                </div>

			</AntdHeader>
		)
	}
}
export default connect(null,null)(CooperatorHeader);
