import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link} from 'react-router-dom';
import {Layout, Modal, Spin, Button, message, Tabs} from 'antd';
import Crumb from 'components/business/crumb';
import IsVipJudge from 'components/business/isVipJudge';
import PrintArea from 'components/widgets/printArea';
import FileView from 'components/business/fileView';
import PrintStatus from 'components/business/printStatus';
import {actions as purchaseAddActions} from 'pages/purchase/add';
import {actions as purchaseIndexActions} from 'pages/purchase/index';
import {actions as operActions} from 'components/business/operateOrder';
import SelectGoodsOrFitting from 'components/business/goodsPop';
import {
    WareEnterBatchEdit,
    FinanceExpendBatchEdit,
    FinanceInvoiceBatchEdit
} from 'components/business/batchEditPop';

import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import OpeBar from 'components/business/opeBar';
import LogModalTable from 'components/business/logModalTable';
import {AttributeBlock, AttributeInfo} from 'components/business/attributeBlock';
import {asyncSend2supplier} from '../actions';
import {asyncExpressInfo} from  '../actions';
import OperatorLog from 'components/business/operatorLog';
import PurchaseOrderOperate from 'components/business/operateOrder';
import LimitOnlineTip from 'components/business/limitOnlineTip';
import InviteModal from 'components/widgets/invite';
import {ConvertButton} from 'components/business/authMenu';
import GoodsTableFieldConfigMenu from 'components/business/goodsTableFieldConfigMenu';
import ProductList from 'components/business/productList';
import CheckWareArriveUpperLimit,{dealCheckWareUpperLimitData} from 'components/business/checkWareArriveUpperLimit';
import BacklogRecord from 'components/business/backlog';
import Fold from 'components/business/fold';
import SendEmail2Supplier from './sendEmail2Supplier';
import {getYmd} from "utils/format";
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import PageTurnBtn from 'components/business/pageTurnBtn';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import Icon from 'components/widgets/icon';
import Tooltip from 'components/widgets/tooltip';
import {InboundRecord} from 'pages/inventory/inbound/index'
import {ExpendRecord} from 'pages/finance/expend/index'
import {InvoiceRecord} from 'pages/finance/invoice/index'
import {MessageRecommend} from 'pages/purchase/show';
import {Auth} from 'utils/authComponent';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import {getUrlParamValue} from 'utils/urlParam';
import {actions as approveActions, RejectApprove, backDisabledStatus, batchBackDisabledStatusForDetail, backApproveStatusImg,ApproveProcess,
    SelectApproveItem, withApprove, BACKEND_TYPES, batchPermitOperate} from 'components/business/approve';
import {withVipWrap} from "components/business/vipOpe";
import {withState} from 'components/business/commonHigherOrderComponent';
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import {detailPage} from  'components/layout/listPage';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);
const {TabPane} = Tabs;

const InterchangeStatus = {
    notSend: 0,
    unAccepted: 1,
    accepted: 2,
    cancelled: 3
};

const mapStateToProps = (state) => ({
    purchaseInfo: state.getIn(['purchaseAdd', 'purchaseInfo']),
    fetchLogInfo: state.getIn(['purchaseAdd', 'fetchLogInfo']),
    convertToLocalProd: state.getIn(['operateOrder', 'convertToLocalProd']),
    send2supplier: state.getIn(['purchaseDetail', 'send2supplier']),
    expressInfo: state.getIn(['purchaseDetail', 'expressInfo'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchPurchaseById: purchaseAddActions.asyncFetchPurchaseById,
        updateProdBindInfo: purchaseAddActions.updateProdBindInfo,
        asyncBindProduct: purchaseAddActions.asyncBindProduct,
        asyncUnbindProduct: purchaseAddActions.asyncUnbindProduct,
        asyncConvertToLocalProd: operActions.asyncConvertToLocalProd,
        emptyDetailData: purchaseAddActions.emptyDetailData,
        asyncFetchOperationLog: purchaseAddActions.asyncFetchOperationLog,
        asyncDeletePurchaseInfo: purchaseIndexActions.asyncDeletePurchaseInfo,
        asyncBeforeDeletePurchaseInfo: purchaseIndexActions.asyncBeforeDeletePurchaseInfo,
        asyncSend2supplier,
        asyncExpressInfo,
        asyncGetApproveStatus: approveActions.asyncGetApproveStatus,
        asyncOperateApprove: approveActions.asyncOperateApprove,
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService
    }, dispatch)
};

@connect(mapStateToProps, mapDispatchToProps)
@withState
@withVipWrap
@withApprove
export default class Index extends detailPage {
    constructor(props) {
        super(props);
        this.state = {
            interchangeLogVisiable: false, //往来日志
            operationLogVisible: false,  // 操作日志
            operateModalVisiable: false,
            goodsPopVisible: false,
            stockInPopVisible: false,
            expendBatchPopVisible: false,
            invoiceBatchPopVisible: false,
            operateType: '', //'cancel' or 'accept'
            sendEmailVisible: false,
            addFriendVisible: false,
            expressVisible: false,
            showTip: false,
            selectApprove: false,  // 选择审批流弹层 ***
            approveModuleFlag: 1,
            approveStatus: 0,
            //控制重复点击按钮
            approveBtnFlag: false,
            approveRevertBtnFlag: false
        }
    }

    componentDidMount() {
        this.loadData();
        this.props.asyncExpressInfo({billNo:this.props.match.params.id});
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.match.params.id!=this.props.match.params.id){
            this.loadData(nextProps.match.params.id);
            this.props.asyncExpressInfo({billNo:nextProps.match.params.id});
        }
    }

    loadData = (nextId) => {
        const {match} = this.props;
        const id = nextId || match.params.id;
        if (id) {
            this.props.asyncFetchPurchaseById(id, (res) => {
                let errorMsg = res.retCode != 0 && res.retMsg;
                if(res.retCode == "0"){
                    this.setState({
                        approveModuleFlag:res.approveModuleFlag,
                        approveStatus: res.data.approveStatus
                    })
                }
                if (errorMsg) {
                    Modal.info({
                        title: intl.get("purchase.show.index.warningTip"),
                        content: errorMsg
                    });
                }
            })
        }
    };

    showConfirm = () => {
        const {match} = this.props;
        const id = match.params.id;

        let self = this;

        self.props.asyncBeforeDeletePurchaseInfo([id], (res)=> {
            Modal.confirm({
                title: intl.get("purchase.show.index.warningTip"),
                okText: intl.get("purchase.show.index.okText"),
                cancelText: intl.get("purchase.show.index.cancelText"),
                content: res == 1? intl.get("purchase.show.index.deleteConfirmContent_1"): intl.get("purchase.show.index.deleteConfirmContent_2"),
                okButtonProps:{
                    'ga-data':'list-delete-ok'
                },
                cancelButtonProps:{
                    'ga-data':'list-delete-cancel'
                },
                onOk() {
                    return new Promise((resolve, reject) => {
                        self.props.asyncDeletePurchaseInfo([id], function(res) {
                            resolve();
                            if (res.retCode == 0) {
                                message.success(intl.get("purchase.show.index.deleteSuccessMessage"));
                                self.props.history.replace('/purchase/')
                            }
                            else {
                                message.error(res.retMsg);
                            }
                        });
                    }).catch(() => {
                        //alert("操作失败")
                    })

                },
                onCancel() {
                },
            });
        });



    };

    getInfo() {
        const {purchaseInfo} = this.props;
        return purchaseInfo && purchaseInfo.getIn(['data', 'data']);
    }

    purchaseBillInfo = () => {
        const interchangeStatus = this.getInfo() && this.getInfo().get('interchangeStatus');
        const info = this.getInfo();

        return (
            <div className={"detail-main-attr cf"}>
                {/*{
                    (interchangeStatus !== InterchangeStatus.unAccepted
                        && interchangeStatus !== InterchangeStatus.cancelled) && (
                        <span style={{
                            color: 'red',
                            paddingTop: 5,
                            fontSize: 16,
                            paddingRight: 15,
                            float: 'left'
                        }}>
                        {info.get('state') == 0 ? '未完成入库' : '已完成入库'}
                        </span>
                    )
                }*/}
                <AttributeInfo data={{
                    name: intl.get("purchase.show.index.displayBillNo"),
                    value: info.get('displayBillNo'),
                    highlight: true
                }}/>

                {/*<div className={cx("status")}>
                    {this.stateDesc()}
                </div>*/}
                <AttributeInfo data={{
                    name: intl.get("purchase.show.index.purchaseOrderDate"),
                    value: moment(info.get('purchaseOrderDate')).format('YYYY-MM-DD')
                }}/>
                <AttributeInfo data={{
                    name: intl.get("purchase.show.index.warehouseName"),
                    value: info.get('warehouseName')
                }}/>
                <AttributeInfo data={{
                    name: intl.get("purchase.show.index.supplierName"),
                    value: info.get('supplierName')
                }}/>
                <AttributeInfo data={{
                    name: intl.get("purchase.show.index.supplierContacterName"),
                    value: info.get('supplierContacterName')
                }}/>
                <AttributeInfo data={{
                    name: intl.get("purchase.show.index.supplierMobile"),
                    value: info.get('supplierMobile')
                }}/>

                {!this.isLocalBill() && info.get('hasUnbindProdFlag') && (
                    <ConvertButton
                        loadingFlag={this.props.convertToLocalProd.get('isFetching')}
                        style={{float: 'right'}}
                        clickHandler={this.convertToMyGoods}
                        title={intl.get("purchase.show.index.oneKeyToMyProd")}
                        module={"goods"}
                        option={"add"}
                    />
                )}
            </div>
        );
    };

    convertToMyGoods = () => {
        const {match} = this.props;
        const id = match.params.id;
        Modal.confirm({
            title: intl.get("purchase.show.index.warningTip"),
            content: intl.get("purchase.show.index.convertToMyGoodsContent"),
            onOk: () => {
                this.props.asyncConvertToLocalProd('purchase', [id], res => {
                    if (res && res.retCode == 0) {
                        this.loadData();
                        message.success(intl.get("purchase.show.index.operateSuccessMessage"));
                    }
                });
            }
        })
    };

    isLocalBill = () => {
        const interchangeStatus = this.getInfo() && this.getInfo().get('interchangeStatus');
        return interchangeStatus === InterchangeStatus.notSend;
    };

    bindProduct = (prodInfo) => {
        this.props.asyncBindProduct(prodInfo, (res) => {
            let errorMsg = res.retCode !== 0 && res.retMsg;
            if (errorMsg) {
                Modal.info({
                    title: intl.get("purchase.show.index.warningTip"),
                    content: errorMsg
                });
            }
            else {
                this.props.updateProdBindInfo(prodInfo);
                // this.props.asyncFetchSaleById();
                Modal.info({
                    title: intl.get("purchase.show.index.warningTip"),
                    content: intl.get("purchase.show.index.bindSuccessContent")
                });
                this.loadData();
            }
        });
    };

    unbindProduct = (prodInfo) => {
        this.props.asyncUnbindProduct(prodInfo, (res) => {
            let errorMsg = res.retCode !== 0 && res.retMsg;
            if (errorMsg) {
                Modal.info({
                    title: intl.get("purchase.show.index.warningTip"),
                    content: errorMsg
                });
            }
            else {
                this.props.updateProdBindInfo(prodInfo);
                this.loadData();
            }
        });
    };

    handleBind = (selectedRows, visibleKey) => {
        this.closeModal(visibleKey);
        if (selectedRows.length > 0) {
            const item = selectedRows[0];
            const bindOpInfo = {
                prodNo: item.code,
                supplierNo: this.getInfo().get('supplierCode'),
                supplierProdNo: this.pendingBindInfo.supplierProdNo
            };

            this.bindProduct(bindOpInfo);
        }
    };

    handleBindOrUnBind = (prodInfo) => {
        if (prodInfo.prodNo && prodInfo.prodNo.length > 1) {
            const bindOpInfo = {
                prodNo: prodInfo.prodNo,
                supplierNo: this.getInfo().get('supplierCode'),
                supplierProdNo: prodInfo.supplierProdNo
            };
            this.unbindProduct(bindOpInfo);
        }
        else {
            this.pendingBindInfo = prodInfo;
            this.openModal('goodsPopVisible');
        }
    };

    purchaseProductList = () => {
        const {purchaseInfo} = this.props;
        const prodList = purchaseInfo && purchaseInfo.getIn(['data', 'data', 'prodList']);
        /**
         *  aggregateAmount 订单优惠后总金额
         *  discountAmount 订单优惠金额
         *  taxAllAmount  订单含税总金额
         * */
        const aggregateAmount = purchaseInfo && purchaseInfo.getIn(['data', 'data', 'aggregateAmount']);
        const discountAmount = purchaseInfo && purchaseInfo.getIn(['data', 'data', 'discountAmount']);
        const taxAllAmount = purchaseInfo && purchaseInfo.getIn(['data', 'data', 'taxAllAmount']);
        const isLocalBill = this.isLocalBill();

        const prodDataTags = purchaseInfo && purchaseInfo.getIn(['data', 'prodDataTags']) && purchaseInfo.getIn(['data', 'prodDataTags']).toJS();
        let quantityDecimalNum = getCookie("quantityDecimalNum");
        let priceDecimalNum = getCookie("priceDecimalNum");

        let data = prodList.map((item, index) => {
            const unBind = (item.get('productCode') || '').length <= 1;
            const supplierProductCode = item.get('supplierProductCode') || '';
            let operate = null;
            if (!isLocalBill) {
                if (supplierProductCode.length > 1) {
                    operate = unBind ? intl.get("purchase.show.index.bind"): intl.get("purchase.show.index.unBind");
                }
                else {
                    operate = unBind ? intl.get("purchase.show.index.bind") : null;
                }
            }

            let prodItem = item && item.toJS();
            prodItem = this.multiPreProcessDataTagValue(prodDataTags, prodItem); // 处理自定义字段中的特殊值

            return {
                ...prodItem,
                serial: index + 1,
                key: prodItem.id,
                prodCustomNo: prodItem.prodCustomNo,
                supplierProdNo: prodItem.supplierProductCode,
                displayCode: unBind ? prodItem.supplierProductDisplayCode : prodItem.prodCustomNo,
                //物品(采购/销售/出库/入库)自定义字段
                item_property_value1: prodItem.propertyValues && prodItem.propertyValues.property_value1,
                item_property_value2: prodItem.propertyValues && prodItem.propertyValues.property_value2,
                item_property_value3: prodItem.propertyValues && prodItem.propertyValues.property_value3,
                item_property_value4: prodItem.propertyValues && prodItem.propertyValues.property_value4,
                item_property_value5: prodItem.propertyValues && prodItem.propertyValues.property_value5,
                quantity: fixedDecimal(prodItem.quantity, quantityDecimalNum),
                untaxedPrice: fixedDecimal(prodItem.untaxedPrice, priceDecimalNum),
                unitPrice: fixedDecimal(prodItem.unitPrice, priceDecimalNum),
                untaxedAmount: (prodItem.untaxedAmount || 0).toFixed(2),
                taxRate: prodItem.taxRate || 0,
                tax: prodItem.tax,
                amount: (prodItem.amount || 0).toFixed(2),
                inQuantity: fixedDecimal(prodItem.entNum, quantityDecimalNum),
                unStockIn: fixedDecimal(prodItem.unEntNum, quantityDecimalNum),
                deliveryDeadlineDate: prodItem.deliveryDeadlineDate && moment(prodItem.deliveryDeadlineDate).format('YYYY-MM-DD'),
                operate: operate,
                isFetching: prodItem.isFetching || false,
                unitConverter: `1${prodItem.recUnit}=${prodItem.unitConverter}${prodItem.unit}`,
                recQuantity: fixedDecimal(prodItem.recQuantity, quantityDecimalNum),
                returnNum: fixedDecimal(prodItem.returnNum, quantityDecimalNum),
                actualNum: fixedDecimal(prodItem.actualNum, quantityDecimalNum)
            }
        }).toArray();
        return (
            <ProductList
                productList={data}
                aggregateAmount={aggregateAmount}
                discountAmount={discountAmount}
                taxAllAmount={taxAllAmount}
                moduleType={'purchase'}
                priceType={'purchasePrice'}
                fieldConfigType={'purchase_order'}
                prodDataTags={prodDataTags}
                operateClick={this.handleBindOrUnBind}
            />
        )

    };

    // 代办事项
    backlogList = () => {
        const {match} = this.props;
        const id = match.params.id;
        const info = this.getInfo();
        return (
            <BacklogRecord source={'purchase'}
                           dataNo={id}
                           displayDataNo={info.get('displayBillNo')}
            />
        )
    };

    openModal = type => {
        this.setState({
            [type]: true
        })
    };

    closeModal = type => {
        this.setState({
            [type]: false
        })
    };

    operateBar = () => {
        const info = this.getInfo();
        if (!info) {
            return null;
        }

        const interchangeStatus = info.get('interchangeStatus');
        const updatedTime =info.get('updatedTime'); //审批更新时间
        const billNo = info.get('billNo');
        const {purchaseInfo} = this.props;
        const approveModuleFlag = purchaseInfo.getIn(['data', 'approveModuleFlag']);  // 是否开启审批功能 0 无 1 有
        const processData =  purchaseInfo.getIn(['data', 'flowState']) && purchaseInfo.getIn(['data', 'flowState']).toJS();

        let infoData = info&&info.toJS();
        infoData.approveModuleFlag = approveModuleFlag;
        let prodList = info && info.prodList || [];
        let warehouseName = info && info.warehouseName;

        let approveTask = purchaseInfo.getIn(['data', 'approveTask']);
        let permitGroup = batchPermitOperate('purchase', processData);

        const {disabledGroup} = batchBackDisabledStatusForDetail(infoData, backDisabledStatus);
        let {
            approvePass, // 审批通过
            approveReject,  // 审批驳回
            approveRevert,  // 审批撤回
            approveSubmit, // 审批提交
            inboundApproveDisabled,
            invoiceApproveDisabled,
            expendApproveDisabled,
            modifyApproveDisabled,
            deleteApproveDisabled,
            operateLogApproveDisabled,
            refundApproveDisabled
        } = disabledGroup;

        let {inboundApproveEnabled, invoiceApproveEnabled, expendApproveEnabled} = permitGroup || {};

        let listAction = [];
        if (interchangeStatus == InterchangeStatus.notSend || interchangeStatus == InterchangeStatus.accepted) {
            listAction.push({
                name: 'storeIn',
                module: 'inbound',
                disabled: (interchangeStatus == InterchangeStatus.notSend && !inboundApproveDisabled) && !inboundApproveEnabled,
                option: 'add',
                onClick: () => {

                    let _self = this;
                    if (!this.isLocalBill() && info.get('hasUnbindProdFlag')) {
                        Modal.confirm({
                            title: intl.get("purchase.show.index.warningTip"),
                            okText: intl.get("purchase.show.index.okText"),
                            cancelText: intl.get("purchase.show.index.cancelText"),
                            content: (
                                <React.Fragment>
                                    <div>
                                        <strong>{intl.get("purchase.show.index.message1")}</strong>
                                    </div>
                                    <p style={{marginTop: '20px', textSize: '10px'}}>
                                        {intl.get("purchase.show.index.message2")}
                                    </p>
                                </React.Fragment>),
                            onOk() {
                                return new Promise((resolve, reject) => {
                                    _self.props.asyncConvertToLocalProd('purchase', [_self.getInfo().get('billNo')], res => {
                                        resolve();
                                        if (res && res.retCode == 0) {
                                            _self.openModal('stockInPopVisible');
                                            _self.loadData();
                                        }
                                        else {
                                            if(res.retCode == undefined && res.status === false){
                                                _self.setState({showTip:true})
                                            }else{
                                                message.error(res && res.retMsg);
                                            }
                                        }
                                    });

                                }).catch(() => {
                                    //alert("操作失败")
                                })

                            },
                            onCancel() {
                            },
                        });
                    }
                    else {
                        this.openModal('stockInPopVisible');
                    }
                }
            });
            listAction = listAction.concat([
                {
                    name: 'purchaseInvoice',
                    module: 'invoice',
                    disabled: (interchangeStatus == InterchangeStatus.notSend && !invoiceApproveDisabled) && !invoiceApproveEnabled,
                    option: 'add',
                    onClick: () => this.openModal('invoiceBatchPopVisible')
                    // path: `/finance/invoice/add?fkDisplayBillNo=${this.getInfo().get('displayBillNo')}&fkBillNo=${this.getInfo().get('billNo')}&amount=${this.totalAmount}&supplier=${this.getInfo().get('supplierName')}`
                },
                {
                    name: 'payment',
                    module: 'expend',
                    disabled: (interchangeStatus == InterchangeStatus.notSend && !expendApproveDisabled) && !expendApproveEnabled,
                    option: 'add',
                    onClick: () => this.openModal('expendBatchPopVisible')
                    // path: `/finance/expend/add?fkDisplayBillNo=${this.getInfo().get('displayBillNo')}&fkBillNo=${this.getInfo().get('billNo')}&amount=${this.totalAmount}&supplier=${this.getInfo().get('supplierName')}`
                },
                {
                    name: 'refund',
                    module: 'outbound',
                    option: 'add',
                    hidden: !refundApproveDisabled,
                    path: `/inventory/outbound/add?fkPurchaseBillNo=${billNo}&outType=3`,
                }
            ]);
        }
        listAction = listAction.concat([
            {
                name: 'edit',
                path: '/purchase/modify/' + billNo + `?source=${getUrlParamValue('source')}&current=${getUrlParamValue('current')}`,
                module: 'purchase',
                disabled: interchangeStatus === InterchangeStatus.unAccepted || interchangeStatus === InterchangeStatus.accepted || interchangeStatus === InterchangeStatus.cancelled || (interchangeStatus == InterchangeStatus.notSend && !modifyApproveDisabled)
            },
            {
                name: 'delete',
                module: 'purchase',
                onClick: () => {
                    this.showConfirm();
                },
                disabled: interchangeStatus === InterchangeStatus.unAccepted || interchangeStatus === InterchangeStatus.accepted || (interchangeStatus == InterchangeStatus.notSend && !deleteApproveDisabled)
            },
            {
                name: 'copy',
                module: 'purchase',
                onClick: () => {
                    if (!this.isLocalBill() && info.get('hasUnbindProdFlag')) {
                        Modal.warning({
                            title: intl.get("purchase.show.index.warningTip"),
                            content: intl.get("purchase.show.index.purchaseBindProd")
                        })
                    }
                    else {
                        this.props.history.push('/purchase/copy/' + billNo + `?source=${getUrlParamValue('source')}&current=${getUrlParamValue('current')}`)
                    }

                }
            }
        ]);

        listAction = listAction.concat([
            {
                name: 'export',
                module: 'purchase',
                label: intl.get("purchase.show.index.export"),
                href: `${BASE_URL}/file/download?url=/purchases/excel/export/${billNo}`,
                displayBillNo: billNo,
                templateType: 'PurchaseOrder'
            },
            {
                /*module: 'purchase',*/
                name: 'print',
                displayBillNo: billNo,
                templateType: 'PurchaseOrder'
            }
        ]);

        interchangeStatus == InterchangeStatus.notSend && approveModuleFlag == 1 && listAction.push(
            {
                name: 'interchangeLog',
                label: intl.get("purchase.show.index.operateLog"),
                icon: 'icon-operation-log',
                module: 'purchase',
                hidden: !operateLogApproveDisabled,
                onClick: () => {
                    this.props.asyncFetchOperationLog(billNo);
                    this.openModal('operationLogVisible');
                }
            },{
                name: 'approveSubmit',  //提交审批流
                label: intl.get("components.approve.approveSubmit"),
                icon: 'icon-submit',
                module: 'purchase',
                hidden: !approveSubmit,
                onClick: () => {
                    let {approveModuleFlag, approveStatus} = this.state;
                    this.props.submitApproveProcess(()=>this.closeModal('selectApprove'), ()=>{
                        if(approveModuleFlag===1 && approveStatus===2){ // 当前单据的审批状态为反驳状态 2，则直接提交
                            this.asyncApproveOperate({operate: 2, type: BACKEND_TYPES.purchase, billNo}, this.loadData);
                        } else {
                            this.openModal('selectApprove'); // 否则打开选择审批流弹层
                        }
                    });
                }
            },{
                name: 'approveRevert',  //撤回审批流
                label: intl.get("components.approve.approveRevert"),
                icon: 'icon-cancel-copy',
                module: 'purchase',
                disabled: this.state.approveRevertBtnFlag,
                hidden: !approveRevert,
                onClick: () => {
                    let _this = this;
                    Modal.confirm({
                        title: '提示',
                        icon: <ExclamationCircleOutlined />,
                        content: '确认撤回审批么？',
                        onOk() {
                            _this.asyncApproveOperate({operate: 3, type:BACKEND_TYPES.purchase,billNo}, _this.loadData);
                        }
                    });
                }
            }
        );


        interchangeStatus != 0 && listAction.push({
            name: 'interchangeLog',
            label: intl.get("purchase.show.index.interchangeLog"),
            icon: 'icon-log',
            onClick: () => {
                this.openModal('interchangeLogVisiable');
            }
        });
        (interchangeStatus == InterchangeStatus.accepted) && listAction.push(
            {
                name: 'express',
                module: 'purchase',
                label: intl.get("purchase.show.index.express"),
                icon: 'icon-delivery-address',
                onClick: () => {
                    this.openModal('expressVisible');
                }

            }
        );

        listAction.push(
            {
                name: 'messageRecommend',
                onClick: () => {
                    this.props.vipTipPop({
                        source: "smsNotify",
                        onTryOrOpenCallback: async ()=>{
                            const name = info.get('supplierContacterName');
                            const mobile = info.get('supplierMobile');
                            await this.messageRecommendRef.validateSmsNumber(); // 校验短信数量不足
                            await this.messageRecommendRef.validateContacterInfo({name, mobile}); // 校验联系人&联系电话
                            this.messageRecommendRef.openModal(); // 打开弹层
                            this.messageRecommendRef.getMessageRecommendLog(); // 获取操作日志
                        }}
                    )
                }
            }
        );

        return (
            <React.Fragment>
                <OpeBar data={{
                    listData: listAction,
                    moreData: []
                }}/>
                <div className={cx("status-btn")}>
                    {
                        approvePass && (  // 审批通过按钮
                            <CheckWareArriveUpperLimit
                                callback={() => this.asyncApproveOperate({approveTask,operate: 4,type:BACKEND_TYPES.purchase,billNo}, this.loadData)}
                                params={dealCheckWareUpperLimitData(billNo, prodList, warehouseName, 'purchase')}
                                render={() => (
                                    <Button disabled={this.state.approveBtnFlag} className={cx("approve-btn")}
                                            type={"primary"}
                                    >{intl.get("components.approve.pass")}</Button>
                                )}
                            />
                        )
                    }
                    {
                        approveReject && (  // 审批驳回按钮
                            <RejectApprove
                                approveTask={approveTask}
                                billNo={billNo}
                                type={BACKEND_TYPES.purchase}
                                okCallback={this.loadData}
                                render={() => (
                                    <Button className={cx("approve-btn")} style={{'marginLeft': '10px'}}
                                            type={"primary"}
                                            okCallback={this.loadData}
                                    >{intl.get("components.approve.reject")}</Button>
                                )}
                            />
                        )
                    }
                    <MessageRecommend
                        getRef={(messageRecommendRef) => this.messageRecommendRef = messageRecommendRef}
                        source={'order'}
                        billNo={billNo}
                        date={moment(info.get('purchaseOrderDate')).format('YYYY年MM月DD日')}
                    />
                </div>
            </React.Fragment>
        )
    };

    purchaseBaseInfo = () => {
        const {purchaseInfo} = this.props;
        const info = this.getInfo() || {};
        const address = [];

        if (info.get('deliveryProvinceText')) {
            address.push(info.get('deliveryProvinceText'));
        }
        if (info.get('deliveryCityText')) {
            address.push(info.get('deliveryCityText'));
        }
        if (info.get('deliveryAddress')) {
            address.push(info.get('deliveryAddress'));
        }

        const data = [
            {
                name: intl.get("purchase.show.index.deliveryAddress"),
                value: (address.length > 0 && address.join('  ')) || ''
            },
            {
                name: intl.get("purchase.show.index.projectName"),
                value: info.get('projectName')
            },
            {
                name: intl.get("purchase.show.index.settlement"),
                value: info.get('settlement')
            },
            {
                name: intl.get("purchase.show.index.ourName"),
                value: info.get('ourName')
            },
            {
                name: intl.get("purchase.show.index.ourContacterName"),
                value: info.get('ourContacterName')
            },
            {
                name: intl.get("purchase.show.index.ourTelNo"),
                value: info.get('ourTelNo')
            }
        ];
        const tags = purchaseInfo && purchaseInfo.getIn(['data', 'tags']);
        const data1 = purchaseInfo.getIn(['data', 'data']);
        const detailData = purchaseInfo && data1 !== '' && data1;


        tags && tags.forEach((value) => {
            let propName = value.get('propName');
            let mappingName = value.get('mappingName');
            const propertyIndex = mappingName && parseInt(mappingName.substr(mappingName.length - 1));
            if (propName && propName !== "" && mappingName) {
                data.push({
                    name: propName,
                    value: info.get(`propertyValue${propertyIndex}`) || ""
                })
            }
        });
        return (
            <div className="detail-sub-attr">
                <AttributeBlock data={data}/>
                <AttributeBlock data={[{
                    name: intl.get("purchase.show.index.contractTerms"),
                    value: info.get('contractTerms')
                }]}/>
                <div>
                    <div style={{
                        display: 'inline-block',
                        verticalAlign: 'top',
                        fontSize: '14px',
                        color: '#666',
                        marginRight: '10px',
                        lineHeight: '30px'
                    }}> {intl.get("purchase.show.index.tempAtt")}：
                    </div>
                    <div style={{display: 'inline-block', lineHeight: '30px'}}>
                        <Auth
                            module="purchase"
                            option="appendix"
                        >
                            {
                                (isAuthed) =>
                                    (
                                        <>
                                            {
                                                detailData && detailData.get("fileInfo") && detailData.get("fileInfo").toJS().map((file) => {
                                                    return (
                                                        <>
                                                            {
                                                                isAuthed?(
                                                                    <div key={file.fileId}>
                                                                        <a style={{color: '#499fff'}}
                                                                           href={`${BASE_URL}/file/download/?url=/file/download/${file.fileId}`}
                                                                        >
                                                                            {file.fileName}
                                                                        </a>
                                                                        <FileView fileId={file.fileId} fileName={file.fileName}/>
                                                                    </div>
                                                                ):(
                                                                    <div>
                                                                        {file.fileName}
                                                                    </div>
                                                                )
                                                            }
                                                        </>
                                                    )
                                                })
                                            }
                                        </>
                                    )
                            }
                        </Auth>
                    </div>
                </div>
            </div>
        );
    };

    // 往来日志
    interchangeLog = () => {
        const {purchaseInfo} = this.props;
        let logInfo = purchaseInfo && purchaseInfo.getIn(['data', 'data', 'interchangeRecords']);
        const data = logInfo.map((item, index) => {
            return {
                key: index,
                serial: index + 1,
                operateTime: getYmd(item.get('operateTime')),
                role: item.get('operatorCompanyName'),
                context: item.get('context')
            }
        });

        return (
            <LogModalTable title={intl.get("purchase.show.index.interchangeLog")}
                           columns="interchangeColumns"
                           logVisible={this.state.interchangeLogVisiable}
                           logData={data}
                           cancelCallBack={() => this.closeModal('interchangeLogVisiable')}
            />
        );
    };

    // 操作日志
    operationLog = () => {
        const {fetchLogInfo} = this.props;
        let logInfo = fetchLogInfo && fetchLogInfo.get('data');
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
            <LogModalTable title={intl.get("purchase.show.index.operateLog")}
                           columns="operationColumns"
                           logVisible={this.state.operationLogVisible}
                           logData={data}
                           cancelCallBack={() => this.closeModal('operationLogVisible')}
            />
        )
    };

    sendToSupplier = () => {
        const {match} = this.props;
        const billNo = match.params.id;
        //判断该供应商是否有百卓账号
        const twoWayBindFlag = this.getInfo() && this.getInfo().get('twoWayBindFlag');
        if (twoWayBindFlag === 0) {
            //调用邀请供应商注册弹层（等qiu那边做好的调用下）
            this.setState({
                addFriendVisible: true
            })
        }
        else if (twoWayBindFlag === 1) {
            Modal.warning({
                title: intl.get("purchase.show.index.warningTip"),
                content: intl.get("purchase.show.index.twoWayBind")
            })
        }
        else if (twoWayBindFlag === 2) {
            this.props.asyncSend2supplier(billNo, res => {
                if (res.data.retCode === '0') {
                    this.loadData();
                    message.success(intl.get("purchase.show.index.operateSuccessMessage"))
                }
                else if (res.data.retMsg) {
                    Modal.info({
                        title: intl.get("purchase.show.index.warningTip"),
                        content: res.data.retMsg
                    });
                }
            });
        }
    };

    // 取消订单成功后取消刷新页面
    orderOpCallback = (result) => {
        if (result) {
            this.loadData();
        }
    };

    renderOperatorButton = () => {
        const interchangeStatus = this.getInfo() && this.getInfo().get('interchangeStatus');
        const state = this.getInfo() && this.getInfo().get('state');
        const payState = this.getInfo() && this.getInfo().get('payState');
        const invoiceState = this.getInfo() && this.getInfo().get('invoiceState');
        const {match} = this.props;
        const id = match.params.id;
        let opeStr = null;
        if (state === 0 && payState === 0 && invoiceState === 0) {
            /*if (interchangeStatus === InterchangeStatus.notSend) {
                opeStr = (
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={this.props.send2supplier.get('isFetching')}
                        onClick={this.sendToSupplier}
                        ga-data={'send-to-supplier'}
                    >
                        发给供应商
                    </Button>
                )
            }
            else*/
            if (interchangeStatus == InterchangeStatus.unAccepted || interchangeStatus == InterchangeStatus.accepted) {
                opeStr = (
                    <Button
                        type="default"
                        onClick={
                            () => this.setState({
                                operateType: 'cancel',
                                operateModalVisiable: true,
                            })
                        }>
                        {intl.get("purchase.show.index.cancelOrder")}
                    </Button>
                )
            }
        }
        return (
            <React.Fragment>
                {opeStr ? (
                    <div className="content-fd">
                        {opeStr}
                        <PurchaseOrderOperate visible={this.state.operateModalVisiable}
                                              visibleFlag={'operateModalVisiable'}
                                              billNo={id}
                                              operateCallback={this.orderOpCallback}
                                              reasonOptions={[
                                                  {
                                                      key: intl.get("purchase.show.index.wrongMsg1"),
                                                      value: intl.get("purchase.show.index.wrongMsg1"),
                                                  },
                                                  {
                                                      key: intl.get("purchase.show.index.wrongMsg2"),
                                                      value: intl.get("purchase.show.index.wrongMsg2"),
                                                  },
                                                  {
                                                      key: intl.get("purchase.show.index.wrongMsg3"),
                                                      value: intl.get("purchase.show.index.wrongMsg3"),
                                                  },
                                                  {
                                                      key: intl.get("purchase.show.index.wrongMsg4"),
                                                      value: intl.get("purchase.show.index.wrongMsg4"),
                                                  }
                                              ]}
                                              billType={'purchase'}
                                              supplierName={this.getInfo().get('supplierName')}
                                              closeModal={this.closeModal}
                                              popType={this.state.operateType}
                        />
                    </div>
                ) : null}
            </React.Fragment>
        )
    };

    componentWillUnmount() {
        this.props.emptyDetailData();
    }

    stateDesc = () => {
        const interchangeStatus = this.getInfo() && this.getInfo().get('interchangeStatus');
        switch (interchangeStatus) {
            case InterchangeStatus.unAccepted:
                return <span className="ui-status ui-status-unaccept">{intl.get("purchase.show.index.notReceive")}</span>;
            case InterchangeStatus.accepted:
                return <span className="ui-status ui-status-accepted">{intl.get("purchase.show.index.receive")}</span>;
            case InterchangeStatus.cancelled:
                return <span className="ui-status ui-status-cancel">{intl.get("purchase.show.index.cancel")}</span>;
            default:
                return null;
        }
    };

    handleTabClick = (activeKey) => {
        this.props.history.replace({
            pathname: this.props.location.pathname,
            search: this.props.location.search,
            hash: activeKey
        });
    };

    copyText = (waybillNo) =>{
        let oInput = document.createElement('input');
        oInput.value = waybillNo;
        document.body.appendChild(oInput);
        oInput.select();
        document.execCommand("Copy");
        oInput.style.display = 'none';
        document.body.removeChild(oInput);
        message.success(intl.get("purchase.show.index.copySuccessMessage"));

    };

    popModal = (title, content, icon, theme) => {
        Modal.confirm({
            icon: <Icon type={icon} theme={theme || 'filled' } />,
            title: title,
            content: content
        })
    };

    resetDefaultFields = (billNo)=>{
        this.props.asyncFetchPurchaseById(billNo)
    };

    render() {
        const {purchaseInfo, expressInfo} = this.props;
        const data = purchaseInfo.getIn(['data', 'data']);
        const listFields = purchaseInfo && purchaseInfo.getIn(['data', 'listFields']);
        const approveModuleFlag = purchaseInfo.getIn(['data', 'approveModuleFlag']); //是否开启审批权
        const approveFlag = purchaseInfo.getIn(['data', 'approveFlag']); // 是否开启审批权限 0 无 1 有
        const approveStatus = data && data.get('approveStatus');  //审批状态 0 未通过 1通过
        const updatedTime =data && data.get('updatedTime'); //审批更新时间
        const interchangeStatus = data && data.get('interchangeStatus');
        const billNo = data && data.get('billNo');
        let printStatus = data && data.get('printState');
        const displayBillNo = data && data.get('displayBillNo');  // 采购展示编号
        const processData =  purchaseInfo.getIn(['data', 'flowState']) && purchaseInfo.getIn(['data', 'flowState']).toJS();
        const detailData = purchaseInfo && data !== '' && data;
        const supplierCode = data && data.get('supplierCode');
        const activeKey = this.props.location.hash.replace('#', '');
        const {match} = this.props;
        const id = match.params.id;
        let renderContent = null;
        if (purchaseInfo && purchaseInfo.get('isFetching')) {
            renderContent = <Spin className="gb-data-loading"/>;
        }
        else if (detailData) {
            renderContent = (
                <React.Fragment>
                    {
                        (printStatus === 0 ||  printStatus === 1)?<PrintStatus status={printStatus} billNo={billNo}/>:null
                    }
                    {this.purchaseBillInfo()}
                    {this.interchangeLog()}
                    {this.operationLog()}
                    {this.purchaseProductList()}
                    {this.purchaseBaseInfo()}
                    {this.backlogList()}
                    <OperatorLog logInfo={{
                        creator: data.get('addedName')||data.get('addedLoginName'),
                        createDate: getYmd(data.get('addedTime')),
                        lastModifier: data.get('updatedName')||data.get('updatedLoginName'),
                        lastModifyDate: getYmd(data.get('updatedTime')),
                        approvedLoginName: data.get('approvedLoginName'),
                        approvedTime: data.get('approvedTime') && getYmd(data.get('approvedTime')),
                        approveModuleFlag: (approveModuleFlag==1 && interchangeStatus == InterchangeStatus.notSend) ? 1 : 0 ,
                    }}/>
                    <ApproveProcess data={processData} approveStatus={approveStatus}/>
                </React.Fragment>
            )
        }

        //物流信息
        const dataWarehouseOut = expressInfo.getIn(['data', 'dataWarehouseOut']);

        return (
            <Layout>
                <div>
                    <Crumb data={getUrlParamValue('source') === 'onlineOrder'?[
                        {
                            url: '/onlineOrder/',
                            title: intl.get("purchase.show.index.onlineOrder")
                        },
                        {
                            url: '/onlineOrder/purchase/',
                            title: intl.get("purchase.show.index.onlinePurchaseOrder")
                        },
                        {
                            title: intl.get("purchase.show.index.detail")
                        }
                    ]:[
                        {title: intl.get("purchase.show.index.purchase")},
                        {url: '/purchase', title: intl.get("purchase.show.index.purchaseList")},
                        {title: intl.get("purchase.show.index.detail")}
                    ]}/>
                    <div className={cx("float-right")}>
                        <GoodsTableFieldConfigMenu
                            tableConfigList={listFields}
                            refresh={() => this.resetDefaultFields(billNo)}
                            type={'purchase_order'}
                        />
                    </div>
                    <div className={cx("float-right")}>
                        <IsVipJudge templateType={"PurchaseOrder"}/>
                    </div>
                </div>
                <div className="detail-content" style={{position:"relative"}}>
                    {this.operateBar()}
                    <div className="detail-content-bd"  style={{position:"relative"}}>
                        {
                            interchangeStatus == InterchangeStatus.notSend && approveModuleFlag == 1 && (
                                <div className={cx("status-img")}>
                                    <img src={backApproveStatusImg(approveStatus, intl.get("home.picFlag"))} width={120}/>
                                </div>
                            )
                        }
                        <PageTurnBtn type={"purchase"}  current={billNo}/>
                        <Tabs
                            onTabClick={this.handleTabClick}
                            defaultActiveKey={activeKey}
                            className="record-tab"
                        >
                            <TabPane tab={
                                <span ga-data="purchase-detail-tab-order" className={cx("tab-tit")}>
                                    {intl.get("purchase.show.index.orderInfo")}
                            </span>
                            } key="orderInfo">
                                <PrintArea>
                                    {renderContent}
                                </PrintArea>

                            </TabPane>
                            <TabPane tab={
                                <span ga-data="purchase-detail-tab-inventory" className={cx("tab-tit")}>
                                    {intl.get("purchase.show.index.inboundRecord")}

                                    {
                                        detailData && (detailData.get('interchangeStatus') !== InterchangeStatus.unAccepted
                                            && detailData.get('interchangeStatus') !== InterchangeStatus.cancelled) ? (
                                            <Tooltip
                                                type={"info"}
                                                title={detailData && detailData.get('state') == 0 ? intl.get("purchase.show.index.inboundStatus_notFinish"): intl.get("purchase.show.index.inboundStatus_finish")}
                                            >
                                                {
                                                    detailData && detailData.get('state') == 0 ?
                                                        <Icon type="icon-state-unfinished"
                                                              className="icon-state-unfinish"/> :
                                                        <Icon type="icon-state-finished"
                                                              className="icon-state-finished"/>
                                                }
                                            </Tooltip>
                                        ) : null
                                    }
                            </span>
                            } key="inboundRecord">
                                {
                                    detailData && detailData.get('state') === 0 && (
                                        <>
                                            <Button type={"primary"} style={{float: 'right', marginBottom: '5px'}}>
                                                <Link to={`/report/inventory/detail?purchaseBillNo=${displayBillNo}`}>查询明细</Link>
                                            </Button>
                                            {this.props.renderFinishButton({
                                                source: 'purchase', module: 'inbound', billNo, style: {marginRight: '10px'},
                                                callback: () => {
                                                    this.wareEnter.fetchData({});
                                                    this.loadData();
                                                }
                                            })}
                                            <InboundRecord
                                                onRef={(record) => this.wareEnter = record}
                                                module={"inbound"} option={"show"} type="purchase" recordFor={id}
                                                noAuthRender={<span style={{paddingTop: '30px'}}>{intl.get("purchase.show.index.noAuthRender")}</span>}/>
                                        </>
                                    )
                                }
                                {
                                    detailData && detailData.get('state') === 1 && (
                                        <>
                                            {this.props.renderHandOperateRecord({
                                                source: 'purchase', module: 'inbound', billNo,
                                                callback: () => {
                                                    this.wareEnter.fetchData({});
                                                    this.loadData();
                                                }
                                            })}
                                            <Fold title={"系统入库记录"} rightContent={()=>{
                                                return (
                                                    <Button type={"primary"} style={{float: 'right', marginBottom: '5px'}}>
                                                        <Link to={`/report/inventory/detail?purchaseBillNo=${displayBillNo}`}>查询明细</Link>
                                                    </Button>
                                                )
                                            }}>
                                                <InboundRecord
                                                    onRef={(record) => this.wareEnter = record}
                                                    module={"inbound"} option={"show"} type="purchase" recordFor={id}
                                                    noAuthRender={<span style={{paddingTop: '30px'}}>{intl.get("purchase.show.index.noAuthRender")}</span>}/>
                                            </Fold>
                                        </>
                                    )
                                }

                            </TabPane>
                            <TabPane tab={
                                <span ga-data="purchase-detail-tab-purchaseInvoice" className={cx("tab-tit")}>
                                    {intl.get("purchase.show.index.invoiceRecord")}
                                    {
                                        detailData && (detailData.get('interchangeStatus') !== InterchangeStatus.unAccepted
                                            && detailData.get('interchangeStatus') !== InterchangeStatus.cancelled) ? (
                                            <Tooltip
                                                type={"info"}
                                                title={detailData && detailData.get('invoiceState') == 0 ? intl.get("purchase.show.index.invoiceState_notFinish"): intl.get("purchase.show.index.invoiceState_finish")}
                                            >
                                                {
                                                    detailData && detailData.get('invoiceState') == 0 ?
                                                        <Icon type="icon-state-unfinished" className="icon-state-unfinish"/> :
                                                        <Icon type="icon-state-finished" className="icon-state-finished"/>
                                                }
                                            </Tooltip>
                                        ) : null
                                    }
                                </span>
                            } key="invoiceRecord">
                                {
                                    detailData && detailData.get('invoiceState') === 0 && (
                                        <>
                                            {
                                                this.props.renderFinishButton({
                                                    source: 'purchase', module: 'invoice', billNo,
                                                    callback: () => {
                                                        this.invoiceRecord.fetchData({});
                                                        this.loadData();
                                                    }
                                                })
                                            }
                                            <InvoiceRecord onRef={(invoiceRecord) => this.invoiceRecord = invoiceRecord}
                                                           module={"invoice"} option={"show"} type={'purchase'} recordFor={id}
                                                           noAuthRender={<span style={{paddingTop: '30px'}}>
                                                   {intl.get("purchase.show.index.noAuthRender")}</span>}/>
                                        </>
                                    )
                                }
                                {
                                    detailData && detailData.get('invoiceState') === 1 && (
                                        <>
                                            {
                                                this.props.renderHandOperateRecord({
                                                    source: 'purchase', module: 'invoice', billNo,
                                                    callback: () => {
                                                        this.invoiceRecord.fetchData({});
                                                        this.loadData();
                                                    }
                                                })
                                            }
                                            <Fold title={"系统到票记录"}>
                                                <InvoiceRecord onRef={(invoiceRecord) => this.invoiceRecord = invoiceRecord}
                                                               module={"invoice"} option={"show"} type={'purchase'} recordFor={id}
                                                               noAuthRender={<span style={{paddingTop: '30px'}}>
                                                   {intl.get("purchase.show.index.noAuthRender")}</span>}/>
                                            </Fold>
                                        </>
                                    )
                                }
                            </TabPane>
                            <TabPane tab={
                                <span ga-data="purchase-detail-tab-payment" className={cx("tab-tit")}>
                                {intl.get("purchase.show.index.payRecord")}
                                    {
                                        detailData && (detailData.get('interchangeStatus') !== InterchangeStatus.unAccepted
                                            && detailData.get('interchangeStatus') !== InterchangeStatus.cancelled) ? (
                                            <Tooltip
                                                type={"info"}
                                                title={detailData && detailData.get('payState') == 0 ? intl.get("purchase.show.index.payState_notFinish"): intl.get("purchase.show.index.payState_finish")}
                                            >
                                                {
                                                    detailData && detailData.get('payState') == 0 ?
                                                        <Icon type="icon-state-unfinished" className="icon-state-unfinish"/> :
                                                        <Icon type="icon-state-finished" className="icon-state-finished"/>
                                                }
                                            </Tooltip>
                                        ) : null
                                    }

                            </span>
                            } key="expendRecord">
                                {
                                    detailData && detailData.get('payState') === 0 && (
                                        <>
                                            {
                                                this.props.renderFinishButton({
                                                    source: 'purchase', module: 'expend', billNo,
                                                    callback: () => {
                                                        this.expendRecord.fetchData({});
                                                        this.loadData();
                                                    }
                                                })
                                            }
                                            <ExpendRecord onRef={(expRecord) => this.expendRecord = expRecord}
                                                          module={"expend"}
                                                          option={"show"}
                                                          type={'purchase'}
                                                          recordFor={id}
                                                          noAuthRender={<span style={{paddingTop: '30px'}}>{intl.get("purchase.show.index.noAuthRender")}</span>}/>
                                        </>
                                    )
                                }
                                {
                                    detailData && detailData.get('payState') === 1 && (
                                        <>
                                            {
                                                this.props.renderHandOperateRecord({
                                                    source: 'purchase', module: 'expend', billNo,
                                                    callback: () => {
                                                        this.expendRecord.fetchData({});
                                                        this.loadData();
                                                    }
                                                })
                                            }
                                            <Fold title={"系统付款记录"}>
                                                <ExpendRecord onRef={(expRecord) => this.expendRecord = expRecord}
                                                              module={"expend"}
                                                              option={"show"}
                                                              type={'purchase'}
                                                              recordFor={id}
                                                              noAuthRender={<span style={{paddingTop: '30px'}}>{intl.get("purchase.show.index.noAuthRender")}</span>}/>
                                            </Fold>
                                        </>
                                    )
                                }
                            </TabPane>
                        </Tabs>
                    </div>
                    {detailData && this.renderOperatorButton()}

                    <SendEmail2Supplier
                        visible={this.state.sendEmailVisible}
                        onClose={() => this.closeModal('sendEmailVisible')}
                        billNo={this.props.match.params.id}
                        supplierCode={supplierCode}
                        billInfo={this.getInfo()}
                    />
                </div>
                <SelectGoodsOrFitting
                    visible={this.state.goodsPopVisible}
                    visibleFlag={'goodsPopVisible'}
                    onOk={this.handleBind}
                    onCancel={() => this.closeModal('goodsPopVisible')}
                    selectType={"radio"}
                    popType={'goods'}
                    // selectedKeys={[this.state.selectedProductKeys]}
                    condition={{disableFlag: 0}}
                    salePriceEditable={false}
                />
                {
                    this.state.stockInPopVisible && <WareEnterBatchEdit
                        visible={this.state.stockInPopVisible}
                        popTitle={intl.get("purchase.show.index.inbound")}
                        billIds={[id]}
                        visibleFlag={'stockInPopVisible'}
                        onOk={() => {
                            this.closeModal('stockInPopVisible');
                            this.loadData();
                            this.wareEnter && this.wareEnter.fetchData({page: 1});
                        }}
                        onCancel={() => this.closeModal('stockInPopVisible')}
                    />
                }

                {
                    this.state.expendBatchPopVisible && <FinanceExpendBatchEdit
                        visible={this.state.expendBatchPopVisible}
                        popTitle={intl.get("purchase.show.index.pay")}
                        billIds={[id]}
                        visibleFlag={'expendBatchPopVisible'}
                        onOk={() => {
                            this.closeModal('expendBatchPopVisible');
                            this.loadData();
                            this.expendRecord && this.expendRecord.fetchData({page: 1});
                        }}
                        onCancel={() => this.closeModal('expendBatchPopVisible')}
                    />
                }

                {
                    this.state.invoiceBatchPopVisible && <FinanceInvoiceBatchEdit
                        visible={this.state.invoiceBatchPopVisible}
                        popTitle={intl.get("purchase.show.index.invoice")}
                        billIds={[id]}
                        visibleFlag={'invoiceBatchPopVisible'}
                        onOk={() => {
                            this.closeModal('invoiceBatchPopVisible');
                            this.loadData();
                            this.invoiceRecord && this.invoiceRecord.fetchData({page: 1});
                        }}
                        onCancel={() => this.closeModal('invoiceBatchPopVisible')}
                    />
                }

                <InviteModal
                    title={intl.get("purchase.show.index.warningTip")}
                    inviteVisible={this.state.addFriendVisible}
                    onCancel={() => this.closeModal('addFriendVisible')}
                    width={800}
                    type={"0"}
                    id={this.getInfo() && this.getInfo().get('supplierCode')}
                    desc={intl.get("purchase.show.index.wxInviteFriend")}
                />

                <Modal
                    title={intl.get("purchase.show.index.warning")}
                    width={800}
                    visible={this.state.expressVisible}
                    onCancel={()=>this.closeModal('expressVisible')}
                    onOk={()=>this.closeModal('expressVisible')}
                    cancelButtonProps={{'style':{'display':'none'}}}
                >
                    <div className={cx('express-wrap')}>
                        <ul className={cx('express-lst')}>
                            {
                                dataWarehouseOut && dataWarehouseOut.map(item=>{
                                    return <li key={item.get('waybillNo')}>
                                        <span className={cx('name')} title={item.get('logistics')}>{intl.get("purchase.show.index.logistics")}：{item.get('logistics')}</span>
                                        <span className={cx('bill-no')} title={item.get('waybillNo')}>{intl.get("purchase.show.index.waybillNo")}：{item.get('waybillNo')}</span>
                                        <Button className={cx('btn')} onClick={()=>this.copyText(item.get('waybillNo'))}>
                                            {intl.get("purchase.show.index.copy")}
                                        </Button>
                                    </li>
                                })
                            }
                        </ul>
                    </div>

                </Modal>

                <LimitOnlineTip onClose={()=>this.closeModal('showTip')} show={this.state.showTip}/>
                <SelectApproveItem  // 选择审批流
                    onClose={this.extendApproveCancelModal}
                    onOk={(id)=>{this.extendApproveOkModal(id,billNo,BACKEND_TYPES.purchase,this.loadData)}}
                    show={this.state.selectApprove}
                    type={BACKEND_TYPES.purchase}
                />
            </Layout>
        )
    }
}

