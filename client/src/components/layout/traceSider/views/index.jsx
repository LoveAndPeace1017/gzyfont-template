import React, { Component } from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Layout,Menu,Button} from 'antd';
import {Link, NavLink, withRouter} from 'react-router-dom';
import classNames from "classnames/bind";
import ScrollContainer from 'components/widgets/scrollContainer';
import styles from "../styles/index.scss";
import Icon from 'components/widgets/icon';
import registerImg from '../images/re-2.png';
import {getCookie,setCookie} from 'utils/cookie';
const cx = classNames.bind(styles);
const AntdSider = Layout.Sider;
const MenuItem = Menu.Item;

class TraceSider extends Component {

	render() {
        let companyName = decodeURIComponent(getCookie('companyName'));
		return(
			<AntdSider
				width={174}
				theme="light"
				className={cx("sider") + " "+ this.props.className}
				trigger={null}
				collapsible
				collapsedWidth = {60}
			>
				<ScrollContainer className={cx("sider-inner")}>
                    <div className={cx("sider-name")}>
						<span>{companyName}</span>
					</div>

                    <Menu
                        mode="vertical"
                        subMenuCloseDelay={0.4}
                        selectedKeys={"/"}
                    >
                        <MenuItem key="/">
                            <NavLink to="/" ga-data={'nav-home'}>
                                <Icon type="icon-home"/>
                                <span>销售</span>
                            </NavLink>
                        </MenuItem>
					</Menu>

					<div className={cx("bd-register")}>
                        <a href="https://erp.abiz.com/register?source=order" target="_blank">
                          <img src={registerImg} alt="tp"/>
						</a>
					</div>

				</ScrollContainer>
			</AntdSider>
		)
	}
}


export default connect(null,null)(TraceSider);


