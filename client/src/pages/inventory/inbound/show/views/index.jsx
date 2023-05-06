import React, { Component } from 'react';
import intl from 'react-intl-universal';
import {Modal, message, Alert, Layout,Button} from 'antd';

import LogModalTable from 'components/business/logModalTable';
import Crumb from 'components/business/crumb';
import OpeBar from 'components/business/opeBar';
import FileView from 'components/business/fileView';
import {AttributeBlock} from 'components/business/attributeBlock';
import {ShowBasicBlock} from 'components/business/showBasicInfo';
import OperatorLog from 'components/business/operatorLog';
import PrintStatus from 'components/business/printStatus';
import GoodsTableFieldConfigMenu from 'components/business/goodsTableFieldConfigMenu';
import ProductList from 'components/business/productList';
import CheckWareArriveUpperLimit,{dealCheckWareUpperLimitData} from 'components/business/checkWareArriveUpperLimit';
import {actions as inboundOrderShowActions} from '../index';
import {reducer as inboundOrderShowIndex} from "../index";
import {actions as inboundOrderActions} from 'pages/inventory/inbound/index';
import {actions as outboundActions} from 'pages/inventory/outbound/add';
import {actions as vipOpeActions,withVipWrap} from "components/business/vipOpe";
import {actions as approveActions, RejectApprove, backDisabledStatus, batchBackDisabledStatusForDetail, backApproveStatusImg,ApproveProcess,
    SelectApproveItem, withApprove, BACKEND_TYPES} from 'components/business/approve';
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import {asyncFetchSerialNumQueryList} from "pages/goods/serialNumQuery/index/actions";
import {detailPage} from  'components/layout/listPage';
import {bindActionCreators} from "redux";
import IsVipJudge from 'components/business/isVipJudge';
import {connect} from "react-redux";
import {Link} from 'react-router-dom';
import Icon from 'components/widgets/icon';

import {getYmd} from 'utils/format';
import {Auth} from 'utils/authComponent';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import {formatCurrency} from 'utils/format';
import PageTurnBtn from 'components/business/pageTurnBtn';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import PrintArea from "../../../../../components/widgets/printArea/views";
import { ExclamationCircleOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

const setBillType = {
    0: 'EnterWarehouse_0',
    1: 'EnterWarehouse_1',
    2: 'EnterWarehouse_2',
    3: 'EnterWarehouse_3',
    4: 'EnterWarehouse_4',
    5: 'EnterWarehouse_5',
    6: 'EnterWarehouse_6',
    7: 'EnterWarehouse_7',
    8: 'EnterWarehouse_8',
};


const mapStateToProps = (state) => ({
    inboundOrderShow: state.getIn(['inboundOrderShowIndex', 'inboundOrderShow']),
    fetchLogInfo: state.getIn(['inboundOrderShowIndex', 'fetchLogInfo']),
    preData:  state.getIn(['outboundOrderAdd', 'preData']),
    vipService: state.getIn(['vipHome', 'vipService'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncBillNoShow: inboundOrderShowActions.asyncBillNoShow,
        asyncFetchPreData: outboundActions.asyncFetchPreData,
        //操作日志
        asyncOperationLog:inboundOrderShowActions.asyncOperationLog,
        asyncDeleteInboundOrderInfo: inboundOrderActions.asyncDeleteInboundOrderInfo,
        asyncGetApproveStatus: approveActions.asyncGetApproveStatus,  //***
        asyncOperateApprove: approveActions.asyncOperateApprove,  //***
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService,  //***
        asyncOpenVipAndSendRequestToOss: vipOpeActions.asyncOpenVipAndSendRequestToOss,
        asyncFetchSerialNumQueryList: asyncFetchSerialNumQueryList
    }, dispatch)
};

@connect(mapStateToProps, mapDispatchToProps)
@withVipWrap
@withApprove
export default class supplierShow extends detailPage{
    constructor(props) {
        super(props);
        this.state = {
            operationLogVisible: false,  // 操作日志
            selectApprove: false,  // 选择审批流弹层 ***
            approveModuleFlag: 1,
            approveStatus: 0,
            //控制重复点击按钮
            approveBtnFlag: false,
            approveRevertBtnFlag: false
        }
    }

    componentDidMount () {
        //获取Vip信息
        this.props.asyncFetchVipService();
        this.loadData();
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.match.params.id!=this.props.match.params.id){
            this.props.asyncBillNoShow(nextProps.match.params.id);
        }
    }

    loadData=(nextId)=>{
        const {match} = this.props;
        const id = nextId || match.params.id;
        if (id) {
            this.props.asyncBillNoShow(id, (res) => {
                let errorMsg = res.retCode != 0 && res.retMsg;
                if(res.retCode == "0"){
                    this.setState({
                        approveModuleFlag:res.approveModuleFlag,
                        approveStatus: res.data.approveStatus
                    })
                }
                if (errorMsg) {
                    Modal.info({
                        title: intl.get("sale.show.index.warningTip"),
                        content: errorMsg
                    });
                }
            });
        }
    };

    showConfirm = (type) => {
        const {match} = this.props;
        const id = match.params.id;
        let self = this;
        Modal.confirm({
            title: intl.get("inbound.show.index.warningTip"),
            okText: intl.get("inbound.show.index.okText"),
            cancelText: intl.get("inbound.show.index.cancelText"),
            content: intl.get("inbound.show.index.deleteConfirmContent"),
            onOk() {
                return new Promise((resolve, reject) => {
                    self.props.asyncDeleteInboundOrderInfo([id], function (res) {
                        resolve();
                        if (res.retCode == 0) {

                            if (res.partDeleteFlag == 1) {
                                if (type && type.length > 0) {
                                    let errorMsg = (type == intl.get("inbound.show.index.stockInbound")) ? intl.get("inbound.show.index.deleteMsg1") :
                                        (type == intl.get("inbound.show.index.allocateInbound")) ? intl.get("inbound.show.index.deleteMsg2") : '';
                                    errorMsg && message.warning(errorMsg);
                                }
                                else {
                                    message.success(`${intl.get("inbound.show.index.deleteMsg3")} "\n" + "\n" ${intl.get("inbound.show.index.deleteMsg4")}`);
                                }
                            }
                            else {
                                message.success(intl.get("inbound.show.index.operateSuccessMessage"));
                                self.props.history.replace('/inventory/inbound/index');
                            }


                        } else {
                            message.error(res.retMsg);
                        }
                    })
                }).catch(() => {
                        //alert("操作失败")
                })
            },
            onCancel() {
            },
        });
    };

    //添加好友/
    state = { addFirendVisible: false};
    showAddFirendModal = () => {
        this.setState({
            addFirendVisible: true,
        });
    };
    hideAddFirend = () => {
        this.setState({
            addFirendVisible: false,
        });
    };
    addFirendModal = () => {
        const  isAbizAccountFlag = false;
        isAbizAccountFlag?message.success(intl.get("inbound.show.index.addSuccessMessage"), [3]):this.showAddFirendModal();
    };


    operateBar = () => {
        const {match} = this.props;
        const id = match.params.id;
        //判断删除和修改按钮是否可以点击
        //逻辑：已审批：修改、删除按钮不可用
        let { inboundOrderShow } = this.props;
        inboundOrderShow = inboundOrderShow?inboundOrderShow.toJS():{};
        //基础信息数据处理
        if(!inboundOrderShow.data || inboundOrderShow.data.length===0) {
            return null;
        } // ***
        const objData = inboundOrderShow && inboundOrderShow.data;
        let approveModuleFlag = objData && objData.approveModuleFlag;
        let type = objData.data && objData.data.enterTypeName;
        let billNo = objData.data && objData.data.billNo;
        let enterType = objData.data && objData.data.enterType;
        const updatedTime = objData.data && objData.data.updatedTime; //审批更新时间

        // ****
        let infoData = (objData && objData.data) || {};
        infoData.approveModuleFlag = approveModuleFlag;
        let approveTask = objData && objData.approveTask;

        let prodList = (objData.data && objData.data.prodList) || [];
        let warehouseName = objData.data && objData.data.warehouseName;

        const {disabledGroup} = batchBackDisabledStatusForDetail(infoData, backDisabledStatus);
        let {
            approvePass, // 审批通过
            approveReject,  // 审批驳回
            approveRevert,  // 审批撤回
            approveSubmit, // 审批提交
            outboundApproveDisabled,
            modifyApproveDisabled,
            deleteApproveDisabled,
            operateLogApproveDisabled
        } = disabledGroup;
        // ***

        let listData =  [
            {
                name: 'edit',
                module: 'inbound',
                disabled: !modifyApproveDisabled,
                path:`/inventory/inbound/modify/${id}`
            },
            {
                name: 'delete',
                module: 'inbound',
                disabled: !deleteApproveDisabled,
                onClick: () => {
                    this.showConfirm(type);
                }
            }
        ];
        if(objData.enterType !== 7 && objData.enterType !== 8) listData.push(
            {
                name: 'copy',
                module: 'inbound',
                path:`/inventory/inbound/copy/${id}`
            },
            {
                name: 'storeOut',
                // disabled: !outboundApproveDisabled,
                path: `/inventory/outbound/add?fkInboundBillNo=${id}&outType=0`,
            }
        )
        listData.push(
            {
                name: 'export',
                module: 'inbound',
                label: intl.get("inbound.show.index.export"),
                href: `${BASE_URL}/file/download?url=/enterwares/excel/export/${id}`,
                displayBillNo: objData.data && billNo,
                templateType: setBillType[enterType]
            },
            {
                name: 'print',
                displayBillNo: objData.data && billNo,
                templateType: setBillType[enterType]
            },
            {
                name: 'interchangeLog',
                label: intl.get("inbound.show.index.operateLog"),
                hidden: !operateLogApproveDisabled,
                icon: 'icon-operation-log',
                onClick: () => {
                    this.props.asyncOperationLog(billNo);
                    this.openModal('operationLogVisible');
                }
            }, {
                name: 'approveSubmit',  //提交审批流
                label: intl.get("components.approve.approveSubmit"),
                icon: 'icon-submit',
                module: 'sale',
                hidden: !approveSubmit,
                onClick: () => {
                    //在提交审批先判断是否有批次号物品，有则判断批次号vip权限
                    //判断否是保质期物品
                    let prodList = objData.data.prodList;
                    let flag = false;
                    for(let i=0;i<prodList.length;i++){
                        if(prodList[i].expirationFlag){
                            flag = true;
                            break
                        }
                    }
                    if(!flag){
                        this.submitApprove(billNo);
                    }else{
                        //判断保质期vip是否到期
                        this.props.vipTipPop({source:"batchShelfLeft",onTryOrOpenCallback:()=>{
                                this.submitApprove(billNo);
                            }})
                    }
                }
            },{
                name: 'approveRevert',  //撤回审批流
                label: intl.get("components.approve.approveRevert"),
                icon: 'icon-cancel-copy',
                module: 'sale',
                disabled: this.state.approveRevertBtnFlag,
                hidden: !approveRevert,
                onClick: async() => {
                    /*await this.dealSerialNumRevert(prodList);
                    await this.dealBatchNumRevert(prodList);*/
                    let _this = this;
                    Modal.confirm({
                        title: '提示',
                        icon: <ExclamationCircleOutlined />,
                        content: '确认撤回审批么？',
                        onOk() {
                            _this.asyncApproveOperate({operate: 3, type: BACKEND_TYPES.inbound,billNo}, _this.loadData);
                        }
                    });

                }
            }
        );

        return (
            <React.Fragment>
                <OpeBar data={{
                    listData: listData,
                    moreData: []
                }}/>
                <div className={cx("status-img")}>
                    {
                        approvePass && (  // 审批通过按钮
                            <CheckWareArriveUpperLimit
                                callback={async() => {
                                    //在提交审批先判断是否有批次号物品，有则判断批次号vip权限
                                    //判断否是保质期物品
                                    let prodList = objData.data.prodList;
                                    let flag = false;
                                    for(let i=0;i<prodList.length;i++){
                                        if(prodList[i].expirationFlag){
                                            flag = true;
                                            break
                                        }
                                    }
                                    //严格序列号管理开启进行判断
                                   /* await this.dealSerialNum(prodList);*/

                                    if(!flag){
                                        this.asyncApproveOperate({approveTask,operate: 4,type: BACKEND_TYPES.inbound,billNo}, this.loadData);
                                    }else{
                                        //判断保质期vip是否到期
                                        this.props.vipTipPop({source:"batchShelfLeft",onTryOrOpenCallback:()=>{
                                                this.asyncApproveOperate({approveTask,operate: 4,type: BACKEND_TYPES.inbound,billNo}, this.loadData);
                                        }})
                                    }

                                }}
                                params={dealCheckWareUpperLimitData(billNo, prodList, warehouseName, 'inbound')}
                                render={() => (
                                    <Button className={cx("approve-btn")}
                                            disabled={this.state.approveBtnFlag}
                                            type={"primary"}
                                    >{intl.get("components.approve.pass")}</Button>
                                )}
                            />
                        )
                    }

                    {
                        approveReject && (  // 审批驳回按钮
                            <RejectApprove
                                okCallback={this.loadData}
                                approveTask={approveTask}
                                billNo={billNo}
                                type={BACKEND_TYPES.inbound}
                                render={() => (
                                    <Button className={cx("approve-btn")} style={{'marginLeft': '10px'}}
                                            type={"primary"}
                                            okCallback={this.loadData}
                                    >{intl.get("components.approve.reject")}</Button>
                                )}
                            />
                        )
                    }
                </div>
            </React.Fragment>
        )
    };

    submitApprove = (billNo)=>{
        let {approveModuleFlag, approveStatus} = this.state;
        this.props.submitApproveProcess(()=>this.closeModal('selectApprove'), ()=>{
            if(approveModuleFlag===1 && approveStatus===2){ // 当前单据的审批状态为反驳状态 2，则直接提交
                this.asyncApproveOperate({operate: 2, type: BACKEND_TYPES.inbound, billNo}, this.loadData);
            } else {
                this.openModal('selectApprove'); // 否则打开选择审批流弹层
            }
        });
    }

    inBoundProductList = () => {
        const {inboundOrderShow,vipService} = this.props;
        const prodList = inboundOrderShow && inboundOrderShow.getIn(['data', 'data', 'prodList']);
        /**
         *  aggregateAmount 订单优惠后总金额
         *  discountAmount 订单优惠金额
         *  taxAllAmount  订单含税总金额
         * */
        const aggregateAmount = inboundOrderShow && inboundOrderShow.getIn(['data', 'data', 'aggregateAmount']);
        const discountAmount = inboundOrderShow && inboundOrderShow.getIn(['data', 'data', 'discountAmount']);
        const taxAllAmount = inboundOrderShow && inboundOrderShow.getIn(['data', 'data', 'taxAllAmount']);
        const enterType = inboundOrderShow && inboundOrderShow.getIn(['data', 'data', 'enterType']);

        const prodDataTags = inboundOrderShow && inboundOrderShow.getIn(['data', 'prodDataTags']) && inboundOrderShow.getIn(['data', 'prodDataTags']).toJS();
        let quantityDecimalNum = getCookie("quantityDecimalNum");
        let priceDecimalNum = getCookie("priceDecimalNum");

        let dataSource = vipService.getIn(['vipData','data']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let batchShelfLeft = dataSource.BATCH_SHELF_LIFE || {};
        let batchShelfLeftFlag = (batchShelfLeft.vipState === 'TRY' || batchShelfLeft.vipState === 'OPENED');
        let priceType = enterType !== 3 ? 'purchasePrice' : 'salePrice';
        let data = [];
        prodList && prodList.map((item, index) => {
            let prodItem = item && item.toJS();
            prodItem = this.multiPreProcessDataTagValue(prodDataTags, prodItem); // 处理自定义字段中的特殊值

            let items = {
                ...prodItem,
                serial: index + 1,
                key: prodItem.id,
                quantity: fixedDecimal(prodItem.quantity, quantityDecimalNum),
                untaxedPrice: fixedDecimal(prodItem.untaxedPrice, priceDecimalNum),
                unitPrice: fixedDecimal(prodItem.unitPrice, priceDecimalNum),
                untaxedAmount: (prodItem.untaxedAmount || 0).toFixed(2),
                taxRate: prodItem.taxRate || 0,
                tax: prodItem.tax,
                amount: (prodItem.amount || 0).toFixed(2),
                //物品(采购/销售/出库/入库)自定义字段
                item_property_value1: prodItem.propertyValues && prodItem.propertyValues.property_value1,
                item_property_value2: prodItem.propertyValues && prodItem.propertyValues.property_value2,
                item_property_value3: prodItem.propertyValues && prodItem.propertyValues.property_value3,
                item_property_value4: prodItem.propertyValues && prodItem.propertyValues.property_value4,
                item_property_value5: prodItem.propertyValues && prodItem.propertyValues.property_value5,
                serialNumber: prodItem.serialNumberList,  // 序列号
                unitConverter: `1${prodItem.recUnit}=${prodItem.unitConverter}${prodItem.unit}`,
                recQuantity: fixedDecimal(prodItem.recQuantity, quantityDecimalNum),
            };
            //批次号vip服务器内
            batchShelfLeftFlag && (
                items.batchNo = prodItem.batchNo,
                items.expirationDate = prodItem.expirationDate?moment(prodItem.expirationDate).format('YYYY-MM-DD'):null,
                items.productionDate = prodItem.productionDate?moment(prodItem.productionDate).format('YYYY-MM-DD'):null
            );
            data.push(items);
        });

        return (
            <ProductList
                productList={data}
                aggregateAmount={aggregateAmount}
                discountAmount={discountAmount}
                taxAllAmount={taxAllAmount}
                moduleType={'inbound'}
                priceType={priceType}
                fieldConfigType={'wareEnter_serial'}
                prodDataTags={prodDataTags}
                batchShelfLeftFlag = {batchShelfLeftFlag}
            />
        )
    };

    closeModal = type => {
        this.setState({
            [type]: false
        })
    };

    openModal = type => {
        this.setState({
            [type]: true
        })
    };
    // 操作日志
    operationLog = () => {
        const {fetchLogInfo} = this.props;
        let logInfo = fetchLogInfo && fetchLogInfo.get('data');
        console.log(logInfo && logInfo.toJS(), 'logInfo');
        const data = logInfo && logInfo.map((item, index) => {
            return {
                key: index,
                serial: index + 1,
                operateLoginName: item.get('operatedLoginName'),
                operation: item.get('operation'),
                operateTime: getYmd(item.get('operatedTime'))
            }
        });

        return (
            <LogModalTable title={intl.get("inbound.show.index.operateLog")}
                           columns="operationColumns"
                           logVisible={this.state.operationLogVisible}
                           logData={data}
                           cancelCallBack={() => this.closeModal('operationLogVisible')}
            />
        )
    };

    resetDefaultFields = ()=>{
        let billNo = this.props.match.params.id;
        this.props.asyncBillNoShow(billNo);
    };

    //处理序列号物品
    dealSerialNum = (prods) =>{
        //需要处理序列号物品serialNumber 字段是否为空
        return new Promise((resolve, reject) => {
            //优先获取是否开启全选
            let flag = true;
            if(flag){
            //序列号存在
            //序列号数量与基本单位数量不相等
            //序列号中存在系统内已有的对应物品序列号，并且状态为在库
                for(let i=0;i<prods.length;i++){
                    let currentProd = prods[i];
                    if(currentProd.serialNumberList){
                        let recQuantity = currentProd.recQuantity;
                        if(recQuantity != currentProd.serialNumberList.length){
                            message.error(`物品${currentProd.prodName}序列号数量于入库数量不一致`);
                            reject();
                        }else{
                            this.props.asyncFetchSerialNumQueryList({},(data)=>{
                                if(data.retCode == 0){
                                    let serialList = data.list;
                                    let serialNumberList = currentProd.serialNumberList;
                                    let promiseFlag = true;
                                    for(let j=0;j<serialList.length;j++){
                                        //序列号列表中存有物品里的序列并且状态为在库
                                        let serialNumber = serialList[j].serialNumber;
                                        if(serialNumberList.indexOf(serialNumber) != -1 && serialList[j].instoreStatus == 0){
                                            message.error(`物品${currentProd.prodName}序列号:${serialNumber}已在库中，请勿重复入库`);
                                            promiseFlag = false;
                                            reject();
                                            break;
                                        }
                                    }
                                    promiseFlag?resolve():null;
                                }
                            });
                        }
                    }else{
                        resolve();
                    }
                }
                console.log(prods,'prods');
            }else{
                resolve();
            }
        });
    }

    //处理序列号物品审批撤回
    dealSerialNumRevert = (prodList) =>{
        return new Promise((resolve, reject) => {
            let flag = true;
            if(flag){
                for(let i=0;i<prodList.length;i++){
                   let serialNumberList = prodList[i].serialNumberList;
                   //获取序列号列表数据
                   this.props.asyncFetchSerialNumQueryList({},(data)=>{
                       if(data.retCode == 0){
                           let serialList = data.list;
                           let promiseFlag = true;
                           for(let j=0;j<serialList.length;j++){
                               let serialNumber = serialList[j].serialNumber;
                               if(serialNumberList.indexOf(serialNumber) != -1 && serialList[j].instoreStatus != 0){
                                   message.error(`物品${prodList[i].prodName}序列号:${serialNumber}已不在库，无法撤回入库单`);
                                   reject();
                                   break;
                               }
                           }
                           promiseFlag?resolve():null;
                       }
                   });
                }
            }else{
                resolve()
            }
        });
    }

    //处理批次负库存审批撤回
    dealBatchNumRevert = (prodList) =>{
        return new Promise((resolve, reject) => {
            let flag = true;
           if(flag){

           }else{
               resolve()
           }

        });
    }

    render(){
        let { inboundOrderShow } = this.props;
        const listFields = inboundOrderShow && inboundOrderShow.getIn(['data', 'listFields']);
        inboundOrderShow = inboundOrderShow?inboundOrderShow.toJS():{};

        //基础信息数据处理
        const objData = inboundOrderShow && inboundOrderShow.data.data;
        const objData1 = inboundOrderShow && inboundOrderShow.data;
        const detailData = inboundOrderShow && objData !== '' && objData;
        let billNo =  objData && objData.billNo;
        let printStatus = objData && objData.printState;
        let enterType = objData1.data && objData1.data.enterType;
        let approveStatus = objData1.data && objData1.data.approveStatus;
        const processData =  objData1 && objData1.flowState;
        //approveFlag 1是开启，0是关闭
        let approveModuleFlag = objData1.approveModuleFlag;
        const tags = inboundOrderShow && inboundOrderShow.data.tags;
        const basicInfoData = objData && [{
            name: intl.get("inbound.show.index.displayBillNo"),
            value: objData.displayBillNo,
            highlight: true
        },{
            name: intl.get("inbound.show.index.enterDate"),
            value: moment(objData.enterDate).format("YYYY-MM-DD")
        },{
            name: intl.get("inbound.show.index.warehouseName"),
            value: objData.warehouseName
        },{
            name: intl.get("inbound.show.index.enterType"),
            value: intl.get(objData.enterTypeName)
        }];
        if(objData && undefined != objData.displayOrderNo){
            basicInfoData.push({
                name: intl.get("inbound.show.index.displayOrderNo"),
                value: objData.displayOrderNo,
                isLink: true,
                href: '/purchase/show/'+objData.fkPurchaseOrderBillNo,
                fkSaleOrderBillNo: objData.fkPurchaseOrderBillNo
            });
        } else if(objData && objData.fkSaleOrderBillNo){
            basicInfoData.push({
                name: "销售单号",
                isLink: true,
                href: '/sale/show/'+objData.fkSaleOrderBillNo,
                value: objData.displaySaleOrderNo,
                fkSaleOrderBillNo: objData.fkSaleOrderBillNo
            })
        }

        //如果是委外加工单类型，显示上游的委外加工单编号
        if(objData && objData.enterType == 6){
            let billNo;
            let url;
            if(objData.originType === 'PRODUCE'){
                billNo = objData.fkProduceNo;
                url =  '/produceOrder/show/'+billNo;
            }else{
                billNo = objData.wwBillNo;
                url =  '/subcontract/show/'+billNo;
            }
            basicInfoData.push({
                name: "上游单据",
                value: billNo,
                isLink: true,
                href: url,
                fkSaleOrderBillNo: billNo
            });
        }

        // 如果是生产入库（5），显示上游的生产单编号, 生产入库有2种（1.直接新增的，无上游单据 2.生产单详情页-成品入库，有上游单据）
        if(objData && objData.enterType === 5 && !!objData.fkProduceNo){
            basicInfoData.push({
                name: "上游单据",
                value: objData.fkProduceNo,
                isLink: true,
                href: '/produceOrder/show/'+objData.fkProduceNo,
                fkProduceNo: objData.fkProduceNo
            });
        }

        // 生产退料入库（7） 委外退料入库（8），显示上游的生产单编号
        if(objData && (objData.enterType === 7 || objData.enterType === 8)){
            basicInfoData.push({
                name: "上游单据",
                value: objData.fkProduceNo,
                isLink: true,
                href: '/produceOrder/show/'+objData.fkProduceNo,
                fkProduceNo: objData.fkProduceNo
            });
        }

        /*if(objData && objData.enterType === 8){
            basicInfoData.push({
                name: "入库方",
                value: objData.supplierName
            },{
                name: "联系人",
                value: objData.supplierContacterName
            },{
                name: "联系电话",
                value: objData.supplierMobile
            });
        }*/


        let otherInfoData = objData && [{
            name: (objData.enterType === 0) ?  intl.get("inbound.show.index.supplier") :
                (objData.enterType === 3) ? intl.get("inbound.show.index.customer") : intl.get("inbound.show.index.warehousingParty"),
            value: (objData.enterType === 0||objData.enterType === 6) ? objData.supplierName :
                (objData.enterType === 3) ? objData.customerName : (objData.enterType === 8)?objData.supplierName:objData.otherEnterWarehouseName,
        }, {
            name: intl.get("inbound.show.index.linkMan"),
            value: objData.enterType === 6 || objData.enterType === 8 ?objData.supplierContacterName: objData.enterType === 7 ? objData.otherEnterWarehouseContacterName:objData.customerContacterName
        }, {
            name: intl.get("inbound.show.index.projectName"),
            value: objData.projectName
        }];

        tags && tags.forEach((value) => {
            let propName = value.propName;
            let mappingName = value.mappingName;
            const propertyIndex = mappingName && parseInt(mappingName.substr(mappingName.length - 1));
            if (propName && propName !== "" && mappingName) {
                otherInfoData.push({
                    name: propName,
                    value: objData[`propertyValue${propertyIndex}`] || ""
                })
            }
        });

        otherInfoData = otherInfoData &&  otherInfoData.concat([ {
            name: intl.get("inbound.show.index.ourContacterName"),
            value: objData.ourContacterName
        },{
            name: intl.get("inbound.show.index.remarks"),
            value: objData.remarks
        }]);

        (objData && objData.enterType !== '4') && otherInfoData.splice(2, 0 ,{
            name: intl.get("inbound.show.index.customerTelNo"), value: objData.enterType === 6?objData.supplierMobile:objData.enterType === 8?objData.supplierMobile:objData.customerTelNo
        });


        //脚注信息处理
        /*const footInfoClassNames = "footnote";

        const footInfoData = objData && [{
            name: "制单人",
            value: objData.addedLoginName
        }, {
            name: "制单时间",
            value: getYmd(objData.addedTime)
        }, {
            name: "最后修改人",
            value: objData.updatedLoginName
        }, {
            name: "最后修改时间",
            value: getYmd(objData.updatedTime)
        }];*/

        return(
            <Layout>
                {/*面包屑*/}
                <div className="content-hd">
                    <Crumb data={[
                        {
                            title: intl.get("inbound.show.index.inbound")
                        },
                        {
                            url: '/inventory/inbound/',
                            title: intl.get("inbound.show.index.inboundList")
                        },
                        {
                            title: intl.get("inbound.show.index.detail")
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <GoodsTableFieldConfigMenu
                            tableConfigList={listFields}
                            refresh={this.resetDefaultFields}
                            type={'wareEnter_serial'}
                        />
                    </div>
                    <div className={cx("float-right")}>
                        <IsVipJudge templateType={setBillType[enterType]}/>
                    </div>
                </div>

                <div className={"detail-content"} style={{position:"relative"}}>
                    {this.operateBar()}
                    <PrintArea>
                        <div className="detail-content-bd" style={{position:"relative"}}>
                            <PageTurnBtn type={"inbound"}  current={objData && objData.billNo}/>
                            <div className={"detail-main-attr cf"} style={{padding:"24px 5px"}}>
                                {
                                    (printStatus === 0 ||  printStatus === 1)?<PrintStatus status={printStatus} billNo={billNo}/>:null
                                }
                                <AttributeBlock data={basicInfoData}/>
                            </div>
                            {
                                approveModuleFlag == 1 && (
                                    <div className={cx("status-img-lst")}>
                                        <img src={backApproveStatusImg(approveStatus, intl.get("home.picFlag"))} width={120}/>
                                    </div>
                                )
                            }
                            {detailData && this.inBoundProductList()}
                            {/*<ShowBasicBlock data={otherInfoData}/>*/}
                            <div className="detail-sub-attr">
                                <AttributeBlock data={otherInfoData}/>
                                <div>
                                    <div style={{
                                        display: 'inline-block',
                                        verticalAlign: 'top',
                                        fontSize: '14px',
                                        color: '#666',
                                        marginRight: '10px',
                                        lineHeight: '30px'
                                    }}>{intl.get("inbound.index.record.tempAtt")}：
                                    </div>
                                    <div style={{display: 'inline-block', lineHeight: '30px'}}>
                                        {
                                            objData && objData.fileInfo && objData.fileInfo.map((file) => {
                                                return (
                                                        <div key={file.fileId}>
                                                            <a style={{color: '#499fff'}}
                                                               href={`${BASE_URL}/file/download/?url=/file/download/${file.fileId}`}
                                                            >
                                                                {file.fileName}
                                                            </a>
                                                            <FileView fileId={file.fileId} fileName={file.fileName}/>
                                                        </div>
                                                )
                                            })
                                        }

                                    </div>
                                </div>
                            </div>




                            <OperatorLog logInfo={{
                                creator: objData && (objData.addedName || objData.addedLoginName),
                                createDate: objData && getYmd(objData.addedTime),
                                lastModifier: objData && (objData.updatedName || objData.updatedLoginName),
                                lastModifyDate: objData && getYmd(objData.updatedTime),
                                approveModuleFlag: approveModuleFlag,
                                approvedLoginName: objData && objData.approvedLoginName,
                                approvedTime: objData && getYmd(objData.approvedTime),
                            }}/>

                            <ApproveProcess data={processData} approveStatus={approveStatus}/>
                            {/*<AttributeBlock data={footInfoData} classNames={footInfoClassNames} />*/}
                        </div>
                    </PrintArea>


                    <Modal
                        title={intl.get("inbound.index.record.warningTip")}
                        visible={this.state.addFirendVisible}
                        onOk={this.hideAddFirend}
                        onCancel={this.hideAddFirend}
                        width={800}
                        okText={intl.get("inbound.index.record.okText")}
                        cancelText={intl.get("inbound.index.record.cancelText")}
                    >
                        <Alert
                            message="Warning"
                            description={intl.get("inbound.index.record.wxInviteFriend")}
                            type="warning"
                            showIcon
                        />
                        <img src="/images/abizRegister.png" alt={intl.get("inbound.index.record.wxInviteFrienTip")}/>
                    </Modal>
                    {this.operationLog()}

                    <SelectApproveItem  // 选择审批流 ***
                        onClose={this.extendApproveCancelModal}
                        onOk={(id)=>{this.extendApproveOkModal(id,billNo,BACKEND_TYPES.inbound,this.loadData)}}
                        show={this.state.selectApprove}
                        type={BACKEND_TYPES.inbound}
                    />
                </div>
            </Layout>
        )
    }
}


