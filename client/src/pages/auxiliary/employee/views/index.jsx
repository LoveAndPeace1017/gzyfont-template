import React, {Component} from 'react';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {Button, message, Modal, Table} from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import intl from 'react-intl-universal';
import classNames from "classnames/bind";
import styles from "../../styles/index.scss";
const cx = classNames.bind(styles);

import Add from './add';
import {asyncFetchEmployeeList, asyncAddEmployee, asyncVisibleEmployee} from "../actions";

const {Column} = Table;
const confirm = Modal.confirm;

class Index extends Component {

    state = {
        addModalVisible: false,
        deleteModalVisible: false,
        curEmployeeData: ''
    };

    openModal = (type, employeeId,values) => {
        const {employeeList} = this.props;
        const employeeListData = employeeList.getIn(['data', 'data']);
        const curEmployeeData = employeeListData && employeeListData.filter(item => {
            return item.get('id') === employeeId
        }).get('0');
        this.setState({
            [type]: true,
            curEmployeeData:''
        });
        if (employeeId && employeeId !== 'object') {
            this.setState({
                curEmployeeData
            });
        }
    };

    closeModal = type => {
        this.setState({
            [type]: false
        })
    };

    deleteConfirm = (id) => {
        let _this = this;
        confirm({
            title: intl.get('common.confirm.title'),
            content: intl.get('common.confirm.content1'),
            onOk() {
                _this.props.asyncAddEmployee('del', {id: id}, (res) => {

                    if (res.data.retCode === '0') {
                        //重新获取列表数据
                        _this.props.asyncFetchEmployeeList();
                        message.success(intl.get('common.confirm.success'));
                    }
                    else {
                        alert(res.data.retMsg)
                    }
                })
            },
            onCancel() {
            },
        });
    };

    //筛选排序分页
    handleTableChange = (pagination, filters, sorter) => {
        const orderByType = sorter.order === 'descend' ? 'desc' : 'asc';
        this.props.asyncFetchEmployeeList({orderByType});
    };

    componentDidMount() {
        this.props.asyncFetchEmployeeList();
    }

    /**
     * 修改或隐藏当前选中项目
     * @param id  项目id
     * @param visibleFlag 0:显示 1:隐藏
     */
    handleDisplayOperate = (id, visibleFlag)=>{
        this.props.asyncVisibleEmployee({id, visibleFlag}, (data)=>{
            if(data && data.data && data.data.retCode === '0'){
                message.success('操作成功');
                this.props.asyncFetchEmployeeList();
            }else if(data.get('retCode') === '2001'){
                Modal.error({
                    title: data.data.retMsg,
                    icon: <ExclamationCircleOutlined/>
                })
            }
        });
    };

    render() {

        const {employeeList} = this.props;
        const employeeListData = employeeList.getIn(['data', 'data']);
        console.log(employeeListData, '%%');
        const dataSource = employeeListData && employeeListData.map((item, index) => {
            return {
                key: item.get('id'),
                serial: index + 1,
                employeeName: item.get('employeeName'),
                deptName: item.get('department'),
                telNo:  item.get('telNo'),
                visibleflag: item.get('visibleflag'),
                action: {
                    employeeId: item.get('id'),
                    employeeName: item.get('employeeName')
                }
            }
        }).toJS();

        return (
            <React.Fragment>
                <div className={cx("aux-ope")}>
                    <Button type="primary" icon={<PlusOutlined />}
                            onClick={this.openModal.bind(this, 'addModalVisible',false)}>{intl.get('common.confirm.new')}</Button>

                </div>
                <div className={cx("aux-list")}>
                    <Table
                        dataSource={dataSource}
                        pagination={false}
                        onChange={this.handleTableChange}
                        loading={employeeList.get('isFetching')}
                        className={cx("tb-aux")}
                        scroll={{y: 339}}
                    >
                        <Column
                            title={intl.get("auxiliary.employee.serial")}
                            dataIndex="serial"
                            key="serial"
                            width="10%"
                        />
                        <Column
                            title={intl.get("auxiliary.employee.employeeName")}
                            dataIndex="employeeName"
                            key="employeeName"
                            width="25%"
                        />
                        <Column
                            title={intl.get("auxiliary.employee.deptName")}
                            dataIndex="deptName"
                            key="deptName"
                            width="20%"
                            sorter={true}
                        />
                        <Column
                            title={intl.get("auxiliary.employee.telNo")}
                            dataIndex="telNo"
                            key="telNo"
                            width="20%"
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
                            title={intl.get("auxiliary.employee.action")}
                            dataIndex="action"
                            key="action"
                            width="25%"
                            align="center"
                            render={({employeeId}, record) => (
                                <React.Fragment>
                                    <a href="#!" className="ope-item"
                                       onClick={this.openModal.bind(this, 'addModalVisible', employeeId)}>{intl.get('common.confirm.editor')}</a>
                                    <span className="ope-split">|</span>
                                    <a href="#!" className="ope-item"
                                       onClick={this.deleteConfirm.bind(this, employeeId)}>{intl.get('common.confirm.delete')}</a>
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
                    curEmployeeData={this.state.curEmployeeData}
                    onClose={this.closeModal.bind(this, 'addModalVisible')}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        employeeList: state.getIn(['auxiliaryEmployee', 'employeeList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchEmployeeList,
        asyncVisibleEmployee,
        asyncAddEmployee
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)
