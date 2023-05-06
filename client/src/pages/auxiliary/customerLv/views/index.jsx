import React, { Component } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, message, Modal, Checkbox, Table } from 'antd';
import intl from 'react-intl-universal';
import classNames from "classnames/bind";
import styles from "../../styles/index.scss";
const cx = classNames.bind(styles);

import Add from './add';
import Icon from 'components/widgets/icon';
import {bindActionCreators} from "redux";
import {asyncFetchCustomerLvList,asyncAddCustomerLv} from "../actions";
import {connect} from "react-redux";

const {Column} = Table;
const confirm = Modal.confirm;

class Index extends Component {

	state = {
		addModalVisible: false,
		deleteModalVisible: false,
		customerLvId: '',
		customerLvName: ''
	};

	openModal = (type, customerLvId, customerLvName,discount) => {
		this.setState({
			[type]: true,
            customerLvId:'',
            customerLvName:'',
			discount:''


		});
		if(customerLvId  && typeof customerLvId !== 'object'){
			this.setState({
				customerLvId,
				customerLvName,
                discount
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
					<p>{intl.get("auxiliary.customerLv.validate6")}</p>
					<p>{intl.get("auxiliary.customerLv.validate7")}</p>
				</React.Fragment>
			),
			onOk() {
				_this.props.asyncAddCustomerLv('del',{recId:id},(res)=>{
					if (res.data.retCode === '0') {
						message.success(intl.get('common.confirm.success'));
						_this.props.asyncFetchCustomerLvList();
					}else {
						alert(res.data.retMsg);
					}
				});
			},
			onCancel() {},
		});
	};

    modifyConfirm = (customerLvId, customerLvName,discount)=>{
        let _this = this;
        confirm({
            title: intl.get('common.confirm.title'),
            content: (
                <React.Fragment>
                    <p>{intl.get("auxiliary.customerLv.validate8")}</p>
                </React.Fragment>
            ),
            onOk() {
                _this.openModal('addModalVisible', customerLvId, customerLvName,discount);
            },
            onCancel() {},
        });
    };

	componentDidMount() {
		this.props.asyncFetchCustomerLvList();
	}

	render() {

		const {customerLvList} = this.props;
		const customerLvListData = customerLvList && customerLvList.get('data');
		const dataSource = customerLvListData && customerLvListData.map((item, index) => {
			return {
				key: item.get('recId'),
				serial: index + 1,
				customerLvName: item.get('name'),
                discount:item.get('percentage'),
				action: {
					customerLvId: item.get('recId'),
					customerLvName: item.get('name'),
                    discount:item.get('percentage')
				}
			}
		}).toJS();

		return (
            <React.Fragment>
				<div className={cx("aux-ope")}>
					<div className={cx("tip-info")}><Icon type="info-circle" className={'blue'} theme="filled" /> {intl.get("auxiliary.customerLv.validate9")}</div>
					<Button type="primary" icon={<PlusOutlined />} onClick={this.openModal.bind(this, 'addModalVisible')}>{intl.get('common.confirm.new')}</Button>
				</div>
				<div className={cx("aux-list")}>
					<Table
						dataSource={dataSource}
						pagination={false}
						loading={customerLvList.get('isFetching')}
						className={cx("tb-aux")}
						scroll={{y: 540}}
					>
						<Column
							title={intl.get("auxiliary.customerLv.customerLvName")}
							dataIndex="customerLvName"
							key="customerLvName"
							width="40%"
						/>
						<Column
							title={intl.get("auxiliary.customerLv.discount")}
							dataIndex="discount"
							key="discount"
							width="30%"
						/>
						<Column
							title={intl.get("auxiliary.customerLv.action")}
							dataIndex="action"
							key="action"
							width="30%"
							align="center"
							render={({customerLvId, customerLvName ,discount}) => (
								<React.Fragment>
									<a href="#!" className="ope-item" onClick={this.modifyConfirm.bind(this, customerLvId, customerLvName,discount)}>{intl.get('common.confirm.editor')}</a>
									<span className="ope-split">|</span>
									<a href="#!" className="ope-item" onClick={this.deleteConfirm.bind(this, customerLvId)}>{intl.get('common.confirm.delete')}</a>
								</React.Fragment>
							)}
						/>
					</Table>
				</div>
				<Add
					visible={this.state.addModalVisible}
					customerLvId={this.state.customerLvId}
					customerLvName={this.state.customerLvName}
					discount = {this.state.discount}
					onClose={this.closeModal.bind(this, 'addModalVisible')}
				/>
			</React.Fragment>
        );
	}
}

const mapStateToProps = (state) => {
	return {
		customerLvList: state.getIn(['auxiliaryCustomerLv', 'customerLvList'])
	}
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({
		asyncFetchCustomerLvList,
        asyncAddCustomerLv
	}, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)
