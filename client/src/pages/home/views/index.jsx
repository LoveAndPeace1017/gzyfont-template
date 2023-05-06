import React, { Component } from 'react';
import {Row, Col, Modal} from 'antd';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

import PendingPanel from './pendingPanel';
import FriendsPanel from './friendsPanel';
import BatchQuery from './batchQuery';
import NoticePanel from './noticePanel';
import SalesKitPanel from './saleskitPanel'
import SaleStatisticsPanel from './saleStatisticsPanel';
import OrderStatisticsPanel from './orderStatisticsPanel';
// import StorePanel from './storePanel';
import PendingApprovalPanel from './pendingApprovalPanel';
import ShortcutPanel from './shortcutPanel';
import MallLeader from './mallLeader';
import ExpiredTips from './expiredTips';


export default class Home extends Component {
	render() {
		return(
			<div className={cx("home")}>
				<Row gutter={20}>
					<Col span={24}>
					   <MallLeader/>
					   <ExpiredTips/>
					</Col>
					<Col span={12}>
						<SaleStatisticsPanel/>
					</Col>
					<Col span={12}>
						<OrderStatisticsPanel/>
					</Col>
					<Col span={12}>
						<PendingApprovalPanel/>
					</Col>
					<Col span={12}>
						<ShortcutPanel/>
					</Col>
					<Col span={12}>
                        <BatchQuery/>
					</Col>
					<Col span={6}>
                        <SalesKitPanel/>
					</Col>
					<Col span={6}>
						<NoticePanel/>
					</Col>
				</Row>
			</div>
		)
	}
}

