import React, {Component} from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {Button, message, Modal, Table, Input, Row, Col} from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import intl from 'react-intl-universal';

import classNames from "classnames/bind";
import styles from "../../styles/index.scss";
const cx = classNames.bind(styles);
import Add from './add';
import {SelectDept} from 'pages/auxiliary/dept';
import {asyncFetchAccountReportList, asyncAddAccountReport} from "../actions";
import {actions as auxiliaryDeptActions} from 'pages/auxiliary/dept';
import Pagination from 'components/widgets/pagination';
import FilterToolBar from 'components/business/filterToolBar';

const {Column} = Table;
const confirm = Modal.confirm;
const { Search } = Input;


class AccountReport extends React.Component{

    state = {
        addModalVisible: false,
        deleteModalVisible: false,
        id: '',
        condition: {},
        data: {}
    };

    componentDidMount() {
        let { condition } = this.props;
        this.props.asyncFetchDeptEmp();
        this.setState({
            condition,
            originCondition: condition
        }, () => {
            this.doFilter(condition);
        });
    }

    fetchData = (params)=>{
        this.props.asyncFetchAccountReportList(params);
    };

    openModal = (id, data) => {
        this.setState({
            addModalVisible: true,
            id:'',
            data: {}
        });
        if (id && typeof id !== 'object') {
            this.setState({
                id,
                data
            });
        }
    };

    closeModal = (type) => {
        //关闭新增/修改弹框后重新刷新部门下拉框数据
        this.setState({
            [type]: false
        });
    };

    onSearch = (value) => {
        this.doFilter({key: value}, false);
    };

    deleteConfirm = (id) => {
        let _this = this;
        confirm({
            title: intl.get('common.confirm.title'),
            content: '删除后将无法恢复，确认删除？',
            onOk() {
                _this.props.asyncAddAccountReport('delete', {id: id}, (res) => {
                    if (res.data.retCode === '0') {
                        //重新获取列表数据
                        _this.props.asyncFetchAccountReportList();
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

    doFilter = (condition, resetFlag) => {
        let params = this.state.condition;
        if (resetFlag) {
            params = this.state.originCondition;
        }
        params = {
            ...params,
            ...condition
        };
        this.setState({
            condition: params
        });
        this.fetchData(params);
    };

    onPageInputChange = (page,perPage) => {
        this.doFilter({page,perPage});
    };
    onShowSizeChange = (current, perPage) => {
        this.doFilter({perPage, page: 1});
    };

    // selectChange = (value)=>{
    //     const {deptEmployee} = this.props;
    //     let deptData = deptEmployee && deptEmployee.getIn(['data', 'data']) && deptEmployee.getIn(['data', 'data']).toJS();
    //     let employeeList = [];
    //     deptData = deptData && deptData.map(item => {
    //         if(item.deptName == value){
    //             employeeList = item.employeeList;
    //         }
    //     });
    //     let employeeData = employeeList.map(item => {
    //         return {
    //             label: item.employeeName,
    //             value: item.employeeName
    //         }
    //     });
    //     this.setState({employerData:employeeData});
    // };

    render() {
        const {accountReportList, deptEmployee} = this.props;
        const incomeListData = accountReportList.getIn(['data','data']);
        let paginationInfo = accountReportList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};
        const dataSource = incomeListData && incomeListData.map((item, index) => {
            return {
                key: item.get('id'),
                serial: index + 1,
                account: item.get('account'),
                departmentName: item.get('departmentName'),
                departmentId: item.get('departmentId'),
                employeeName: item.get('employeeName'),
                employeeId: item.get('employeeId'),
                typeName: item.get('type')=== 0?"报工+质检":"报工",
                type: item.get('type'),
                action: {
                    id: item.get('recId')
                }
            }
        }).toJS();

        let deptData = deptEmployee && deptEmployee.getIn(['data', 'data']) && deptEmployee.getIn(['data', 'data']).toJS();
        deptData = deptData && deptData.map(item => {
            return {
                label: item.deptName,
                value: item.deptName
            }
        });

        const filterDataSource = {
            prefixComponents: [
                <div className={cx(["list-search"])}>
                    <Search
                        placeholder={'报工账号/员工姓名'}
                        onSearch={this.onSearch}
                        enterButton
                        allowClear={true}
                    />
                </div>,
            ],
            selectComponents: [
                {
                    label: "report.inventory.departmentName",
                    fieldName: 'departmentName',
                    visibleFlag: true,
                    cannotEdit: true,
                    type: 'select',
                    showType: 'full',
                    options: deptData,
                    // onSelectChanges: this.selectChange
                }
            ]
        };

        return (
            <React.Fragment>
                <div className={cx("ope-bar")}>
                    <Row>
                        <Col span={18}>
                            <FilterToolBar
                                dataSource={filterDataSource}
                                doFilter={this.doFilter}
                                ref={(child) => {
                                    this.filterToolBarHanler = child;
                                }}
                            />
                            </Col>
                        <Col span={6} style={{textAlign:"right"}}>
                            <Button type="primary" icon={<PlusOutlined />}
                                    onClick={()=>this.openModal()}>新建</Button>
                        </Col>
                    </Row>
                </div>
                <div className={cx("aux-list")} style={{'marginTop': 0}}>
                    <Table
                        dataSource={dataSource}
                        pagination={false}
                        loading={accountReportList.get(['isFetching'])}
                        className={cx("tb-aux")}
                        scroll={{y: 510}}
                    >
                        <Column
                            title={"序号"}
                            dataIndex="serial"
                            key="serial"
                            width="5%"
                            align="center"
                        />
                        <Column
                            title={"账号"}
                            dataIndex="account"
                            key="account"
                            width="20%"
                        />
                        <Column
                            title={"部门"}
                            dataIndex="departmentName"
                            key="departmentName"
                            width="20%"
                        />
                        <Column
                            title={"员工"}
                            dataIndex="employeeName"
                            key="employeeName"
                            width="20%"
                        />
                        <Column
                            title={"类型"}
                            dataIndex="typeName"
                            key="typeName"
                            width="10%"
                        />
                        <Column
                            title={intl.get("auxiliary.orderType.action")}
                            dataIndex="action"
                            key="action"
                            width="25%"
                            align="center"
                            render={({id},data) => (
                                <React.Fragment>
                                    <a href="#!" className="ope-item" onClick={()=>this.openModal(id, data)}>{intl.get('common.confirm.editor')}</a>
                                    <span className="ope-split">|</span>
                                    <a href="#!" className="ope-item"
                                       onClick={this.deleteConfirm.bind(this, id)}>{intl.get('common.confirm.delete')}</a>
                                </React.Fragment>
                            )}
                        />
                    </Table>
                    <div className={cx("account-tab-footer")}>
                        <Pagination {...paginationInfo}
                                    onChange={this.onPageInputChange}
                                    onShowSizeChange={this.onShowSizeChange}
                        />
                    </div>

                </div>
                <Add
                    visible={this.state.addModalVisible}
                    id={this.state.id}
                    data={this.state.data}
                    onClose={() => this.closeModal('addModalVisible')}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        accountReportList: state.getIn(['auxiliaryAccountReport', 'accountReportList']),
        deptEmployee: state.getIn(['auxiliaryDept', 'deptEmployee'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchAccountReportList,
        asyncAddAccountReport,
        asyncFetchDeptEmp: auxiliaryDeptActions.asyncFetchDeptEmp,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountReport)

