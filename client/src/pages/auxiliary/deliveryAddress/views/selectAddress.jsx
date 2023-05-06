import React, {Component} from 'react';
import {Select} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import intl from 'react-intl-universal';
import IntlTranslation from 'utils/IntlTranslation'
import {asyncFetchAddressList, asyncAddAddress} from "../actions";
import {AddressAdd} from 'pages/auxiliary/deliveryAddress';

import Auxiliary from 'pages/auxiliary';

const {Option} = Select;
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import PropTypes from "prop-types";

const cx = classNames.bind(styles);


/**
 * 选择交付地址
 *
 * @visibleName SelectAddress（选择交付地址）
 * @author guozhaodong
 *
 */
class SelectAddress extends Component {

    static propTypes = {
        /**
         * 指定当前选中的条目
         */
        value: PropTypes.string,
        /**
         * 选中option的回调函数
         * @param {string} value 选择的值
         */
        onChange: PropTypes.func,
        /**
         * 暗注释
         * */
        placeholder:PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string
        ]),
        /**
         * 是否显示新建、管理操作
         * */
        showEdit: PropTypes.bool
    };

    static defaultProps = {
        placeholder: <IntlTranslation intlKey = "home.account.selectAddress"/>,
        showEdit: false
    };

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
            addressAddVisible: false,
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
        // this.handleChange(projectName);
    };

    componentDidMount() {
        //初始化列表数据
        this.props.asyncFetchAddressList('address');
    }

    render() {
        const {addressList, showEdit} = this.props;
        const addressListData = addressList.getIn(['address','data','data']);

        return (
            <div className={cx(['modal-container', {'modal-size': !!showEdit}])}>
                <div onMouseDown={(e) => { e.preventDefault(); return false; }}>
                    <Select
                        allowClear
                        value={this.state.value}
                        onChange={this.handleChange}
                        style={{minWidth: '200px'}}
                        placeholder={this.props.placeholder}
                        dropdownRender={menu => (
                            <div>
                                {menu}
                                {
                                    !!showEdit && (
                                        <div className={cx('dropdown-action') + " cf"}>
                                            <a href="#!" className="fl" onClick={()=>this.openModal('addressAddVisible')}>{intl.get('common.confirm.new')}</a>
                                            <a href="#!" className="fr" onClick={()=>this.openModal('auxiliaryVisible', 'order', 'address')}>{intl.get('common.confirm.manage')}</a>
                                        </div>
                                    )
                                }
                            </div>
                        )}
                    >
                        {
                            addressListData && addressListData.map(item => (
                                <Option key={item.get('id')}
                                        value={item.get('receiverProvinceCode')
                                        + ' ' + item.get('receiverProvinceText')
                                        + ' ' + item.get('receiverCityCode')
                                        + ' ' + item.get('receiverCityText')
                                        + ' ' + item.get('receiverAddress')}>{item.get('receiverProvinceText') + ' ' + item.get('receiverCityText') + ' ' + item.get('receiverAddress')}</Option>
                            ))
                        }
                    </Select>
                </div>

                <AddressAdd onClose={this.closeModal.bind(this, 'addressAddVisible')} visible={this.state.addressAddVisible} callback={(address) => {
                    this.props.asyncFetchAddressList('address', () => {
                        this.handleChange(address);
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
        addressList: state.getIn(['auxiliaryAddress', 'addressList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchAddressList,
        asyncAddAddress,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectAddress)