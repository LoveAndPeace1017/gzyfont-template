import React, {Component} from 'react';
import {Select} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import intl from 'react-intl-universal';
import {asyncFetchExpressList} from "../actions";
import Add from './add';

import Auxiliary from 'pages/auxiliary';

const {Option} = Select;
import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);

class SelectInvoiceType extends Component {

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

        const value = props.value;
        this.state = {
            value,
            invoiceTypeAddVisible: false,
        };
    }

    openModal = (type, auxiliaryKey, auxiliaryTabKey) => {
        this.setState({
            [type]: true,
            auxiliaryKey,
            auxiliaryTabKey
        })
    };

    closeModal = (type) => {
        this.setState({
            [type]: false
        })
    };

    handleChange = (value) => {

        if(!value){
            value = ''
        }
        this.setState({
            value
        });

        const onChange = this.props.onChange;
        if (onChange) {
            onChange(value);
        }
    };

    componentDidMount() {
        //初始化列表数据
        this.props.asyncFetchExpressList('bill');
    }

    render() {
        const {invoiceTypeList, showEdit} = this.props;
        const invoiceTypeListData = invoiceTypeList && invoiceTypeList.getIn(['bill', 'data', 'data']);
        // const value = this.state.key !== undefined ? {key: this.state.key, label: this.state.label} : undefined;

        return (
            <div className={cx(['modal-container', {'modal-size': !!showEdit}])}>
                <div onMouseDown={(e) => {
                    e.preventDefault();
                    return false;
                }}>
                    <Select
                        allowClear
                        value={this.state.value}
                        onChange={this.handleChange}
                        style={{...this.props.style, minWidth: 200}}
                        placeholder={this.props.placeholder || intl.get('auxiliary.bill.incomeName')}
                        dropdownRender={menu => (
                            <div>
                                {menu}
                                {
                                    !!showEdit && (
                                        <div className={cx('dropdown-action') + " cf"}>
                                            <a href="#!" className="fl"
                                               onClick={() => this.openModal('invoiceTypeAddVisible')}>{intl.get('common.confirm.new')}</a>
                                            <a href="#!" className="fr"
                                               onClick={() => this.openModal('auxiliaryVisible', 'tax')}>{intl.get('common.confirm.manage')}</a>
                                        </div>
                                    )
                                }
                            </div>
                        )}
                    >
                        {
                            invoiceTypeListData && invoiceTypeListData.map(item => (
                                <Option key={item.get('id')} value={item.get('paramName')}>
                                    {item.get('paramName')}
                                </Option>
                            ))
                        }
                    </Select>
                </div>

                <Add type={'bill'} onClose={this.closeModal.bind(this, 'invoiceTypeAddVisible')}
                     visible={this.state.invoiceTypeAddVisible} callback={(invoiceType) => {
                    this.props.asyncFetchExpressList('bill', () => {
                        this.handleChange(invoiceType);
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
        invoiceTypeList: state.getIn(['auxiliaryBill', 'billList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchExpressList,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectInvoiceType)