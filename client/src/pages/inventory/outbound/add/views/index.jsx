import React, {Component} from 'react';
import intl from 'react-intl-universal';
import _ from "lodash";
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import { Row, Col, Button, Input, message, Spin, Radio, Form, Modal } from 'antd';
import {withRouter} from "react-router-dom";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");

import Crumb from 'components/business/crumb';
import {newAddForm as AddForm, actions as addFormActions, formCreate}  from 'components/layout/addForm';
import Content from 'components/layout/content';
import {asyncAddSale, asyncFetchOutBoundOrderById,asyncFetchPreData} from '../actions';
import {actions as saleAddActions} from 'pages/sale/add';
import {actions as purchaseAddActions} from 'pages/purchase/add';
import {actions as inboundOrderShowActions} from 'pages/inventory/inbound/show';
import {actions as requisitionShowActions} from 'pages/purchase/requisitionOrder/show';
import {actions as supplierAddActions} from 'pages/supplier/add';
import {actions as customerAddActions} from 'pages/customer/add';
import {actions as addGoodsActions} from 'pages/goods/add';
import GoodsTableFieldConfigMenu, {actions as fieldConfigActions} from 'components/business/goodsTableFieldConfigMenu';
import LimitOnlineTip from 'components/business/limitOnlineTip';
import TaxToolTip from 'components/business/taxToolTip';
import {checkWareArriveUpperLimit, dealCheckWareUpperLimitData, actions as wareUpperLimitActions} from 'components/business/checkWareArriveUpperLimit';
import {actions as approveActions, SelectApproveItem, BACKEND_TYPES, withApprove} from  'components/business/approve';
import {addPage} from  'components/layout/listPage';
import {actions as vipOpeActions,withVipWrap} from "components/business/vipOpe";
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import {actions as rateAction} from 'pages/auxiliary/rate';
import {actions as commonActions} from "components/business/commonRequest";
import { withPreProcessProd, OutboundProdList as ProdList } from 'components/business/goods';
import CopyFromOrder from 'components/business/copyFromOrder';
import CopyFromSale from 'components/business/copyFromSale';
import formMap from '../dependencies/initFormMap';
import BaseInfo from './baseInfo';
import OtherInfo from './otherInfo';
import 'url-search-params-polyfill';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {getCookie} from 'utils/cookie';
import {fixedDecimal} from "utils/Decimal";
const cx = classNames.bind(styles);


const mapStateToProps = (state) => ({
    addSale: state.getIn(['outboundOrderAdd', 'addSale']),
    orderInfo: state.getIn(['outboundOrderAdd', 'orderInfo']),
    preData:  state.getIn(['outboundOrderAdd', 'preData']),
    inboundOrderShow: state.getIn(['inboundOrderShowIndex', 'inboundOrderShow']),
    saleInfo: state.getIn(['saleAdd', 'saleInfo']),
    goodsInfo: state.getIn(['goods', 'goodsInfo']),
    produceOrderInfo: state.getIn(['produceOrderShow', 'produceOrderInfo']),
    rateList: state.getIn(['auxiliaryRate', 'rateList']),
    goodsTableConfig: state.getIn(['goodsTableFieldConfigMenu', 'goodsTableConfig']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncAddSale,
        asyncFetchOutBoundOrderById,
        asyncFetchPreData,
        asyncFetchGoodsById: addGoodsActions.asyncFetchGoodsById,
        asyncRequisitionOrderShow: requisitionShowActions.asyncRequisitionOrderShow,
        asyncShowSupplier: supplierAddActions.asyncShowSupplier,
        asyncCustomerShow: customerAddActions.asyncCustomerShow,
        asyncCheckWareArriveUpperLimit: wareUpperLimitActions.asyncCheckWareArriveUpperLimit,
        setInitFinished: addFormActions.setInitFinished,
        asyncFetchExpressList: rateAction.asyncFetchExpressList,
        asyncBillNoShow: inboundOrderShowActions.asyncBillNoShow,
        asyncFetchSaleById: saleAddActions.asyncFetchSaleById,
        asyncFetchPurchaseById: purchaseAddActions.asyncFetchPurchaseById,
        asyncFetchGoodsDataByProdNo: purchaseAddActions.asyncFetchGoodsDataByProdNo,
        asyncGetApproveStatus: approveActions.asyncGetApproveStatus,
        asyncOpenVipAndSendRequestToOss: vipOpeActions.asyncOpenVipAndSendRequestToOss,
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService,
        asyncFetchGetContinueCreate: commonActions.asyncFetchGetContinueCreate,
        asyncFetchSetContinueCreate: commonActions.asyncFetchSetContinueCreate,
        emptyFieldConfig: fieldConfigActions.emptyFieldConfig,
        asyncSaveFieldConfig: fieldConfigActions.asyncSaveFieldConfig
    }, dispatch)
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
@withPreProcessProd
@withVipWrap
@withApprove
@formCreate
export default class Outbound extends addPage {
    formRef = React.createRef();
    dataPrefix = 'prod';
    source='OUTBOUND_SALE';
    fieldConfigType = 'wareOut';
    crumbMap = {
        6:{
            add: "新建委外领料",
            editor: "修改委外领料",
        },
        7:{
            add: "新建生产领料单",
            editor: "修改生产领料单"
        }
    }
    getProdRef = (prodRef)=>{
        this.prodRef = prodRef;
    };
    getOtherInfoRef = (otherInfoRef) => {
        this.otherInfoRef = otherInfoRef
    };
    getBaseRef = (baseInfoRef) => {
        this.baseInfoRef = baseInfoRef
    };

    static formItemLayout = {
        labelCol: {
            xs: {span: 24},
            sm: {span: 8},
        },
        wrapperCol: {
            xs: {span: 24},
            sm: {span: 16},
        }
    };

    constructor(props) {
        super(props);
        let outType =  props.location.searchObj.outType || '2';
        if(outType !== '2') this.source = "OUTBOUND";
        this.state={
            saleOrderPopVisible: false,
            purchaseOrderPopVisible: false,
            option:'add',
            approveFlag: 0,
            showTip: false,
            isCopy: false,
            customerNo: null,
            outType: Number(outType),
            fkProduceNo: props.location.searchObj.fkProduceNo || '',
            outBoundType: [
                {type: "内部领用", value: 0},
                {type: "销售出库", value: 2},
                {type: "采购退货", value: 3},
                {type: "其他出库", value: 4}
            ],
            selectApprove: false,  // 选择审批流弹层
            approveModuleFlag: 0,  // 当前模块是否开启审批权限 0 无 1 有
            approveStatus: 0,   //审批状态 0 未提交  1 通过  2 反驳  3 审批中
            submitData: {}, // 新增最终提交表单的信息
            continueAddFlag: true,  //连续新增Flag
            typeKey: "OutWarehouse",
        };
    }

    componentDidMount() {
        this.props.asyncFetchVipService();
        this.preDataProcess();
    }

    componentWillUnmount () {
        // 保存字段配置
        this.props.asyncSaveFieldConfig(this.fieldConfigType);
        this.props.emptyFieldConfig();
    }

    // 初始化数据的流程
    preDataProcess = async () => {
        const {match} = this.props;
        //修改页面或复制页面
        let id = match.params.id || match.params.copyId;
        let params = new URLSearchParams(this.props.location.search);
        const fkInboundBillNo = params && params.get('fkInboundBillNo')||"";  //入库单到出库单
        const fkPurchaseBillNo = params && params.get('fkPurchaseBillNo')||""; // 采购单到出库单
        const fkSaleBillNo = params && params.get('fkBillNo')||""; //销售到出库单
        const requisitionOrderNo = params && params.get('requisitionOrderNo') || ""; // 请购单号到出库单
        const productCode = params && params.get('productCode');    // 单独带入的物品信息
        let isCopy = match.params.copyId?true:false;
        this.setState({isCopy:isCopy});
        await this.initPreData(id);
        await this.initRate();
        id && await this.initModifyData(id);
        productCode && await this.initSingleGoods(productCode);
        fkInboundBillNo && await this.initFkInBoundBillNoShow(fkInboundBillNo);
        fkSaleBillNo && await this.initFkSaleBillNo(fkSaleBillNo);
        fkPurchaseBillNo && await this.initFkPurchaseBillNo(fkPurchaseBillNo);
        requisitionOrderNo && await this.fillRequisition(requisitionOrderNo);
        this.getContinueCreateFlag();
        this.props.setInitFinished();
        // 当 outType === 7 时，即 生产领料出库单时， 从生产单代入数据
        if(params && (params.get('outType')==='7')) this.initOutboundReceiveMaterial();
        // outType === 6  委外领料出库单
        if(params && (params.get('outType')==='6')) this.initOutboundReceiveMaterialForTypeSix();
    };

    /** 初始化 普通 物品数据 */
    initCommonProdInfo = (prodList) => {
        this.props.asyncFetchGoodsDataByProdNo(prodList,(data)=>{
            let {rateList, preProcessProd} = this.props;
            let taxRate = rateList && rateList.getIn(['rate', 'defaultValue']);
            let prodInfo = data.data || [];
            prodInfo = preProcessProd({type: 'goods', source: this.source, defaultForm: {taxRate}, lists: prodInfo});
            // 填充物品数据
            this.prodRef.props.fillList(prodInfo, null, ()=> {
                // 计算合计
                this.prodRef.props.calcTotal();
            });
        });
    };

    /** 初始化只存在一条物品信息的数据 */
    initSingleGoods = (productCode) => {
        return new Promise((resolve, reject) => {
            let params = new URLSearchParams(this.props.location.search);
            let batchNo = params && params.get('batchNo');
            let expirationDate = params && params.get('expirationDate');
            let productionDate = params && params.get('productionDate');
            let quantity = params && params.get('quantity');
            if(expirationDate) expirationDate = _.parseInt(expirationDate);
            if(productionDate) productionDate = _.parseInt(productionDate);
            this.props.asyncFetchGoodsById(productCode, res => {
                if (res.get('retCode') === '0') {
                    let list = res.get('data') && res.get('data').toJS() || {};
                    list = {...list, batchNo, expirationDate, productionDate, quantity};
                    let good = this.props.preProcessProd({type: 'goods', source: this.source, list});
                    // 填充物品数据
                    this.prodRef.props.fillList([good], null, ()=> {
                        // 计算合计
                        this.prodRef.props.calcTotal();
                    });
                }
                resolve();
            });
        })
    };

    /** 初始化请购单数据到出库单物品数据 */
    fillRequisition = (requisitionOrderNo) => {
        return new Promise((resolve, reject) => {
            this.props.asyncRequisitionOrderShow(requisitionOrderNo, (res) => {
                let data = res.data || {};
                this.initForm({
                    useDepartment: data.departmentName,
                    usePerson: data.employeeName,
                    projectName: data.projectName,
                    outType: 0,  // 内部领用
                });
                let prodList = data.prodList && data.prodList.map(item => {
                    return {
                        code: item.prodNo,
                        quantity: item.quantity
                    }
                }) || [];
                this.initCommonProdInfo(prodList);
                resolve();
            });
        })
    };

    // 初始化退料出库
    initOutboundReceiveMaterial = () => {
        let params = new URLSearchParams(this.props.location.search);
        let formMap = {
            fkProduceNo: params.get('fkProduceNo'),
            useDepartment: params.get('departmentName'),
            usePerson: params.get('employeeName')
        };
        if(params.get('warehouseName')) formMap.warehouseName = params.get('warehouseName');
        this.initForm(formMap);

        let arrDataJson = JSON.parse(window.localStorage.getItem('outboundReceiveMaterial_arrData'));
        this.initCommonProdInfo(arrDataJson);
    };

    // 初始化委外领料出库
    initOutboundReceiveMaterialForTypeSix= () => {
        let params = new URLSearchParams(this.props.location.search);
        let formMap = {
            fkProduceNo: params.get('fkProduceNo'),
            supplierName: params.get('supplierName'),
            fkSupplierNo: params.get('supplierCode'),
            supplierContacterName: params.get('contacterName'),
            supplierTelNo: params.get('contacterTelNo'),
            warehouseName: params.get('warehouseName')
        };
        this.initForm(formMap);
        let arrDataJson = JSON.parse(window.localStorage.getItem('outboundReceiveMaterial_arrData'));
        this.initCommonProdInfo(arrDataJson);
    };

    // 初始化数据
    initPreData = (id) => {
        return new Promise((resolve, reject) => {
            this.props.asyncFetchPreData(data=> {
                if (data.retCode === '0') {
                    //设置仓库的默认值
                    const warehouses = data.warehouses;
                    let inintWareHouses;
                    if (warehouses) {
                        let dataWareHouses = warehouses;
                        dataWareHouses.forEach(function (element, index, arr1) {
                            if (element.isCommon == 1) {
                                inintWareHouses = element.name;
                                return
                            }
                        })
                    }
                    if (data && data.tags) {
                        const { outType } = this.state;
                        if (!id) {
                            this.formRef.current.setFieldsValue({
                                warehouseName: inintWareHouses
                            });
                        }
                        this.setState({tags: data.tags, outType}, () => {
                            this.initForm({outType});
                        });
                    }
                    resolve();
                }
            })
        });
    };
    // 初始化税率
    initRate = () => {
        return new Promise((resolve, reject) => {
            this.props.asyncFetchExpressList('rate', (rateList)=>{
                let commonSelectedValue = 0;
                const rateListData = rateList.get('data');
                rateListData.forEach(item=>{
                    if(item.get('isCommon') === 1){
                        commonSelectedValue = item.get('paramName');
                    }
                });
                this.prodRef.props.fillList([{taxRate: commonSelectedValue}]);
                resolve();
            });
        });
    };
    // 初始化修改数据
    initModifyData = (id) => {
        const {match} = this.props;
        let isCopy = match.params.copyId?true:false;
        this.setState({option:'edit'});
        return new Promise((resolve, reject) => {
            this.props.asyncFetchOutBoundOrderById(id, data=>{
                let order = data.data||{};
                // 初始化修改物品
                let prodList = this.props.preProcessProd({type: 'modify', source: this.source, lists: order.prodList});
                let _this = this;
                // 设置当前单据的审批状态
                this.setState({
                    approveStatus: data.data.approveStatus,
                    approveModuleFlag: data.approveModuleFlag
                });
                if(data.retCode == "1"){
                    Modal.warning({
                        title: intl.get("outbound.add.index.warningTip"),
                        okText: intl.get("outbound.add.index.okText"),
                        content: `${data.retMsg}`,
                        onOk() {
                            _this.props.history.goBack();
                        }
                    });
                    reject();
                }
                this.setState({approveFlag:data.approveFlag});
                console.log(order, 'order');
                order.outType !== 2 ? this.source = "OUTBOUND": 'OUTBOUND_SALE';
                order.tags && this.setState({tags:order.tags});
                if(order.approveStatus == 1 && data.approveFlag == 1 && !isCopy){
                    this.setState({approveStatus:order.approveStatus});
                    Modal.warning({
                        title: intl.get("outbound.add.index.warningTip"),
                        okText: intl.get("outbound.add.index.okText"),
                        content: intl.get("outbound.add.index.orderHasApproveTipContent"),
                        onOk() {
                            _this.props.history.goBack();
                        }
                    });
                    reject();
                }
                this.initForm(order);
                // 初始化物品表单数据
                this.initProdForm(prodList);
                // 初始化合计
                this.initFormTotal(order);
                // 处理自定义字段
                this.setState({tags:data.tags});
                resolve();
            })
        })
    };

    /** 初始化入库单到出库单物品数据 */
    initFkInboundProdInfo = (prodList) => {
        this.props.asyncFetchGoodsDataByProdNo(prodList,(data)=>{
            let {preProcessProd} = this.props;
            let prodInfo = data.data || [];
            prodInfo = _.map(prodInfo, (item, index) => {
                return {
                    ...item,
                    orderPrice: 0,
                    unitPrice: prodList[index].unitPrice
                }
            });
            prodInfo = preProcessProd({type: 'goods', source: this.source, defaultForm: null, lists: prodInfo});
            // 填充物品数据
            this.prodRef.props.fillList(prodInfo, null);
        });
    };

    /** 入库单到出库单 */
    initFkInBoundBillNoShow = (billNo) => {
        return new Promise((resolve, reject) => {
            this.props.asyncBillNoShow(billNo,data=>{
                let order = data.data||{};
                let prodList = order.prodList && order.prodList.map(item => {
                    return {
                        code: item.prodNo,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice
                    }
                }) || [];
                this.initForm({
                    projectName: order.projectName,
                    ourContacterName:  order.ourContacterName,
                    deliveryAddress: order.deliveryAddress?order.deliveryProvinceCode+ ' '+
                        order.deliveryProvinceText+ ' '+
                        order.deliveryCityCode+ ' '+
                        order.deliveryCityText + ' '+
                        order.deliveryAddress: ''
                });
                // 初始化入库单到出库单物品数据
                this.initFkInboundProdInfo(prodList);
                resolve();
            });
        });
    };

    /** 销售到出库单 */
    initFkSaleBillNo = (fkSaleOrderBillNo) => {
        return new Promise((resolve, reject) => {
            this.props.asyncFetchSaleById(fkSaleOrderBillNo,data=>{
                let order = data.data||{};
                let prodList = order.prodList && order.prodList.map(item => {
                    return {
                        code: item.productCode,
                        quantity: item.quantity,
                    }
                }) || [];
                order.fkCustomerNo = order.customerNo;
                order.fkSaleOrderBillNo = fkSaleOrderBillNo;
                this.initForm(order);
                // 初始化采购单到出库单物品数据
                this.initCommonProdInfo(prodList);
            });
            resolve();
        });
    };

    /** 采购退货单到出库单 */
    initFkPurchaseBillNo = (fkPurchaseBillNo) => {
        return new Promise((resolve, reject) => {
            this.props.asyncFetchPurchaseById(fkPurchaseBillNo,data=>{
                let order = data.data||{};
                let prodList = order.prodList && order.prodList.map(item => {
                    return {
                        code: item.productCode,
                        unitPrice: item.unitPrice,
                        taxRate: item.taxRate,
                        remarks: item.remarks
                    }
                }) || [];
                let out = {};
                out.fkOrderBillNo = fkPurchaseBillNo;
                out.fkSupplierNo = order.supplierCode;
                out.supplierName = order.supplierName;
                out.supplierContacterName = order.supplierContacterName;
                out.supplierTelNo = order.supplierMobile;
                out.projectName = order.projectName;
                out.ourContacterName = order.ourContacterName;
                this.initForm(out);
                // 初始化采购单到出库单物品数据
                this.initFkPurchaseProdInfo(prodList);
            });
            resolve();
        });
    };

    /** 初始化采购单到出库单物品数据 */
    initFkPurchaseProdInfo = (prodList) => {
        this.props.asyncFetchGoodsDataByProdNo(prodList,(data)=>{
            let {preProcessProd} = this.props;
            let prodInfo = data.data || [];
            prodInfo = _.map(prodInfo, (item, index) => {
                return {
                    ...item,
                    quantity: null,
                    orderPrice: null,
                    unitPrice: prodList[index].unitPrice,
                    taxRate: prodList[index].taxRate,
                    remarks: prodList[index].remarks
                }
            });
            prodInfo = preProcessProd({type: 'goods', source: this.source, defaultForm: null, lists: prodInfo});
            // 填充物品数据
            this.prodRef.props.fillList(prodInfo, null);
        });
    };

    /** 初始化合计 */
    initFormTotal = (info) => {
        let {taxAllAmount: totalAmount, totalQuantity,
            aggregateAmount, discountAmount} = info;
        this.prodRef.props.setTotalForm({totalQuantity, totalAmount, aggregateAmount, discountAmount});
    };

    /** 初始化物品表单数据 */
    initProdForm = (prodList, source, callback) => {
        if(prodList && prodList.length > 0){
            this.prodRef.props.fillList(prodList, source, () => {
                callback && callback();
            });
        }
    };

    /** 初始化时给表单赋值 */
    initForm = (info)=>{
        info = this.initFormData(info);
        this.initFormField(formMap, info);
    };

    /** 初始化表单数据 */
    initFormData = (info) => {
        if(info.billNo){
            this.baseInfoRef.handleSelectCustomer(info.fkCustomerNo, (deliveryAddrData)=>{
                this.baseInfoRef.setState({deliveryAddrData});
                this.setFormFieldByAddress(formMap, 'deliveryAddress', info);
            });
            info.fkCustomerNo && this.onChangeCustomerNo(info.fkCustomerNo);
        }
        if(info.outType === 0 || info.outType){
            //如果是复制进的新建页，入库类型可能会新建页面不存在的。就更改其默认设置
            let existOutType = [0,2,3,4,6,7];
            (existOutType.indexOf(info.outType)!== -1)?null:(info.outType=2);
            this.setState({outType: info.outType});
        }
        let params = new URLSearchParams(this.props.location.search);
        const warehouseName = params && params.get('warehouseName');
        if(warehouseName){
            info.warehouseName = warehouseName;
        }
        info = this.initFormTags(info, 'propertyValue');
        return info;
    };

    /** 处理自定义字段 */
    dealCustomField = (values)=>{
        // 处理自定义字段
        // 需要和后端确认分别在什么时候使用propValue1和property_value1
        let tempArr = [];
        if(values.propName){
            values.propName.forEach((item,index)=>{
                if(item){
                    values['propertyValue'+values.mappingName[index].slice(-1)] = values.propValue[index];
                    tempArr.push({
                        mappingName: values.mappingName[index],
                        propValue: values.propValue[index],
                        propName: values.propName[index],
                        customInfoType:'OutWareCustomPropInfo'
                    });
                }
            });
        }
        values.dataTagList = tempArr;
        values.dataTagList.forEach((item)=>{
            this.state.tags.some((tag)=>{
                if(tag.mappingName==item.mappingName){
                    item.id = tag.id;
                }
            })
        });
    };

    /** 处理交货地址 */
    dealAddress = (values) => {
        if(values.deliveryAddress){
            let arr = values.deliveryAddress.split(' ');
            if(values.deliveryAddress && arr.length>1){
                values.outProvinceCode = arr[0];
                values.outCityCode = arr[2];
                values.outAddress = arr[4]
            } else {
                values.outProvinceCode = arr[0];
                values.outCityCode = arr[2];
                values.outAddress = values.deliveryAddress;
            }
        }
    };

    /** 处理物品列表*/
    dealProdList = (values) => {
        let prodList = _.filter(values.prod, (item) => item);
        let formData = this.prodRef.props.formData;
        prodList = _.map(prodList, (item, idx) => {
            let {itemPropertyValue1,itemPropertyValue2,itemPropertyValue3,itemPropertyValue4,itemPropertyValue5,serialNumber,...out} = item;
            let {amount,diasbleFlag,key,orderPrice,quantity,recQuantity,salePrice,
                serial,tax,taxRate,unitConverterText,unitPrice,untaxedAmount,
                untaxedPrice,wareIsFetching,...form} = formData[idx];
            out.propertyValues = {
                property_value1: itemPropertyValue1,
                property_value2: itemPropertyValue2,
                property_value3: itemPropertyValue3,
                property_value4: itemPropertyValue4,
                property_value5: itemPropertyValue5
            };
            if(serialNumber) {
                out.serialNumberList = serialNumber.split(',');
            }
            out.unit = (!form.unit) ? item.recUnit : form.unit;
            return {...form, ...out};
        });
        delete values[this.dataPrefix];
        values.prodList = prodList;
    };

    /** 处理其他信息*/
    dealOtherInfo = (values) => {
        let params = new URLSearchParams(this.props.location.search);
        const billNo = params && params.get('billNo')||"";
        const fkBillNo = params && params.get('fkBillNo')||"";
        if(this.props.match.params.copyId || billNo || fkBillNo){
            values.billNo = "";
        }
        values.fileIds = this.otherInfoRef.state.fileList.map(item => item.response.fileId);
        values.discountAmount = values.discountAmount || 0;
        if(values.customer){
            values.fkCustomerNo = values.customer.key;
            values.customerName = values.customer.label;
        }
        if(values.supplier){
            values.fkSupplierNo = values.supplier.key;
            values.supplierName = values.supplier.label;
        }
    };

    /** 处理表单提交数据*/
    dealSubmitFormInfo = (values) => {
        this.dealCustomField(values); //处理自定义字段
        this.dealAddress(values);   // 处理地址
        this.dealProdList(values);  // 处理物品列表
        this.dealOtherInfo(values);  // 处理其他信息
    };

    /** 校验库存上限*/
    validateWarehouseArriveUpperLimit = (module, values) => {
        let _this = this;
        return new Promise(function (resolve, reject) {
            let {billNo, prodList, warehouseName} = values;
            let initWareParams = dealCheckWareUpperLimitData(billNo, prodList, warehouseName, module);
            _this.props.asyncCheckWareArriveUpperLimit(initWareParams, (res) => {  // 校验是否达到上限
                //data 为 0没有负库存  1有负库存且允许负库存  2有负库存且不允许负库存
                //prodList为返回的Data数据
                if(res.data === 1) {
                    checkWareArriveUpperLimit(res, module, ()=> resolve(), ()=> reject());
                }else if(res.data === 2) {
                    checkWareArriveUpperLimit(res, module, ()=>reject(), ()=>reject());
                }else{
                    resolve();
                }
            });
        })
    };

    /** 校验审批操作*/
    validateApproveStatus = (module, values) => {
        let {match} = this.props;
        let {approveModuleFlag, approveStatus} = this.state;
        let _this = this;
        return new Promise(function (resolve, reject) {
            _this.setState({submitData: values},() => {
                _this.props.submitApproveProcess(() => {
                    _this.cancelApproveOperate();  // 取消操作
                    reject();
                }, () => {
                    // 非复制状态， 且当前单据的审批状态为反驳状态 2，则直接提交
                    if(!match.params.copyId && approveModuleFlag===1 && approveStatus===2) {
                        _this.cancelApproveOperate(true);
                    } else {
                        _this.openModal('selectApprove'); // 否则进入审批流的过程，并提交表单
                    }
                    reject();
                });
            });
        });
    };

    /**  校验仓库的Vip是否到期 */
    validateWarehouseVip = (module, values) => {
        const {preData} = this.props;
        const warehouses = preData && preData.getIn(['data','warehouses']);
        let commonWarehouse = '';
        warehouses.map((item)=>{
            if(item.get('isCommon') === 1){
                commonWarehouse = item.get('name');
            }
        });
        //处理仓库是否为常用仓库
        let _this = this;
        return new Promise(function (resolve, reject) {
            if(commonWarehouse === values.warehouseName){
                resolve()
            }else{
                //判断增值包vip是否到期
                _this.props.vipTipPop({source:"warehouse",expireCallback:()=>{
                        reject()
                    },onTryOrOpenCallback:()=>{
                        resolve()
                    }})
            }
        });
    };

    /** 校验批次保质期 */
    validateExpirationDate = (module, values) => {
        //判断否是保质期物品
        let prodList = values.prodList;
        let flag = false;

        for(let i=0;i<prodList.length;i++){
            if(prodList[i].expirationFlag){
                flag = true;
                break
            }
        }
        let _this = this;
        return new Promise(function (resolve, reject) {
            if(!flag){
                resolve()
            }else{
                //判断保质期vip是否到期
                _this.props.vipTipPop({source:"batchShelfLeft",expireCallback:()=>{
                        reject()
                    },onTryOrOpenCallback:()=>{
                        resolve()
                    }})

            }
        })
    };

    /** 返回审批状态 */
    backApproveFlag = (module) => {
        let _this = this;
        return new Promise(function (resolve, reject) {
            _this.props.asyncGetApproveStatus({types: BACKEND_TYPES[module]}, (res) => {
                if(res.data.retCode === "0") {
                    resolve(res.data.data==="1")
                } else {
                    reject();
                }
            });
        });
    };


    /**  后端校验工作，如符合条件则提交表单 */
    backendValidateAndSubmit = async (module, values) => {
        /** 校验库存上限*/
        await this.validateWarehouseArriveUpperLimit(module, values);
        /**  校验仓库的Vip是否到期 */
        await this.validateWarehouseVip(module, values);
        /**  审批是否开启*/
        if(await this.backApproveFlag(module)){  // 审批开启
            /** 校验审批操作,如果符合条件，执行提交操作，审批为所有操作最后一步*/
            await this.validateApproveStatus(module, values);
        } else {
            /** 审批未开启 执行保质期相关校验 */
            await this.validateExpirationDate(module, values);
            await new Promise( (resolve, reject) => {
                this.setState({submitData: values}, () => {
                    this.cancelApproveOperate();
                    reject();
                });
            })
        }
    };

    handleSubmit = async (values) => {
        //如果审核状态为已审核，不允许修改
        if(this.state.approveStatus == 1  && this.state.approveFlag ==1 && !this.state.isCopy){
            message.error(intl.get("outbound.add.index.handleSubmitErrorMsg"));
            return false;
        }
        /** 处理表单提交数据 */
        this.dealSubmitFormInfo(values);
        /** 后端校验工作，如符合条件则提交表单*/
        await this.backendValidateAndSubmit('outbound', values);
        /** 提交表单数据 */
        this.asyncSubmit();
    };

    // 提交表单数据（新加）***
    asyncSubmit=()=> {
        let values = this.state.submitData;
        this.props.asyncAddSale(values.billNo, values, (res) => {
            if (res.data.retCode === "0") {
                let displayId = res.data.data;
                message.success(intl.get("outbound.add.index.operateSuccessMessage"));
                this.props.emptyFieldChange();
                let continueAddFlag = !this.props.match.params.id && this.state.continueAddFlag;
                if(this.state.outType === 7) continueAddFlag = false; // 领料出库不要连续提交
                let url = continueAddFlag ? '/blank' :`/inventory/outbound/show/${displayId}`;
                this.props.history.push(url);
                if(continueAddFlag) this.props.history.replace('/inventory/outbound/add');
            }else if (res.data.retCode == '2019'){
                Modal.info({
                    icon: <ExclamationCircleOutlined/>,
                    title: intl.get("outbound.add.index.warningTip"),
                    content: (
                        <div>
                            <p>{intl.get("outbound.add.index.vipExpireTip")}</p>
                            <a style={{color:'#0066dd'}} target="_blank" href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true">{intl.get("outbound.add.index.treatyText")}</a>
                        </div>
                    )
                });
                return false;
            } else {
                if(res.data && res.data.retCode == undefined &&!res.data.status){
                    this.setState({showTip:true})
                }else{
                    //alert(res.data.retMsg);
                    Modal.error({
                        title: intl.get("outbound.add.index.warningTip"),
                        content: (res.data.retValidationMsg && res.data.retValidationMsg.msg && res.data.retValidationMsg.msg[0].msg)||res.data.retMsg
                    });
                }
            }
        })
    };

    selectGoods = (ids,visibleKey)=>{
        this.openModal(visibleKey);
    };

    /** 处理采购弹层物品数据*/
    handlePurchaseOrderPopOnOK = ({prodList, ...data}, visibleKey) => {
        // 清空所有物品表单数据
        this.prodRef.props.clearAllRows(() => {
            let {rateList, preProcessProd} = this.props;
            let taxRate = rateList && rateList.getIn(['rate', 'defaultValue']);
            this.handleCopyFromPurchase(data);
            // 关闭弹层
            this.closeModal(visibleKey);
            // 初始化物从采购复制弹层物品
            prodList = preProcessProd({type: 'copyOrderPop', source: this.source, lists: prodList, defaultForm: {taxRate}});
            // 填充物品数据
            this.prodRef.props.fillList(prodList, null, () => {
                // 计算合计
                this.prodRef.props.calcTotal();
            });
        });
    };

    /** 处理销售弹层物品数据*/
    handleSaleOrderPopOnOK = ({prodList, ...data}, visibleKey) => {
        console.log(data,'data');
        // 清空所有物品表单数据
        this.prodRef.props.clearAllRows(() => {
            let {rateList, preProcessProd} = this.props;
            let taxRate = rateList && rateList.getIn(['rate', 'defaultValue']);
            this.handleCopyFromSale(data);
            // 关闭弹层
            this.closeModal(visibleKey);
            // 初始化物从销售复制弹层物品
            prodList = preProcessProd({type: 'copyOrderPop', source: this.source, lists: prodList, defaultForm: {taxRate}});
            // 填充物品数据
            this.prodRef.props.fillList(prodList, null, () => {
                // 计算合计
                this.prodRef.props.calcTotal();
            });
        });
    };

    handleCopyFromSale=(data)=>{
        this.formRef.current.setFieldsValue({
            'fkSaleOrderBillNo': data.billNo,
            'projectName': data.projectName,
            'ourName': data.ourName,
            'ourContacterName':  data.ourContacterName,
            'ourMobile': data.ourTelNo,
            'remarks':  data.remarks,
            'customer':{
                key: data.customerNo,
                label: data.customerName
            },
            'customerContacterName': data.customerContacterName,
            'customerTelNo': data.customerTelNo,
            'deliveryAddress': data.deliveryAddress?data.deliveryProvinceCode+ ' '+
                data.deliveryProvinceText+ ' '+
                data.deliveryCityCode+ ' '+
                data.deliveryCityText + ' '+
                data.deliveryAddress:''
        });

        //交货地址下拉列表必须先填充客户，然后根据客户编号发一个请求去拉交货地址列表，列表数据出来才能去填充选中的交货地址
        if(data.customerNo){
            this.baseInfoRef.handleSelectCustomer(data.customerNo, ()=>{
                this.formRef.current.setFieldsValue({
                    'deliveryAddress': data.deliveryAddress?data.deliveryProvinceCode+ ' '+
                        data.deliveryProvinceText+ ' '+
                        data.deliveryCityCode+ ' '+
                        data.deliveryCityText + ' '+
                        data.deliveryAddress:'',
                    'customerOrderNo': data.customerOrderNo==null?'--':data.customerOrderNo
                });
            });
            this.onChangeCustomerNo(data.customerNo);
        }
    };

    handleCopyFromPurchase=(data)=>{
        let info = {
            fkSupplierNo: data.supplierCode,
            supplierName: data.supplierName,
            projectName: data.projectName,
            supplierContacterName: data.supplierContacterName,
            supplierTelNo: data.supplierMobile,
            ourContacterName: data.ourContacterName,
            fkOrderBillNo: data.billNo
        };
        this.initForm(info);
    };

    // 填充仓库
    onFillWarehouse = (warehouseName) => {
        let {setFieldsValue}  = this.formRef.current;
        setFieldsValue({ warehouseName });
    };

    closeModals = () =>{
        this.setState({showTip:false})
    };

    onChangeCustomerNo = (customerNo) => {
        this.setState({customerNo});
    };


    resetDefaultFields = ()=>{
        const {match} = this.props;
        const id = match.params.id;
        if(id){
            this.props.asyncFetchOutBoundOrderById(id, ()=>{
                this.props.setInitFinished();
            })
        }else{
            this.props.asyncFetchPreData(()=>{
                this.props.setInitFinished();
            });
        }
    };

    render() {

        const {orderInfo, preData, match, goodsTableConfig, rateList} = this.props;
        const {outType, purchaseOrderPopVisible, saleOrderPopVisible, customerNo} = this.state;

        let listFields, prodFields;
        // 默认税率
        let taxRate = rateList && rateList.getIn(['rate', 'defaultValue']);
        if(match.params.id){
            listFields  = orderInfo && orderInfo.getIn(['data', 'listFields']);
            prodFields = orderInfo && orderInfo.getIn(['data', 'prodDataTags']);
        }else{
            listFields  = preData && preData.getIn(['data', 'listFields']);
            prodFields = preData && preData.getIn(['data', 'prodDataTags']);
        }

        let id = match.params.id || match.params.copyId;

        let orderInfoData,
            baseInfo;
        if(id){
            orderInfoData = orderInfo && orderInfo.getIn(['data', 'data']);
            if(orderInfoData && orderInfoData.get('billNo')===id){  //只有id与订单里的billNo一致，在重新渲染
                baseInfo = orderInfoData;
            }
        }

        let setContinueAddFlag = this.setContinueAddFlag;
        if(outType === 7) {
            setContinueAddFlag = null;
        }

        console.log(outType,'outType');

        return (
            <React.Fragment>
                <Content.ContentHd>
                    <Crumb data={[
                        {
                            url: '/inventory/outbound/',
                            title: intl.get("outbound.add.index.outbound")
                        },
                        {
                            title: (this.state.option==="edit" || match.params.copyId) ? this.crumbMap[outType]&&this.crumbMap[outType]['editor']||"修改出库单" : this.crumbMap[outType]&&this.crumbMap[outType]['add']||"新增出库单"
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <GoodsTableFieldConfigMenu
                            tableConfigList={listFields}
                            refresh={this.resetDefaultFields}
                            type={'wareOut_serial'}
                        />
                        <TaxToolTip cookieSave={'outbound'} tip={intl.get("outbound.add.index.taxToolTip")}/>
                    </div>
                </Content.ContentHd>
                <Content.ContentBd>
                    <Spin
                        spinning={orderInfo.get("isFetching")}
                    >
                        <AddForm {...this.props}
                                 onSubmit={this.handleSubmit}
                                 formRef={this.formRef}
                                 isModify={!!match.params.id}
                                 setContinueAddFlag={setContinueAddFlag}
                                 continueAddFlag={this.state.continueAddFlag}
                                 loading={this.props.addSale.get('isFetching')}>
                            {
                                this.formRef.current && (
                                    <React.Fragment>
                                        {
                                            (outType === 7 || outType === 6) ?
                                                <div style={{display:'none'}}>
                                                    <Form.Item
                                                        label={intl.get("outbound.add.index.outType")}
                                                        name="outType"
                                                        initialValue={outType}
                                                    >
                                                        <Input value={outType}/>
                                                    </Form.Item>
                                                </div>
                                                :
                                                <AddForm.TopOpe>
                                                    <Row>
                                                        <Col span={14} className={cx("special-col")}>
                                                            <Form.Item
                                                                {...Outbound.formItemLayout}
                                                                name="outType"
                                                                label={intl.get("outbound.add.index.outType")}
                                                            >
                                                                <Radio.Group onChange={(e) => {
                                                                    let value = e.target.value;
                                                                    this.source = (value !== 2) ? "OUTBOUND" : "OUTBOUND_SALE";
                                                                    this.setState({outType: value});
                                                                    this.formRef.current.setFieldsValue({outType: value});
                                                                }}>
                                                                    <Radio  value={0}>{intl.get("outbound.add.index.outType1")}</Radio>
                                                                    <Radio  value={2}>{intl.get("outbound.add.index.outType2")}</Radio>
                                                                    <Radio  value={3}>{intl.get("outbound.add.index.outType3")}</Radio>
                                                                    <Radio  value={4}>{intl.get("outbound.add.index.outType4")}</Radio>
                                                                </Radio.Group>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={10} className={cx("special-col-lst")}>
                                                            {
                                                                outType === 2 && (
                                                                    <React.Fragment>
                                                                        <Button type="sub" className="fr" ga-data={"purchase-copy-from-sale"}
                                                                                onClick={() => this.openModal('saleOrderPopVisible')}>从销售订单选择</Button>
                                                                        <CopyFromSale
                                                                            visible={saleOrderPopVisible}
                                                                            visibleFlag={'saleOrderPopVisible'}
                                                                            onOk={this.handleSaleOrderPopOnOK}
                                                                            onFillWarehouse={this.onFillWarehouse}
                                                                            onCancel={() => this.closeModal('saleOrderPopVisible')}
                                                                            selectType={"radio"}
                                                                            popType={'goods'}
                                                                            unitPriceSource='salePrice'
                                                                            copySource={'outbound'} //复制按钮的来源
                                                                        />
                                                                        <div style={{display: "none"}}>
                                                                            <Form.Item name="fkSaleOrderBillNo">
                                                                                <Input/>
                                                                            </Form.Item>
                                                                        </div>
                                                                    </React.Fragment>
                                                                )
                                                            }
                                                            {
                                                                outType === 3 && (
                                                                    <React.Fragment>
                                                                        <Button type="sub" className="fr" ga-data={"purchase-copy-from-sale"}
                                                                                onClick={() => this.openModal('purchaseOrderPopVisible')}>从采购订单选择</Button>
                                                                        <CopyFromOrder
                                                                            visible={purchaseOrderPopVisible}
                                                                            visibleFlag={'purchaseOrderPopVisible'}
                                                                            onOk={this.handlePurchaseOrderPopOnOK}
                                                                            onFillWarehouse={this.onFillWarehouse}
                                                                            onCancel={() => this.closeModal('purchaseOrderPopVisible')}
                                                                            selectType={"radio"}
                                                                            popType={'goods'}
                                                                            unitPriceSource='orderPrice'
                                                                            copySource={'outbound'} //复制按钮的来源
                                                                        />
                                                                        <div style={{display: "none"}}>
                                                                            <Form.Item name="fkOrderBillNo">
                                                                                <Input/>
                                                                            </Form.Item>
                                                                        </div>
                                                                    </React.Fragment>
                                                                )
                                                            }
                                                        </Col>
                                                    </Row>
                                                </AddForm.TopOpe>
                                        }
                                        <AddForm.BaseInfo>
                                            <BaseInfo {...this.props}
                                                      outType={outType}
                                                      formRef={this.formRef}
                                                      initBaseInfo={baseInfo}

                                                      onChangeCustomerNo={this.onChangeCustomerNo}
                                                      getRef={this.getBaseRef}

                                            />
                                        </AddForm.BaseInfo>
                                        <AddForm.ProdList>
                                            <ProdList dataPrefix={this.dataPrefix}
                                                      getRef={this.getProdRef}
                                                      formRef={this.formRef}
                                                      defaultForm={{taxRate}}
                                                      source={this.source}
                                                      goodsPopCondition={{customerNo}}
                                                      prodFields={prodFields}
                                                      billType={outType === 2?"listForSaleOrder":''}
                                                      goodsTableConfig={goodsTableConfig}/>
                                        </AddForm.ProdList>
                                        <AddForm.OtherInfo>
                                            <OtherInfo  {...this.props}
                                                        formRef={this.formRef}
                                                        initBaseInfo={baseInfo}
                                                        outType={outType}
                                                        getRef={this.getOtherInfoRef}
                                            />
                                        </AddForm.OtherInfo>
                                        <div style={{display: "none"}}>
                                            <Form.Item name="billNo"
                                                       initialValue={match.params.id}
                                            >
                                                <Input/>
                                            </Form.Item>
                                        </div>
                                    </React.Fragment>
                                )
                            }
                        </AddForm>
                    </Spin>
                </Content.ContentBd>
                <LimitOnlineTip onClose={()=>this.closeModals()} show={this.state.showTip}/>
                <SelectApproveItem
                    onClose={this.extendApproveCancelModal}
                    onOk={(id)=>{this.extendApproveOkModal(id)}}
                    show={this.state.selectApprove}
                    type={BACKEND_TYPES.outbound}
                />
            </React.Fragment>
        );
    }
}

