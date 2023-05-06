import React, {Component} from 'react';
import {Select} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import intl from 'react-intl-universal';
import Add from './add';
import {asyncFetchPayList, asyncAddPay} from "../actions";

import Auxiliary from 'pages/auxiliary';


const {Option} = Select;
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);

class SelectSettlement extends Component {

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

    componentDidMount() {
        //初始化列表数据
        this.props.asyncFetchPayList('orderType');
    }


    render() {
        const { incomeListData, showEdit} = this.props;
        const settlementListData = incomeListData && incomeListData.getIn(['orderType','data', 'data']);

        return (
            <div className={cx(['modal-container', {'modal-size': !!showEdit}])}>
                <div onMouseDown={(e) => { e.preventDefault(); return false; }}>
                    <Select
                        allowClear
                        value={this.state.value}
                        onChange={this.handleChange}
                        style={{minWidth: '200px'}}
                        placeholder={this.props.placeholder||intl.get("auxiliary.orderType.placeholder")}
                        dropdownRender={menu => (
                            <div>
                                {menu}
                                {
                                    !!showEdit && (
                                        <div className={cx('dropdown-action') + " cf"}>
                                            <a href="#!" className="fl" onClick={()=>this.openModal('payAddVisible')}>{intl.get('common.confirm.new')}</a>
                                            <a href="#!" className="fr" onClick={()=>this.openModal('auxiliaryVisible', 'order')}>{intl.get('common.confirm.manage')}</a>
                                        </div>
                                    )
                                }
                            </div>
                        )}
                    >
                        {
                            settlementListData && settlementListData.map(item => (
                                <Option key={item.get('recId')}
                                        value={item.get('paramName')}>{item.get('paramName')}</Option>
                            ))
                        }
                    </Select>
                </div>

                <Add
                    visible={this.state.payAddVisible}
                    type='orderType'
                    onClose={this.closeModal.bind(this,'payAddVisible')}
                    callback={(settlementName) => {
                        this.props.asyncFetchPayList('orderType',() => {
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
        incomeListData: state.getIn(['auxiliaryOrderType', 'orderTypeList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchPayList,
        asyncAddPay
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectSettlement)
