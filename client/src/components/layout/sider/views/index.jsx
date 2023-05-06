import React, { Component } from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Layout} from 'antd';
import classNames from "classnames/bind";
import intl from 'react-intl-universal';

import {actions as collapseActions} from "components/layout/sider";
import ScrollContainer from 'components/widgets/scrollContainer';
import UserPanel from '../dependencies/userPanel';
import Menu from '../dependencies/menu';

import styles from "../styles/index.scss";

const cx = classNames.bind(styles);
const AntdSider = Layout.Sider;


/**
 * 侧边
 *
 * @visibleName Sider（侧边）
 * @author guozhaodong
 *
 */
class Sider extends Component {
	render() {
		return(
			<AntdSider
				width={174}
				theme="light"
				className={cx("sider") + " "+ this.props.className}
				trigger={null}
				collapsible
				collapsedWidth = {60}
				collapsed={this.props.collapsed}
			>
				<ScrollContainer className={cx("sider-inner")}>
					<UserPanel/>
					<Menu/>
					<div className={cx(["sider-bottom", {"sider-bottom-collapsed": this.props.collapsed}])}>
						<a href="//cn.made-in-china.com/" target="_blank" className={cx("find-btn")}>{intl.get("home.menu.lookProduct")}</a>
					</div>
				</ScrollContainer>
			</AntdSider>
		)
	}
}

const mapStateToProps = state => ({
	collapsed: state.getIn(['sider', 'collapsed'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        toggle: collapseActions.toggle
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Sider);

