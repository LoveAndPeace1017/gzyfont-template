import React, { Component } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, message, Modal, Checkbox, Table } from 'antd';

import classNames from "classnames/bind";
import styles from "../../styles/index.scss";
const cx = classNames.bind(styles);

import Add from './add';
import {bindActionCreators} from "redux";
import {asyncFetchSmsNotifyList,asyncAddSmsNotify} from "../actions";
import {connect} from "react-redux";
import intl from 'react-intl-universal';
const {Column} = Table;
const confirm = Modal.confirm;

class Index extends Component {

	state = {
		addModalVisible: false,
		deleteModalVisible: false,
        id: '',
        notifyModule: '',
        notifyAction: '',
        notifyUsers: []
	};

	openModal = (type, id,data) => {
		this.setState({
			[type]: true,
            notifyModule: '',
            notifyAction: '',
            notifyUsers: []
		});
		if(id && typeof id !== 'object'){
			this.setState({
                id,
                notifyModule: data.notifyModule,
                notifyAction: data.notifyAction,
                notifyUsers: data.notifyUsers
			});
		}
	};

	closeModal = type => {
		this.setState({
			[type]: false
		})
	};

	deleteConfirm = (id)=>{
		let _this = this;
		confirm({
			title: intl.get('common.confirm.title'),
			content: (
				<React.Fragment>
					<p>确定删除吗？删除后将无法恢复</p>
				</React.Fragment>
			),
			onOk() {
				_this.props.asyncAddSmsNotify("delete",{id:id},(res)=>{
					if (res.data.retCode === '0') {
						message.success(intl.get('common.confirm.success'));
						_this.props.asyncFetchSmsNotifyList();
					}else {
						alert(res.retMsg);
					}
				});
			},
			onCancel() {},
		});
	};

	componentDidMount() {
		this.props.asyncFetchSmsNotifyList();
	}

	render() {
		const {smsNotifyList,currentAccountInfo} = this.props;
        let accountInfo = currentAccountInfo.get('data');
        accountInfo = accountInfo ? accountInfo.toJS() : {};
		const smsNotifyListtData = smsNotifyList.getIn(['data', 'data']);
		const dataSource = smsNotifyListtData && smsNotifyListtData.map((item, index) => {
			return {
				key: item.get('id'),
				serial: index + 1,
                notifyModule: item.get('notifyModule'),
                notifyAction: item.get('notifyAction'),
                notifyUsers: item.get('notifyUsers'),
				action: {
                    id: item.get('id')
				}
			}
		}).toJS();

		return (
            <React.Fragment>
                {
                    accountInfo.mainUserFlag?(
                        <div className={cx("aux-ope")}>
                            <Button type="primary" icon={<PlusOutlined />} onClick={this.openModal.bind(this, 'addModalVisible')}>{intl.get('common.confirm.new')}</Button>
                        </div>
                    ):null
                }
				<div className={cx("aux-list")}>
					<Table
						dataSource={dataSource}
						pagination={false}
						loading={smsNotifyList.get('isFetching')}
						className={cx("tb-aux")}
						scroll={{y: 518}}
					>
						<Column
							title={intl.get("auxiliary.goodsUnit.serial")}
							dataIndex="serial"
							key="serial"
							width="10%"
						/>
						<Column
							title={"单据类型"}
							dataIndex="notifyModule"
							key="notifyModule"
							width="10%"
						/>
                        <Column
                            title={"触发条件"}
                            dataIndex="notifyAction"
                            key="notifyAction"
                            width="20%"
                        />
                        <Column
                            title={"通知人"}
                            dataIndex="notifyUsers"
                            key="notifyUsers"
                            width="50%"
                            render={(notifyUsers) => (
                                <React.Fragment>
									{
                                        notifyUsers.map((user)=>{
                                        	return user.userName && (user.userName + ',')
										})
									}
                                </React.Fragment>
                            )}
                        />
                        {
                            accountInfo.mainUserFlag?(
                                <Column
                                    title={intl.get("auxiliary.goodsUnit.action")}
                                    dataIndex="action"
                                    key="action"
                                    width="10%"
                                    align="center"
                                    render={({id},data) => (
                                        <React.Fragment>
                                            {/*<a href="#!" className="ope-item" onClick={this.openModal.bind(this, 'addModalVisible', id, data)}>{intl.get('common.confirm.editor')}</a>
                                    <span className="ope-split">|</span>*/}
                                            <a href="#!" className="ope-item" onClick={this.deleteConfirm.bind(this, id)}>{intl.get('common.confirm.delete')}</a>
                                        </React.Fragment>
                                    )}
                                />
                            ):null
                        }
					</Table>
				</div>
				<Add
					visible={this.state.addModalVisible}
					id={this.state.id}
                    notifyModule={this.state.notifyModule}
                    notifyAction={this.state.notifyAction}
                    notifyUsers={this.state.notifyUsers}
					onClose={this.closeModal.bind(this, 'addModalVisible')}
				/>
			</React.Fragment>
        );
	}
}

const mapStateToProps = (state) => {
	return {
        smsNotifyList: state.getIn(['auxiliarySmsNotify', 'smsNotifyList']),
        currentAccountInfo: state.getIn(['commonInfo', 'currentAccountInfo'])
	}
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({
        asyncFetchSmsNotifyList,
        asyncAddSmsNotify
	}, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)
