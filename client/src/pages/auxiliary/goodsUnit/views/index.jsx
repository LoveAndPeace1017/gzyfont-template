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
import {asyncFetchGoodsUnitList,asyncAddGoodsUnit} from "../actions";
import {connect} from "react-redux";
import intl from 'react-intl-universal';
const {Column} = Table;
const confirm = Modal.confirm;

class Index extends Component {

	state = {
		addModalVisible: false,
		deleteModalVisible: false,
		goodsUnitId: '',
		goodsUnitName: ''
	};

	openModal = (type, goodsUnitId, goodsUnitName) => {
		this.setState({
			[type]: true,
            goodsUnitName:''
		});
		if(goodsUnitId && typeof goodsUnitId !== 'object'){
			this.setState({
				goodsUnitId,
				goodsUnitName
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
					<p>{intl.get('common.confirm.content1')}</p>
				</React.Fragment>
			),
			onOk() {
				_this.props.asyncAddGoodsUnit("del",{id:id},(res)=>{
					if (res.data.retCode === '0') {
						message.success(intl.get('common.confirm.success'));
						_this.props.asyncFetchGoodsUnitList();
					}else {
						alert(res.retMsg);
					}
				});
			},
			onCancel() {},
		});
	};

	componentDidMount() {
		this.props.asyncFetchGoodsUnitList();
	}

	render() {
		const {goodsUnitList} = this.props;
		const goodsUnitListData = goodsUnitList.getIn(['data', 'data']);
		const dataSource = goodsUnitListData && goodsUnitListData.map((item, index) => {
			return {
				key: item.get('id'),
				serial: index + 1,
				goodsUnitName: item.get('paramName'),
				action: {
					goodsUnitId: item.get('id'),
					goodsUnitName: item.get('paramName')
				}
			}
		}).toJS();

		return (
            <React.Fragment>
				<div className={cx("aux-ope")}>
					<Button type="primary" icon={<PlusOutlined />} onClick={this.openModal.bind(this, 'addModalVisible')}>{intl.get('common.confirm.new')}</Button>
				</div>
				<div className={cx("aux-list")}>
					<Table
						dataSource={dataSource}
						pagination={false}
						loading={goodsUnitList.get('isFetching')}
						className={cx("tb-aux")}
						scroll={{y: 518}}
					>
						<Column
							title={intl.get("auxiliary.goodsUnit.serial")}
							dataIndex="serial"
							key="serial"
							width="15%"
						/>
						<Column
							title={intl.get("auxiliary.goodsUnit.goodsUnitName")}
							dataIndex="goodsUnitName"
							key="goodsUnitName"
							width="70%"
						/>
						<Column
							title={intl.get("auxiliary.goodsUnit.action")}
							dataIndex="action"
							key="action"
							width="15%"
							align="center"
							render={({goodsUnitId}) => (
								<React.Fragment>
									<a href="#!" className="ope-item" onClick={this.deleteConfirm.bind(this, goodsUnitId)}>{intl.get('common.confirm.delete')}</a>
								</React.Fragment>
							)}
						/>
					</Table>
				</div>
				<Add
					visible={this.state.addModalVisible}
					goodsUnitId={this.state.goodsUnitId}
					goodsUnitName={this.state.goodsUnitName}
					onClose={this.closeModal.bind(this, 'addModalVisible')}
				/>
			</React.Fragment>
        );
	}
}

const mapStateToProps = (state) => {
	return {
		goodsUnitList: state.getIn(['auxiliaryGoodsUnit', 'goodsUnitList'])
	}
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({
		asyncFetchGoodsUnitList,
		asyncAddGoodsUnit
	}, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)
