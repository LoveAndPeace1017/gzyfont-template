import React, {Component} from 'react';
import {Select} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import intl from 'react-intl-universal';
import {asyncFetchIncomeList} from '../actions'

import {IncomeAdd} from 'pages/auxiliary/income';
import Auxiliary from 'pages/auxiliary';


import classNames from "classnames/bind";
import styles from "../../project/styles/index.scss";
const cx = classNames.bind(styles);

const {Option} = Select;

class SelectIncomeType extends Component {

    static getDerivedStateFromProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            return {
                ...(nextProps.value || {}),
            };
        }
        return null;
    }

    constructor(props) {
        super(props);

        const value = props.value || {};

        this.state = {
            key: value.key,
            label: value.label,
            incomeAddVisible: false
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
        this.setState({
            key: value && value.key,
            label: value && value.label
        });

        const onChange = this.props.onChange;
        if (onChange) {
            onChange(value ? {...value} : {});
        }
    };

    componentDidMount() {
        //初始化列表数据
        this.props.asyncFetchIncomeList(this.props.type);
    }


    render() {
        const {incomeList, type, showAll, showEdit} = this.props;
        const incomeListData = incomeList.getIn([type, 'data', 'data']);
        const value = this.state.key !== undefined ? {key: this.state.key, label: this.state.label} : undefined;

        return (
            <div className={cx(['modal-container', {'modal-size': !!showEdit}])}>
                <div onMouseDown={(e) => { e.preventDefault(); return false; }}>
                    <Select defaultActiveFirstOption={false}
                            allowClear={!!value}
                            labelInValue
                            style={{minWidth: '120px'}}
                            placeholder={this.props.placeholder || ''}
                            value={value}
                            onChange={this.handleChange}
                            dropdownRender={menu => (
                                <div>
                                    {menu}
                                    {
                                        !!showEdit && (
                                            <div className={cx('dropdown-action') + " cf"}>
                                                <a href="#!" className="fl" onClick={()=>this.openModal('incomeAddVisible')}>{intl.get('common.confirm.new')}</a>
                                                <a href="#!" className="fr" onClick={()=>this.openModal('auxiliaryVisible', 'income', type)}>{intl.get('common.confirm.manage')}</a>
                                            </div>
                                        )
                                    }
                                </div>
                            )}
                    >
                        {showAll && <Option key='all' value=''>{intl.get("auxiliary.income.all")}</Option>}
                        {
                            incomeListData && incomeListData.map(item => (
                                <Option key={item.get('recId')}
                                        value={item.get('recId')}>{item.get('propName')}</Option>
                            ))
                        }
                    </Select>
                </div>
                <IncomeAdd onClose={this.closeModal.bind(this, 'incomeAddVisible')} type={type} visible={this.state.incomeAddVisible} callback={(data) => {
                    this.props.asyncFetchIncomeList(this.props.type, () => {
                        this.handleChange(data);
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
        incomeList: state.getIn(['auxiliaryIncome', 'incomeList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchIncomeList
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectIncomeType)
