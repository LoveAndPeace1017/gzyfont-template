import React, {Component} from 'react';
import {Select} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import intl from 'react-intl-universal';
import Add from './add';
import {asyncFetchWorkCenterList, asyncAddWorkCenter} from "../actions";

import Auxiliary from 'pages/auxiliary';
const {Option} = Select;
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);

class SelectWorkCenter extends Component {

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
            payAddVisible: false,
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
        this.props.asyncFetchWorkCenterList();
    }


    render() {
        const { incomeListData, showEdit, showFullSize, disabled} = this.props;
        const settlementListData = incomeListData && incomeListData.getIn(['data', 'data']);

        return (
            <div className={cx(['modal-container', {'modal-size': !!showFullSize}])}>
                <div onMouseDown={(e) => { e.preventDefault(); return false; }}>
                    <Select
                        disabled={disabled || false}
                        allowClear
                        value={this.state.value}
                        onChange={this.handleChange}
                        style={{minWidth: '200px'}}
                        placeholder={this.props.placeholder||"选择工作中心"}
                        dropdownRender={menu => (
                            <div>
                                {menu}
                                {
                                    !!showEdit && (
                                        <div className={cx('dropdown-action') + " cf"}>
                                            <a href="#!" className="fl" onClick={()=>this.openModal('payAddVisible')}>{intl.get('common.confirm.new')}</a>
                                            <a href="#!" className="fr" onClick={()=>this.openModal('auxiliaryVisible', 'production')}>{intl.get('common.confirm.manage')}</a>
                                        </div>
                                    )
                                }
                            </div>
                        )}
                    >
                        {
                            settlementListData && settlementListData.map(item => (
                                <Option key={item.get('recId')}
                                        value={item.get('caCode')}
                                        goods={{...item.toJS()}}>{item.get('caName')}</Option>
                            ))
                        }
                    </Select>
                </div>

                <Add
                    visible={this.state.payAddVisible}
                    onClose={this.closeModal.bind(this,'payAddVisible')}
                    callback={(settlementName) => {
                        this.props.asyncFetchWorkCenterList(() => {
                            this.handleChange(settlementName);
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
        incomeListData: state.getIn(['auxiliaryWorkCenter', 'workCenterList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchWorkCenterList,
        asyncAddWorkCenter
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectWorkCenter)
