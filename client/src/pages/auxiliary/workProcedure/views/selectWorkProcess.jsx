import React, {Component} from 'react';
import {Select} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import Add from './add';
import {asyncFetchWorkProcedureList, asyncAddWorkProcedure} from "../actions";
import Auxiliary from 'pages/auxiliary';
const {Option} = Select;
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);

class SelectWorkProcess extends Component {
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
            value,
            procedureAddVisible: false
        };
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

    handleChange = (value, option) => {
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
            onChange(value, option);
        }
    };

    componentDidMount() {
        //初始化列表数据
        this.props.asyncFetchWorkProcedureList();
    }


    render() {
        const { workProcedureList, showEdit, showFullSize, disabled } = this.props;
        const workProcedureData = workProcedureList && workProcedureList.getIn(['data', 'data']);

        return (
            <div className={cx(['modal-container', {'modal-size': !!showFullSize}])}>
                <div onMouseDown={(e) => { e.preventDefault(); return false; }}>
                    <Select
                        disabled={disabled || false}
                        allowClear
                        value={this.state.value}
                        onChange={this.handleChange}
                        style={{minWidth: '200px'}}
                        placeholder={this.props.placeholder||"选择工作工序"}
                        dropdownRender={menu => (
                            <div>
                                {menu}
                                {
                                    !!showEdit && (
                                        <div className={cx('dropdown-action') + " cf"}>
                                            <a href="#!" className="fl" onClick={()=>this.openModal('procedureAddVisible')}>新建</a>
                                            <a href="#!" className="fr" onClick={()=>this.openModal('auxiliaryVisible', 'production')}>管理</a>
                                        </div>
                                    )
                                }
                            </div>
                        )}
                    >
                        {
                            workProcedureData && workProcedureData.map(item => (
                                <Option key={item.get('processCode')}
                                        value={item.get('processCode')}>
                                    {item.get('processCode')}
                                    &nbsp;
                                    {item.get('processName')}
                                </Option>
                            ))
                        }
                    </Select>
                </div>

                <Add
                    visible={this.state.procedureAddVisible}
                    onClose={this.closeModal.bind(this,'procedureAddVisible')}
                    callback={(values) => {
                        this.props.asyncFetchWorkProcedureList(() => {
                            this.handleChange(values.processCode);
                        });
                    }}
                />
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
        workProcedureList: state.getIn(['auxiliaryWorkProcedure', 'workProcedureList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchWorkProcedureList,
        asyncAddWorkProcedure
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectWorkProcess)
