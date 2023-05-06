import React, { Component } from 'react';

import { List, InputItem, DatePicker, Modal, Toast } from 'antd-mobile';
import locale from 'antd-mobile/lib/date-picker/locale/zh_CN';
import { format } from 'date-fns'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import {formatCurrency} from 'utils/format';
import Header from 'components/layout/header';
import CartCardWrap from 'pages/onlineOrder/cartList/views/cartCardWrap';

import {actions as onlineOrderCartOrderActions} from '../index'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {withRouter} from "react-router-dom";
import {getUrlParamValue} from 'utils/urlParam';
import * as constant from "../actionsTypes";
const alert = Modal.alert;

const Item = List.Item;
const Brief = Item.Brief;
const cx = classNames.bind(styles);

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
class OrderConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: now,
            isEditPage: false,
            ourNameDisplay: '',
            ourContacterNameDisplay: '',
            ourTelNoDisplay: '',
            ourName: '',
            ourContacterName: '',
            ourTelNo: '',
            remarks: '',
            visible: false
        };
    };



    componentDidMount() {
        const {data} = this.props;
        this.setState({
            source:getUrlParamValue('source')
        });
        let cookieGroup = document.cookie.split(";");
        let prodList = JSON.parse(cookieGroup.filter((item) => {
            return item.indexOf('prodList=') !== -1
        })[0].split('=')[1]);

        let inforData = {};
        inforData.prodList = prodList;
        inforData.immediateFlag = (getUrlParamValue("immediateFlag")=='true');

        this.props.asyncFetchCartDetailData(inforData, (res)=>{
            // this.props.setInitFinished();
            if(res.orders){
                const supplierDetail = res.orders[0];
                this.setState({
                    ourName: this.removeNull(supplierDetail.ourName),
                    ourContacterName: this.removeNull(supplierDetail.ourContacterName),
                    ourTelNo: this.removeNull(supplierDetail.ourTelNo),
                    ourNameDisplay: this.removeNull(supplierDetail.ourName),
                    ourContacterNameDisplay: this.removeNull(supplierDetail.ourContacterName),
                    ourTelNoDisplay: this.removeNull(supplierDetail.ourTelNo),
                },() => {
                    const {ourName, ourContacterName, ourTelNo} = this.state;
                    if(!ourName || !ourContacterName || !ourTelNo){
                        this.setState({isEditPage: true});
                    }
                })
            }

        });
    };

    removeNull (val) {
        return !val ? '' : val;
    }

    editDetailInfo = () => {
        this.setState({isEditPage: true});
    };

    leftClick = () => {
        const {ourName, ourContacterName, ourTelNo} = this.state;
        this.setState({
            isEditPage: false,
            ourNameDisplay: ourName,
            ourContacterNameDisplay: ourContacterName,
            ourTelNoDisplay: ourTelNo,
        });
    };

    //验证操作
    validateSub() {
        const {ourNameDisplay, ourContacterNameDisplay, ourTelNoDisplay} = this.state;
        if(ourNameDisplay.trim().length === 0){
            Toast.fail('填写收货方!', 1);
            return false;
        }
        if(ourContacterNameDisplay.trim().length === 0){
            Toast.fail('填写收货人!', 1);
            return false;
        }
        if(ourTelNoDisplay.trim().length === 0){
            Toast.fail('填写联系方式!', 1);
            return false;
        }

        this.setState({
            isEditPage: false,
            ourName: ourNameDisplay.trim(),
            ourContacterName: ourContacterNameDisplay.trim(),
            ourTelNo: ourTelNoDisplay.trim(),
        });
        return true;
    }

    //编辑页面右击
    rightClick = () => {
        this.validateSub();
    };

    getWarehouse = () => {
        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.nativeHandler) {
            window.webkit.messageHandlers.nativeHandler.postMessage({"action" : 'getWarehouse'});
        }else if(window.nativeHandler) {
            window.nativeHandler.getWarehouse && window.nativeHandler.getWarehouse();
        }
    };

    //提交订单
    submitOrder = () => {
        const {ourName, ourContacterName, ourTelNo, remarks, date} = this.state;
        let formData = {};
        var self = this;
        let cookieGroup = document.cookie.split(";");
        let prodList = JSON.parse(cookieGroup.filter((item) => {
            return item.indexOf('prodList=') !== -1
        })[0].split('=')[1]);
        if(this.validateSub()){
            formData.prodList = prodList;
            formData.ourName = ourName;
            formData.ourContacterName = ourContacterName;
            formData.ourTelNo = ourTelNo;
            formData.contractTerms = remarks;
            formData.deliveryDeadlineDate = format(date, 'YYYY-MM-DD');
            formData.deliveryProvinceCode = document.getElementById('provinceCode').value;
            formData.deliveryProvinceText = document.getElementById('provinceText').value;
            formData.deliveryCityCode = document.getElementById('cityCode').value;
            formData.deliveryCityText = document.getElementById('cityText').value;
            formData.deliveryAddress = document.getElementById('address').value;
            if(this.state.source=='cart'){
                formData.cart = 1;
            }
            this.props.asyncFetchSubmitCartData(formData, (res) => {
                if (res.data.retCode === '0') {
                    Toast.success('操作成功!', 1);
                    let {clientType, userId, token} = res.data.mobileInfo;

                    document.cookie="prodList="+JSON.stringify([]);
                    self.props.history.push(`${PROD_PATH}?clienttype=${clientType}&userid=${userId}&token=${token}`)
                }
                else {
                    res.data.retValidationMsg ? Toast.fail(res.data.retValidationMsg.msg[0].msg, 1) : Toast.fail(res.data.retMsg, 1);
                }
            })
        }
    };

    render() {
        const { visible, date, isEditPage, ourName, ourContacterName, ourTelNo, ourNameDisplay, ourContacterNameDisplay, ourTelNoDisplay} = this.state;
        const {isFetching, data} = this.props;
        const warehouseDetail = data.get('warehouses') ? data.get('warehouses').toJS()[0]: {};

        return (
            <div className={cx('container')}>

                {
                    !isEditPage && (
                        <div>
                            <Header navStatus={'orderConfirm'}/>

                            <div className={cx('main')}>
                                <div className={cx('order-detail')}>
                                    <input type="hidden" name="provinceCode" id="provinceCode"/>
                                    <input type="hidden" name="provinceText" id="provinceText"/>
                                    <input type="hidden" name="cityCode" id="cityCode"/>
                                    <input type="hidden" name="cityText" id="cityText"/>
                                    <input type="hidden" name="address" id="address"/>
                                    <List  className="my-list">
                                        <Item
                                            arrow="horizontal"
                                            multipleLine
                                            onClick={() => {this.editDetailInfo()}}
                                            platform="android"
                                        >
                                            <span className={cx('com-name')}>{ourName}</span>
                                            <Brief><span className={cx('com-mobile')}>{ourContacterName} &nbsp; {ourTelNo}</span></Brief>
                                        </Item>

                                        <Item arrow="horizontal" multipleLine onClick={() => {this.getWarehouse()}}>
                                        <span className={cx(['order-desc', 'order-content'])} id="cartAdress">
                                            {warehouseDetail.provinceText}-{warehouseDetail.cityText}-{warehouseDetail.address}
                                        </span>
                                        </Item>

                                        <Item arrow="horizontal" multipleLine onClick={() => {this.setState({ visible: true })}}>
                                        <span className={cx('order-desc')}>
                                            <label htmlFor="">交付日期：</label>
                                            <span>{format(date, 'YYYY-MM-DD')}</span>
                                        </span>
                                        </Item>

                                        <InputItem
                                            placeholder="请填写备注"
                                            onChange={(v) => {this.setState({remarks: v})}}
                                            style={{color: '#666'}}
                                            maxLength={2000}
                                        ><span className={cx('order-desc')}>备注：</span></InputItem>
                                    </List>
                                </div>

                                {
                                    data.get('orders') && data.get('orders').map((item, index) => (
                                        <CartCardWrap key={index}  supplierName={item.get('supplierName')}  dataSource={item.get('prodList')} status={3}/>
                                    ))
                                }
                            </div>

                            <DatePicker
                                visible={visible}
                                mode="date"
                                title=""
                                value={date}
                                locale={locale}
                                onOk={(date) => this.setState({ date, visible: false })}
                                onDismiss={() => this.setState({ visible: false })}
                            >
                            </DatePicker>

                            <div className={cx('cart-bottom')}>
                                <span className={cx('total')}>总金额： <span className={cx('red')}>¥ {formatCurrency(data.get('totalAmount'))}</span></span>
                                <a href="#!" className={cx('submit-btn')} onClick={() => {this.submitOrder()}}>提交订单</a>
                            </div>
                        </div>
                    )
                }


                {
                    isEditPage && (
                        <div>
                            <Header navStatus={'orderConfirmEdit'} leftClick={() => {this.leftClick()}} rightClick={() => {this.rightClick()}}/>

                            <div className={cx('main')}>
                                <div className={cx('order-detail')}>
                                    <List className="my-list">
                                        <InputItem
                                            placeholder="填写收货方（必填）" defaultValue={ourNameDisplay}
                                            onChange={(v) => {this.setState({ourNameDisplay: v})}}
                                            maxLength={80}
                                        ><span className={cx('order-desc')}>收货方</span></InputItem>

                                        <InputItem
                                            placeholder="填写收货人（必填）" defaultValue={ourContacterNameDisplay}
                                            onChange={(v) => {this.setState({ourContacterNameDisplay: v})}}
                                            maxLength={25}
                                        ><span className={cx('order-desc')}>收货人</span></InputItem>

                                        <InputItem
                                            placeholder="填写联系方式（必填）" defaultValue={ourTelNoDisplay}
                                            onChange={(v) => {this.setState({ourTelNoDisplay: v})}}
                                            maxLength={50}
                                        ><span className={cx('order-desc')}>联系方式</span></InputItem>
                                    </List>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    isFetching: state.getIn(['orderConfirmReducer', 'onlineOrderCartOrderList', 'isFetching']),
    data: state.getIn(['orderConfirmReducer', 'onlineOrderCartOrderList', 'data'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchCartDetailData: onlineOrderCartOrderActions.asyncFetchCartDetailData,
        asyncFetchSubmitCartData: onlineOrderCartOrderActions.asyncFetchSubmitCartData
    }, dispatch)
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(OrderConfirm)
)
