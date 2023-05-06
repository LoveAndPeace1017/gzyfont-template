import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {Form, Input, message, Spin, Modal} from 'antd';
import {withRouter} from "react-router-dom";
import {
    ExclamationCircleOutlined
} from '@ant-design/icons';
import {getUrlParamValue} from 'utils/urlParam';
import {getCookie} from 'utils/cookie';
import {formatCurrency, removeCurrency} from 'utils/format';
import {newAddForm as AddForm, actions as addFormActions, formCreate} from 'components/layout/addForm';
import Content from 'components/layout/content';
import Crumb from 'components/business/crumb';
import GoodsTableFieldConfigMenu, {actions as fieldConfigActions} from 'components/business/goodsTableFieldConfigMenu';
import TaxToolTip from 'components/business/taxToolTip';
import LimitOnlineTip from 'components/business/limitOnlineTip';
import {checkWareArriveUpperLimit, dealCheckWareUpperLimitData, actions as wareUpperLimitActions} from 'components/business/checkWareArriveUpperLimit';
import {asyncFetchPreData, asyncAddQuotation, asyncFetchQuotationById, emptyDetailData} from '../actions';
import {actions as customerShowActions} from 'pages/customer/add';
import {actions as addGoodsActions} from 'pages/goods/add';
import {addPage} from  'components/layout/listPage';
import { withPreProcessProd, SaleProdList as ProdList, CurrencySaleProdList as CurrencyProdList } from 'components/business/goods';
import {actions as approveActions, SelectApproveItem, BACKEND_TYPES, withApprove} from 'components/business/approve';
import {actions as vipOpeActions} from "components/business/vipOpe";
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import { actions as rateAction} from 'pages/auxiliary/rate';
import {actions as commonActions} from "components/business/commonRequest";

import formMap from '../dependencies/initFormMap';
import BaseInfo from './baseInfo';
import OtherInfo from './otherInfo';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import {fromJS} from "immutable";
import 'url-search-params-polyfill';
import _ from "lodash";
import moment from "moment-timezone/index";

const cx = classNames.bind(styles);

const mapStateToProps = (state) => ({
    addQuotation: state.getIn(['quotationAdd', 'addQuotation']),
    quotationInfo: state.getIn(['quotationAdd', 'quotationInfo']),
    preData:  state.getIn(['quotationAdd', 'preData']),
    goodsInfo: state.getIn(['goods', 'goodsInfo']),
    rateList: state.getIn(['auxiliaryRate', 'rateList']),
    goodsTableConfig: state.getIn(['goodsTableFieldConfigMenu', 'goodsTableConfig']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchPreData,
        asyncAddQuotation,
        asyncFetchQuotationById,
        emptyDetailData,
        asyncFetchGoodsById: addGoodsActions.asyncFetchGoodsById,
        asyncShowCustomer: customerShowActions.asyncShowCustomer,
        asyncShowCustomerForSelect: customerShowActions.asyncShowCustomerForSelect,
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
export default class SaleAddForm extends addPage {
    formRef = React.createRef();
    dataPrefix = 'prod';
    source='QUOTATION';
    fieldConfigType = 'saleOrder';
    constructor(props) {
        super(props);
        this.state={
            copyFromOrderVisible: false,
            customerNo: '',
            deliveryAddrData: fromJS([]),
            showTip: false,
            selectApprove: false,  // 选择审批流弹层
            approveModuleFlag: 0,  // 当前模块是否开启审批权限 0 无 1 有
            approveStatus: 0,   //审批状态 0 未提交  1 通过  2 反驳  3 审批中
            submitData: {}, // 新增最终提交表单的信息
            continueAddFlag: true,  //连续新增Flag
            typeKey: "SaleOrder"
        };
    }

    componentDidMount() {
        this.preDataProcess();
    }

    componentWillUnmount() {
        this.props.emptyDetailData();
        // 保存字段配置
        this.props.asyncSaveFieldConfig(this.fieldConfigType);
        this.props.emptyFieldConfig()
    }

    /** 初始化数据的流程 */
    preDataProcess = async () => {
        const {match} = this.props;
        //修改页面或复制页面
        let id = match.params.id || match.params.copyId;
        let modifyBackData = {};
        let params = new URLSearchParams(this.props.location.search);
        let customerNo = params && params.get('customerNo')||"";
        const productCode = params && params.get('productCode');    // 单独带入的物品信息
        await this.initPreData();
        await this.initRate();
        productCode && await this.initSingleGoods(productCode);
        if(id) modifyBackData = await this.initModifyData(id);
        customerNo = modifyBackData.customerNo || customerNo;
        let initFlag = !!id;
        if(customerNo) await this.handleSelectCustomer(customerNo, initFlag);
        this.getContinueCreateFlag();
        this.props.setInitFinished();
    };

    getProdRef = (prodRef)=>{
        this.prodRef = prodRef;
    };

    getBaseRef = (baseRef) => {
        this.baseRef = baseRef;
    };

    getOtherInfoRef = (otherInfoRef) => {
        this.otherInfoRef = otherInfoRef
    };

    // 预处理修改时物品数据
    preProcessProd = ({prodList, billProdDataTags}) => {
        prodList = _.map(prodList, (item) => {
            let {id,addedTime,entNum,isDeleted,minQuantity,maxQuantity,orderCode,orderCodeV2,categoryCode,
                quantityDelivered,unEntNum,updatedTime,thumbnailUri,serialNumberList,...out} = item;
            let unitConverter = out.unitConverter || 1;
            let unitConverterText = `1${out.recUnit || out.unit}=${unitConverter || 1}${out.unit}`;
            if(!out.productCode){
                out.productCode = out.prodNo;
            }
            if(out.deliveryDeadlineDate) {
                out.deliveryDeadlineDate = moment(out.deliveryDeadlineDate);
            }
            if(out.amount){
                out.amount = removeCurrency(formatCurrency(out.amount, 2, true))
            }
            out = this.preProcessDataTags(out, billProdDataTags);  // 预处理自定义单据物品字段
            return {
                ...out,
                unitConverter,
                unitConverterText
            };
        });
        return prodList;
    };

    /** 初始化数据 */
    initPreData = () => {
        return new Promise((resolve, reject) => {
            this.props.asyncFetchPreData(data=>{
                if(data.retCode === '0'){
                    let currencyVipFlag = getCookie("currencyVipFlag");
                    if(data.tags){
                        this.otherInfoRef.createCustomFields(data.tags);
                    }
                    if(data.currencyId && currencyVipFlag === "true"){
                        // 初始化默认币种
                        this.initForm({currencyId: data.currencyId, quotation: 100});
                        // 默认币种时，牌价不可以修改
                        this.baseRef.setState({quotationDisabled: true});
                    }
                    resolve();
                }
            });
        })
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
            this.props.asyncFetchQuotationById(id, data=>{
                let _this = this;
                let info = data.data||{};
                // 初始化修改物品
                let prodList = this.preProcessProd({prodList: info.prodList, billProdDataTags: data.billProdDataTags});
                // 设置当前单据的审批状态
                this.setState({
                    approveStatus: data.data.approveStatus,
                    approveModuleFlag: data.approveModuleFlag
                });
                if(info.approveStatus == 1 && data.approveFlag == 1 && !match.params.copyId){
                    Modal.warning({
                        title: intl.get("sale.add.index.warningTip"),
                        okText: intl.get("sale.add.index.okText"),
                        content: intl.get("sale.add.index.orderHasApproveTipContent"),
                        onOk() {
                            _this.props.history.goBack();
                        }
                    });
                    reject();
                }
                // 默认币种时，牌价不可以修改
                this.baseRef.setState({quotationDisabled: info.currencyFlag});
                // 初始化表单数据
                this.initForm(info, {tags: data.tags});
                // 初始化物品表单数据
                this.initProdForm(prodList);
                // 初始化合计
                this.initFormTotal(info);
                resolve({customerNo: info.customerNo});
            })
        })
    };

    /** 初始化合计 */
    initFormTotal = (info) => {
        let {taxAllAmount: totalAmount, totalQuantity,
            aggregateAmount, discountAmount, currencyAggregateAmount: currencyTotalAmount} = info;
        this.prodRef.props.setTotalForm({totalQuantity, totalAmount, aggregateAmount, discountAmount, currencyTotalAmount});
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
    initForm = (info, otherInfo)=>{
        info = this.initFormData(info, otherInfo);
        this.initFormField(formMap, info);
    };

    /** 初始化表单数据 */
    initFormData = (info, otherInfo={}) => {
        console.log(info, 'info');
        // 处理ourContacterName字段
        if(info.ourContacterName && info.departmentName){
            info.ourContacterName = info.departmentName +'-'+info.ourContacterName;
        }
        // 处理自定义列表字段
        info.propertyValues = this.preProcessDataTags(info.propertyValues, otherInfo.tags);
        return info;
    };

    /** 处理销售员字段 */
    dealSaleNameField = (values) => {
        if(values.ourContacterName){
            let nameGroup = values.ourContacterName.split('-');
            if(values.ourContacterName && nameGroup.length === 2){
                values.departmentName = nameGroup[0];
                values.ourContacterName = nameGroup[1];
            }
        }
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
        let {match, preData, quotationInfo} = this.props;
        let billProdDataTags;
        if(match.params.id){
            billProdDataTags = quotationInfo && quotationInfo.getIn(['data', 'billProdDataTags']);
        }else{
            billProdDataTags = preData && preData.getIn(['data', 'billProdDataTags']);
        }
        billProdDataTags = billProdDataTags && billProdDataTags.toJS();
        let prodList = _.filter(values.prod, (item) => item);
        let formData = this.prodRef.props.formData;
        prodList = _.map(prodList, (item, idx) => {
            let {amount,diasbleFlag,key,orderPrice,quantity,recQuantity,salePrice,
                serial,tax,taxRate,unitConverterText,unitPrice,untaxedAmount,
                untaxedPrice,wareIsFetching,...form} = formData[idx];
            item.propertyValues = {};
            _.forEach(billProdDataTags, (tag) => {
                let propertyValue = item[tag.mappingName];
                if(propertyValue || propertyValue === 0) {
                    item.propertyValues[tag.mappingName.slice(5)] = propertyValue;
                }
                delete item[tag.mappingName];
            });
            item.taxRate = item.taxRate || 0;
            item.unit = (!form.unit) ? item.recUnit : form.unit;
            return {...form, ...item};
        });
        delete values[this.dataPrefix];
        values.prodList = prodList;
    };

    /** 处理其他信息*/
    dealOtherInfo = (values) => {
        if(this.props.match.params.copyId) values.id = null;  // 复制状态将id置为0
        values.fileIds = this.otherInfoRef.state.fileList.map(item => item.response.fileId);
        values.discountAmount = values.discountAmount || 0;
        values.customerNo = values.customer && values.customer.key;
        values.customerName = values.customer && values.customer.label;
    };

    /** 处理表单提交数据*/
    dealSubmitFormInfo = (values) => {
        this.dealSaleNameField(values); //处理销售员字段
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
                }else if(res===2) {
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
        /*await this.validateWarehouseArriveUpperLimit(module, values);*/
        /**  审批是否开启*/
        /*if(await this.backApproveFlag(module)){  // 审批开启
            /!** 校验审批操作,如果符合条件，执行提交操作，审批为所有操作最后一步*!/
            await this.validateApproveStatus(module, values);
        } else {
            /!** 审批未开启 直接提交*!/
            await new Promise( (resolve, reject) => {
                this.setState({submitData: values}, () => {
                    this.cancelApproveOperate();
                    reject();
                });
            })
        }*/
        await new Promise( (resolve, reject) => {
            this.setState({submitData: values}, () => {
                this.cancelApproveOperate();
                reject();
            });
        });
    };

    handleSubmit = async (values) => {
        console.log(values + 'Received values of form');
        /** 处理表单提交数据 */
        this.dealSubmitFormInfo(values);
        /** 后端校验工作，如符合条件则提交表单*/
        await this.backendValidateAndSubmit('sale', values);
        /** 提交表单数据 */
        this.asyncSubmit();
    };

    // 提交表单数据（新加）
    asyncSubmit=()=>{
        let values = this.state.submitData;
        this.props.asyncAddQuotation(values.billNo, values, (res) => {
            if (res.data.retCode === '0') {
                let displayId = res.data.data;
                message.success(intl.get("sale.add.index.operateSuccessMessage"));
                this.props.emptyFieldChange();
                let continueAddFlag = !this.props.match.params.id && this.state.continueAddFlag;
                let url = continueAddFlag ? '/blank' :`/quotation/show/${displayId}`;
                this.props.history.push(url);
                if(continueAddFlag) this.props.history.replace('/quotation/add');
            } else if(res.data.retCode == '2001' && res.data.retMsg === 'limitException' ) {
                this.setState({showTip:true});
            }  else if (res.data.retCode == '2019'){
                Modal.info({
                    icon: <ExclamationCircleOutlined/>,
                    title: intl.get("sale.add.index.warningTip"),
                    content: (
                        <div>
                            <p>{intl.get("sale.add.index.vipExpireTip")}</p>
                            <a style={{color:'#0066dd'}} target="_blank" href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true">{intl.get("sale.add.index.treatyText")}</a>
                        </div>
                    )
                });
                return false;
            } else {
                Modal.error({
                    title: intl.get("sale.add.index.warningTip"),
                    content: (res.data.retValidationMsg && res.data.retValidationMsg.msg && res.data.retValidationMsg.msg[0].msg)||(res.data.retValidationMsg && res.data.retValidationMsg.rowMsg && res.data.retValidationMsg.rowMsg[0].msgs[0].msg)||res.data.retMsg
                })
            }
        })
    };

    //选择客户后，带入联系人联系电话以及客户交货地址
    handleSelectCustomer = (customerNo, isInit)=>{
        this.setState({
            customerNo
        });
        return new Promise((resolve, reject) => {
            if(customerNo){
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
                                deliveryAddress: ''
                            });
                        }

                        //设置客户交货地址列表
                        const customerAddressList = data.getIn(['data', 'customerAddressList']);
                        this.setState({
                            deliveryAddrData: customerAddressList
                        });
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    };

    // 当牌价发生改变时
    handleQuotationOnChange = (quotation) => {
        if(this.prodRef.props.handleQuotationOnChange){
            this.prodRef.props.handleQuotationOnChange(quotation);
        }
    };

    resetDefaultFields = ()=>{
        const {match} = this.props;
        const id = match.params.id;
        if(id){
            this.props.asyncFetchQuotationById(id, ()=>{
                this.props.setInitFinished();
            })
        }else{
            this.props.asyncFetchPreData(()=>{
                this.props.setInitFinished();
            });
        }
    };

    render() {
        let currencyVipFlag = getCookie("currencyVipFlag");
        const {quotationInfo, preData, match, goodsTableConfig, rateList} = this.props;
        let listFields, billFields, prodFields;
        // 默认税率
        let taxRate = rateList && rateList.getIn(['rate', 'defaultValue']);
        if(match.params.id){
            listFields  = quotationInfo && quotationInfo.getIn(['data', 'listFields']);
            billFields = quotationInfo && quotationInfo.getIn(['data', 'billProdDataTags']);
            prodFields = quotationInfo && quotationInfo.getIn(['data', 'prodDataTags']);
        }else{
            listFields  = preData && preData.getIn(['data', 'listFields']);
            billFields = preData && preData.getIn(['data', 'billProdDataTags']);
            prodFields = preData && preData.getIn(['data', 'prodDataTags']);
        }

        //修改页面或复制页面
        let id = match.params.id || match.params.copyId;

        let quotationInfoData,
            baseInfo;
        if(id){
            quotationInfoData = quotationInfo && quotationInfo.getIn(['data', 'data']);
            if(quotationInfoData && quotationInfoData.get('billNo') === id) {
                baseInfo = quotationInfoData;
            }
        }

        return (
            <React.Fragment>
                <Content.ContentHd>
                    <Crumb data={[
                        {
                            url: '/quotation/',
                            title: "报价单"
                        },
                        {
                            title: this.props.match.params.id? "修改报价单" : "新建报价单"
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <GoodsTableFieldConfigMenu
                            tableConfigList={listFields}
                            refresh={this.resetDefaultFields}
                            type={'saleOrder'}
                        />
                    </div>
                    <TaxToolTip cookieSave={'sale'} tip={intl.get("sale.add.index.taxToolTip")}/>
                </Content.ContentHd>
                <Content.ContentBd>
                    <Spin
                        spinning={preData.get('isFetching') || quotationInfo.get("isFetching")}
                    >
                        <AddForm {...this.props}
                                 id={'purchase-form-add'}
                                 formRef={this.formRef}
                                 onSubmit={this.handleSubmit}
                                 isModify={!!match.params.id}
                                 setContinueAddFlag={this.setContinueAddFlag}
                                 continueAddFlag={this.state.continueAddFlag}
                                 loading={this.props.addQuotation.get('isFetching')}
                        >
                            {
                                this.formRef.current && (
                                    <React.Fragment>
                                        <AddForm.BaseInfo>
                                            <BaseInfo
                                                {...this.props}
                                                formRef={this.formRef}
                                                getRef={this.getBaseRef}
                                                currencyVipFlag={currencyVipFlag}
                                                handleSelectCustomer={this.handleSelectCustomer}
                                                handleQuotationOnChange={this.handleQuotationOnChange}
                                            />
                                        </AddForm.BaseInfo>
                                        <AddForm.ProdList>
                                            {
                                                currencyVipFlag === 'true' ? (
                                                    <CurrencyProdList dataPrefix={this.dataPrefix}
                                                                      getRef={this.getProdRef}
                                                                      formRef={this.formRef}
                                                                      defaultForm={{taxRate,recQuantity:1,quantity:1}}
                                                                      source={this.source}
                                                                      billFields={billFields}
                                                                      prodFields={prodFields}
                                                                      goodsPopCondition={{customerNo: this.state.customerNo}}
                                                                      billType={"listForSaleOrder"}
                                                                      goodsTableConfig={goodsTableConfig}/>
                                                ) : (
                                                    <ProdList dataPrefix={this.dataPrefix}
                                                              getRef={this.getProdRef}
                                                              formRef={this.formRef}
                                                              defaultForm={{taxRate,recQuantity:1,quantity:1}}
                                                              source={this.source}
                                                              billFields={billFields}
                                                              prodFields={prodFields}
                                                              goodsPopCondition={{customerNo: this.state.customerNo}}
                                                              billType={"listForSaleOrder"}
                                                              goodsTableConfig={goodsTableConfig}/>
                                                )
                                            }


                                        </AddForm.ProdList>
                                        <AddForm.OtherInfo>
                                            <OtherInfo  {...this.props}
                                                        initBaseInfo={baseInfo}
                                                        formRef={this.formRef}
                                                        getRef={this.getOtherInfoRef}
                                                        deliveryAddrData={this.state.deliveryAddrData}
                                            />
                                        </AddForm.OtherInfo>
                                        <div style={{display: "none"}}>
                                            <Form.Item name="id">
                                                <Input type="hidden"/>
                                            </Form.Item>
                                            <Form.Item name="billNo" initialValue={this.props.match.params.id}>
                                                <Input type="hidden"/>
                                            </Form.Item>
                                        </div>
                                    </React.Fragment>
                                )
                            }
                        </AddForm>
                    </Spin>
                </Content.ContentBd>
                <LimitOnlineTip onClose={()=>this.closeModal('showTip')} show={this.state.showTip}/>
                <SelectApproveItem
                    onClose={this.extendApproveCancelModal}
                    onOk={(id)=>{this.extendApproveOkModal(id)}}
                    show={this.state.selectApprove}
                    type={BACKEND_TYPES.sale}
                />
            </React.Fragment>
        );
    }
}
