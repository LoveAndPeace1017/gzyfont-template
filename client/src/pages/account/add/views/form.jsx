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

import {actions as auxiliaryDeptActions, DeptAdd} from 'pages/auxiliary/dept'
import {EmployeeAdd} from 'pages/auxiliary/employee'
import Auxiliary from 'pages/auxiliary';

import {asyncFetchSubAccountById, changeSubAccountUserName, changeSubAccountPassword, EmptySubAccountInput} from '../actions';

const Option = Select.Option;

class AccountForm extends Component {

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
            asyncFetchSubAccountById,
            pageType,
            userId
        } = this.props;

        //获取部门员工信息
        asyncFetchDeptEmp();

        if (pageType === 'edit') {
            //修改页获取子账号数据
            asyncFetchSubAccountById(userId);
            this.props.getCurForm({
                editForm: this.props.form
            });
        }
    }

    componentWillUnmount() {
        this.props.EmptySubAccountInput();
        this.props.emptyDeptEmployee();
    }

    render() {
        const {form: {getFieldDecorator}, deptEmployee, subAccount} = this.props;

        const deptData = deptEmployee && deptEmployee.getIn(['data', 'data']);
        const deptId = deptEmployee && deptEmployee.get('deptId');
        const employeeList = deptEmployee && deptEmployee.get('employeeList');


        //根据userId获取的子账号信息填充到修改页
        let logonName;
        if(this.props.pageType === 'edit'){
            const subAccountData = subAccount.getIn(['data','data']);
            logonName = subAccountData && subAccountData.get('userName');

            //设置userId输入框中的值（提交时候要）
            getFieldDecorator('userId',{
                initialValue: this.props.userId
            })
        }

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

        //校验的正则
        const regLetterOrNum = /^[0-9a-zA-Z]+$/;  //数字或者字母
        const regLetterAndNum = /^(?!\d+$)[\da-zA-Z]+$/; //数字和字母组合

        return (
            <div>
                <Form>
                    <Form.Item
                        {...formItemLayout}
                        label={intl.get("account.add.logonName")}
                    >
                        {this.props.pageType === 'edit'?(
                            <div>{logonName}</div>
                        ):(<div>
                            {
                                getFieldDecorator('userName', {
                                    ...defaultOptions,
                                    rules: [
                                        {
                                            required: true,
                                            message: intl.get("account.add.rule1")
                                        },
                                        {
                                            min: 6,
                                            message: intl.get("account.add.rule2")
                                        },
                                        {
                                            max: 20,
                                            message: intl.get("account.add.rule2")
                                        },
                                        {
                                            validator: (rules, val, callback) => {
                                                if (val.length >= 11 && !regLetterAndNum.test(val)) {
                                                    callback(intl.get("account.add.rule3"));
                                                }
                                                else if (!regLetterOrNum.test(val)) {
                                                    callback(intl.get("account.add.rule2"));
                                                }
                                                callback();
                                            }
                                        },
                                        /*{
                                            validator: (rules, val, callback) => {
                                                axios.get(`${BASE_URL}/subAccount/checkChildLogUserName`,{
                                                    params: {
                                                        logUserName: val
                                                    }
                                                }).then(res => {
                                                    if (res.data && res.data.retCode !== 0 && res.data.retMsg) {
                                                        callback('登录名已存在！')
                                                    }
                                                    else {
                                                        callback();
                                                    }
                                                }).catch(error => {
                                                    callback(error);
                                                });
                                            }
                                        }*/
                                    ],
                                })(
                                    <Input placeholder={intl.get("account.add.placeHolder")} maxLength={20}/>
                                )
                            }
                        </div>)
                        }
                    </Form.Item>
                    {
                        this.props.pageType === 'edit' ? null : (
                            <Form.Item
                                {...formItemLayout}
                                label={intl.get("account.add.password")}
                            >
                                {getFieldDecorator('password', {
                                    ...defaultOptions,
                                    rules: [
                                        {
                                            required: true,
                                            message: intl.get("account.add.rule4")
                                        },
                                        {
                                            min: 6,
                                            message: intl.get("account.add.rule5")
                                        },
                                        {
                                            max: 20,
                                            message: intl.get("account.add.rule5")
                                        },
                                        {
                                            pattern: regLetterOrNum,
                                            message: intl.get("account.add.rule5")
                                        }
                                    ],
                                })(
                                    <Input.Password placeholder={intl.get("account.add.placeHolder")} maxLength={20}/>
                                )}
                            </Form.Item>
                        )
                    }
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
                                initialValue:deptId,
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
                                ...defaultOptions
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
                        console.log(data,'989');
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
        subAccount: state.getIn(['accountAdd', 'subAccount']),
        changeSubAccount: state.getIn(['accountAdd', 'changeSubAccount'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchDeptEmp: auxiliaryDeptActions.asyncFetchDeptEmp,
        getEmployeesByDeptId: auxiliaryDeptActions.getEmployeesByDeptId,
        emptyDeptEmployee: auxiliaryDeptActions.emptyDeptEmployee,
        getDeptAndEmployeesByEmployeeId: auxiliaryDeptActions.getDeptAndEmployeesByEmployeeId,
        asyncFetchSubAccountById,
        changeSubAccountUserName,
        changeSubAccountPassword,
        EmptySubAccountInput
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({
    onFieldsChange(props, fields){
        if(fields.userName){
            props.changeSubAccountUserName(fields.userName.value);
        }else if(fields.password){
            props.changeSubAccountPassword(fields.password.value);
        }
    },
    mapPropsToFields(props){

        //部门id从redux中取得值
        const userName = props.changeSubAccount.get('userName');
        const password = props.changeSubAccount.get('password');
        const employeeId = props.deptEmployee.get('employeeId');
        return {
            userName: Form.createFormField({
                value: userName
            }),
            password: Form.createFormField({
                value: password
            }),
            employeeId: Form.createFormField({
                value: employeeId
            })
        }
    }
})(AccountForm))
