import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Select, Col, Row } from 'antd';
import axios from 'utils/axios';
import {bindActionCreators} from "redux";
import defaultOptions from 'utils/validateOptions';
import intl from 'react-intl-universal';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);

import {actions as auxiliaryDeptActions, DeptAdd} from 'pages/auxiliary/dept';
import {actions as accountActions} from 'pages/account/index';
import {EmployeeAdd} from 'pages/auxiliary/employee'
import Auxiliary from 'pages/auxiliary';

import {asyncFetchSubAccountById, changeSubAccountUserName, changeSubAccountPassword, EmptySubAccountInput} from '../actions';

const Option = Select.Option;

class AccountMainForm extends Component {

    state = {
        deptAddVisible: false,
        employeeAddVisible: false,
        auxiliaryVisible: false,
        auxiliaryKey: '',
        auxiliaryTabKey: ''
    };

    upValue = '';
    upValueName = '';
    //部门选择
    handleDeptChange = (value,e) => {
        //选择部门后人员下拉选项变动
        if(typeof e == 'object'){
            this.upValueName = e.props.children;
        }else if(typeof e == 'string'){
            this.upValueName = e;
        }
        console.log(value,'value');
        this.props.getEmployeesByDeptId(value);
    };

    openModal = (type, auxiliaryKey, auxiliaryTabKey) => {
        this.setState({
            [type]: true,
            auxiliaryKey,
            auxiliaryTabKey
        })
    };

    closeModal = (type) =>{
        this.setState({
            [type]: false
        })
    };

    componentDidMount() {
        const {
            asyncFetchDeptEmp,
            asyncFetchInfoByMainAccount,
        } = this.props;

        //获取部门员工信息
        asyncFetchDeptEmp();

        asyncFetchInfoByMainAccount().then((data)=>{
            if(data.retCode == "0"){
                setTimeout(()=>{
                    this.props.getEmployeesByDeptId1(data.departmentId,data.employeeId);
                },500);
            }
        });

        this.props.getCurForm({
            mainForm: this.props.form
        });

    }

    componentWillUnmount() {
        this.props.EmptySubAccountInput();
        this.props.emptyDeptEmployee();
    }

    render() {
        const {form: {getFieldDecorator}, deptEmployee,mainUserName} = this.props;

        const deptData = deptEmployee && deptEmployee.getIn(['data', 'data']);
        const deptId = deptEmployee && deptEmployee.get('deptId');
        const employeeList = deptEmployee && deptEmployee.get('employeeList');
        const employeeId = deptEmployee && deptEmployee.get('employeeId');

        let logonName = mainUserName;

        //表单宽度
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 10},
            }
        };


        return (
            <div>
                <Form>
                    <Form.Item
                        {...formItemLayout}
                        label={intl.get("account.add.mainLogonName")}
                    >
                        <div>{logonName}</div>
                    </Form.Item>
                    <div className={cx("dept-lst")}>
                    <Form.Item
                        {...formItemLayout}
                        label={intl.get("account.add.dept")}
                    >

                        <Form.Item
                            wrapperCol={{span:24}}
                            className={cx('select-dept')}
                        >
                            <div
                                onMouseDown={(e) => { e.preventDefault(); return false; }}>
                                {getFieldDecorator('deptId', {
                                    ...defaultOptions,
                                    initialValue: deptId,
                                })(
                                    <Select
                                        //value={deptId}
                                        onChange={this.handleDeptChange}
                                        loading={this.props.deptEmployee.get('isFetching')}
                                        dropdownRender={menu => (
                                            <div>
                                                {menu}
                                                <div className={cx('dropdown-action') + " cf"}>
                                                    <a href="#!" className="fl" onClick={()=>this.openModal('deptAddVisible')}>{intl.get('common.confirm.new')}</a>
                                                    <a href="#!" className="fr" onClick={()=>this.openModal('auxiliaryVisible', 'company')}>{intl.get('common.confirm.manage')}</a>
                                                </div>
                                            </div>
                                        )}
                                    >
                                        {deptData && deptData.size>0 && deptData.map(dept => <Option key={dept.get('deptId')} value={dept.get('deptId')}>{dept.get('deptName')}</Option>)}
                                    </Select>)}
                            </div>
                        </Form.Item>
                        <div
                            className={cx('select-employee')}
                            onMouseDown={(e) => { e.preventDefault(); return false; }}
                        >
                            {getFieldDecorator('employeeId', {
                                ...defaultOptions,
                                initialValue: employeeId,
                                /*rules: [
                                    {
                                        required: true,
                                        message: intl.get("account.add.rule6")
                                    }
                                ]*/
                            })(
                                <Select
                                    loading={this.props.deptEmployee.get('isFetching')}
                                    dropdownRender={menu => (
                                        <div>
                                            {menu}
                                            <div className={cx('dropdown-action') + " cf"}>
                                                <a href="#!" className="fl" onClick={()=>this.openModal('employeeAddVisible')}>{intl.get('common.confirm.new')}</a>
                                                <a href="#!" className="fr" onClick={()=>this.openModal('auxiliaryVisible', 'company', 'employee')}>{intl.get('common.confirm.manage')}</a>
                                            </div>
                                        </div>
                                    )}
                                >
                                    {employeeList && employeeList.size>0 && employeeList.map(employee => <Option
                                        key={employee.get('id')} value={employee.get('id')}>{employee.get('employeeName')}</Option>)}
                                </Select>
                            )}
                        </div>
                    </Form.Item>
                    </div>
                </Form>
                <DeptAdd onClose={this.closeModal.bind(this, 'deptAddVisible')} visible={this.state.deptAddVisible} callback={(data) => {
                    this.props.asyncFetchDeptEmp().then(()=>{
                        this.handleDeptChange(data.key,data.label);
                    })
                }}/>
                <EmployeeAdd upValue={this.upValue} upValueName={this.upValueName} onClose={this.closeModal.bind(this, 'employeeAddVisible')} visible={this.state.employeeAddVisible} callback={(employeeId)=>{
                    this.props.asyncFetchDeptEmp().then(()=>{
                        this.props.getDeptAndEmployeesByEmployeeId(employeeId);
                    });
                }} />
                {/*辅助资料弹层*/}
                <Auxiliary
                    defaultKey={this.state.auxiliaryKey}
                    defaultTabKey={this.state.auxiliaryTabKey}
                    visible={this.state.auxiliaryVisible}
                    onClose={this.closeModal.bind(this, 'auxiliaryVisible')}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        deptEmployee: state.getIn(['auxiliaryDept', 'deptEmployee']),
        changeSubAccount: state.getIn(['accountAdd', 'changeSubAccount'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchDeptEmp: auxiliaryDeptActions.asyncFetchDeptEmp,
        getEmployeesByDeptId: auxiliaryDeptActions.getEmployeesByDeptId,
        getEmployeesByDeptId1:auxiliaryDeptActions.getEmployeesByDeptId1,
        emptyDeptEmployee: auxiliaryDeptActions.emptyDeptEmployee,
        getDeptAndEmployeesByEmployeeId: auxiliaryDeptActions.getDeptAndEmployeesByEmployeeId,
        asyncFetchInfoByMainAccount: accountActions.asyncFetchInfoByMainAccount,
        asyncFetchSubAccountById,
        changeSubAccountUserName,
        changeSubAccountPassword,
        EmptySubAccountInput
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({
    mapPropsToFields(props){
        //部门id从redux中取得值
        const employeeId = props.deptEmployee.get('employeeId');
        return {
            employeeId: Form.createFormField({
                value: employeeId
            })
        }
    }
})(AccountMainForm))
