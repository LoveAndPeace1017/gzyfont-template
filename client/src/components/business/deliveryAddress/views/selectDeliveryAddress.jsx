import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {Button, Modal, Select} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";

import {asyncFetchDeliveryAddrList} from '../actions'
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);

const {Option} = Select;
import PropTypes from 'prop-types';
import WarehouseAdd from "pages/warehouse/add";
import WarehouseIndex, {actions as warehouseActions} from "pages/warehouse/index";
import Icon from "components/widgets/icon";
import {AddPkgOpen} from "components/business/vipOpe";


/**
 * 仓库或交货地址下拉选择
 *
 * @visibleName SelectDeliveryAddress（仓库或交货地址下拉选择）
 * @author guozhaodong
 */
class SelectDeliveryAddress extends Component {

    static propTypes = {
        /**
         * 是否显示新建、管理操作
         * */
        value: PropTypes.oneOfType([PropTypes.string,PropTypes.array]),
        /**
         * 是否为选择仓库，默认为false，为选择交货地址
         * */
        isWareHouses: PropTypes.bool,
        /**
         * 是否显示管理
         * */
        showEdit:  PropTypes.bool,
        /**
         * 初始化数据，只有isWareHouses为false才生效
         * */
        initOptions: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object
        ]),
        /**
         * 暗注释
         * */
        placeholder: PropTypes.string,
        /**
         * 是否禁用
         * */
        disabled: PropTypes.bool,
        /**
         * 下拉选项是否展开
         **/
        open: PropTypes.bool,
        /**
         * 当下拉选项展开时的回调
         **/
        onDropdownVisibleChange: PropTypes.func,
        /**
         * 选择后，执行onChange之前的回调
         * @param {func} callback 改变值的回调函数
         */
        beforeChange: PropTypes.func,
        /**
         * 当value改变的回调
         **/
        onChange: PropTypes.func,
        /**
         * 样式
         **/
        style: PropTypes.object
    };

    static defaultProps = {
        showEdit: false,
        isWareHouses: false,
        placeholder: '',
        disabled: false
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
            warehouseAddVisible: false,
            warehouseManageVisible: false
        };
    }

    openModal = (type) => {
        this.setState({
            [type]: true
        })
    };

    getAuth=()=>{
        const {currentAccountInfo, warehouseList} = this.props;
        const accountInfo = currentAccountInfo.get('data');
        const warehouseInfo = warehouseList.getIn(['data', 'info']);
        return {
            mainUserFlag: accountInfo && accountInfo.get('mainUserFlag'),
            warehouseInfo: warehouseInfo?warehouseInfo.toJS():{}
        }
    };

    closeModal = (type) =>{
        this.setState({
            [type]: false
        })
    };

    beforeChange = (callback)=>{
        // let result = true;
        // if(this.props.beforeChange){
        //     result = this.props.beforeChange();
        // }
        // return result;
        if(this.props.beforeChange){
            this.props.beforeChange(callback);
        }else{
            callback();
        }
    };

    handleChange = (value) => {
        this.beforeChange(()=>{
            if (!('value' in this.props)) {
                this.setState({
                    value
                });
            }

            const onChange = this.props.onChange;
            if (onChange) {
                onChange(value);
            }
        })
        // if(this.beforeChange()){
        //
        // }
    };

    componentDidMount() {
        //初始化列表数据
        // if (!('initOptions' in this.props)) {
        this.props.isWareHouses && this.props.asyncFetchWarehouseList();
        // }
    }


    render() {
        const {initOptions, isWareHouses, isOnlineOrder, warehouseList,multiple} = this.props;
        let deliveryAddrListData;

        if(isWareHouses && warehouseList.getIn(['data', 'list'])){
            deliveryAddrListData = warehouseList.getIn(['data', 'list']);
        }
        //初始数据从外部传入
        else if (initOptions) {
            deliveryAddrListData = initOptions;
        }

        const selectProps = {
            allowClear: true,
            value: this.state.value?this.state.value:undefined,
            mode: multiple?"multiple":"",
            placeholder: this.props.placeholder,
            onChange: this.handleChange,
            disabled: this.props.disabled,
            style: {
                minWidth: '200px',
                ...this.props.style
            }

        };
        // //如果是厂库地址，需要带入默认数据
        // if (isWareHouses && initOptions){
        //     let dataWareHouses = initOptions.toJS();
        //     dataWareHouses.forEach(function(element,index,arr1){
        //         if(element.isCommon==1){
        //             selectProps.value = element.name;
        //             return
        //         }
        //     })
        // }

        if('open' in this.props){
            selectProps.open = this.props.open;
        }
        if('onDropdownVisibleChange' in this.props){
            selectProps.onDropdownVisibleChange = this.props.onDropdownVisibleChange;
        }

        if(!!this.props.showEdit && this.getAuth().mainUserFlag){
            selectProps.dropdownRender= menu => (
                <div>
                    {menu}
                    {
                        (
                            <div className={cx('dropdown-action') + " cf"}>

                                <AddPkgOpen onTryOrOpenCallback={()=>this.openModal('warehouseAddVisible')}
                                          openVipSuccess={() => this.props.asyncFetchWarehouseList()}
                                          vipInfo={this.getAuth().warehouseInfo}
                                          render={() => (
                                              <a href="#!" className="fl">{intl.get("components.deliveryAddress.selectDeliveryAddress.add")}</a>
                                          )}
                                />
                                <a href="#!" className="fr" onClick={()=>this.openModal('warehouseManageVisible')}>{intl.get("components.deliveryAddress.selectDeliveryAddress.management")}</a>
                            </div>
                        )
                    }
                </div>
            )
        }

        return (
            <div className={cx(['modal-container', {'modal-size': !!this.props.showEdit}])}>
                    <div onMouseDown={(e) => { e.preventDefault(); return false; }}>
                    <Select
                        {...selectProps}
                    >
                        {
                            deliveryAddrListData && deliveryAddrListData.map(item => {
                                    if (isWareHouses) {
                                        return <Option key={item.get('recId')}
                                                       value={item.get('name')}>{item.get('name')}</Option>
                                    } else if(isOnlineOrder) {
                                        return <Option key={item.get('recId')}
                                                       value={item.get('id')}
                                        >{item.get('address')?item.get('name') + '-' + item.get('provinceText') + ' ' + item.get('cityText') + ' ' + item.get('address'):item.get('name')}</Option>
                                    } else if(item.get('provinceText') && item.get('cityText') && item.get('address')){
                                        return <Option key={item.get('recId')}
                                                       value={item.get('provinceCode')
                                                       + ' ' + item.get('provinceText')
                                                       + ' ' + item.get('cityCode')
                                                       + ' ' + item.get('cityText')
                                                       + ' ' + item.get('address')}
                                        >{item.get('provinceText') + ' ' + item.get('cityText') + ' ' + item.get('address')}</Option>
                                    }

                                }
                            )
                        }
                    </Select>
                </div>
                    <WarehouseAdd
                        visible={this.state.warehouseAddVisible}
                        data={{}}
                        onClose={this.closeModal.bind(this, 'warehouseAddVisible')}
                        callback={(warehouseName) => {
                            this.props.asyncFetchWarehouseList(() => {
                                this.handleChange(warehouseName);
                            });
                        }}
                    />
                    <WarehouseIndex
                        visible={this.state.warehouseManageVisible}
                        onClose={()=>this.closeModal('warehouseManageVisible')}
                    />
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        warehouseList: state.getIn(['warehouseIndex', 'warehouseList']),
        currentAccountInfo: state.getIn(['commonInfo', 'currentAccountInfo'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchWarehouseList:warehouseActions.asyncFetchWarehouseList,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectDeliveryAddress)
