import React, {Component} from 'react';
import {Select} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import intl from 'react-intl-universal';
import {asyncFetchMultiCurrencyList, asyncAddMultiCurrency} from "../actions";
import {CurrencyAdd} from 'pages/auxiliary/multiCurrency';

import Auxiliary from 'pages/auxiliary';

const {Option} = Select;
import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);

class SelectCurrency extends Component {

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
            currencyAddVisible: false,
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

    handleChange = (value,options) => {

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
            onChange(value,options);
        }
        // this.handleChange(projectName);
    };

    componentDidMount() {
        //初始化列表数据
        this.props.asyncFetchMultiCurrencyList();
    }

    render() {
        const {multiCurrencyList, showEdit, disabled=false} = this.props;
        const listData = multiCurrencyList.getIn(['data','data']);

        return (
            <div className={cx(['modal-container', {'modal-size': !!showEdit}])}>
                <div onMouseDown={(e) => { e.preventDefault(); return false; }}>
                    <Select
                        disabled={disabled}
                        allowClear
                        value={this.state.value}
                        onChange={this.handleChange}
                        style={{minWidth: '200px'}}
                        placeholder={this.props.placeholder||"请选择货币"}
                        dropdownRender={menu => (
                            <div>
                                {menu}
                                {
                                    !!showEdit && (
                                        <div className={cx('dropdown-action') + " cf"}>
                                            <a href="#!" className="fl" onClick={()=>this.openModal('currencyAddVisible')}>{intl.get('common.confirm.new')}</a>
                                            <a href="#!" className="fr" onClick={()=>this.openModal('auxiliaryVisible', 'order','currency')}>{intl.get('common.confirm.manage')}</a>
                                        </div>
                                    )
                                }
                            </div>
                        )}
                    >
                        {
                            listData && listData.map(item => (
                                <Option key={item.get('id')}
                                        value={item.get('id')}
                                        currency={{...item.toJS()}}
                                >
                                    {item.get('paramKey')}
                                </Option>
                            ))
                        }
                    </Select>
                </div>

                <CurrencyAdd onClose={this.closeModal.bind(this, 'currencyAddVisible')} visible={this.state.currencyAddVisible} callback={(currency) => {
                    this.props.asyncFetchMultiCurrencyList(() => {
                        this.handleChange(currency);
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
        multiCurrencyList: state.getIn(['auxiliaryMultiCurrency', 'multiCurrencyList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchMultiCurrencyList,
        asyncAddMultiCurrency,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectCurrency)