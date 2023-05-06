import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import { Button, Row, Col, Input, message, Spin, Form, Modal, Radio } from 'antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import 'url-search-params-polyfill';
import {getCookie} from 'utils/cookie';
import {fixedDecimal} from "utils/Decimal";
import Crumb from 'components/business/crumb';
import {newAddForm as AddForm, actions as addFormActions, formCreate}  from 'components/layout/addForm';
import Content from 'components/layout/content'
import {asyncAddSale, asyncFetchInboundById,asyncFetchPreData,emptyDetailData} from '../actions';
import GoodsTableFieldConfigMenu, {actions as fieldConfigActions} from 'components/business/goodsTableFieldConfigMenu';
import TaxToolTip from 'components/business/taxToolTip';
import LimitOnlineTip from 'components/business/limitOnlineTip';
import {checkWareArriveUpperLimit, dealCheckWareUpperLimitData, actions as wareUpperLimitActions} from 'components/business/checkWareArriveUpperLimit';
import {actions as supplierAddActions} from 'pages/supplier/add';
import {actions as customerShowActions} from 'pages/customer/add';
import {actions as purchaseAddActions} from 'pages/purchase/add';
import {actions as addGoodsActions} from 'pages/goods/add';
import {actions as saleAddActions} from 'pages/sale/add';
import {addPage} from  'components/layout/listPage';
import {actions as approveActions, SelectApproveItem, BACKEND_TYPES, withApprove} from 'components/business/approve';
import {actions as vipOpeActions, withVipWrap} from "components/business/vipOpe";
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import {actions as rateAction} from 'pages/auxiliary/rate';
import {actions as commonActions} from "components/business/commonRequest";
import { withPreProcessProd, InboundProdList as ProdList } from 'components/business/goods';
import CopyFromOrder from 'components/business/copyFromOrder';
import CopyFromSale from 'components/business/copyFromSale';
import formMap from '../dependencies/initFormMap';
import BaseInfo from './baseInfo';
import OtherInfo from './otherInfo';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import {fromJS} from "immutable";
const RadioGroup = Radio.Group;
import _ from "lodash";
const cx = classNames.bind(styles);

const mapStateToProps = (state) => ({
    purchaseInfo: state.getIn(['purchaseAdd', 'purchaseInfo']),
    addSale: state.getIn(['inboundOrderAdd', 'addSale']),
    saleInfo: state.getIn(['inboundOrderAdd', 'saleInfo']),
    preData:  state.getIn(['inboundOrderAdd', 'preData']),
    vipService: state.getIn(['vipHome', 'vipService']),
    goodsInfo: state.getIn(['goods', 'goodsInfo']),
    produceOrderInfo: state.getIn(['produceOrderShow', 'produceOrderInfo']),
    rateList: state.getIn(['auxiliaryRate', 'rateList']),
    goodsTableConfig: state.getIn(['goodsTableFieldConfigMenu', 'goodsTableConfig']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncAddSale,
        asyncFetchInboundById,
        asyncFetchPreData,
        emptyDetailData,
        asyncFetchSaleById: saleAddActions.asyncFetchSaleById,
        asyncFetchGoodsById: addGoodsActions.asyncFetchGoodsById,
        asyncShowSupplier: supplierAddActions.asyncShowSupplier,
        asyncShowSupplierForSelect: supplierAddActions.asyncShowSupplierForSelect,
        asyncShowCustomer: customerShowActions.asyncShowCustomer,
        asyncShowCustomerForSelect: customerShowActions.asyncShowCustomerForSelect,
        asyncCheckWareArriveUpperLimit: wareUpperLimitActions.asyncCheckWareArriveUpperLimit,
        asyncFetchExpressList: rateAction.asyncFetchExpressList,
		setInitFinished: addFormActions.setInitFinished,
        asyncFetchPurchaseById: purchaseAddActions.asyncFetchPurchaseById,
        asyncFetchGoodsDataByProdNo: purchaseAddActions.asyncFetchGoodsDataByProdNo,
        asyncGetApproveStatus: approveActions.asyncGetApproveStatus,
        asyncOpenVipAndSendRequestToOss: vipOpeActions.asyncOpenVipAndSendRequestToOss,
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService,
        asyncFetchGetContinueCreate: commonActions.asyncFetchGetContinueCreate,
        asyncFetchSetContinueCreate: commonActions.asyncFetchSetContinueCreate,
        emptyFieldConfig: fieldConfigActions.emptyFieldConfig,
        asyncSaveFieldConfig: fieldConfigActions.asyncSaveFieldConfig,
    }, dispatch)
};


@withRouter
@connect(mapStateToProps, mapDispatchToProps)
@withPreProcessProd
@withVipWrap
@withApprove
@formCreate
export default class Inbound extends addPage {
    formRef = React.createRef();
    dataPrefix = 'prod';
    source='INBOUND';
    fieldConfigType = 'warehouse_enter';
    crumbMap = {
        7:{
            add: "新建生产退料单",
            editor: "修改生产退料单",
        },
        8:{
            add: "新建委外退料单",
            editor: "修改委外退料单"
        },
        6:{
            add: "新建委外成品入库单",
            editor: "修改委外成品入库单"
        }
    }
    getProdRef = (prodRef)=>{
        this.prodRef = prodRef;
    };
    getOtherInfoRef = (otherInfoRef) => {
        this.otherInfoRef = otherInfoRef
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
        this.state={
            purchaseOrderPopVisible: false,
            saleOrderPopVisible: false,
            currentInBoundType: +props.location.searchObj.enterType || 0,
            fkProduceNo: props.location.searchObj.fkProduceNo || '',
            approveFlag: 0,
            isCopy: false,
            showTip: false,
            inboundType: [
                {type: "生产入库", value: 5},
                {type: "采购入库", value: 0},
                {type: "销售退货", value: 3},
                {type: "其他入库", value: 1}
            ],
            selectApprove: false,  // 选择审批流弹层
            approveModuleFlag: 0,  // 当前模块是否开启审批权限 0 无 1 有
            approveStatus: 0,   //审批状态 0 未提交  1 通过  2 反驳  3 审批中
            submitData: {}, // 新增最终提交表单的信息
            continueAddFlag: true,  //连续新增Flag
            typeKey: "EnterWarehouse",
        };
    }

   
    componentDidMount() {
        this.props.asyncFetchVipService();
        this.preDataProcess();
    }

    componentWillUnmount() {
        this.props.emptyDetailData();
        // 保存字段配置
        this.props.asyncSaveFieldConfig(this.fieldConfigType);
        this.props.emptyFieldConfig();
    }

    /** 初始化数据的流程 */
    preDataProcess = async () => {
        const {match} = this.props;
        //修改页面或复制页面
        let id = match.params.id || match.params.copyId;
        let isCopy = match.params.copyId?true:false;
        this.setState({isCopy: isCopy});
        let modifyBackData = {};
        let params = new URLSearchParams(this.props.location.search);
        // const fkBillNo = params && params.get('fkBillNo') || "";
        const productCode = params && params.get('productCode');    // 单独带入的物品信息
        const fkSaleBillNo = params && params.get('fkSaleBillNo')||""; // 销售订单到入库单
        await this.initPreData(id);
        await this.initRate();
        // fkBillNo && this.props.asyncFetchPurchaseById(fkBillNo);
        fkSaleBillNo && await this.initFkSaleBillNo(fkSaleBillNo);
        if (id) modifyBackData = await this.initModifyData(id);
        productCode && await this.initSingleGoods(productCode);
        if (modifyBackData.customerNo) await this.handleSelectCustomer(customerNo, true);
        if (modifyBackData.supplierNo) await this.handleSelectSupplier(supplierNo, true);
        this.getContinueCreateFlag();
        this.props.setInitFinished();
        // 领料入库
        if(params && (params.get('enterType')==='7')) this.fillInboundReturnMaterial();
        // 委外退料入库
        if(params && (params.get('enterType')==='8')) this.fillInboundReturnMaterialForTypeEight();
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

    /** 初始化领料入库 */
    fillInboundReturnMaterial = () => {
        let params = new URLSearchParams(this.props.location.search);
        let formMap = {
            fkProduceNo: params.get('fkProduceNo'),
            otherEnterWarehouseName: params.get('departmentName'),
            otherEnterWarehouseContacterName: params.get('employeeName')
        };
        if(params.get('warehouseName')) formMap.warehouseName = params.get('warehouseName');
        //  初始化表单其他信息
        this.initForm(formMap);
        // 初始化物品列表信息
        let prodList = JSON.parse(window.localStorage.getItem('inboundReturnMaterial_arrData'));
        this.initCommonProdInfo(prodList);
    };

    /** 初始化委外退料入库 */
    fillInboundReturnMaterialForTypeEight = () => {
        let params = new URLSearchParams(this.props.location.search);
        let formMap = {
            fkProduceNo: params.get('fkProduceNo'),
            supplierName: params.get('supplierName'),
            supplierCode: params.get('supplierCode'),
            supplierContacterName: params.get('contacterName'),
            supplierMobile: params.get('contacterTelNo'),
            warehouseName: params.get('warehouseName')
        };
        //  初始化表单其他信息
        this.initForm(formMap);
        // 初始化物品列表信息
        let prodList = JSON.parse(window.localStorage.getItem('inboundReturnMaterial_arrData'));
        this.initCommonProdInfo(prodList);
    };

    /** 初始化数据 */
    initPreData = (id) => {
        return new Promise((resolve, reject) => {
            this.props.asyncFetchPreData(data=>{
                if(data.retCode === '0'){
                    //设置仓库的默认值
                    const warehouses = data.warehouses;
                    let inintWareHouses;
                    if(warehouses){
                        let dataWareHouses = warehouses;
                        dataWareHouses.forEach(function(element,index,arr1){
                            if(element.isCommon==1){
                                inintWareHouses = element.name;
                                return
                            }
                        })
                    }

                    if(data.tags){
                        if(!id){
                            this.formRef.current.setFieldsValue({
                                warehouseName:inintWareHouses
                            });
                        }
                        this.setState({tags:data.tags},()=>{
                            this.initForm({});
                        });
                    }
                    resolve();
                }
            });
        })
    };

    /** 初始化税率 */
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

    /** 初始化只存在一条物品信息的数据 */
    initSingleGoods = (productCode) => {
        return new Promise((resolve, reject) => {
            this.props.asyncFetchGoodsById(productCode, res => {
                if (res.get('retCode') === '0') {
                    let list = res.get('data') && res.get('data').toJS() || {};
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

    /** 初始化销售单到入库单物品数据 */
    initFkSaleProdInfo = (prodList) => {
        this.props.asyncFetchGoodsDataByProdNo(prodList,(data)=>{
            let {preProcessProd} = this.props;
            let prodInfo = data.data || [];
            prodInfo = _.map(prodInfo, (item, index) => {
                return {
                    ...item,
                    quantity: null,
                    taxRate: prodList[index].taxRate,
                    remarks: prodList[index].remarks
                }
            });
            prodInfo = preProcessProd({type: 'goods', source: this.source, defaultForm: null, lists: prodInfo});
            // 填充物品数据
            this.prodRef.props.fillList(prodInfo, null);
        });
    };

    /** 销售单到销售入库单 */
    initFkSaleBillNo = (fkSaleBillNo) => {
        return new Promise((resolve, reject) => {
            this.props.asyncFetchSaleById(fkSaleBillNo,data=>{
                let order = data.data||{};
                let prodList = order.prodList && order.prodList.map(item => {
                    return {
                        code: item.productCode,
                        taxRate: item.taxRate,
                        remarks: item.remarks
                    }
                }) || [];
                let out = {};
                out.fkSaleOrderBillNo = fkSaleBillNo;
                out.customerCode = order.customerNo;
                out.customerName = order.customerName;
                out.customerContacterName = order.customerContacterName;
                out.customerTelNo = order.customerTelNo;
                out.projectName = order.projectName;
                out.ourContacterName = order.ourContacterName;
                this.initForm(out);
                // 初始化销售单到入库单物品数据
                this.initFkSaleProdInfo(prodList);
            });
            resolve();
        });
    };

    /** 初始化修改数据 */
    initModifyData = (id) => {
        const {match} = this.props;
        let isCopy = match.params.copyId?true:false;
        return new Promise((resolve, reject) => {
            this.props.asyncFetchInboundById(id, data=>{
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
                        title: intl.get("inbound.add.index.warningTip"),
                        okText: intl.get("inbound.add.index.okText"),
                        content: `${data.retMsg}`,
                        onOk() {
                            _this.props.history.goBack();
                        }
                    });
                    reject();
                }
                this.setState({approveFlag:data.approveFlag});

                if(order.approveStatus == 1 && data.approveFlag == 1 && !isCopy){
                    this.setState({approveStatus:order.approveStatus});
                    Modal.warning({
                        title: intl.get("inbound.add.index.warningTip"),
                        okText: intl.get("inbound.add.index.okText"),
                        content: intl.get("inbound.add.index.orderHasApproveTipContent"),
                        onOk() {
                            _this.props.history.goBack();
                        }
                    });
                    return false;
                }
                order && this.setState({currentInBoundType: order.enterType});
                this.initForm(order);
                // 初始化物品表单数据
                this.initProdForm(prodList);
                // 初始化合计
                this.initFormTotal(order);
                // 处理自定义字段
                this.setState({tags:data.tags});
                resolve({customerNo: order.customerCode, supplierNo: order.supplierNo});
            })
        })
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

    /** 初始化表单数据 */
    initFormData = (info) => {
        // 处理自定义列表字段
        info = this.initFormTags(info, 'propertyValue');
        return info;
    };

    /** 初始化时给表单赋值 */
    initForm = (info)=>{
        console.log(info,'info');
        info = this.initFormData(info);
        this.initFormField(formMap, info);
    };

    /** 处理自定义字段 */
    dealCustomField = (values)=>{
        // 处理自定义字段
        // 需要和后端确认分别在什么时候使用propValue1和property_value1
        let tempArr = [];
        if(values.propName){
            values.propName.forEach((item,index)=>{
                if(item) {
                    values['propertyValue'+values.mappingName[index].slice(-1)] = values.propValue[index];
                    tempArr.push({
                        mappingName: values.mappingName[index],
                        propValue: values.propValue[index],
                        propName: values.propName[index],
                        customInfoType: 'PurchaseCustomPropInfo'
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
        let {currentInBoundType} = this.state;
        if(this.props.match.params.copyId) values.billNo = '';  // 复制状态将id置为0
        values.fileIds = this.otherInfoRef.state.fileList.map(item => item.response.fileId);
        values.discountAmount = values.discountAmount || 0;
        if(currentInBoundType===0 || currentInBoundType===8){
            if(values.supplier){
                values.supplierCode = values.supplier.key;
                values.supplierName = values.supplier.label;
            }
        } else if(currentInBoundType===3){
            if(values.customer){
                values.customerCode = values.customer.key;
                values.customerName = values.customer.label;
            }
        }
    };

    /** 处理表单提交数据*/
    dealSubmitFormInfo = (values) => {
        this.dealCustomField(values); //处理自定义字段
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
                // data 为 0代表正常操作  1 允许超卖  2 不允许超卖
                // 1 表示允许超卖， 点击确定继续执行表单操作
                if(res===1) {
                    checkWareArriveUpperLimit(res, module, ()=> resolve(), ()=> reject());
                } else{
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
        if(this.state.approveStatus == 1 && this.state.approveFlag ==1 && !this.state.isCopy){
            message.error(intl.get("inbound.add.index.submitErrorMessage1"));
            return false;
        }
        /** 处理表单提交数据 */
        this.dealSubmitFormInfo(values);
        /** 后端校验工作，如符合条件则提交表单*/
        await this.backendValidateAndSubmit('inbound', values);
        /** 提交表单数据 */
        this.asyncSubmit();
    };

    /** 提交表单数据（新加） */
    asyncSubmit=()=>{
        let values = this.state.submitData;
        this.props.asyncAddSale(values.billNo, values, (res) => {  // 校验是否到达上限后在提交表单
            if (res.data.retCode === '0') {
                let displayId = res.data.data;
                message.success(intl.get("inbound.add.index.operateSuccessMessage"));
                this.props.emptyFieldChange();
                let continueAddFlag = !this.props.match.params.id && this.state.continueAddFlag;
                if(this.state.currentInBoundType === 7) continueAddFlag = false; // 领料入库不要连续提交
                let url = continueAddFlag ? '/blank' :`/inventory/inbound/show/${displayId}`;
                this.props.history.push(url);
                if(continueAddFlag) this.props.history.replace('/inventory/inbound/add');
            } else if (res.data.retCode == '2019'){
                Modal.info({
                    icon: <ExclamationCircleOutlined/>,
                    title: intl.get("inbound.add.index.warningTip"),
                    content: (
                        <div>
                            <p>{intl.get("inbound.add.index.vipExpireTip")}</p>
                            <a style={{color:'#0066dd'}} target="_blank" href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true">{intl.get("inbound.add.index.treatyText")}</a>
                        </div>
                    )
                });
                return false;
            } else {
                if(res.data && res.data.retCode == undefined && !res.data.status){
                    this.setState({showTip:true})
                }else{
                    Modal.error({
                        title: intl.get("inbound.add.index.warningTip"),
                        content: (res.data.retValidationMsg && res.data.retValidationMsg.msg && res.data.retValidationMsg.msg[0].msg)||res.data.retMsg
                    });
                }
            }
        })
    };

    selectGoods = (ids,visibleKey)=>{
        this.openModal(visibleKey);
    };

    closeModals = () =>{
        this.setState({showTip:false})
    };

    /** 选择客户后，带入联系人联系电话以及客户交货地址*/
    handleSelectSupplier=(supplierCode, isInit)=>{
        if(!supplierCode) return;
        this.setState({
            supplierCode
        });
        this.props.asyncShowSupplierForSelect(supplierCode, data =>{
            if(data.retCode === '0'){
                if(!isInit){
                    let {setFieldsValue} = this.formRef.current;
                    //带入客户联系人和联系电话
                    const contacterName = data.data.contacterName;
                    const mobile = data.data.mobile;
                    setFieldsValue({
                        supplier:{
                            key:data.data.code,
                            label:data.data.name
                        },
                        supplierContacterName: contacterName,
                        supplierMobile: mobile
                    });
                }

            }
        });
    };


    /** 选择客户后，带入联系人联系电话以及客户交货地址*/
    handleSelectCustomer=(customerNo, isInit)=>{
        if(!customerNo) return;
        this.setState({
            customerNo
        });
        this.props.asyncShowCustomerForSelect(customerNo, res =>{
            const data = fromJS(res);
            if(data.get('retCode') === '0'){
                if(!isInit){
                    let {setFieldsValue} = this.formRef.current;
                    //带入客户联系人和联系电话
                    const contacterName = data.getIn(['data', 'contacterName']);
                    const telNo = data.getIn(['data', 'telNo']);
                    setFieldsValue({
                        customer:{
                            key:data.getIn(['data', 'customerNo']),
                            label:data.getIn(['data', 'customerName']),
                        },
                        customerContacterName: contacterName,
                        customerTelNo: telNo,
                    });
                }
            }
        });
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
        // 清空所有物品表单数据
        this.prodRef.props.clearAllRows(() => {
            let {rateList, preProcessProd} = this.props;
            let taxRate = rateList && rateList.getIn(['rate', 'defaultValue']);
            this.handleCopyFromSale(data);
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

    /** 填充仓库*/
    onFillWarehouse = (warehouseName) => {
        let {setFieldsValue}  = this.formRef.current;
        setFieldsValue({ warehouseName });
    };

    handleCopyFromPurchase=(data)=>{
        let {setFieldsValue} = this.formRef.current;
        setFieldsValue({
            projectName: data.projectName,
            fkPurchaseOrderBillNo: data.billNo
        });
        this.handleSelectSupplier(data.supplierCode, false);
    };

    handleCopyFromSale = (data) => {
        let {setFieldsValue} = this.formRef.current;
        setFieldsValue({
            projectName: data.projectName,
            customerContacterName: data.customerContacterName,
            customerTelNo: data.customerTelNo,
            ourContacterName:  data.ourContacterName,
            fkSaleOrderBillNo: data.billNo
        });
        this.handleSelectCustomer(data.customerNo, false);
    };

    onChangeBoundData = (val) => {
        this.setState({currentInBoundType: val});
    };
    resetDefaultFields = ()=>{
        const {match} = this.props;
        const id = match.params.id;
        if(id){
            this.props.asyncFetchInboundById(id, ()=>{
                this.props.setInitFinished();
            })
        }else{
            this.props.asyncFetchPreData(()=>{
                this.props.setInitFinished();
            });
        }
    };


    render() {
        //修改页面或复制页面
        const {saleInfo, match, preData, goodsTableConfig, rateList} = this.props;
        const {currentInBoundType, inboundType, purchaseOrderPopVisible, saleOrderPopVisible} = this.state;

        let id = match.params.id || match.params.copyId;
        let listFields, prodFields;
        // 默认税率
        let taxRate = rateList && rateList.getIn(['rate', 'defaultValue']);
        if(match.params.id){
            listFields  = saleInfo && saleInfo.getIn(['data', 'listFields']);
            prodFields = saleInfo && saleInfo.getIn(['data', 'prodDataTags']);
        }else{
            listFields  = preData && preData.getIn(['data', 'listFields']);
            prodFields = preData && preData.getIn(['data', 'prodDataTags']);
        }

        let saleInfoData,
            baseInfo;
       if(id){
            saleInfoData = saleInfo && saleInfo.getIn(['data', 'data']);
            baseInfo = saleInfoData;
       }

        let setContinueAddFlag = this.setContinueAddFlag;
        if(currentInBoundType === 7) {
            setContinueAddFlag = null;
        }

        return (
            <React.Fragment>
                <Content.ContentHd>
                    <Crumb data={[
                        {
                            url: '/inventory/inbound/',
                            title: intl.get("inbound.add.index.inbound")
                        },
                        {
                            title: this.props.match.params.id?this.crumbMap[currentInBoundType]&&this.crumbMap[currentInBoundType]['editor']||"修改入库单":this.crumbMap[currentInBoundType]&&this.crumbMap[currentInBoundType]['add']||"新建入库单"
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <GoodsTableFieldConfigMenu
                            tableConfigList={listFields}
                            refresh={this.resetDefaultFields}
                            type={'wareEnter_serial'}
                        />
                        <TaxToolTip cookieSave={'inbound'} tip={intl.get("inbound.add.index.taxToolTip")}/>
                    </div>
                </Content.ContentHd>
                <Content.ContentBd>
                    <Spin
                        spinning={saleInfo.get("isFetching")}
                    >
                        <AddForm {...this.props}
                                 onSubmit={this.handleSubmit}
                                 isModify={!!match.params.id}
                                 setContinueAddFlag={setContinueAddFlag}
                                 continueAddFlag={this.state.continueAddFlag}
                                 formRef={this.formRef}
                        >
                            {
                                this.formRef.current && (
                                    <React.Fragment>
                                        {
                                            (currentInBoundType === 6 || currentInBoundType === 7 || currentInBoundType === 8) ?
                                                <div style={{display:'none'}}>
                                                    <Form.Item
                                                        label={intl.get("inbound.add.index.enterType")}
                                                        name="enterType"
                                                        initialValue={currentInBoundType}
                                                    >
                                                        <Input value={currentInBoundType}/>
                                                    </Form.Item>
                                                </div>
                                            :
                                                <AddForm.TopOpe>
                                                    <Row>
                                                        <Col span={12} className={cx("special-col")}>
                                                            <Form.Item
                                                                label={intl.get("inbound.add.index.enterType")}
                                                                name="enterType"
                                                                initialValue={currentInBoundType}
                                                                {...Inbound.formItemLayout}
                                                            >
                                                                <RadioGroup onChange={(e) => this.onChangeBoundData(e.target.value)}>
                                                                    {
                                                                        inboundType.map((item, index) =>
                                                                            <Radio key={index} value={item.value}>{item.type}</Radio>
                                                                        )
                                                                    }
                                                                </RadioGroup>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={12} className={cx("special-col-lst")}>
                                                            {
                                                                currentInBoundType === 0 && (
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
                                                                            copySource={'inbound'} //复制按钮的来源
                                                                        />
                                                                        <div style={{display: "none"}}>
                                                                            <Form.Item name="fkPurchaseOrderBillNo">
                                                                                <Input/>
                                                                            </Form.Item>
                                                                        </div>
                                                                    </React.Fragment>
                                                                )
                                                            }
                                                            {
                                                                currentInBoundType === 3 && (
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
                                                                            unitPriceSource='orderPrice'
                                                                            copySource={'inbound'} //复制按钮的来源
                                                                        />
                                                                        <div style={{display: "none"}}>
                                                                            <Form.Item name="fkSaleOrderBillNo">
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
                                                      formRef={this.formRef}
                                                      initBaseInfo={baseInfo}
                                                      currentInBoundType={currentInBoundType}
                                                      onChangeBoundData={this.onChangeBoundData}
                                                      handleSelectSupplier={this.handleSelectSupplier}
                                                      handleSelectCustomer={this.handleSelectCustomer}/>
                                        </AddForm.BaseInfo>
                                        <AddForm.ProdList>
                                            <ProdList dataPrefix={this.dataPrefix}
                                                      getRef={this.getProdRef}
                                                      formRef={this.formRef}
                                                      defaultForm={{taxRate}}
                                                      source={this.source}
                                                      prodFields={prodFields}
                                                      goodsTableConfig={goodsTableConfig}/>
                                        </AddForm.ProdList>
                                        <AddForm.OtherInfo>
                                            <OtherInfo
                                                {...this.props}
                                                formRef={this.formRef}
                                                initBaseInfo={baseInfo}
                                                currentInBoundType={currentInBoundType}
                                                handleSelectSupplier={this.handleSelectSupplier}
                                                handleSelectCustomer={this.handleSelectCustomer}
                                                getRef={this.getOtherInfoRef}
                                            />
                                        </AddForm.OtherInfo>
                                        <div style={{display: "none"}}>
                                            <Form.Item name="billNo" initialValue={id}>
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
                <SelectApproveItem   // ***
                    onClose={this.extendApproveCancelModal}
                    onOk={(id)=>{this.extendApproveOkModal(id)}}
                    show={this.state.selectApprove}
                    type={BACKEND_TYPES.inbound}
                />
            </React.Fragment>
        );
    }
}



