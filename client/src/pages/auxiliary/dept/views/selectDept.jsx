import React, {Component} from 'react';
import {Select} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import intl from 'react-intl-universal';
import {asyncFetchDeptList, asyncAddDept, asyncFetchDeptEmp} from "../actions";

import {DeptAdd} from 'pages/auxiliary/dept';
import Auxiliary from 'pages/auxiliary';


import classNames from "classnames/bind";
import styles from "../../project/styles/index.scss";
import PropTypes from "prop-types";
const cx = classNames.bind(styles);

const {Option} = Select;

/**
 * 选择部门
 *
 * @visibleName SelectDept（选择部门）
 * @author guozhaodong
 *
 */
class SelectDept extends Component {

    static propTypes = {
        /**
         * 指定当前选中的条目
         */
        value: PropTypes.string,
        /**
         * 选中option的回调函数
         * @param {string} value 选中部门的名称
         */
        onChange: PropTypes.func,

        /**
         * 选中option的回调函数
         * @param {string} key 选中部门的id
         */
        handleDeptChange: PropTypes.func,
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
            deptName: '',
            deptAddVisible: false
        };
    }

    UNSAFE_componentWillReceiveProps (nextProps, nextContext) {
        if(nextProps.value){
            this.setState({value: nextProps.value});
        }
        if(nextProps.deptName && nextProps.deptName !== this.state.deptName){
            this.handleChange(nextProps.deptName);
            this.setState({value: nextProps.deptName, deptName: nextProps.deptName});
        }
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

        const onChange = this.props.onChange;
        if (onChange) {
            onChange(value);
        }
        if(options){
            this.props.handleDeptChange(options.key);
        }
    };

    componentDidMount() {
        //初始化列表数据
        let params = {};
        if(this.props.showEmployeeVisible){
            params.visibleFlag = true;
        }
        if(this.props.deptRef){
            this.props.deptRef(this);
        }
        this.props.asyncFetchDeptEmp(params);
    }


    render() {
        const {deptEmployee, showEdit} = this.props;

        const deptData = deptEmployee && deptEmployee.getIn(['data', 'data']);

        return (
            <div className={cx(['modal-container', {'modal-size': !!showEdit}])}>
                <div onMouseDown={(e) => { e.preventDefault(); return false; }}>
                    <Select
                        defaultActiveFirstOption={false}
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
                                                <a href="#!" className="fl" onClick={()=>this.openModal('deptAddVisible')}>{intl.get('common.confirm.new')}</a>
                                                <a href="#!" className="fr" onClick={()=>this.openModal('auxiliaryVisible', 'company', 'dept')}>{intl.get('common.confirm.manage')}</a>
                                            </div>
                                        )
                                    }
                                </div>
                        )}
                    >

                        {deptData && deptData.map(dept =>
                            (
                                <Option key={dept.get('deptId')}
                                        value={dept.get('deptName')}>
                                    {dept.get('deptName')}
                                </Option>
                            ))
                        }
                    </Select>
                </div>
                <DeptAdd onClose={this.closeModal.bind(this, 'deptAddVisible')}  visible={this.state.deptAddVisible} callback={(data) => {
                    this.props.asyncFetchDeptList('', () => {
                        this.handleChange(data.label);
                        this.props.handleDeptChange(data.key);
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
        deptEmployee: state.getIn(['auxiliaryDept', 'deptEmployee']),
        deptName: state.getIn(['auxiliaryDept', 'deptEmployee', 'department'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchDeptEmp,
        asyncFetchDeptList,
        asyncAddDept
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectDept)
