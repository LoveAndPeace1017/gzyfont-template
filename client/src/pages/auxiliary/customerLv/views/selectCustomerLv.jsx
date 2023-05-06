import React, {Component} from 'react';
import {Select} from 'antd';
import {connect} from 'react-redux';
import intl from 'react-intl-universal';
import {CustomerLvAdd} from 'pages/auxiliary/customerLv';
import Auxiliary from 'pages/auxiliary';

import classNames from "classnames/bind";
import styles from "../../project/styles/index.scss";
import {bindActionCreators} from "redux";
import {asyncFetchCustomerLvList,asyncAddCustomerLv} from "../actions";
import PropTypes from "prop-types";
const cx = classNames.bind(styles);

const {Option} = Select;


/**
 * 选择客户级别
 *
 * @visibleName SelectCustomerLv（选择客户级别）
 * @author guozhaodong
 *
 */
class SelectCustomerLv extends Component {

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
            customerLvAddVisible: false
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
        this.props.asyncFetchCustomerLvList();
    }

    componentWillUnmount() {
        //当组件销毁时，把请求的数据缓存清除
        // this.props.emptyGoodsUnitListCache();
    }


    render() {
        const {customerLvList, showEdit} = this.props;
        const customerLvListData = customerLvList && customerLvList.get('data');

        return (
            <div className={cx(['modal-container', {'modal-size': !!showEdit}])}>
                <div onMouseDown={(e) => { e.preventDefault(); return false; }}>
                    <Select
                        defaultActiveFirstOption={false}
                        style={{minWidth: '120px'}}
                        placeholder={this.props.placeholder}
                        value={this.state.value}
                        allowClear
                        onChange={this.handleChange}
                        dropdownRender={menu => (
                            <div>
                                {menu}
                                {
                                    !!showEdit && (
                                        <div className={cx('dropdown-action') + " cf"}>
                                            <a href="#!" className="fl" onClick={()=>this.openModal('customerLvAddVisible')}>新建</a>
                                            <a href="#!" className="fr" onClick={()=>this.openModal('auxiliaryVisible', 'customerLv')}>管理</a>
                                        </div>
                                    )
                                }
                            </div>
                        )}
                    >
                        {
                            customerLvListData && customerLvListData.map(item => (
                                <Option key={item.get('id')}
                                        value={item.get('id')}>{item.get('name')}</Option>
                            ))
                        }
                    </Select>
                </div>

                <CustomerLvAdd onClose={this.closeModal.bind(this, 'customerLvAddVisible')} visible={this.state.customerLvAddVisible} callback={(id) => {
                    this.props.asyncFetchCustomerLvList(() => {
                        this.handleChange(id);
                    })
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
        customerLvList: state.getIn(['auxiliaryCustomerLv', 'customerLvList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchCustomerLvList,
        asyncAddCustomerLv
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectCustomerLv)
