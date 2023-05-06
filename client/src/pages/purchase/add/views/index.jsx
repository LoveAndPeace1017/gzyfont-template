import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {Button, Modal, Input, message, Spin,Form} from 'antd';
import {withRouter} from "react-router-dom";
import Crumb from 'components/business/crumb';
import AddForm, {actions as addFormActions, formCreate} from 'components/layout/addForm';
import { actions as rateAction} from 'pages/auxiliary/rate';
import NewAddForm from 'components/layout/addForm/views/newAddForm';
import Content from 'components/layout/content';
import {
    ExclamationCircleOutlined
} from '@ant-design/icons';
import {asyncFetchPreData, asyncAddPurchase, asyncFetchPurchaseById, emptyDetailData, asyncFetchGoodsDataByProdNo} from '../actions';
import {actions as supplierAddActions} from 'pages/supplier/add';
import {actions as addGoodsActions} from 'pages/goods/add';
import {actions as requisitionShowActions} from 'pages/purchase/requisitionOrder/show';
import GoodsTableFieldConfigMenu, {actions as fieldConfigActions} from 'components/business/goodsTableFieldConfigMenu';
import LimitOnlineTip from 'components/business/limitOnlineTip';
import {checkWareArriveUpperLimit, dealCheckWareUpperLimitData, actions as wareUpperLimitActions} from 'components/business/checkWareArriveUpperLimit';
import {addPage} from  'components/layout/listPage';
import {actions as approveActions, SelectApproveItem, BACKEND_TYPES, withApprove} from 'components/business/approve';
import {actions as vipOpeActions} from "components/business/vipOpe";
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import {actions as commonActions} from "components/business/commonRequest";
import CopyFromSale from 'components/business/copyFromSale';
import { withPreProcessProd, PurchaseProdList as ProdList } from 'components/business/goods';
import BaseInfo from './baseInfo';
import OtherInfo from './otherInfo';
import TaxToolTip from 'components/business/taxToolTip';
import 'url-search-params-polyfill';
import {getUrlParamValue} from 'utils/urlParam';
import {getCookie} from 'utils/cookie';
import {fixedDecimal} from "utils/Decimal";
import formMap from '../dependencies/initFormMap';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import _ from "lodash";
const cx = classNames.bind(styles);

const mapStateToProps = (state) => ({
    addPurchase: state.getIn(['purchaseAdd', 'addPurchase']),
    purchaseInfo: state.getIn(['purchaseAdd', 'purchaseInfo']),
    preData: state.getIn(['purchaseAdd', 'preData']),
    goodsInfo: state.getIn(['goods', 'goodsInfo']),
    rateList: state.getIn(['auxiliaryRate', 'rateList']),
    goodsTableConfig: state.getIn(['goodsTableFieldConfigMenu', 'goodsTableConfig']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchPreData,
        asyncAddPurchase,
        asyncFetchPurchaseById,
        asyncFetchGoodsDataByProdNo,
        emptyDetailData,
        asyncFetchGoodsById: addGoodsActions.asyncFetchGoodsById,
        asyncRequisitionOrderShow: requisitionShowActions.asyncRequisitionOrderShow,
        asyncShowSupplier: supplierAddActions.asyncShowSupplier,
        asyncShowSupplierByName: supplierAddActions.asyncShowSupplierByName,
        asyncShowSupplierForSelect: supplierAddActions.asyncShowSupplierForSelect,
        asyncCheckWareArriveUpperLimit: wareUpperLimitActions.asyncCheckWareArriveUpperLimit,
        setInitFinished: addFormActions.setInitFinished,
        asyncFetchExpressList: rateAction.asyncFetchExpressList,
        asyncFetchGetContinueCreate: commonActions.asyncFetchGetContinueCreate,
        asyncFetchSetContinueCreate: commonActions.asyncFetchSetContinueCreate,
        asyncGetApproveStatus: approveActions.asyncGetApproveStatus,
        asyncOpenVipAndSendRequestToOss: vipOpeActions.asyncOpenVipAndSendRequestToOss,
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService,
        emptyFieldConfig: fieldConfigActions.emptyFieldConfig,
        asyncSaveFieldConfig: fieldConfigActions.asyncSaveFieldConfig,
    }, dispatch)
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
@withPreProcessProd
@withApprove
@formCreate
export default class PurchaseAddForm extends addPage {
    formRef = React.createRef();
    dataPrefix = 'prod';
    source='PURCHASE';
    fieldConfigType = 'purchase_order';
    getProdRef = (prodRef)=>{
        this.prodRef = prodRef;
    };

    getOtherInfoRef = (otherInfoRef) => {
        this.otherInfoRef = otherInfoRef
    };
    constructor(props) {
        super(props);
        this.state = {
            saleOrderPopVisible: false,
            supplierCode: '',
            tags: [],
            fileList: [],
            showTip: false,
            selectApprove: false,  // 选择审批流弹层
            approveModuleFlag: 0,  // 当前模块是否开启审批权限 0 无 1 有
            approveStatus: 0,   //审批状态 0 未提交  1 通过  2 反驳  3 审批中
            submitData: {}, // 新增最终提交表单的信息
            continueAddFlag: true,  //连续新增Flag
            typeKey: "PurchaseOrder"
        };
    }

    componentDidMount() {
        this.preDataProcess();
    }

    componentWillUnmount() {
        this.props.emptyDetailData();
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
        const supplierNo = params && params.get('supplierNo') || "";
        const requisitionOrderNo = params && params.get('requisitionOrderNo') || ""; // 请购单号
        const type = params && params.get('type') || "";
        const productCode = params && params.get('productCode');    // 单独带入的物品信息
        await this.initPreData();
        await this.initRate();
        if(id) await this.initModifyData(id);
        productCode && await this.initSingleGoods(productCode);
        if(type === "mrpToPurchaseData") await this.fillMrpData(type);  //type=mrpToPurchaseData Mrp计算计划采购Tab带入数据
        if(type === "lackMaterial") await this.fillLackMaterialData(type);  //type=lackMaterial 缺料查询带入数据
        if(type === 'requisitionOrderApplyInfo') await this.fillRequisitionDetail(type);  //type=mrpToPurchaseData 从请购单明细带入数据
        if(requisitionOrderNo) await this.fillRequisition(requisitionOrderNo);
        if(supplierNo) await this.handleSelectSupplier(supplierNo, false);
        this.getContinueCreateFlag();
        this.props.setInitFinished();
    };

    /** 初始化数据 */
    initPreData = () => {
        return new Promise((resolve, reject) => {
            this.props.asyncFetchPreData(data => {
                if (data.retCode === '0') {
                    if (data.tags) {
                        this.setState({tags: data.tags},()=>{
                            this.initForm({});
                        });
                    }
                    resolve();
                }
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

    /** Mrp计算计划采购Tab带入数据 */
    fillMrpData = (type)=>{
        return new Promise((resolve, reject) => {
            let {rateList, preProcessProd} = this.props;
            let taxRate = rateList && rateList.getIn(['rate', 'defaultValue']);
            let data =JSON.parse(localStorage.getItem(type));
            let prodList = data.prodList;
            this.initForm(data);
            //根据供应商名称，得到供应商信息
            console.log(prodList,'prodList');
            let supplierName = data.supplierName;
            console.log(supplierName,'supplierName');
            supplierName && this.handleSelectSupplierByNameWithMrpCount(supplierName);
            this.props.asyncFetchGoodsDataByProdNo(prodList,(data)=>{
                //获取prod数据处理，遍历使其适配goodsTable
                let prodInfo = data.data || [];
                prodInfo = preProcessProd({type: 'goods', source: this.source, defaultForm: {taxRate}, lists: prodInfo});
                // 填充物品数据
                this.prodRef.props.fillList(prodInfo, null, () => {
                    // 计算合计
                    this.prodRef.props.calcTotal();
                });
                resolve();
            });
        });
    };

    /** 缺料查询带入物品数据 */
    fillLackMaterialData = (type) => {
        return new Promise((resolve, reject) => {
            let {rateList, preProcessProd} = this.props;
            let taxRate = rateList && rateList.getIn(['rate', 'defaultValue']);
            let prodList =JSON.parse(localStorage.getItem(type));
            this.props.asyncFetchGoodsDataByProdNo(prodList,(data)=>{
                //获取prod数据处理，遍历使其适配goodsTable
                let prodInfo = data.data || [];
                prodInfo = preProcessProd({type: 'goods', source: this.source, defaultForm: {taxRate}, lists: prodInfo});
                // 填充物品数据
                this.prodRef.props.fillList(prodInfo, null, () => {
                    // 计算合计
                    this.prodRef.props.calcTotal();
                });
                resolve();
            });
        });
    };

    /** 填充请购单数据 */
    fillRequisition = (requisitionOrderNo) => {
        return new Promise((resolve, reject) => {
            this.props.asyncRequisitionOrderShow(requisitionOrderNo, (res) => {
                let data = res.data || {};
                let prodList = data.prodList.map(item => {
                    return {
                        code: item.prodNo,
                        quantity: item.toPurchaseQuantity, // 待采购数量
                        unitPrice: item.unitPrice,
                        deliveryDeadlineDate: item.deliveryDeadlineDate,  // 交付日期
                        requestDisplayBillNo: data.displayBillNo,   // 请购展示编号
                        requestBillNo: data.billNo // 请购真实单号
                    }
                }) || [];
                this.initForm({projectName: data.projectName});
                this.initRequisitionProdInfo(prodList);
                resolve();
            });
        })
    };

    /** 从请购单明细带入数据 */
    fillRequisitionDetail = (type) => {
        return new Promise((resolve, reject) => {
            let prodList = JSON.parse(localStorage.getItem(type)) || [];
            let projectName;
            prodList = _.map(prodList, (item) => {
                if(!projectName && item.projectName){
                    projectName = item.projectName;
                }
                return {
                    code: item.prodNo,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    deliveryDeadlineDate: item.deliveryDeadlineDate,  // 交付日期
                    requestDisplayBillNo: item.displayBillNo,   // 请购展示编号
                    requestBillNo: item.billNo // 请购真实单号
                }
            });
            this.initForm({projectName});
            this.initRequisitionProdInfo(prodList);
            resolve();
        });
    };

    /** 初始化请购单物品数据 */
    initRequisitionProdInfo = (prodList) => {
        this.props.asyncFetchGoodsDataByProdNo(prodList,(data)=>{
            let {rateList, preProcessProd} = this.props;
            let taxRate = rateList && rateList.getIn(['rate', 'defaultValue']);
            let prodInfo = data.data || [];
            prodInfo = _.map(prodInfo, (item, index) => {
                return {
                    ...item,
                    unitPrice: prodList[index].unitPrice || item.orderPrice,
                    deliveryDeadlineDate: prodList[index].deliveryDeadlineDate,  // 交付日期
                    requestBillNo: prodList[index].requestBillNo, // 请购单号
                    requestDisplayBillNo: prodList[index].requestDisplayBillNo, // 请购展示编号
                }
            });
            prodInfo = preProcessProd({type: 'goods', source: this.source, defaultForm: {taxRate}, lists: prodInfo});
            // 填充物品数据
            this.prodRef.props.fillList(prodInfo, null, () => {
                // 计算合计
                this.prodRef.props.calcTotal();
            });
        });
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

    /** 初始化修改数据 */
    initModifyData = (id) => {
        return new Promise((resolve, reject) => {
            this.props.asyncFetchPurchaseById(id, data => {
                let _this = this;
                let info = data.data || {};
                // 初始化修改物品
                let prodList = this.props.preProcessProd({type: 'modify', source: this.source, lists: info.prodList});
                // 设置当前单据的审批状态
                this.setState({
                    approveStatus: data.data.approveStatus,
                    approveModuleFlag: data.approveModuleFlag
                });
                if(info.approveStatus == 1 && data.approveFlag == 1 && !match.params.copyId){
                    Modal.warning({
                        title: intl.get("purchase.add.index.warningTip"),
                        okText: intl.get("purchase.add.index.okText"),
                        content: intl.get("purchase.add.index.orderHasApproveTipContent"),
                        onOk() {
                            _this.props.history.goBack();
                        }
                    });
                    reject();
                }
                // 初始化表单数据
                this.initForm(info);
                // 初始化物品表单数据
                this.initProdForm(prodList);
                // 初始化合计
                this.initFormTotal(info);
                // 处理自定义字段
                this.setState({tags: data.tags});
                resolve();
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

    /** 初始化时给表单赋值 */
    initForm = (info) => {
        info = this.initFormData(info);
        this.initFormField(formMap, info);
    };

    /** 初始化表单数据 */
    initFormData = (info) => {
        // 处理自定义列表字段
        info = this.initFormTags(info, 'propertyValue');
        return info;
    };

    /** 处理自定义字段 */
    dealCustomField = (values)=>{
        // 处理自定义字段
        // 需要和后端确认分别在什么时候使用propValue1和property_value1
        let tempArr = [];
        if (values.propName) {
            values.propName.forEach((item, index) => {
                if (item) {
                    values['propertyValue' + values.mappingName[index].slice(-1)] = values.propValue[index];
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
        values.dataTagList.forEach((item) => {
            this.state.tags.some((tag) => {
                if (tag.mappingName == item.mappingName) {
                    item.id = tag.id;
                }
            })
        });
    };

    /** 处理交货地址 */
    dealAddress = (values) => {
        if(values.deliveryAddress) {
            const deliveryAddressArr = values.deliveryAddress.split(' ');
            if (deliveryAddressArr.length > 1) {
                values.deliveryProvinceCode = deliveryAddressArr[0];
                values.deliveryProvinceText = deliveryAddressArr[1];
                values.deliveryCityCode = deliveryAddressArr[2];
                values.deliveryCityText = deliveryAddressArr[3];
                values.deliveryAddress = deliveryAddressArr[4];
            } else {
                values.deliveryProvinceCode = "";
                values.deliveryProvinceText = "";
                values.deliveryCityCode = "";
                values.deliveryCityText = "";
            }
        }
    };

    /** 处理物品列表*/
    dealProdList = (values) => {
        let prodList = _.filter(values.prod, (item) => item);
        let formData = this.prodRef.props.formData;
        prodList = _.map(prodList, (item, idx) => {
            let {itemPropertyValue1,itemPropertyValue2,itemPropertyValue3,itemPropertyValue4,itemPropertyValue5,...out} = item;
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
            out.unit = (!form.unit) ? item.recUnit : form.unit;
            return {...form, ...out};
        });
        delete values[this.dataPrefix];
        values.prodList = prodList;
    };

    /** 处理其他信息*/
    dealOtherInfo = (values) => {
        if(this.props.match.params.copyId) values.id = null;  // 复制状态将id置为0
        values.fileIds = this.otherInfoRef.state.fileList.map(item => item.response.fileId);
        values.discountAmount = values.discountAmount || 0;
        if(values.supplier){
            values.supplierCode = values.supplier.key;
            values.supplierName = values.supplier.label;
        }
    };

    /** 处理表单提交数据*/
    dealSubmitFormInfo = (values) => {
        this.dealCustomField(values); //处理自定义字段
        this.dealAddress(values);  // 处理地址
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
                // 2 表示不允许超卖， 不进行后续表单操作
                if(res===1) {
                    checkWareArriveUpperLimit(res, module, ()=> resolve(), ()=> reject());
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
        /**  审批是否开启*/
        if(await this.backApproveFlag(module)){  // 审批开启
            /** 校验审批操作,如果符合条件，执行提交操作，审批为所有操作最后一步*/
            await this.validateApproveStatus(module, values);
        } else {
            /** 审批未开启 直接提交*/
            await new Promise((resolve, reject) => {
                this.setState({submitData: values}, () => {
                    this.cancelApproveOperate();
                    reject();
                });
            })
        }
    };

    handleSubmit = async (values) => {
        console.log('Received values of form: ', values);
        /** 处理表单提交数据 */
        this.dealSubmitFormInfo(values);
        /** 后端校验工作，如符合条件则提交表单*/
        await this.backendValidateAndSubmit('purchase', values);
        /** 提交表单数据 */
        this.asyncSubmit();
    };

    /** 提交表单数据*/
    asyncSubmit=()=> {
        let values = this.state.submitData;
        this.props.asyncAddPurchase(values.billNo, values, (res) => {
            if (res.data.retCode === '0') {
                let displayId = res.data.data;
                message.success(intl.get("purchase.add.index.operateSuccessMessage"));
                this.props.emptyFieldChange();
                let continueAddFlag = !this.props.match.params.id && this.state.continueAddFlag;
                let url = continueAddFlag ? '/blank' :`/purchase/show/${displayId}`;
                this.props.history.push(url);
                if(continueAddFlag) this.props.history.replace('/purchase/add');
            } else if(res.data.retCode == '2001' && res.data.retMsg === 'limitException' ) {
                this.setState({showTip:true});
            }  else if (res.data.retCode == '2019'){
                Modal.info({
                    icon: <ExclamationCircleOutlined/>,
                    title: intl.get("purchase.add.index.warningTip"),
                    content: (
                        <div>
                            <p>{intl.get("purchase.add.index.vipExpireTip")}</p>
                            <a style={{color:'#0066dd'}} target="_blank" href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true">{intl.get("purchase.add.index.treatyText")}</a>
                        </div>
                    )
                });
                return false;
            } else {
                Modal.error({
                    title: intl.get("purchase.add.index.warningTip"),
                    content: (res.data.retValidationMsg && res.data.retValidationMsg.msg && res.data.retValidationMsg.msg[0].msg)||(res.data.retValidationMsg && res.data.retValidationMsg.rowMsg && res.data.retValidationMsg.rowMsg[0].msgs[0].msg)||res.data.retMsg
                })
            }
        })
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
            // 初始化物从销售复制弹层物品
            prodList = preProcessProd({type: 'copyOrderPop', source: this.source, lists: prodList, defaultForm: {taxRate}});
            // 填充物品数据
            this.prodRef.props.fillList(prodList, null, () => {
                // 计算合计
                this.prodRef.props.calcTotal();
            });
        })
    };

    handleCopyFromSale = (data) => {
        let {setFieldsValue} = this.formRef.current;
        setFieldsValue({
            projectName: data.projectName,
        });
    };

    handleSelectSupplierByNameWithMrpCount = (supplierName)=>{
        this.props.asyncShowSupplierByName(supplierName, data =>{
            const contacterName = data.data.contacterName;
            const mobile = data.data.mobile;
            const supplierCode = data.data.code;
            this.setState({
                supplierCode
            });
            this.formRef.current.setFieldsValue({
                supplier: {
                    key: data.data.code,
                    label: data.data.name
                },
                supplierContacterName: contacterName,
                supplierMobile: mobile
            });

            console.log(data,'datasd');
        });
    }

    /** 选择客户后，带入联系人联系电话以及客户交货地址*/
    handleSelectSupplier = (supplierCode, isInit) => {
        this.setState({
            supplierCode
        });
        console.log(supplierCode,'supplierCode');
        return new Promise((resolve, reject) => {
            this.props.asyncShowSupplierForSelect(supplierCode, data => {
                if (data.retCode === '0') {
                    if (!isInit) {
                        //带入客户联系人和联系电话
                        const contacterName = data.data.contacterName;
                        const mobile = data.data.mobile;
                        this.formRef.current.setFieldsValue({
                            supplier: {
                                key: data.data.code,
                                label: data.data.name
                            },
                            supplierContacterName: contacterName,
                            supplierMobile: mobile
                        });
                    }
                    resolve();
                }
            });
        });
    };

    resetDefaultFields = ()=>{
        const {match} = this.props;
        const id = match.params.id;
        if(id){
            this.props.asyncFetchPurchaseById(id, ()=>{
                this.props.setInitFinished();
            })
        }else{
            this.props.asyncFetchPreData(()=>{
                this.props.setInitFinished();
            });
        }
    };


    render() {

        const {match, purchaseInfo, preData, goodsTableConfig, rateList} = this.props;

        let listFields, prodFields;
        // 默认税率
        let taxRate = rateList && rateList.getIn(['rate', 'defaultValue']);

        if(match.params.id){
            listFields  = purchaseInfo && purchaseInfo.getIn(['data', 'listFields']);
            prodFields = purchaseInfo && purchaseInfo.getIn(['data', 'prodDataTags']);
        }else{
            listFields  = preData && preData.getIn(['data', 'listFields']);
            prodFields = preData && preData.getIn(['data', 'prodDataTags']);
        }

        let id = match.params.id || match.params.copyId;

        let purchaseInfoData,
            baseInfo;

        if(id){
            purchaseInfoData = purchaseInfo && purchaseInfo.getIn(['data', 'data']);
            if(purchaseInfoData && purchaseInfoData.get('billNo') === id) {
                baseInfo = purchaseInfoData;
            }
        }

        return (
            <React.Fragment>
                <Content.ContentHd>
                    <Crumb data={getUrlParamValue('source') === 'onlineOrder'?[
                        {
                            url: '/onlineOrder/',
                            title: intl.get("purchase.add.index.onlineOrder")
                        },
                        {
                            url: '/onlineOrder/purchase/',
                            title: intl.get("purchase.add.index.onlinePurchaseOrder")
                        },
                        {
                            title: this.props.match.params.id ? intl.get("purchase.add.index.modifyPurchaseOrder"): intl.get("purchase.add.index.addPurchaseOrder")
                        }
                    ]:[
                        {
                            url: '/purchase/',
                            title: intl.get("purchase.add.index.purchase")
                        },
                        {
                            title: this.props.match.params.id ? intl.get("purchase.add.index.modifyPurchaseOrder"): intl.get("purchase.add.index.addPurchaseOrder")
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <GoodsTableFieldConfigMenu
                            tableConfigList={listFields}
                            refresh={this.resetDefaultFields}
                            type={'purchase_order'}
                        />
                    </div>
                    <TaxToolTip cookieSave={'purchase'} tip={intl.get("purchase.add.index.taxToolTip")}/>
                </Content.ContentHd>
                <Content.ContentBd>
                    <Spin
                        spinning={preData.get('isFetching') || purchaseInfo.get("isFetching")}
                    >
                        <NewAddForm id={'purchase-form-add'}
                            {...this.props}
                            onSubmit={this.handleSubmit}
                            formRef={this.formRef}
                            isModify={!!match.params.id}
                            setContinueAddFlag={this.setContinueAddFlag}
                            continueAddFlag={this.state.continueAddFlag}
                            loading={this.props.addPurchase.get('isFetching')}
                        >
                            {
                                this.formRef.current && (
                                    <React.Fragment>
                                        <NewAddForm.TopOpe>
                                            <Button type="sub" className="fr" ga-data={"purchase-copy-from-sale"}
                                                    onClick={() => this.openModal('saleOrderPopVisible')}>从销售订单选择</Button>
                                            <CopyFromSale
                                                visible={this.state.saleOrderPopVisible}
                                                visibleFlag={'saleOrderPopVisible'}
                                                onOk={this.handleSaleOrderPopOnOK}
                                                onCancel={() => this.closeModal('saleOrderPopVisible')}
                                                selectType={"radio"}
                                                popType={'goods'}
                                                unitPriceSource='orderPrice'
                                                copySource={'purchase'} //复制按钮的来源
                                            />
                                        </NewAddForm.TopOpe>
                                        <NewAddForm.BaseInfo>
                                            <BaseInfo {...this.props} formRef={this.formRef} initBaseInfo={baseInfo}
                                                      handleSelectSupplier={this.handleSelectSupplier}/>
                                        </NewAddForm.BaseInfo>
                                        <NewAddForm.ProdList>
                                            <ProdList dataPrefix={this.dataPrefix}
                                                      getRef={this.getProdRef}
                                                      formRef={this.formRef}
                                                      defaultForm={{taxRate}}
                                                      source={this.source}
                                                      prodFields={prodFields}
                                                      goodsTableConfig={goodsTableConfig}/>
                                        </NewAddForm.ProdList>
                                        <NewAddForm.OtherInfo>
                                            <OtherInfo  {...this.props}
                                                        formRef={this.formRef}
                                                        initBaseInfo={baseInfo}
                                                        getRef={this.getOtherInfoRef}
                                            />
                                        </NewAddForm.OtherInfo>
                                        <div style={{display: "none"}}>
                                            <Form.Item name="id" initialValue={purchaseInfoData && purchaseInfoData.get('id')}>
                                                <Input type="hidden"/>
                                            </Form.Item>
                                            <Form.Item name="billNo" initialValue={this.props.match.params.id}>
                                                <Input type="hidden"/>
                                            </Form.Item>
                                            <Form.Item name="fkMrpBillNo">
                                                <Input type="hidden"/>
                                            </Form.Item>
                                        </div>
                                    </React.Fragment>
                                )
                            }
                        </NewAddForm>
                    </Spin>
                </Content.ContentBd>
                <LimitOnlineTip onClose={()=>this.closeModal('showTip')} show={this.state.showTip}/>
                <SelectApproveItem
                    onClose={this.extendApproveCancelModal}
                    onOk={(id)=>{this.extendApproveOkModal(id)}}
                    show={this.state.selectApprove}
                    type={BACKEND_TYPES.purchase}
                />
            </React.Fragment>
        );
    }
}
