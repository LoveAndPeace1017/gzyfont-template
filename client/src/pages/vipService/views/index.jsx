import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { Col, Row, message, Tabs, Button } from 'antd';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import Crumb from 'components/business/crumb';
import Content from 'components/layout/content';
import {bindActionCreators} from "redux";
import {MallOpen, AddPkgOpen} from 'components/business/vipOpe';
import SwitchLanguage from 'components/business/switchLanguage';
import AccountIndex from 'pages/account/index';
import AccountReport from 'pages/auxiliary/accountReport';
import WarehouseIndex from "pages/warehouse/index";
import FittingIndex from 'pages/fitting/index';
import {getUrlParamValue} from 'utils/urlParam';
import moment from 'moment-timezone';
import Auxiliary from 'pages/auxiliary';
import {getCookie,setCookie} from 'utils/cookie';
moment.tz.setDefault("Asia/Shanghai");
import vipLog from '../images/vip-log.png';
import qqLog from '../images/qq.png';
import phoneLog from '../images/phone.png';
import l1 from  '../images/l-1.png';
import l2 from  '../images/l-2.png';
import l3 from  '../images/l-3.png';
import l4 from  '../images/l-4.png';
import m1 from  '../images/m-1.png';
import m2 from  '../images/m-2.png';
import m3 from  '../images/m-3.png';
import m4 from  '../images/m-4.png';
import hs1 from  '../images/h1-new.png';
import hs2 from  '../images/h2-new.png';
import hs3 from  '../images/h3-new.png';
import hs4 from  '../images/h4-new.png';
import hs5 from  '../images/h5-new.png';
import hs6 from  '../images/h6-new.png';
import hs7 from  '../images/hs7.png';
import hs8 from  '../images/hs8-new.png';
import hs9 from  '../images/hs9-new.png';
import hs10 from  '../images/hs10-new.png';
import hs11 from  '../images/hs11-new.png';
import hs12 from  '../images/hs12-bom.png';
import hs13 from  '../images/hs13-mrp.png';
import hs14 from  '../images/hs14-product.png';
import hs15 from  '../images/hs15-product.png';
import hs16 from '../images/hs16-currency.png';
import hs17 from '../images/hs17-notice.png';
import ddzz1 from '../images/ddzz1.png';

import NEW from  '../../../pages/home/images/NEW@2x.png';
import HOT from  '../../../pages/home/images/hot.png';

import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {actions as vipServiceHomeActions} from "../index";
import {Modal} from "antd/lib/index";

const { TabPane } = Tabs;
const cx = classNames.bind(styles);


class vipService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            completeComInfoVisible: false,
            mulAccountVisible: false,
            warehouseManageVisible: false,
            fittingVisible: false,
            languageVisible: false,
            auxiliaryVisible: false,
            accountReportVisible: false,
            auxiliaryKey: '',
            auxiliaryTabKey: '',
            smsNumber: 0
        }
    }

    componentDidMount() {
        this.props.asyncFetchVipService();
        this.loadSmsNumber();
    }

    loadSmsNumber = ()=>{
        setTimeout(()=>{
            this.props.asyncFetchGetSmsNotifyNum((data)=>{
                if(data.retCode === "0"){
                    this.setState({
                        smsNumber: data.data < 0 ? 0 : data.data
                    });
                }
            })
        },400);
    }

    //联系qq
    linkToQq = () => {
        if(this.isMainCount()){
            window.open('https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true');
        }else{
            message.warn(intl.get("vipService.index.onlyMainUserOperate"));
        }
    }
    //免费试用在线商城
    freeUse = () =>{
        if(this.isMainCount()){
            this.openModal('completeComInfoVisible');
        }else{
            message.warn(intl.get("vipService.index.onlyMainUserOperate"));
        }
    }
    //免费试用增值包
    freeUseAdd = ()=>{
        if(this.isMainCount()){
            //this.openModal('completeComInfoVisible');
            this.props.asyncFetchVipValueAdded((data)=>{
                console.log(data,'added');
                if(data.retCode == "0"){
                    message.success(intl.get("vipService.index.operateSuccessMessage"));
                    this.props.asyncFetchVipService();
                }else{
                    alert(data.retMsg);
                }
            });
        }else{
            message.warn(intl.get("vipService.index.onlyMainUserOperate"));
        }
    };
    //多币种免费试用成功后写入cookie
    tryCurrencyVip = ()=>{
        //初始化vip信息
        this.props.asyncFetchVipService();
        setCookie('currencyVipFlag','true');
    }

    //判断是否是主账号
    isMainCount = () =>{
        const {currentAccountInfo} = this.props;
        let accountInfo = currentAccountInfo.get('data');
        accountInfo = accountInfo ? accountInfo.toJS() : [];
        return accountInfo.mainUserIdEnc == accountInfo.subUserIdEnc;
    };

    closeModal = (tag)=>{
        let obj = {};
        obj[tag] = false;
        this.setState(obj);
    };

    openModal = (tag)=>{
        let obj = {};
        obj[tag] = true;
        this.setState(obj)
    };

    toMoreCount = ()=>{
        if(this.isMainCount()){
            this.openModal('mulAccountVisible');
        }else{
            message.warn(intl.get("vipService.index.onlyMainUserOperate"));
        }
    };

    handleOpen(type, auxiliaryKey, auxiliaryTabKey) {
        this.setState({
            [type]: true,
            auxiliaryKey,
            auxiliaryTabKey
        })
    }

    handleClose(type) {
        this.setState({
            [type]: false
        })
    }

    render() {
        const {vipService,currentAccountInfo} = this.props;
        let accountInfo = currentAccountInfo.get('data');
        accountInfo = accountInfo ? accountInfo.toJS() : [];
        console.log(accountInfo,'accountInfo');
        let dataSource = vipService.getIn(['vipData','data']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let type = getUrlParamValue('type')
        //多账号数据
        let subAccount = dataSource.SUB_ACCOUNT || {};
        //在线商城数据
        let onlineMall = dataSource.ONLINE_MALL || {};
        //增值包数据
        let valueAdd = dataSource.VALUE_ADDED || {};
        // 多语言
        let multiLanguage = dataSource.MULTI_LANGUAGE || {};
        // 多级审批
        let multiApprove = dataSource.MULTI_LEVEL_APPROVE || {};
        // 批次保质期
        let batchShelfLeft = dataSource.BATCH_SHELF_LIFE || {};
        //委外加工
        let subContract = dataSource.SUB_CONTRACT || {};
        //生产管理PRODUCT_MANAGE
        let productManage = dataSource.PRODUCT_MANAGE || {};
        //移动报工
        let mobileWork = dataSource.MOBILE_WORK || {};
        //多币种
        let currency = dataSource.CURRENCY || {};
        // 订单追踪
        let orderTrack = dataSource.ORDER_TRACK || {};
        //短信提醒
        let smsNotify = dataSource.SMS_NOTIFY || {};


        let getVipInfor;
        if(onlineMall.vipState == 'NOT_OPEN'){
            getVipInfor =  <h3>{intl.get("vipService.index.openState_not_open")}</h3>;
        }else if(onlineMall.vipState == 'EXPIRED'){
            getVipInfor = <h3 className={cx("vip-out")}>{intl.get("vipService.index.openState_expired")}</h3>
        }else if(onlineMall.vipState == 'TRY'){
            getVipInfor = <div>
                <span className={cx("try-vip")}>{intl.get("vipService.index.openState_try")}</span>
                <span className={cx("time-vip")}>{intl.get("vipService.index.serviceTime")}：{moment(onlineMall.startTime).format('YYYY-MM-DD')} - {moment(onlineMall.endTime).format('YYYY-MM-DD')}</span>
            </div>
        }else if(onlineMall.vipState == 'OPENED'){
            getVipInfor = <div>
                <span className={cx("use-vip")}>{intl.get("vipService.index.openState_open")}</span>
                <span className={cx("time-vip")}>{intl.get("vipService.index.serviceTime")}：{moment(onlineMall.startTime).format('YYYY-MM-DD')} - {moment(onlineMall.endTime).format('YYYY-MM-DD')}</span>
            </div>
        }

        let addedInfor;
        if(valueAdd.vipState == 'NOT_OPEN'){
            addedInfor =  <h3>{intl.get("vipService.index.openState_not_open")}</h3>;
        }else if(valueAdd.vipState == 'EXPIRED'){
            addedInfor = <h3 className={cx("vip-out")}>{intl.get("vipService.index.openState_expired")}</h3>
        }else if(valueAdd.vipState == 'TRY'){
            addedInfor = <div>
                <span className={cx("try-vip")}>{intl.get("vipService.index.openState_try")}</span>
                <span className={cx("time-vip")}>{intl.get("vipService.index.serviceTime")}：{moment(valueAdd.startTime).format('YYYY-MM-DD')} - {moment(valueAdd.endTime).format('YYYY-MM-DD')}</span>
            </div>
        }else if(valueAdd.vipState == 'OPENED'){
            addedInfor = <div>
                <span className={cx("use-vip")}>{intl.get("vipService.index.openState_open")}</span>
                <span className={cx("time-vip")}>{intl.get("vipService.index.serviceTime")}：{moment(valueAdd.startTime).format('YYYY-MM-DD')} - {moment(valueAdd.endTime).format('YYYY-MM-DD')}</span>
            </div>
        }

        let multiLanguageInfor;
        if(multiLanguage.vipState === 'NOT_OPEN'){
            multiLanguageInfor =  <div>
                <span className={cx("vip-not-open")}>{intl.get("vipService.index.openState_not_open")}</span>
                <span className={cx("time-vip")}>多语言功能开通后可免费试用 7 天</span>
            </div>
        } else if(multiLanguage.vipState === 'EXPIRED'){
            multiLanguageInfor = <div>
                <span className={cx("vip-out")}>{intl.get("vipService.index.openState_expired")}</span>
                <span className={cx("time-vip")}>多语言功能已到期，续费可继续使用</span>
            </div>
        } else if(multiLanguage.vipState === 'TRY'){
            multiLanguageInfor = <div>
                <span className={cx("try-vip")}>{intl.get("vipService.index.openState_try")}</span>
                <span className={cx("time-vip")}>{intl.get("vipService.index.serviceTime")}：{moment(multiLanguage.startTime).format('YYYY-MM-DD')} - {moment(multiLanguage.endTime).format('YYYY-MM-DD')}</span>
            </div>
        } else if(multiLanguage.vipState === 'OPENED'){
            multiLanguageInfor = <div>
                <span className={cx("use-vip")}>{intl.get("vipService.index.openState_open")}</span>
                <span className={cx("time-vip")}>{intl.get("vipService.index.serviceTime")}：{moment(multiLanguage.startTime).format('YYYY-MM-DD')} - {moment(multiLanguage.endTime).format('YYYY-MM-DD')}</span>
            </div>
        }

        let multiApproveInfor;
        if(multiApprove.vipState === 'NOT_OPEN'){
            multiApproveInfor =  <h3>{intl.get("vipService.index.openState_not_open")}</h3>;
        } else if(multiApprove.vipState === 'EXPIRED'){
            multiApproveInfor = <h3 className={cx("vip-out")}>{intl.get("vipService.index.openState_expired")}</h3>
        } else if(multiApprove.vipState === 'TRY'){
            multiApproveInfor = <div>
                <span className={cx("try-vip")}>{intl.get("vipService.index.openState_try")}</span>
                <span className={cx("time-vip")}>{intl.get("vipService.index.serviceTime")}：{moment(multiApprove.startTime).format('YYYY-MM-DD')} - {moment(multiApprove.endTime).format('YYYY-MM-DD')}</span>
            </div>
        } else if(multiApprove.vipState === 'OPENED'){
            multiApproveInfor = <div>
                <span className={cx("use-vip")}>{intl.get("vipService.index.openState_open")}</span>
                <span className={cx("time-vip")}>{intl.get("vipService.index.serviceTime")}：{moment(multiApprove.startTime).format('YYYY-MM-DD')} - {moment(multiApprove.endTime).format('YYYY-MM-DD')}</span>
            </div>
        }

        let batchShelfLeftInfor;
        if(batchShelfLeft.vipState === 'NOT_OPEN'){
            batchShelfLeftInfor = <div>
                        <span className={cx("vip-not-open")}>{intl.get("vipService.index.openState_not_open")}</span>
                        <span className={cx("time-vip")}>批次保质期功能开通后可免费试用 7 天</span>
                </div>
        } else if(batchShelfLeft.vipState === 'EXPIRED'){
            batchShelfLeftInfor = <div>
                        <span className={cx("vip-out")}>{intl.get("vipService.index.openState_expired")}</span>
                        <span className={cx("time-vip")}>批次保质期功能已到期，续费可继续使用</span>
            </div>
        } else if(batchShelfLeft.vipState === 'TRY'){
            batchShelfLeftInfor = <div>
                <span className={cx("try-vip")}>{intl.get("vipService.index.openState_try")}</span>
                <span className={cx("time-vip")}>{intl.get("vipService.index.serviceTime")}：{moment(batchShelfLeft.startTime).format('YYYY-MM-DD')} - {moment(batchShelfLeft.endTime).format('YYYY-MM-DD')}</span>
            </div>
        } else if(batchShelfLeft.vipState === 'OPENED'){
            batchShelfLeftInfor = <div>
                <span className={cx("use-vip")}>{intl.get("vipService.index.openState_open")}</span>
                <span className={cx("time-vip")}>{intl.get("vipService.index.serviceTime")}：{moment(batchShelfLeft.startTime).format('YYYY-MM-DD')} - {moment(batchShelfLeft.endTime).format('YYYY-MM-DD')}</span>
            </div>
        }

        let subContractInfo;
        if(subContract.vipState === 'NOT_OPEN'){
            subContractInfo = <div>
                <span className={cx("vip-not-open")}>{intl.get("vipService.index.openState_not_open")}</span>
                <span className={cx("time-vip")}>委外加工功能开通后可免费试用 7 天</span>
            </div>
        } else if(subContract.vipState === 'EXPIRED'){
            subContractInfo = <div>
                <span className={cx("vip-out")}>{intl.get("vipService.index.openState_expired")}</span>
                <span className={cx("time-vip")}>委外加工功能已到期，续费可继续使用</span>
            </div>
        } else if(subContract.vipState === 'TRY'){
            subContractInfo = <div>
                <span className={cx("try-vip")}>{intl.get("vipService.index.openState_try")}</span>
                <span className={cx("time-vip")}>{intl.get("vipService.index.serviceTime")}：{moment(subContract.startTime).format('YYYY-MM-DD')} - {moment(subContract.endTime).format('YYYY-MM-DD')}</span>
            </div>
        } else if(subContract.vipState === 'OPENED'){
            subContractInfo = <div>
                <span className={cx("use-vip")}>{intl.get("vipService.index.openState_open")}</span>
                <span className={cx("time-vip")}>{intl.get("vipService.index.serviceTime")}：{moment(subContract.startTime).format('YYYY-MM-DD')} - {moment(subContract.endTime).format('YYYY-MM-DD')}</span>
            </div>
        }

        let productManageInfo;
        if(productManage.vipState === 'NOT_OPEN'){
            productManageInfo = <div>
                <span className={cx("vip-not-open")}>{intl.get("vipService.index.openState_not_open")}</span>
                <span className={cx("time-vip")}>生产管理功能开通后可免费试用 7 天</span>
            </div>
        } else if(productManage.vipState === 'EXPIRED'){
            productManageInfo = <div>
                <span className={cx("vip-out")}>{intl.get("vipService.index.openState_expired")}</span>
                <span className={cx("time-vip")}>生产管理功能已到期，续费可继续使用</span>
            </div>
        } else if(productManage.vipState === 'TRY'){
            productManageInfo = <div>
                <span className={cx("try-vip")}>{intl.get("vipService.index.openState_try")}</span>
                <span className={cx("time-vip")}>{intl.get("vipService.index.serviceTime")}：{moment(productManage.startTime).format('YYYY-MM-DD')} - {moment(productManage.endTime).format('YYYY-MM-DD')}</span>
            </div>
        } else if(productManage.vipState === 'OPENED'){
            productManageInfo = <div>
                <span className={cx("use-vip")}>{intl.get("vipService.index.openState_open")}</span>
                <span className={cx("time-vip")}>{intl.get("vipService.index.serviceTime")}：{moment(productManage.startTime).format('YYYY-MM-DD')} - {moment(productManage.endTime).format('YYYY-MM-DD')}</span>
            </div>
        }

        //移动报工
        let mobileWorkInfo;
        if(mobileWork.vipState === 'NOT_OPEN'){
            mobileWorkInfo = <div>
                <span className={cx("vip-not-open")}>{intl.get("vipService.index.openState_not_open")}</span>
                <span className={cx("time-vip")}>移动报工功能未开通</span>
            </div>
        } else if(mobileWork.vipState === 'EXPIRED'){
            mobileWorkInfo = <div>
                <span className={cx("vip-out")}>{intl.get("vipService.index.openState_expired")}</span>
                <span className={cx("time-vip")}>移动报工功能已到期，续费可继续使用</span>
            </div>
        }else if(mobileWork.vipState === 'TRY'){
            mobileWorkInfo = <div>
                <span className={cx("try-vip")}>{intl.get("vipService.index.openState_try")}</span>
                <span className={cx("time-vip")}>{intl.get("vipService.index.serviceTime")}：{moment(mobileWork.startTime).format('YYYY-MM-DD')} - {moment(mobileWork.endTime).format('YYYY-MM-DD')}</span>
            </div>
        }else if(mobileWork.vipState === 'OPENED'){
            mobileWorkInfo = <div>
                <span className={cx("use-vip")}>{intl.get("vipService.index.openState_open")}</span>
                <span className={cx("time-vip")}>{intl.get("vipService.index.serviceTime")}：{moment(mobileWork.startTime).format('YYYY-MM-DD')} - {moment(mobileWork.endTime).format('YYYY-MM-DD')}</span>
            </div>
        }

        //多币种
        let currencyInfo;
        if(currency.vipState === 'NOT_OPEN'){
            currencyInfo = <div>
                <span className={cx("vip-not-open")}>{intl.get("vipService.index.openState_not_open")}</span>
                <span className={cx("time-vip")}>多币种功能未开通</span>
            </div>
        } else if(currency.vipState === 'EXPIRED'){
            currencyInfo = <div>
                <span className={cx("vip-out")}>{intl.get("vipService.index.openState_expired")}</span>
                <span className={cx("time-vip")}>多币种功能已到期，续费可继续使用</span>
            </div>
        }else if(currency.vipState === 'TRY'){
            currencyInfo = <div>
                <span className={cx("try-vip")}>{intl.get("vipService.index.openState_try")}</span>
                <span className={cx("time-vip")}>{intl.get("vipService.index.serviceTime")}：{moment(currency.startTime).format('YYYY-MM-DD')} - {moment(currency.endTime).format('YYYY-MM-DD')}</span>
            </div>
        }else if(currency.vipState === 'OPENED'){
            currencyInfo = <div>
                <span className={cx("use-vip")}>{intl.get("vipService.index.openState_open")}</span>
                <span className={cx("time-vip")}>{intl.get("vipService.index.serviceTime")}：{moment(currency.startTime).format('YYYY-MM-DD')} - {moment(currency.endTime).format('YYYY-MM-DD')}</span>
            </div>
        }


        // 订单追踪
        let orderTrackInfo;
        if(orderTrack.vipState === 'NOT_OPEN'){
            orderTrackInfo = <div>
                <span className={cx("vip-not-open")}>{intl.get("vipService.index.openState_not_open")}</span>
                <span className={cx("time-vip")}>订单追踪平台功能未开通</span>
            </div>
        } else if(orderTrack.vipState === 'EXPIRED'){
            orderTrackInfo = <div>
                <span className={cx("vip-out")}>{intl.get("vipService.index.openState_expired")}</span>
                <span className={cx("time-vip")}>订单追踪平台功能已到期，续费可继续使用</span>
            </div>
        }else if(orderTrack.vipState === 'TRY'){
            orderTrackInfo = <div>
                <span className={cx("try-vip")}>{intl.get("vipService.index.openState_try")}</span>
                <span className={cx("time-vip")}>{intl.get("vipService.index.serviceTime")}：{moment(orderTrack.startTime).format('YYYY-MM-DD')} - {moment(orderTrack.endTime).format('YYYY-MM-DD')}</span>
            </div>
        }else if(orderTrack.vipState === 'OPENED'){
            orderTrackInfo = <div>
                <span className={cx("use-vip")}>{intl.get("vipService.index.openState_open")}</span>
                <span className={cx("time-vip")}>{intl.get("vipService.index.serviceTime")}：{moment(orderTrack.startTime).format('YYYY-MM-DD')} - {moment(orderTrack.endTime).format('YYYY-MM-DD')}</span>
            </div>
        }

        //短信提醒
        let smsNotifyInfo;
        if(smsNotify.vipState === 'NOT_OPEN'){
            smsNotifyInfo = <div>
                <span className={cx("vip-not-open")}>{intl.get("vipService.index.openState_not_open")}</span>
                <span className={cx("time-vip")}>短信提醒功能未开通</span>
            </div>
        } else if(smsNotify.vipState === 'EXPIRED'){
            smsNotifyInfo = <div>
                <span className={cx("vip-out")}>{intl.get("vipService.index.openState_expired")}</span>
                <span className={cx("time-vip")}>短信提醒功能已到期，续费可继续使用</span>
            </div>
        }else if(smsNotify.vipState === 'TRY'){
            smsNotifyInfo = <div>
                <span className={cx("try-vip")}>{intl.get("vipService.index.openState_try")}</span>
                <span className={cx("time-vip")}>{intl.get("vipService.index.serviceTime")}：{moment(smsNotify.startTime).format('YYYY-MM-DD')} - {moment(smsNotify.endTime).format('YYYY-MM-DD')}</span>
            </div>
        }else if(smsNotify.vipState === 'OPENED'){
            smsNotifyInfo = <div>
                <span className={cx("use-vip")}>{intl.get("vipService.index.openState_open")}</span>
                <span className={cx("time-vip")}>{intl.get("vipService.index.serviceTime")}：{moment(smsNotify.startTime).format('YYYY-MM-DD')} - {moment(smsNotify.endTime).format('YYYY-MM-DD')}</span>
            </div>
        }


        let vipBtn;
        if(onlineMall.vipState == 'NOT_OPEN'){
            vipBtn =  <div> <Button onClick={()=>this.freeUse()} style={{marginRight:"15px"}} type={"default"}>{intl.get("vipService.index.freeUse")}</Button>
                <Button onClick={()=>this.linkToQq()} type={"primary"}>{intl.get("vipService.index.buy")}</Button>
            </div>
        }else if(onlineMall.vipState == 'EXPIRED'){
            vipBtn =
                <div>
                    <Button onClick={()=>this.linkToQq()} type={"primary"}>{intl.get("vipService.index.extend_buy")}</Button>
                    <Link to={"/mall"} className={cx("go-account")}>{intl.get("vipService.index.enterMall")}></Link>
                </div>
        }else if(onlineMall.vipState == 'TRY'){
            vipBtn =
                <div>
                    <Button onClick={()=>this.linkToQq()} type={"primary"}>{intl.get("vipService.index.extend_buy")}</Button>
                    <Link to={"/mall"} className={cx("go-account")}>{intl.get("vipService.index.enterMall")}></Link>
                </div>
        }else if(onlineMall.vipState == 'OPENED'){
            vipBtn =
                <div>
                    <Button onClick={()=>this.linkToQq()} type={"primary"}>{intl.get("vipService.index.extend_buy")}</Button>
                    <Link to={"/mall"} className={cx("go-account")}>{intl.get("vipService.index.enterMall")}></Link>
                </div>
        }

        let addBtn = <div>
            <span onClick={()=>this.openModal('warehouseManageVisible')} className={cx("go-account")}>{intl.get("vipService.index.enterWarehouse")}></span>
            {/*<span onClick={()=>this.openModal('fittingVisible')} className={cx("go-account")}>{intl.get("vipService.index.enterBom")}></span>*/}
         {/*   <Link to={"/multiBom/list"} className={cx("go-account")}>{intl.get("vipService.index.enterBom")}></Link>*/}
            <Link to={"/template/list"} className={cx("go-account")}>{intl.get("vipService.index.enterPrint")}></Link>
        </div>;

        return(
            <React.Fragment>
                <Content.ContentHd>
                    <Crumb data={[
                        {
                            title: intl.get("vipService.index.vipService")
                        }
                    ]}/>
                </Content.ContentHd>
                <Content.ContentBd>
                    {/*<div className={cx("top-adv")}>

                    </div>*/}
                    <div className="detail-vip-service">
                        <Tabs
                            defaultActiveKey = {type||"1"}
                            className="record-tab"
                            animated={true}
                        >
                            <TabPane tab={intl.get("vipService.index.multipleAccounts")} key="1">
                                <div className={cx("service-hd")}>
                                    <div className={cx("service-hd-lst")}>
                                        <div className={cx("service-hd-menu")}>
                                            <h3 style={{marginTop: "15px"}} className={cx("service-name")}>多账号</h3>
                                            {/*<div className={cx("service-price")}>*/}
                                                {/*<span>¥ 688/个/年</span>*/}
                                            {/*</div>*/}
                                            {/*<span className={cx("service-name")}>多账号</span>
                                            <span className={cx("service-name-title")}>（多账号服务：企业内多人使用软件，需分主子账号管理，数据更安全，管理更轻松）</span>
                                            <span className={cx("service-btn")}>
                                               {subAccount.EXPIRED + subAccount.OPENED == 0?
                                                   <div>
                                                       <Button onClick={()=>this.toMoreCount()} type={"primary"}>{intl.get("vipService.index.open")}</Button>
                                                   </div>:
                                                   <div>
                                                       <Button onClick={()=>this.linkToQq()} type={"primary"}>{intl.get("vipService.index.extend_buy")}</Button>
                                                   </div>
                                               }
                                            </span>
                                            <span className={cx("service-price")}>499个/年</span>
                                            <span className={cx("service-price-title")}>价格：¥</span>*/}
                                        </div>
                                        <div className={cx("service-hd-des")}>
                                            <h2 className={cx("service-des")}>企业内多人使用软件，需分主子账号管理，数据更安全，管理更轻松</h2>
                                            <div className={cx("service-hd-num")}>
                                                <Row gutter={24}>
                                                    <Col span={8}>
                                                        <div className={cx("service-hd-col")}>
                                                            <h3>{intl.get("vipService.index.accountAmount")}:<span style={{color: "#E53E3E"}}>{(subAccount.EXPIRED||0) + (subAccount.OPENED||0)}</span></h3>
                                                        </div>
                                                    </Col>
                                                    <Col span={8}>
                                                        <div className={cx("service-hd-col")}>
                                                            <h3>{intl.get("vipService.index.accountAmountInServiceTime")}:<span>{subAccount.OPENED}</span></h3>
                                                        </div>
                                                    </Col>
                                                    <Col span={8}>
                                                        <div className={cx("service-hd-col")}>
                                                            <h3>{intl.get("vipService.index.accountAmountServiceTimeExpired")}:<span>{subAccount.EXPIRED}</span></h3>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div  className={cx("service-btn")}>
                                               {subAccount.EXPIRED + subAccount.OPENED == 0?
                                                   <div>
                                                       <Button onClick={()=>this.toMoreCount()} type={"primary"}>{intl.get("vipService.index.open")}</Button>
                                                   </div>:
                                                   <div>
                                                       <Button onClick={()=>this.linkToQq()} type={"primary"}>{intl.get("vipService.index.extend_buy")}</Button>
                                                   </div>
                                               }
                                            </div>

                                        </div>
                                        <div>
                                            <span onClick={()=>this.toMoreCount()} className={cx("go-account")}>{intl.get("vipService.index.enterMultipleAccount")}></span>
                                            <span onClick={this.handleOpen.bind(this, 'auxiliaryVisible', 'approve')} className={cx("go-account")}>多级审批设置></span>
                                        </div>

                                       {/* <div className={cx("service-hd-num")}>
                                            <Row gutter={24}>
                                                <Col span={8}>
                                                    <div className={cx("service-hd-col")}>
                                                        <p style={{color: "#E53E3E"}}>
                                                            {(subAccount.EXPIRED||0) + (subAccount.OPENED||0)}
                                                        </p>
                                                        <h3>{intl.get("vipService.index.accountAmount")}</h3>
                                                    </div>
                                                </Col>
                                                <Col span={8}>
                                                    <div className={cx("service-hd-col")}>
                                                        <p>{subAccount.OPENED}</p>
                                                        <h3>{intl.get("vipService.index.accountAmountInServiceTime")}</h3>
                                                    </div>
                                                </Col>
                                                <Col span={8}>
                                                    <div className={cx("service-hd-col")}>
                                                        <p>{subAccount.EXPIRED}</p>
                                                        <h3>{intl.get("vipService.index.accountAmountServiceTimeExpired")}</h3>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                        {
                                            subAccount.EXPIRED + subAccount.OPENED == 0?null:(
                                                <div>
                                                    <span onClick={()=>this.toMoreCount()} className={cx("go-account")}>{intl.get("vipService.index.enterMultipleAccount")}></span>

                                                    <span onClick={this.handleOpen.bind(this, 'auxiliaryVisible', 'approve')} className={cx("go-account")}>多级审批设置></span>
                                                </div>
                                            )
                                        }*/}
                                    </div>
                                    <div className={cx("service-hd-2st")}>
                                        <div style={{float: "left"}}>
                                            <div className={cx("qq-link")}>
                                                <img src={qqLog} alt="tp"/>
                                            </div>
                                            <span onClick={()=>this.linkToQq()} className={cx("link-name")}>{intl.get("vipService.index.onlineService")}</span>
                                            <div className={cx("phone-link")}>
                                                <img src={phoneLog} alt="tp"/>
                                            </div>
                                            <span className={cx("link-name")}>{intl.get("vipService.index.phone")}</span>
                                            <a className={cx("go-account-link")} target="_blank" href="https://www.abiz.com/info/assistant-sfaq/63517.htm">{intl.get("vipService.index.watchDetail")}></a>
                                        </div>
                                        <div className={cx("service-link")}>
                                            {intl.get("vipService.index.accountTip1")} <span className={cx("green")}>{intl.get("vipService.index.accountTip2")}</span>
                                        </div>
                                    </div>
                                </div>
                                <h2 className={cx("vip-hd-name")}>
                                    {intl.get("vipService.index.accountPrivilege")}
                                </h2>
                                <ul className={cx("service-bd-ul")}>
                                    <li>
                                        <div className={cx("vip-power")}>
                                            <img src={l1} alt="tp"/>
                                        </div>
                                        <p>{intl.get("vipService.index.privacyTask")}</p>
                                        <h3>
                                            {intl.get("vipService.index.privacyContent1")}<br/>
                                            {intl.get("vipService.index.privacyContent2")}
                                        </h3>
                                    </li>
                                    <li>
                                        <div className={cx("vip-power")}>
                                            <img src={l2} alt="tp"/>
                                        </div>
                                        <p>{intl.get("vipService.index.dataSecure")}</p>
                                        <h3>
                                            {intl.get("vipService.index.dataSecureContent1")}<br/>
                                            {intl.get("vipService.index.dataSecureContent2")}
                                        </h3>
                                    </li>
                                    <li>
                                        <div className={cx("vip-power")}>
                                            <img src={l3} alt="tp"/>
                                        </div>
                                        <p>{intl.get("vipService.index.priceProtect")}</p>
                                        <h3>
                                            {intl.get("vipService.index.priceProtectContent1")}<br/>
                                            {intl.get("vipService.index.priceProtectContent2")}
                                        </h3>
                                    </li>
                                    <li>
                                        <div className={cx("vip-power")}>
                                            <img src={l4} alt="tp"/>
                                        </div>
                                        <p>{intl.get("vipService.index.completeProcess")}</p>
                                        <h3>
                                            {intl.get("vipService.index.completeProcessContent1")}<br/>
                                            {intl.get("vipService.index.completeProcessContent2")}
                                        </h3>
                                    </li>
                                </ul>
                            </TabPane>
                            {/*<TabPane tab={intl.get("vipService.index.multipleLanguage")} key="4">
                                <div className={cx("service-hd")}>
                                    <div className={cx("service-hd-lst")}>
                                        <div className={cx("service-hd-menu")}>
                                            <span className={cx("service-name")}>多语言</span>
                                            <span className={cx("service-name-title")}>（多语言服务：支持切换系统语言为简体中文、英文）</span>
                                            <span className={cx("service-btn")}>
                                                  {
                                                      multiLanguage.vipState === 'NOT_OPEN' && (
                                                          <React.Fragment>
                                                              <AddPkgOpen
                                                                  openVipSuccess={() => this.props.asyncFetchVipService()}
                                                                  vipInfo={multiLanguage}
                                                                  source={'multiLanguage'}
                                                                  render={() => (
                                                                      <Button style={{marginRight:"15px"}} type={"default"}>{intl.get("vipService.index.freeUse")}</Button>
                                                                  )}
                                                              />
                                                          </React.Fragment>
                                                      )
                                                  }
                                                 {
                                                    multiLanguage.vipState !== 'NOT_OPEN' && (
                                                        <React.Fragment>
                                                            <Button onClick={()=>this.linkToQq()} type={"primary"}>{intl.get("vipService.index.extend_buy")}</Button>
                                                        </React.Fragment>
                                                    )
                                                 }
                                            </span>
                                            <span className={cx("service-price")}>1888/年</span>
                                            <span className={cx("service-price-title")}>价格：¥</span>
                                            <h3 className={cx("service-name")}>多语言</h3>
                                            <div className={cx("service-price")}>
                                                <span>¥ 1888/年</span>
                                            </div>
                                        </div>
                                        <div className={cx("service-hd-des")}>
                                            <h2 className={cx("service-des")}>
                                                支持切换系统语言为简体中文、英文
                                            </h2>
                                            <div className={cx("vip-service-status")}>
                                                {multiLanguageInfor}
                                            </div>
                                            <div className={cx("service-btn")}>
                                                  {
                                                      multiLanguage.vipState === 'NOT_OPEN' && (
                                                          <React.Fragment>
                                                              <AddPkgOpen
                                                                  openVipSuccess={() => this.props.asyncFetchVipService()}
                                                                  vipInfo={multiLanguage}
                                                                  source={'multiLanguage'}
                                                                  render={() => (
                                                                      <Button type={"primary"}>{intl.get("vipService.index.freeUse")}</Button>
                                                                  )}
                                                              />
                                                          </React.Fragment>
                                                      )
                                                  }
                                                {
                                                    multiLanguage.vipState !== 'NOT_OPEN' && (
                                                        <React.Fragment>
                                                            <Button onClick={()=>this.linkToQq()} type={"primary"}>{intl.get("vipService.index.extend_buy")}</Button>
                                                        </React.Fragment>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div>
                                            <div className={cx("switch-language-btn")}>
                                                <AddPkgOpen
                                                    onTryOrOpenCallback={()=>{this.setState({languageVisible: true})}}
                                                    vipInfo={multiLanguage}
                                                    source={'multiLanguage'}
                                                    render={() => (
                                                        <span  className={cx("go-account")}>{intl.get("vipService.index.switchLanguage")+">"}</span>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className={cx("service-account")}>
                                            {multiLanguageInfor}
                                        </div>
                                        <div>
                                            <AddPkgOpen
                                                onTryOrOpenCallback={()=>{this.setState({languageVisible: true})}}
                                                vipInfo={multiLanguage}
                                                source={'multiLanguage'}
                                                render={() => (
                                                    <span  className={cx("go-account")}>{intl.get("vipService.index.switchLanguage")+">"}</span>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className={cx("service-hd-2st")}>
                                        {intl.get("vipService.index.multipleLanguageTip1")} <span className={cx("green")}>{intl.get("vipService.index.multipleLanguageTip2")}</span>
                                        <div>
                                            <div className={cx("qq-link")}>
                                                <img src={qqLog} alt="tp"/>
                                            </div>
                                            <span onClick={()=>this.linkToQq()} className={cx("link-name")}>{intl.get("vipService.index.onlineService")}</span>
                                            <div className={cx("phone-link")}>
                                                <img src={phoneLog} alt="tp"/>
                                            </div>
                                            <span className={cx("link-name")}>{intl.get("vipService.index.phone")}</span>
                                        </div>
                                    </div>
                                </div>
                                <h2 className={cx("vip-hd-name")}>
                                    {intl.get("vipService.index.multipleLanguagePrivilege")}
                                </h2>
                                <div className={cx("added-package")}>
                                    <div className={cx("added-log")}>
                                        <img src={hs6} alt="tp"/>
                                    </div>
                                    <div className={cx("added-wild")}>
                                        <h3>{intl.get("vipService.index.multipleLanguage")}</h3>
                                        <p>{intl.get("vipService.index.multipleLanguageContent")}</p>
                                    </div>
                                </div>
                            </TabPane>*/}
                            <TabPane tab={
                                <>
                                    <div className={cx("new-tab")}>
                                        多币种
                                    </div>
                                </>} key="10">
                                <div className={cx("service-hd")}>
                                    <div className={cx("service-hd-lst")}>
                                        <div className={cx("service-hd-menu")}>
                                            <h3 className={cx("service-name")}>多币种</h3>
                                            <div className={cx("service-price")}>
                                                <span>¥ 3000/年</span>
                                            </div>
                                        </div>
                                        <div className={cx("service-hd-des")}>
                                            <h2 className={cx("service-des")}>
                                                支持销售订单及关联单据录入其他币种
                                            </h2>
                                            <div className={cx("vip-service-status")}>
                                                {currencyInfo}
                                            </div>
                                            <div className={cx("service-btn")}>
                                                {
                                                    currency.vipState === 'NOT_OPEN' && (
                                                        <React.Fragment>
                                                            <AddPkgOpen
                                                                openVipSuccess={this.tryCurrencyVip}
                                                                vipInfo={currency}
                                                                source={'currency'}
                                                                render={() => (
                                                                    <Button  type={"primary"}>{intl.get("vipService.index.freeUse")}</Button>
                                                                )}
                                                            />
                                                        </React.Fragment>
                                                    )
                                                }
                                                {
                                                    currency.vipState !== 'NOT_OPEN' && (
                                                        <React.Fragment>
                                                            <Button onClick={()=>this.linkToQq()} type={"primary"}>{intl.get("vipService.index.extend_buy")}</Button>
                                                        </React.Fragment>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div style={{position: "relative"}}>
                                            <span onClick={this.handleOpen.bind(this, 'auxiliaryVisible','order','currency')} className={cx("go-account")}>币种设置></span>
                                        </div>

                                    </div>
                                    <div className={cx("service-hd-2st")}>
                                        {/*{intl.get("vipService.index.batchShelfLeft")}{intl.get("vipService.index.funcOpenTip")} <span className={cx("green")}>{intl.get("vipService.index.multipleLanguageTip2")}</span>*/}
                                        <div>
                                            <div className={cx("qq-link")}>
                                                <img src={qqLog} alt="tp"/>
                                            </div>
                                            <span onClick={()=>this.linkToQq()} className={cx("link-name")}>{intl.get("vipService.index.onlineService")}</span>
                                            <div className={cx("phone-link")}>
                                                <img src={phoneLog} alt="tp"/>
                                            </div>
                                            <span className={cx("link-name")}>{intl.get("vipService.index.phone")}</span>
                                            <a className={cx("go-account-link")} target="_blank" href="http://www.abiz.com/info/assfaq/63610.htm">{intl.get("vipService.index.watchDetail")}></a>
                                        </div>
                                    </div>
                                </div>
                                <h2 className={cx("vip-hd-name")}>
                                    多币种内容
                                </h2>

                                <div className={cx("added-package")}>
                                    <div className={cx("added-log")}>
                                        <img src={hs16} alt="tp"/>
                                    </div>
                                    <div className={cx("added-wild")}>
                                        <h3>多币种</h3>
                                        <p>销售订单及关联收入记录支持不同币种，外贸业务单据也可轻松管理</p>
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab={intl.get("vipService.index.batchShelfLeft")} key="6">
                                <div className={cx("service-hd")}>
                                    <div className={cx("service-hd-lst")}>
                                        <div className={cx("service-hd-menu")}>
                                            {/*<span className={cx("service-name")}>批次保质期</span>
                                            <span className={cx("service-name-title")}>（批次保质期：物品库存按批次保质期管理，物品管理更精细）</span>
                                            <span className={cx("service-btn")}>
                                                  {
                                                      batchShelfLeft.vipState === 'NOT_OPEN' && (
                                                          <React.Fragment>
                                                              <AddPkgOpen
                                                                  openVipSuccess={() => this.props.asyncFetchVipService()}
                                                                  vipInfo={batchShelfLeft}
                                                                  source={'batchShelfLeft'}
                                                                  render={() => (
                                                                      <Button style={{marginRight:"15px"}} type={"default"}>{intl.get("vipService.index.freeUse")}</Button>
                                                                  )}
                                                              />
                                                          </React.Fragment>
                                                      )
                                                  }
                                                {
                                                    batchShelfLeft.vipState !== 'NOT_OPEN' && (
                                                        <React.Fragment>
                                                            <Button onClick={()=>this.linkToQq()} type={"primary"}>{intl.get("vipService.index.extend_buy")}</Button>
                                                        </React.Fragment>
                                                    )
                                                }
                                            </span>
                                            <span className={cx("service-price")}>688/年</span>
                                            <span className={cx("service-price-title")}>价格：¥</span>*/}
                                            <h3 className={cx("service-name")}>批次保质期</h3>
                                            <div className={cx("service-price")}>
                                                <span>¥ 688/年</span>
                                            </div>
                                        </div>
                                        <div className={cx("service-hd-des")}>
                                            <h2 className={cx("service-des")}>
                                                物品库存按批次保质期管理，物品管理更精细
                                            </h2>
                                            <div className={cx("vip-service-status")}>
                                                {batchShelfLeftInfor}
                                            </div>
                                            <div className={cx("service-btn")}>
                                                  {
                                                      batchShelfLeft.vipState === 'NOT_OPEN' && (
                                                          <React.Fragment>
                                                              <AddPkgOpen
                                                                  openVipSuccess={() => this.props.asyncFetchVipService()}
                                                                  vipInfo={batchShelfLeft}
                                                                  source={'batchShelfLeft'}
                                                                  render={() => (
                                                                      <Button  type={"primary"}>{intl.get("vipService.index.freeUse")}</Button>
                                                                  )}
                                                              />
                                                          </React.Fragment>
                                                      )
                                                  }
                                                {
                                                    batchShelfLeft.vipState !== 'NOT_OPEN' && (
                                                        <React.Fragment>
                                                            <Button onClick={()=>this.linkToQq()} type={"primary"}>{intl.get("vipService.index.extend_buy")}</Button>
                                                        </React.Fragment>
                                                    )
                                                }
                                            </div>
                                        </div>
                                       {/* <div className={cx("service-account")}>
                                            {batchShelfLeftInfor}
                                        </div>*/}
                                        <div>
                                            <Link to="/report/batchQuery/detail"><span className={cx("go-account")}>批次查询></span></Link>
                                        </div>
                                    </div>
                                    <div className={cx("service-hd-2st")}>
                                        {/*{intl.get("vipService.index.batchShelfLeft")}{intl.get("vipService.index.funcOpenTip")} <span className={cx("green")}>{intl.get("vipService.index.multipleLanguageTip2")}</span>*/}
                                        <div>
                                            <div className={cx("qq-link")}>
                                                <img src={qqLog} alt="tp"/>
                                            </div>
                                            <span onClick={()=>this.linkToQq()} className={cx("link-name")}>{intl.get("vipService.index.onlineService")}</span>
                                            <div className={cx("phone-link")}>
                                                <img src={phoneLog} alt="tp"/>
                                            </div>
                                            <span className={cx("link-name")}>{intl.get("vipService.index.phone")}</span>
                                            <a className={cx("go-account-link")} target="_blank" href="https://www.abiz.com/info/assistant-sfaq/63522.htm">{intl.get("vipService.index.watchDetail")}></a>
                                        </div>
                                    </div>
                                </div>
                                <h2 className={cx("vip-hd-name")}>
                                    批次保质期内容
                                </h2>
                                <div className={cx("added-package")}>
                                    <div className={cx("added-log")}>
                                        <img src={hs8} alt="tp"/>
                                    </div>
                                    <div className={cx("added-wild")}>
                                        <h3>批次保质期</h3>
                                        <p>食品、医药等保质期敏感物品支持通过批次保质期进行管理，</p>
                                        <p>精细化管理各批次物品出入库信息，实时展示即将到期与已到期物品库存。</p>
                                    </div>
                                </div>
                            </TabPane>
                            {/*<TabPane tab={"委外加工"} key="7">
                                <div className={cx("service-hd")}>
                                    <div className={cx("service-hd-lst")}>
                                        <div className={cx("service-hd-menu")}>
                                            <h3 className={cx("service-name")}>委外加工</h3>
                                            <div className={cx("service-price")}>
                                                <span>¥ 1000/年</span>
                                            </div>
                                        </div>
                                        <div className={cx("service-hd-des")}>
                                            <h2 className={cx("service-des")}>
                                                实现内外部产品加工管理，计算产成品的物料成本，生产管理更全面
                                            </h2>
                                            <div className={cx("vip-service-status")}>
                                                {subContractInfo}
                                            </div>
                                            <div className={cx("service-btn")}>
                                                {
                                                    subContract.vipState === 'NOT_OPEN' && (
                                                        <React.Fragment>
                                                            <AddPkgOpen
                                                                openVipSuccess={() => this.props.asyncFetchVipService()}
                                                                vipInfo={subContract}
                                                                source={'subContract'}
                                                                render={() => (
                                                                    <Button  type={"primary"}>{intl.get("vipService.index.freeUse")}</Button>
                                                                )}
                                                            />
                                                        </React.Fragment>
                                                    )
                                                }
                                                {
                                                    subContract.vipState !== 'NOT_OPEN' && (
                                                        <React.Fragment>
                                                            <Button onClick={()=>this.linkToQq()} type={"primary"}>{intl.get("vipService.index.extend_buy")}</Button>
                                                        </React.Fragment>
                                                    )
                                                }
                                            </div>
                                        </div>
                                         <div className={cx("service-account")}>
                                            {batchShelfLeftInfor}
                                        </div>
                                        <div>
                                            <Link to="/subcontract/"><span className={cx("go-account")}>委外加工></span></Link>
                                        </div>
                                    </div>
                                    <div className={cx("service-hd-2st")}>
                                        {intl.get("vipService.index.batchShelfLeft")}{intl.get("vipService.index.funcOpenTip")} <span className={cx("green")}>{intl.get("vipService.index.multipleLanguageTip2")}</span>
                                        <div>
                                            <div className={cx("qq-link")}>
                                                <img src={qqLog} alt="tp"/>
                                            </div>
                                            <span onClick={()=>this.linkToQq()} className={cx("link-name")}>{intl.get("vipService.index.onlineService")}</span>
                                            <div className={cx("phone-link")}>
                                                <img src={phoneLog} alt="tp"/>
                                            </div>
                                            <span className={cx("link-name")}>{intl.get("vipService.index.phone")}</span>
                                            <a className={cx("go-account-link")} target="_blank" href="https://www.abiz.com/info/assistant-sfaq/63522.htm">{intl.get("vipService.index.watchDetail")}></a>
                                        </div>
                                    </div>
                                </div>
                                <h2 className={cx("vip-hd-name")}>
                                    委外加工内容
                                </h2>
                                <div className={cx("added-package")}>
                                    <div className={cx("added-log")}>
                                        <img src={hs9} alt="tp"/>
                                    </div>
                                    <div className={cx("added-wild")}>
                                        <h3>委外加工</h3>
                                        <p>自有车间加工、委外加工业务，可通过委外加工模块实现原料的出库和成品的入库，</p>
                                        <p>同时根据原料出库成本及加工费用计算成品成本，帮助企业管理生产流程。</p>
                                    </div>
                                </div>
                            </TabPane>*/}
                            <TabPane tab={
                                <>
                                   <div className={cx("new-tab")}>
                                       生产管理
                                   </div>
                                </>} key="8">
                                <div className={cx("service-hd")}>
                                    <div className={cx("service-hd-lst")}>
                                        <div className={cx("service-hd-menu")}>
                                            <h3 className={cx("service-name")}>生产管理</h3>
                                            <div className={cx("service-price")}>
                                                <span>¥ 8000/年</span>
                                            </div>
                                        </div>
                                        <div className={cx("service-hd-des")}>
                                            <h2 className={cx("service-des")}>
                                                精细化进行生产管理，提升生产效率
                                            </h2>
                                            <div className={cx("vip-service-status")}>
                                                {productManageInfo}
                                            </div>
                                            <div className={cx("service-btn")}>
                                                {
                                                    productManage.vipState === 'NOT_OPEN' && (
                                                        <React.Fragment>
                                                            <AddPkgOpen
                                                                openVipSuccess={() => this.props.asyncFetchVipService()}
                                                                vipInfo={productManage}
                                                                source={'productManage'}
                                                                render={() => (
                                                                    <Button  type={"primary"}>{intl.get("vipService.index.freeUse")}</Button>
                                                                )}
                                                            />
                                                        </React.Fragment>
                                                    )
                                                }
                                                {
                                                    productManage.vipState !== 'NOT_OPEN' && (
                                                        <React.Fragment>
                                                            <Button onClick={()=>this.linkToQq()} type={"primary"}>{intl.get("vipService.index.extend_buy")}</Button>
                                                        </React.Fragment>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        {/* <div className={cx("service-account")}>
                                            {batchShelfLeftInfor}
                                        </div>*/}
                                        <div style={{position: "relative"}}>

                                            <div className={cx("btn-ls")}>
                                                <AddPkgOpen
                                                    onTryOrOpenCallback={() => {this.props.history.push('/productControl/mrpCount/list')}}
                                                    openVipSuccess={() => {this.props.history.push('/productControl/mrpCount/list')}}
                                                    vipInfo={productManage}
                                                    source={'productManage'}
                                                    module={1}
                                                    render={() => (
                                                        <a href="#!" className="fl"><span className={cx("go-account")}>MRP运算></span></a>
                                                    )}
                                                />
                                            </div>

                                            <div className={cx("btn-ls")}>
                                                <AddPkgOpen
                                                    onTryOrOpenCallback={() => {this.props.history.push('/produceOrder/')}}
                                                    openVipSuccess={() => {this.props.history.push('/produceOrder/')}}
                                                    vipInfo={productManage}
                                                    source={'productManage'}
                                                    module={2}
                                                    render={() => (
                                                        <a href="#!" className="fl"><span className={cx("go-account")}>生产单></span></a>
                                                    )}
                                                />
                                            </div>

                                            <div className={cx("btn-ls")}>
                                                <AddPkgOpen
                                                    onTryOrOpenCallback={() => {this.props.history.push('/productControl/')}}
                                                    openVipSuccess={() => {this.props.history.push('/productControl/')}}
                                                    vipInfo={productManage}
                                                    source={'productManage'}
                                                    module={4}
                                                    render={() => (
                                                        <a href="#!" className="fl"><span className={cx("go-account")}>工单信息></span></a>
                                                    )}
                                                />
                                            </div>


                                            {/*<div className={cx("btn-ls")}>*/}
                                                {/*<AddPkgOpen*/}
                                                    {/*openVipSuccess={() => this.props.asyncFetchVipService()}*/}
                                                    {/*vipInfo={productManage}*/}
                                                    {/*source={'productManage'}*/}
                                                    {/*render={() => (*/}
                                                        {/*<Link to="/subcontract/"><span className={cx("go-account")}>委外加工></span></Link>*/}
                                                    {/*)}*/}
                                                {/*/>*/}
                                            {/*</div>*/}
                                            {/*{*/}
                                                {/*//只有主账号可以看到该功能*/}
                                                {/*accountInfo.mainUserFlag?(*/}
                                                    {/*<div className={cx("btn-ls")}>*/}
                                                        {/*<span onClick={()=>this.openModal('accountReportVisible')} className={cx("go-account")}>报工账号></span>*/}
                                                    {/*</div>*/}
                                                {/*):null*/}
                                            {/*}*/}

                                        </div>
                                    </div>
                                    <div className={cx("service-hd-2st")}>
                                        {/*{intl.get("vipService.index.batchShelfLeft")}{intl.get("vipService.index.funcOpenTip")} <span className={cx("green")}>{intl.get("vipService.index.multipleLanguageTip2")}</span>*/}
                                        <div>
                                            <div className={cx("qq-link")}>
                                                <img src={qqLog} alt="tp"/>
                                            </div>
                                            <span onClick={()=>this.linkToQq()} className={cx("link-name")}>{intl.get("vipService.index.onlineService")}</span>
                                            <div className={cx("phone-link")}>
                                                <img src={phoneLog} alt="tp"/>
                                            </div>
                                            <span className={cx("link-name")}>{intl.get("vipService.index.phone")}</span>
                                            <a className={cx("go-account-link")} target="_blank" href="https://www.abiz.com/info/assistant-63573.htm">{intl.get("vipService.index.watchDetail")}></a>
                                        </div>
                                    </div>
                                </div>
                                <h2 className={cx("vip-hd-name")}>
                                    生产管理内容
                                </h2>

                                <div className={cx("added-package-3st")}>
                                    <div className={cx("added-log")}>
                                        <img src={hs13} alt="tp"/>
                                    </div>
                                    <div className={cx("added-wild")}>
                                        <h3>MRP运算</h3>
                                        <p>实现模拟生产，精准推算原材料缺货情况与日期，轻松应对 多变的市场需求</p>
                                    </div>
                                </div>
                                <div className={cx("added-package-3st")}>
                                    <div className={cx("added-log")}>
                                        <img src={hs14} alt="tp"/>
                                    </div>
                                    <div className={cx("added-wild")}>
                                        <h3>生产单</h3>
                                        <p>实现领料、退料、产成品入库并可快速流转生成派工单， 精准管理生产任务</p>
                                    </div>
                                </div>
                                {/*<div className={cx("added-package-3st")}>*/}
                                    {/*<div className={cx("added-log")}>*/}
                                        {/*<img src={hs15} alt="tp"/>*/}
                                    {/*</div>*/}
                                {/*</div>*/}
                            </TabPane>
                            <TabPane tab={
                                <>
                                    <div className={cx("new-tab")}>
                                        移动报工
                                    </div>
                                </>} key="9">
                                <div className={cx("service-hd")}>
                                    <div className={cx("service-hd-lst")}>
                                        <div className={cx("service-hd-menu")}>
                                            <h3 className={cx("service-name")}>移动报工</h3>
                                            <div className={cx("service-price")}>
                                                <span>¥ 3000/年</span>
                                            </div>
                                        </div>
                                        <div className={cx("service-hd-des")}>
                                            <h2 className={cx("service-des")}>
                                                移动报工
                                            </h2>
                                            <div className={cx("vip-service-status")}>
                                                {mobileWorkInfo}
                                            </div>
                                            <div className={cx("service-btn")}>
                                                {
                                                    mobileWork.vipState === 'NOT_OPEN' && (
                                                        <React.Fragment>
                                                            <AddPkgOpen
                                                                openVipSuccess={() => this.props.asyncFetchVipService()}
                                                                vipInfo={mobileWork}
                                                                source={'mobileWork'}
                                                                render={() => (
                                                                    <Button  type={"primary"}>{intl.get("vipService.index.freeUse")}</Button>
                                                                )}
                                                            />
                                                        </React.Fragment>
                                                    )
                                                }
                                                {
                                                    mobileWork.vipState !== 'NOT_OPEN' && (
                                                        <React.Fragment>
                                                            <Button onClick={()=>this.linkToQq()} type={"primary"}>{intl.get("vipService.index.extend_buy")}</Button>
                                                        </React.Fragment>
                                                    )
                                                }
                                               {/* {
                                                    (mobileWork.vipState === 'NOT_OPEN' || mobileWork.vipState === 'EXPIRED') && (*/}
                                                        {/*<React.Fragment>
                                                            <Button onClick={()=>this.linkToQq()} type={"primary"}>{intl.get("vipService.index.extend_buy")}</Button>
                                                        </React.Fragment>*/}
                                                   {/* )
                                                }*/}
                                            </div>
                                        </div>
                                        <div style={{position: "relative"}}>
                                            {
                                                //只有主账号可以看到该功能
                                                accountInfo.mainUserFlag?(
                                                    <div className={cx("btn-ls")}>
                                                        <AddPkgOpen
                                                            openVipSuccess={() => this.props.asyncFetchVipService()}
                                                            vipInfo={mobileWork}
                                                            source={'mobileWork'}
                                                            render={() => (
                                                                <span onClick={ (mobileWork.vipState === 'OPENED' || mobileWork.vipState === 'TRY')?()=>this.openModal('accountReportVisible'):null} className={cx("go-account")}>报工账号></span>
                                                            )}
                                                        />
                                                    </div>
                                                ):null
                                            }
                                        </div>
                                    </div>
                                    <div className={cx("service-hd-2st")}>
                                        {/*{intl.get("vipService.index.batchShelfLeft")}{intl.get("vipService.index.funcOpenTip")} <span className={cx("green")}>{intl.get("vipService.index.multipleLanguageTip2")}</span>*/}
                                        <div>
                                            <div className={cx("qq-link")}>
                                                <img src={qqLog} alt="tp"/>
                                            </div>
                                            <span onClick={()=>this.linkToQq()} className={cx("link-name")}>{intl.get("vipService.index.onlineService")}</span>
                                            <div className={cx("phone-link")}>
                                                <img src={phoneLog} alt="tp"/>
                                            </div>
                                            <span className={cx("link-name")}>{intl.get("vipService.index.phone")}</span>
                                            <a className={cx("go-account-link")} target="_blank" href="http://www.abiz.com/info/assfaq/63600.htm">{intl.get("vipService.index.watchDetail")}></a>
                                        </div>
                                    </div>
                                </div>
                                <h2 className={cx("vip-hd-name")}>
                                    移动报工内容
                                </h2>
                                <div className={cx("added-package-3st")}>
                                    <div className={cx("added-log")}>
                                        <img src={hs15} alt="tp"/>
                                    </div>
                                </div>
                            </TabPane>

                            <TabPane tab={intl.get("vipService.index.valueAddedPackage")} key="3">
                                <div className={cx("service-hd")}>
                                    <div className={cx("service-hd-lst")}>
                                        <div className={cx("service-hd-menu")}>
                                            <h3 style={{marginTop: "15px"}} className={cx("service-name")}>增值包</h3>
                                        </div>
                                        <div className={cx("service-hd-des")}>
                                            {addBtn}
                                        </div>
                                    </div>
                                    <div className={cx("service-hd-2st")}>
                                        <div>
                                            <div className={cx("qq-link")}>
                                                <img src={qqLog} alt="tp"/>
                                            </div>
                                            <span onClick={()=>this.linkToQq()} className={cx("link-name")}>{intl.get("vipService.index.onlineService")}</span>
                                            <div className={cx("phone-link")}>
                                                <img src={phoneLog} alt="tp"/>
                                            </div>
                                            <span className={cx("link-name")}>{intl.get("vipService.index.phone")}</span>
                                        </div>
                                    </div>
                                </div>
                                <h2 className={cx("vip-hd-name")}>
                                    {intl.get("vipService.index.valueAddedPackageContent")}
                                </h2>
                                <div className={cx("added-package")}>
                                    <div className={cx("added-log")}>
                                        <img src={hs1} alt="tp"/>
                                    </div>
                                    <div className={cx("added-wild")}>
                                        <h3>{intl.get("vipService.index.warehouse")}</h3>
                                        <p>{intl.get("vipService.index.warehouseContent")}</p>
                                    </div>
                                </div>
                              {/*  <div className={cx("added-package-2st")}>
                                    <div className={cx("added-log")}>
                                        <img src={hs2} alt="tp"/>
                                    </div>
                                    <div className={cx("added-wild")}>
                                        <h3>{intl.get("vipService.index.bom")}</h3>
                                        <p>{intl.get("vipService.index.bomContent1")}<br/>{intl.get("vipService.index.bomContent2")}</p>
                                    </div>
                                </div>*/}
                                <div className={cx("added-package-2st")}>
                                    <div className={cx("added-log")}>
                                        <img src={hs3} alt="tp"/>
                                    </div>
                                    <div className={cx("added-wild")}>
                                        <h3>{intl.get("vipService.index.print")}</h3>
                                        <p>{intl.get("vipService.index.printContent1")}<br />{intl.get("vipService.index.printContent2")}</p>
                                    </div>
                                </div>
                                <div className={cx("added-package-end")}>
                                    <div className={cx('added-package-more')}>
                                        {intl.get("vipService.index.moreFunctionOnShow")}
                                    </div>
                                </div>
                            </TabPane>

                            <TabPane tab={
                                <>
                                    <div className={cx("new-tab")}>
                                        <img src={HOT} className={cx('icon-new')}/>
                                        订单追踪平台
                                    </div>
                                </>} key="11">
                                <div className={cx("service-hd")}>
                                    <div className={cx("service-hd-lst")}>
                                        <div className={cx("service-hd-menu")}>
                                            <h3 className={cx("service-name")}>订单追踪平台</h3>
                                            <div className={cx("service-price")}>
                                                <span>¥ 10000+/年</span>
                                            </div>
                                        </div>
                                        <div className={cx("service-hd-des")}>
                                            <h2 className={cx("service-des")}>
                                                订单追踪平台
                                            </h2>
                                            <div className={cx("vip-service-status")}>
                                                {orderTrackInfo}
                                            </div>
                                            <div className={cx("service-btn")}>
                                                {
                                                    orderTrack.vipState === 'NOT_OPEN' && (
                                                        <React.Fragment>
                                                            <AddPkgOpen
                                                                openVipSuccess={() => this.props.asyncFetchVipService()}
                                                                vipInfo={orderTrack}
                                                                source={'orderTrack'}
                                                                render={() => (
                                                                    <Button  type={"primary"}>{intl.get("vipService.index.freeUse")}</Button>
                                                                )}
                                                            />
                                                        </React.Fragment>
                                                    )
                                                }
                                                {
                                                    orderTrack.vipState !== 'NOT_OPEN' && (
                                                        <React.Fragment>
                                                            <Button onClick={()=>this.linkToQq()} type={"primary"}>{intl.get("vipService.index.extend_buy")}</Button>
                                                        </React.Fragment>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className={cx("service-hd-2st")}>
                                        <div>
                                            <div className={cx("qq-link")}>
                                                <img src={qqLog} alt="tp"/>
                                            </div>
                                            <span onClick={()=>this.linkToQq()} className={cx("link-name")}>{intl.get("vipService.index.onlineService")}</span>
                                            <div className={cx("phone-link")}>
                                                <img src={phoneLog} alt="tp"/>
                                            </div>
                                            <span className={cx("link-name")}>{intl.get("vipService.index.phone")}</span>
                                            <a className={cx("go-account-link")} target="_blank" href="https://www.abiz.com/info/assfaq/63614.htm">{intl.get("vipService.index.watchDetail")}></a>
                                        </div>
                                    </div>
                                </div>
                                <h2 className={cx("vip-hd-name")}>
                                    订单追踪平台
                                </h2>
                                <div className={cx("added-package")}>
                                    <div className={cx("added-log")}>
                                        <img src={ddzz1} alt="tp"/>
                                    </div>
                                    <div className={cx("added-wild")}>
                                        <h3>订单追踪平台</h3>
                                        <p>支持给客户设置外部登录账号，客户可自助查看自己公司订单的生产、发货、物流、付款、发票进度。</p>
                                    </div>
                                </div>
                            </TabPane>

                            <TabPane tab={"短信提醒"} key="12">
                                <div className={cx("service-hd")}>
                                    <div className={cx("service-hd-lst")}>
                                        <div className={cx("service-hd-menu")}>
                                            <h3 className={cx("service-name")}>短信提醒</h3>
                                            {/*<div className={cx("service-price")}>
                                                <span>¥ 998+/年</span>
                                            </div>*/}
                                        </div>
                                        <div className={cx("service-hd-des")}>
                                            <h2 className={cx("service-des")}>
                                                短信提醒
                                            </h2>
                                            <div className={cx("vip-service-status")}>
                                                {smsNotifyInfo}
                                            </div>
                                            <div className={cx("sms-hd")}>
                                                可使用短信数: <span className={cx("sms-number")}>{this.state.smsNumber}</span>
                                            </div>
                                            <div className={cx("service-btn")}>
                                                {
                                                    smsNotify.vipState === 'NOT_OPEN' && (
                                                        <React.Fragment>
                                                            <AddPkgOpen
                                                                openVipSuccess={() => {
                                                                    this.props.asyncFetchVipService();
                                                                    this.loadSmsNumber();
                                                                }}
                                                                vipInfo={smsNotify}
                                                                source={'smsNotify'}
                                                                render={() => (
                                                                    <Button  type={"primary"}>{intl.get("vipService.index.freeUse")}</Button>
                                                                )}
                                                            />
                                                        </React.Fragment>
                                                    )
                                                }
                                                {
                                                    smsNotify.vipState !== 'NOT_OPEN' && (
                                                        <React.Fragment>
                                                            <Button onClick={()=>this.linkToQq()} type={"primary"}>{intl.get("vipService.index.extend_buy")}</Button>
                                                        </React.Fragment>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className={cx("service-hd-2st")}>
                                        <div>
                                            <div className={cx("qq-link")}>
                                                <img src={qqLog} alt="tp"/>
                                            </div>
                                            <span onClick={()=>this.linkToQq()} className={cx("link-name")}>{intl.get("vipService.index.onlineService")}</span>
                                            <div className={cx("phone-link")}>
                                                <img src={phoneLog} alt="tp"/>
                                            </div>
                                            <span className={cx("link-name")}>{intl.get("vipService.index.phone")}</span>
                                            {/*<a className={cx("go-account-link")} target="_blank" href="https://www.abiz.com/info/assfaq/63614.htm">{intl.get("vipService.index.watchDetail")}></a>*/}
                                        </div>
                                    </div>
                                </div>
                                <h2 className={cx("vip-hd-name")}>
                                    短信提醒
                                </h2>
                                <div className={cx("added-package-3st")}>
                                    <div className={cx("added-log")}>
                                        <img src={hs17} alt="tp"/>
                                    </div>
                                </div>
                            </TabPane>
                        </Tabs>
                    </div>
                </Content.ContentBd>
                <MallOpen
                    visible={this.state.completeComInfoVisible}
                    onClose={()=>this.closeModal('completeComInfoVisible')}
                    openSuccCallback={()=>{
                        message.success(intl.get("vipService.index.operateSuccessMessage"));
                        this.props.asyncFetchVipService();
                    }}
                />
                <Modal
                    title={intl.get("vipService.index.multipleAccountManagement")}
                    width={''}
                    className={cx("modal-mul-account") + " list-pop list-pop-no-footer"}
                    visible={this.state.mulAccountVisible}
                    onCancel={()=>this.closeModal('mulAccountVisible')}
                    destroyOnClose={true}
                    footer={null}
                >
                    <AccountIndex/>
                </Modal>
                <WarehouseIndex
                    visible={this.state.warehouseManageVisible}
                    onClose={()=>this.closeModal('warehouseManageVisible')}
                />
                <Modal
                    title={intl.get("vipService.index.bom")}
                    width={''}
                    className={cx("modal-mul-account")+ " list-pop list-pop-no-footer"}
                    visible={this.state.fittingVisible}
                    footer = {null}
                    onCancel={()=>this.closeModal('fittingVisible')}
                    destroyOnClose={true}
                >
                    <FittingIndex/>
                </Modal>
                {/*报工账号弹层*/}
                <Modal
                    title={"报工账号"}
                    width={''}
                    className={cx("modal-mul-account")+ " list-pop list-pop-no-footer"}
                    visible={this.state.accountReportVisible}
                    footer = {null}
                    onCancel={()=>this.closeModal('accountReportVisible')}
                    destroyOnClose={true}
                >
                    <AccountReport/>
                </Modal>
                <SwitchLanguage
                    onClose={()=>this.closeModal('languageVisible')}
                    visible={this.state.languageVisible}
                />
                {/*辅助资料弹层*/}
                <Auxiliary
                    defaultKey={this.state.auxiliaryKey}
                    visible={this.state.auxiliaryVisible}
                    defaultTabKey={this.state.auxiliaryTabKey}
                    onClose={this.handleClose.bind(this, 'auxiliaryVisible')}
                />
            </React.Fragment>

        )
    }
}
const mapStateToProps = (state) => ({
    vipService: state.getIn(['vipHome', 'vipService']),
    currentAccountInfo: state.getIn(['commonInfo', 'currentAccountInfo'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService,
        asyncFetchVipValueAdded: vipServiceHomeActions.asyncFetchVipValueAdded,
        asyncFetchGetSmsNotifyNum:  vipServiceHomeActions.asyncFetchGetSmsNotifyNum
    }, dispatch)

};
export default connect(mapStateToProps, mapDispatchToProps)(vipService)

