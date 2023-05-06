import React, { Component } from 'react';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {Button, message, Modal, Table, Switch} from 'antd';

import classNames from "classnames/bind";
import styles from "../../styles/index.scss";
const cx = classNames.bind(styles);
import intl from 'react-intl-universal';
import Add from './add';
import {bindActionCreators} from "redux";
import {asyncFetchProjectList,asyncAddProject, asyncVisibleProject} from "../actions";
import {connect} from "react-redux";

const {Column} = Table;
const confirm = Modal.confirm;

class Index extends Component {

	state = {
		addModalVisible: false,
		deleteModalVisible: false,
		projectId: '',
		projectName: ''
	};

	openModal = (type, projectId, projectName) => {
		this.setState({
			[type]: true,
            projectId: '',
            projectName: ''
		});
		if(projectId && typeof projectId !== 'object'){
			this.setState({
				projectId,
				projectName
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
					<p>{intl.get("auxiliary.project.tip2")}</p>
					 {/*<p><Checkbox>同时删除历史单据中该项目信息</Checkbox></p>*/}
				</React.Fragment>
			),
			onOk() {
				_this.props.asyncAddProject('del', {id: id},(res)=>{
					if (res.data.retCode === '0') {
						message.success(intl.get('common.confirm.success'));
						_this.props.asyncFetchProjectList();
					}else {
						alert(res.data.retMsg);
					}
				});
			},
			onCancel() {},
		});
	};

	componentDidMount() {
		this.props.asyncFetchProjectList();
	}

    /**
	 * 修改或隐藏当前选中项目
     * @param id  项目id
     * @param visibleFlag 0:显示 1:隐藏
     */
    handleDisplayOperate = (id, visibleFlag)=>{
        this.props.asyncVisibleProject({id, visibleFlag}, (data)=>{
            if(data && data.data && data.data.retCode === '0'){
                message.success('操作成功');
                this.props.asyncFetchProjectList();
            }else if(data.get('retCode') === '2001'){
                Modal.error({
                    title: data.data.retMsg,
                    icon: <ExclamationCircleOutlined/>
                })
            }
        });
    };

	render() {

		const {projectList} = this.props;
		const projectListData = projectList.getIn(['data', 'data']);
		const dataSource = projectListData && projectListData.map((item, index) => {
			return {
				key: item.get('id'),
				serial: index + 1,
				projectName: item.get('projectName'),
                visibleflag: item.get('visibleflag'),
				action: {
					projectId: item.get('id'),
					projectName: item.get('projectName')
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
						loading={projectList.get('isFetching')}
						className={cx("tb-aux")}
						scroll={{y: 510}}
					>
						<Column
							title={intl.get("auxiliary.project.serial")}
							dataIndex="serial"
							key="serial"
							width="15%"
						/>
						<Column
							title={intl.get("auxiliary.project.projectName")}
							dataIndex="projectName"
							key="projectName"
							width="35%"
                           /* defaultSortOrder='ascend'
                            sorter = {(a, b) => a.projectName - b.projectName}*/
						/>
                        <Column
                            title={'展示状态'}
                            dataIndex="visibleflag"
                            width="15%"
                            align="center"
                            render={(visibleflag) => (
                                <span className="txt-clip">
									{visibleflag===1 ? '隐藏' : '显示'}
                                </span>
                            )}
                        />
						<Column
							title={intl.get("auxiliary.project.action")}
							dataIndex="action"
							key="action"
							width="35%"
							align="center"
							render={({projectId, projectName}, record) => (
								<React.Fragment>
									<a href="#!" className="ope-item" onClick={this.openModal.bind(this, 'addModalVisible', projectId, projectName)}>{intl.get('common.confirm.editor')}</a>
									<span className="ope-split">|</span>
									<a href="#!" className="ope-item" onClick={this.deleteConfirm.bind(this, projectId)}>{intl.get('common.confirm.delete')}</a>
                                    <span className="ope-split">|</span>
									{
                                        record.visibleflag === 1 ? (
                                            <a href="#!" className="ope-item" onClick={()=>this.handleDisplayOperate(record.key, '0')}>显示</a>
										) : (
                                            <a href="#!" className="ope-item" onClick={()=>this.handleDisplayOperate(record.key, '1')}>隐藏</a>
										)
									}
								</React.Fragment>
							)}
						/>
					</Table>
				</div>
				<Add
					visible={this.state.addModalVisible}
					projectId={this.state.projectId}
					projectName={this.state.projectName}
					onClose={this.closeModal.bind(this, 'addModalVisible')}
				/>
			</React.Fragment>
        );
	}
}

const mapStateToProps = (state) => {
	return {
		projectList: state.getIn(['auxiliaryProject', 'projectList'])
	}
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({
		asyncFetchProjectList,
        asyncAddProject,
        asyncVisibleProject
	}, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)
