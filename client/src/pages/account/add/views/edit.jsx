import React, { Component } from 'react';
import {Tabs} from 'antd';
import Form from './form';
import ResetPwd from './resetPwd';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import intl from 'react-intl-universal';
const cx = classNames.bind(styles);
const TabPane = Tabs.TabPane;

export default class AccountEdit extends Component {

	tabForms = {};

	//获取tab切中的两个form
	getCurForm = ({editForm, resetForm}) => {
		if(editForm){
			this.tabForms.editForm = editForm;
		}
		if(resetForm){
			this.tabForms.resetForm = resetForm;
		}
	};

	handleTabChange = key => {
		let curForm;
		//tab切换时变化表单
		if(key === 'edit'){
			curForm = this.tabForms.editForm;
		}else if(key === 'reset'){
			curForm = this.tabForms.resetForm;
		}
		this.props.handleTabSwitch(key, curForm);
	};

	render() {
		return (
			<Tabs
				defaultActiveKey="edit"
				onChange={this.handleTabChange}
				className={cx("account-tab")}
			>
				<TabPane
					tab={intl.get("account.add.editor")}
					key='edit'
				>
					<Form {...this.props} pageType="edit" getCurForm={this.getCurForm}/>
				</TabPane>
				<TabPane
					tab={intl.get("account.add.reset")}
					key='reset'
				>
					<ResetPwd {...this.props} getCurForm={this.getCurForm}/>
				</TabPane>
			</Tabs>
		);
	}
}

