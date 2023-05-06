import React, {Component} from 'react';
import {Select} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import intl from 'react-intl-universal';
import {asyncFetchEmployeeList, asyncAddEmployee} from "../actions";
import {actions as auxiliaryDeptActions} from 'pages/auxiliary/dept';

import {EmployeeAdd} from 'pages/auxiliary/employee';
import Auxiliary from 'pages/auxiliary';


import classNames from "classnames/bind";
import styles from "../../project/styles/index.scss";
import PropTypes from "prop-types";
const cx = classNames.bind(styles);

const {Option} = Select;

/**
 * 选择员工，一般和选择部门组件一起使用，选择了部门才能选择对应的员工
 *
 * @visibleName SelectEmployee（选择员工）
 * @author guozhaodong
 *
 */
class SelectEmployee extends Component {

    static propTypes = {
        /**
         * 部门ID，不传则不会有数据
         */
        deptId: PropTypes.oneOfType([
                     PropTypes.string,
                     PropTypes.number
                 ]),
        /**
         * 指定当前选中的条目
         */
        value: PropTypes.string,
        /**
         * 选中option的回调函数
         * @param {string} value 选中员工的名称
         */
        onChange: PropTypes.func,
        /**
         * 暗注释
         * */
        placeholder: PropTypes.string,
        /**
         * 是否显示新建、管理操作
         * */
        showEdit: PropTypes.bool
    };

    static defaultProps = {
        placeholder: '',
        showEdit: false
    };

    constructor(props) {
        super(props);

        this.state = {
            value: undefined,
            depId: '',
            employeeAddVisible: false,
            clearFlag: false, // 是否清空
        };
    }

    UNSAFE_componentWillReceiveProps (nextProps, nextContext) {
        if(nextProps.depId !== this.state.depId){
            this.setState({depId: nextProps.depId});
            this.props.asyncFetchDeptEmp({visibleFlag: this.props.showVisible}).then(()=>{
                this.props.getEmployeesByDeptId(nextProps.depId);
                if(nextProps.clearFlag){
                    this.setState({value: undefined});
                    this.handleChange(undefined);
                } else {
                    this.setState({clearFlag : true});
                }
            });
        }
        if(nextProps.value !== this.state.value){
            this.setState({value: nextProps.value});
        }
    }

    componentWillUnmount() {
        this.props.emptyDeptEmployee();
    }

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

    handleChange = (value, options) => {

        if(!value){
            value = ''
        }

        if (!('value' in this.props)) {
            this.setState({
                value
            });
        }
        console.log(value,'value');
        console.log(options,'options');

        const onChange = this.props.onChange;
        if (onChange) {
            onChange(value);
        }
        if(options){
            this.props.handleEmployeeChange && this.props.handleEmployeeChange(options.key);
        }
    };

    render() {
        const {deptEmployee, showEdit} = this.props;
        const employeeList = deptEmployee && deptEmployee.get('employeeList');
        console.log(employeeList && employeeList.toJS() , 'employeeList2');

        return (
            <div className={cx(['modal-container', {'modal-size': !!showEdit}])}>
                <div onMouseDown={(e) => { e.preventDefault(); return false; }}>
                    <Select
                        allowClear
                        style={{minWidth: this.props.width?this.props.width:'200px'}}
                        placeholder={this.props.placeholder}
                        value={this.state.value}
                        onChange={this.handleChange}
                        dropdownRender={menu => (
                            <div>
                                {menu}
                                {
                                    !!showEdit && (
                                        <div className={cx('dropdown-action') + " cf"}>
                                            <a href="#!" className="fl" onClick={()=>this.openModal('employeeAddVisible')}>{intl.get('common.confirm.new')}</a>
                                            <a href="#!" className="fr" onClick={()=>this.openModal('auxiliaryVisible', 'company', 'employee')}>{intl.get('common.confirm.manage')}</a>
                                        </div>
                                    )
                                }
                            </div>
                        )}
                    >
                        {employeeList && employeeList.map(employee =>
                            (
                                <Option key={employee.get('id')}
                                        value={this.props.valueType === 'id'?employee.get('id'):employee.get('employeeName')}>
                                    {employee.get('employeeName')}
                                </Option>
                            ))
                        }
                    </Select>
                </div>
                <EmployeeAdd
                    onClose={this.closeModal.bind(this, 'employeeAddVisible')}
                    visible={this.state.employeeAddVisible}
                    callback={(employeeId, employeeName)=>{
                    this.props.asyncFetchDeptEmp().then(()=>{
                        this.handleChange(this.props.valueType?employeeId:employeeName);
                        this.props.getDeptAndEmployeesByEmployeeId(employeeId);
                        this.props.handleEmployeeChange && this.props.handleEmployeeChange(employeeId);
                    });
                }}/>
                {/*辅助资料弹层*/}
                <Auxiliary
                    defaultKey={this.state.auxiliaryKey}
                    defaultTabKey={this.state.auxiliaryTabKey}
                    visible={this.state.auxiliaryVisible}
                    onClose={this.closeModal.bind(this, 'auxiliaryVisible')}
                />
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        deptEmployee: state.getIn(['auxiliaryDept', 'deptEmployee'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchDeptEmp: auxiliaryDeptActions.asyncFetchDeptEmp,
        getEmployeesByDeptId: auxiliaryDeptActions.getEmployeesByDeptId,
        getDeptAndEmployeesByEmployeeId: auxiliaryDeptActions.getDeptAndEmployeesByEmployeeId,
        emptyDeptEmployee: auxiliaryDeptActions.emptyDeptEmployee,
        asyncFetchEmployeeList,
        asyncAddEmployee
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectEmployee);
