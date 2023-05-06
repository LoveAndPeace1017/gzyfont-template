import React, {Component} from 'react';
import {Select} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {asyncFetchEmployeeList, asyncAddEmployee} from "../actions";
import {EmployeeAdd} from 'pages/auxiliary/employee';
import classNames from "classnames/bind";
import styles from "../../project/styles/index.scss";
const cx = classNames.bind(styles);
const {Option} = Select;
import intl from 'react-intl-universal';

class SelectEmployeeFix extends Component {
    static getDerivedStateFromProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            return {
                value: nextProps.value
            };
        }
        return null;
    }


    constructor(props) {
        super(props);

        const value = props.value || undefined;

        this.state = {
            value
        };
    }

    componentDidMount() {
        if(!this.props.notRequestFlag){ // notRequestFlag 不需要初始化请求
            //初始化列表数据
            let params = {};
            if(this.props.showVisible){
                params.visibleFlag = true;
            }
            this.props.asyncFetchEmployeeList(params);
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

    handleChange = (value) => {

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
    };


    render() {
        const {employeeList,width, showFullSize, disabled} = this.props;
        const employeeListData = employeeList.getIn(['data','data']);
        return (
            <div className={cx(['modal-container', {'modal-size': showFullSize}])}>
                <div onMouseDown={(e) => { e.preventDefault(); return false; }}>
                    <Select
                        disabled={disabled || false}
                        showSearch={this.props.showSearch || false}
                        defaultActiveFirstOption={false}
                        onSearch={this.handleChange}
                        allowClear
                        style={width?{minWidth: width}:{minWidth: '120px'}}
                        placeholder={this.props.placeholder}
                        value={this.state.value}
                        onChange={this.handleChange}
                    >
                        {employeeListData && employeeListData.map((employee) =>
                            {
                                if(employee.get('visibleflag') === 0){
                                    return <Option key={employee.get('id')}
                                                   value={employee.get('id')}>
                                        {employee.get('department')+'-'+employee.get('employeeName')}
                                    </Option>
                                }
                            }
                         )
                        }
                    </Select>
                </div>

            </div>
        )
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
        asyncAddEmployee
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectEmployeeFix);
