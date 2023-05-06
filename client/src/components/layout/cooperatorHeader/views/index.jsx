import React, { Component } from 'react';
import {Layout} from "antd";
import {Link} from 'react-router-dom';
import Icon from 'components/widgets/icon';
import InviteModal from 'components/widgets/invite';
import logo from '../images/logo.png';
import shouzhi from '../images/shouzhi.png';
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

    showAddFriendModal = () => {
        this.setState({
            addFriendVisible: true,
        });
    };

    hideAddFriend = () => {
        this.setState({
            addFriendVisible: false,
        });
    };

	render() {
		let contacter = decodeURIComponent(getCookie('contacter'));
		let userIdEnc = getCookie('userIdEnc');

		return(
			<AntdHeader className={cx('header')}>
				<div className={cx('header-hd')}>
				<h1 className={cx('logo')}>
					<Link to="/">
						<img src={logo} alt="百卓优采云进销存" />
					</Link>
				</h1>
				<h1 className={cx('user-name')}>
					欢迎您 {contacter}
				</h1>
				<h1 className={cx('user-tools')}>
                    <img src={shouzhi} alt="tp"/>
                    <span className={cx('user-register')} onClick={this.showAddFriendModal}>获取专属邀请注册地址</span>
                    <span className={cx("v-sep")}>|</span>
                    <a href="/logout/cooperator">退出</a>
				</h1>
                </div>
                <InviteModal
                    title="提示信息"
                    inviteVisible={this.state.addFriendVisible}
                    onCancel={this.hideAddFriend}
                    width={800}
                    type={"1"}
					module={"hehuo"}
                    url={`https://erp.abiz.com/register/invite?source=${userIdEnc}&trench=8`}
                />
			</AntdHeader>
		)
	}
}
export default connect(null,null)(CooperatorHeader);
