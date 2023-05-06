import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {Link} from 'react-router-dom';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Layout, Modal, Table, Spin, Button, message, Tabs, Radio} from 'antd';
import Crumb from 'components/business/crumb';
import FileView from 'components/business/fileView';
import {Auth} from 'utils/authComponent';
import PrintArea from 'components/widgets/printArea';
import PrintStatus from 'components/business/printStatus';
import {ConvertButton} from 'components/business/authMenu';
import {updateProdBindInfo, asyncFetchQuotationById, asyncBindProduct, asyncUnbindProduct, asyncFetchOperationLog} from '../../add/actions';
import {asyncDeleteQuotationInfo,asyncBeforeDeleteQuotationInfo} from '../../index/actions';
import {asyncJudgeIsBelongBom} from 'pages/fitting/index/actions';
import IsVipJudge from 'components/business/isVipJudge';
import {actions as customerActions} from 'pages/customer/index'
import {actions as operActions} from 'components/business/operateOrder';
import BindCustomer from 'components/business/bindCustomer';
import SelectGoodsOrFitting from 'components/business/goodsPop';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import OpeBar from 'components/business/opeBar';
import LogModalTable from 'components/business/logModalTable';
import {AttributeBlock, AttributeInfo} from 'components/business/attributeBlock';
import LimitOnlineTip from 'components/business/limitOnlineTip';
import BacklogRecord from 'components/business/backlog';
import CheckWareArriveUpperLimit,{dealCheckWareUpperLimitData} from 'components/business/checkWareArriveUpperLimit';
import {
    WareOutBatchEdit,
    FinanceSaleInvoiceBatchEdit,
    FinanceIncomeBatchEdit
} from 'components/business/batchEditPop';
import OperatorLog from 'components/business/operatorLog';
import SaleOrderOperate from 'components/business/operateOrder';
import GoodsTableFieldConfigMenu from 'components/business/goodsTableFieldConfigMenu';
import ProductList from 'components/business/productList';
import {getYmd} from "utils/format";
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import Icon from 'components/widgets/icon';
import Tooltip from 'components/widgets/tooltip';
import {actions as approveActions, RejectApprove, backDisabledStatus, batchBackDisabledStatusForDetail, backApproveStatusImg,
    ApproveProcess, SelectApproveItem, withApprove, BACKEND_TYPES, batchPermitOperate} from 'components/business/approve';
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import {detailPage} from  'components/layout/listPage';
import {OutboundRecord} from 'pages/inventory/outbound/index';
import {IncomeRecord} from 'pages/finance/income/index';
import {SaleInvoiceRecord} from 'pages/finance/saleInvoice/index';
import {ProduceRecord} from 'pages/produceOrder/index';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import {getUrlParamValue} from 'utils/urlParam';
import PageTurnBtn from 'components/business/pageTurnBtn';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);
const {Content} = Layout;
const {TabPane} = Tabs;
const InterchangeStatus = {
    notSend: 0,
    unAccepted: 1,
    accepted: 2,
    cancelled: 3
};

const mapStateToProps = (state) => ({
    saleInfo: state.getIn(['quotationAdd', 'quotationInfo']),
    fetchLogInfo: state.getIn(['quotationAdd', 'fetchLogInfo']),
    convertToLocalProd: state.getIn(['operateOrder', 'convertToLocalProd'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchQuotationById,
        asyncDeleteQuotationInfo,
        asyncBeforeDeleteQuotationInfo,
        updateProdBindInfo,
        asyncBindProduct,
        asyncUnbindProduct,
        asyncFetchOperationLog,
        asyncJudgeIsBelongBom,
        asyncConvertToLocalProd: operActions.asyncConvertToLocalProd,
        asyncAddToBlackList: customerActions.asyncAddToBlackList,
        asyncGetApproveStatus: approveActions.asyncGetApproveStatus,
        asyncOperateApprove: approveActions.asyncOperateApprove,
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService
    }, dispatch)
};

@connect(mapStateToProps, mapDispatchToProps)
@withApprove
export default class Index extends detailPage {
    constructor(props) {
        super(props);
        this.state = {
            interchangeLogVisiable: false, //往来日志
            operationLogVisible: false,  // 操作日志
            operateModalVisiable: false,
            goodsPopVisible: false,
            wareOutPopVisible: false,
            saleInvoicePopVisible: false,
            incomePopVisible: false,
            operateType: '', //'cancel' or 'accept'
            saveCustomerVisible:false,
            cancelPopVisible:false,
            rejectCallback:null,
            bindCustomerCallback:null,
            showTip: false,
            selectApprove: false,  // 选择审批流弹层
            approveModuleFlag: 1,
            approveStatus: 0,
            //控制重复点击按钮
            approveBtnFlag: false,
            approveRevertBtnFlag: false
        }
    }

    componentDidMount() {
        this.loadData();
    }


    loadData = (nextId) => {
        const {match} = this.props;
        const id = nextId || match.params.id;
        if (id) {
            this.props.asyncFetchQuotationById(id, (res) => {
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

    showConfirm = () => {
        const {match} = this.props;
        const id = match.params.id;

        let self = this;

        Modal.confirm({
            title: intl.get("sale.show.index.warningTip"),
            okText: intl.get("sale.show.index.okText"),
            cancelText: intl.get("sale.show.index.cancelText"),
            content: "删除后将无法恢复，确定删除吗？",
            okButtonProps:{
                'ga-data':'list-delete-ok'
            },
            cancelButtonProps:{
                'ga-data':'list-delete-cancel'
            },

            onOk() {
                return new Promise((resolve, reject) => {
                    self.props.asyncDeleteQuotationInfo([id], function (res) {
                        resolve();
                        if (res.retCode == 0) {
                            message.success(intl.get("sale.show.index.deleteSuccessMessage"));
                            self.props.history.replace('/quotation/')
                        } else {
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
    };

    getInfo() {
        const {saleInfo} = this.props;
        return saleInfo && saleInfo.getIn(['data', 'data']);
    }

    saleBillInfo = () => {
        const info = this.getInfo();
        let currencyVipFlag = getCookie("currencyVipFlag");
        return (
            <div className={"detail-main-attr cf"}>
                <AttributeInfo data={{
                    name: "报价单号",
                    value: info.get('displayBillNo'),
                    highlight: true
                }}/>

                {/*<div className={cx("status")}>
                    {this.stateDesc()}
                </div>*/}
                <AttributeInfo data={{
                    name: "报价日期",
                    value: moment(info.get('quotationDate')).format('YYYY-MM-DD')
                }}/>
                <AttributeInfo data={{
                    name: intl.get("sale.show.index.warehouseName"),
                    value: info.get('warehouseName')
                }}/>
                <AttributeInfo data={{
                    name: intl.get("sale.show.index.customerName"),
                    value: info.get('customerName')
                }}/>
                <AttributeInfo data={{
                    name: intl.get("sale.add.baseInfo.customerContacterName"),
                    value: info.get('customerContacterName')
                }}/>
                <AttributeInfo data={{
                    name: intl.get("sale.show.index.customerTelNo"),
                    value: info.get('customerTelNo')
                }}/>
                {
                    currencyVipFlag === 'true' && (
                        <>
                            <AttributeInfo data={{
                                name: "币种",
                                value: info.get('currencyName')
                            }}/>
                            <AttributeInfo data={{
                                name: "牌价",
                                value: info.get('quotation')
                            }}/>
                        </>
                    )
                }

                {!this.isLocalBill() && info.get('hasUnbindProdFlag') && (
                    <ConvertButton
                        loadingFlag={this.props.convertToLocalProd.get('isFetching')}
                        style={{float: 'right'}}
                        clickHandler={this.convertToMyGoods}
                        title={intl.get("sale.show.index.oneKeyToMyProd")}
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
            title: intl.get("sale.show.index.warningTip"),
            content: intl.get("sale.show.index.convertToMyGoodsContent"),
            onOk: () => {
                this.props.asyncConvertToLocalProd('sale', [id], res => {
                    if (res && res.retCode == 0) {
                        this.loadData();
                        message.success(intl.get("sale.show.index.operateSuccessMessage"));
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
                    title: intl.get("sale.show.index.warningTip"),
                    content: errorMsg
                });
            } else {
                this.props.updateProdBindInfo(prodInfo);
                Modal.info({
                    title: intl.get("sale.show.index.warningTip"),
                    content: intl.get("sale.show.index.bindSuccessContent")
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
                    title: intl.get("sale.show.index.warningTip"),
                    content: errorMsg
                });
            } else {
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
                customerNo: this.getInfo().get('customerNo'),
                customerProdNo: this.pendingBindInfo.customerProdNo
            };

            this.bindProduct(bindOpInfo);
        }
    };

    handleBindOrUnBind = (prodInfo) => {
        if (prodInfo.prodNo && prodInfo.prodNo.length > 1) {
            const bindOpInfo = {
                prodNo: prodInfo.prodNo,
                customerNo: this.getInfo().get('customerNo'),
                customerProdNo: prodInfo.customerProdNo
            };
            this.unbindProduct(bindOpInfo);
        } else {
            this.pendingBindInfo = prodInfo;
            this.openModal('goodsPopVisible');
        }
    };

    saleProductList = () => {
        const {saleInfo} = this.props;
        const prodList = saleInfo && saleInfo.getIn(['data', 'data', 'prodList']);
        /**
         *  aggregateAmount 订单优惠后总金额
         *  discountAmount 订单优惠金额
         *  taxAllAmount  订单含税总金额
         * */
        const aggregateAmount = saleInfo && saleInfo.getIn(['data', 'data', 'aggregateAmount']);
        const discountAmount = saleInfo && saleInfo.getIn(['data', 'data', 'discountAmount']);
        const taxAllAmount = saleInfo && saleInfo.getIn(['data', 'data', 'taxAllAmount']);
        const currencyAggregateAmount = saleInfo && saleInfo.getIn(['data', 'data', 'currencyAggregateAmount']);
        const billProdDataTags = saleInfo && saleInfo.getIn(['data', 'billProdDataTags']) && saleInfo.getIn(['data', 'billProdDataTags']).toJS();
        const prodDataTags = saleInfo && saleInfo.getIn(['data', 'prodDataTags']) && saleInfo.getIn(['data', 'prodDataTags']).toJS();

        let quantityDecimalNum = getCookie("quantityDecimalNum");
        let priceDecimalNum = getCookie("priceDecimalNum");
        let currencyVipFlag = getCookie("currencyVipFlag");

        const isLocalBill = this.isLocalBill();
        const data = prodList.map((item, index) => {
            const unBind = (item.get('productCode') || '').length <= 1;
            let operateAction = null;
            if (!isLocalBill) {
                if (unBind) {
                    operateAction = intl.get("sale.show.index.bind");
                } else if ((item.get('customerProductCode') || '').length > 1) {
                    operateAction = intl.get("sale.show.index.unBind");
                }
            }
            let prodItem = item && item.toJS();

            prodItem = this.multiPreProcessDataTagValue(prodDataTags, prodItem);
            return {
                ...prodItem,
                serial: index + 1,
                key: prodItem.id,
                customerProdNo: prodItem.customerProductCode,
                displayCode: unBind ? prodItem.customerProductDisplayCode : prodItem.prodCustomNo,
                quantity: fixedDecimal(prodItem.quantity, quantityDecimalNum),
                untaxedPrice: fixedDecimal(prodItem.untaxedPrice, priceDecimalNum),
                unitPrice: fixedDecimal(prodItem.unitPrice, priceDecimalNum),
                untaxedAmount: (prodItem.untaxedAmount || 0).toFixed(2),
                taxRate: prodItem.taxRate || 0,
                tax: prodItem.tax,
                amount: (prodItem.amount || 0).toFixed(2),
                deliveryDeadlineDate: prodItem.deliveryDeadlineDate && moment(prodItem.deliveryDeadlineDate).format('YYYY-MM-DD'),
                outQuantity: fixedDecimal(prodItem.outNum, quantityDecimalNum),
                unStockOut: fixedDecimal(prodItem.unOutNum, quantityDecimalNum),
                producedQuantity: fixedDecimal(prodItem.producedQuantity, quantityDecimalNum),
                operate: operateAction,
                isFetching: prodItem.isFetching || false,
                unitConverter: `1${prodItem.recUnit}=${prodItem.unitConverter}${prodItem.unit}`,
                recQuantity: fixedDecimal(prodItem.recQuantity, quantityDecimalNum),
                returnNum: fixedDecimal(prodItem.returnNum, quantityDecimalNum),
                actualNum: fixedDecimal(prodItem.actualNum, quantityDecimalNum),
                currencyUnitPrice: fixedDecimal(prodItem.currencyUnitPrice, priceDecimalNum),
                currencyAmount: fixedDecimal(prodItem.currencyAmount, priceDecimalNum)
            }
        }).toArray();

        return (
            <ProductList
                productList={data}
                aggregateAmount={aggregateAmount}
                discountAmount={discountAmount}
                taxAllAmount={taxAllAmount}
                currencyAggregateAmount={currencyAggregateAmount}
                moduleType={'sale'}
                priceType={'salePrice'}
                fieldConfigType={'quotation'}
                currencyVipFlag={currencyVipFlag}
                billProdDataTags={billProdDataTags}
                prodDataTags={prodDataTags}
                operateClick={this.handleBindOrUnBind}
            />
        );
    };

    // 代办事项
    backlogList = () => {
        const {match} = this.props;
        const id = match.params.id;
        const info = this.getInfo();
        return (
            <BacklogRecord source={'sale'}
                           dataNo={id}
                           displayDataNo={info.get('displayBillNo')}
            />
        )
    };

    operateBar = () => {
        const info = this.getInfo();
        if (!info) {
            return null;
        }

        const interchangeStatus = info.get('interchangeStatus');
        const updatedTime =info.get('updatedTime'); //审批更新时间
        const billNo = info.get('billNo');
        const {saleInfo} = this.props;
        const approveModuleFlag = saleInfo.getIn(['data', 'approveModuleFlag']);  // 是否开启审批功能 0 无 1 有
        const processData =  saleInfo.getIn(['data', 'flowState']) && saleInfo.getIn(['data', 'flowState']).toJS();

        // ****
        let infoData = info&&info.toJS();
        infoData.approveModuleFlag = approveModuleFlag;
        let prodList = info && info.prodList || [];
        let warehouseName = info && info.warehouseName;
        let approveTask = saleInfo.getIn(['data', 'approveTask']);
        let permitGroup = batchPermitOperate('sale', processData);

        const {disabledGroup} = batchBackDisabledStatusForDetail(infoData, backDisabledStatus);
        let {
            approvePass, // 审批通过
            approveReject,  // 审批驳回
            approveRevert,  // 审批撤回
            approveSubmit, // 审批提交
            outboundApproveDisabled,
            saleInvoiceApproveDisabled,
            incomeApproveDisabled,
            modifyApproveDisabled,
            deleteApproveDisabled,
            operateLogApproveDisabled,
            refundApproveDisabled
        } = disabledGroup;

        let {outboundApproveEnabled, saleInvoiceApproveEnabled, incomeApproveEnabled} = permitGroup || {};

        let listAction = [];
        if (interchangeStatus == InterchangeStatus.notSend || interchangeStatus == InterchangeStatus.accepted) {
            listAction.push({
                name: 'storeOut',
                module: 'outbound',
                disabled: (interchangeStatus == InterchangeStatus.notSend && !outboundApproveDisabled) && !outboundApproveEnabled,
                option: 'add',
                onClick: () => {
                    const _self = this;
                    const {match} = this.props;
                    const id = match.params.id;
                    if (!this.isLocalBill() && info.get('hasUnbindProdFlag')) {
                        Modal.confirm({
                            title: intl.get("sale.show.index.warningTip"),
                            okText: intl.get("sale.show.index.okText"),
                            cancelText: intl.get("sale.show.index.cancelText"),
                            content: (
                                <React.Fragment>
                                    <div>
                                        <strong>{intl.get("sale.show.index.message1")}</strong>
                                    </div>
                                    <p style={{marginTop: '20px', textSize: '10px'}}>
                                        {intl.get("sale.show.index.message2")}
                                    </p>
                                </React.Fragment>),
                            onOk() {
                                return new Promise((resolve, reject) => {
                                    _self.props.asyncConvertToLocalProd('sale', [id], res => {
                                        resolve();
                                        if (res && res.retCode == 0) {
                                            _self.openModal('wareOutPopVisible');
                                            _self.loadData();
                                        }  else {
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
                    } else {
                        this.openModal('wareOutPopVisible');
                    }
                }
                // path: `/inventory/outbound/add?fkBillNo=${this.getInfo().get('billNo')}`

            });
            listAction = listAction.concat([
                {
                    name: 'invoice',
                    module: 'saleInvoice',
                    disabled: (interchangeStatus == InterchangeStatus.notSend && !saleInvoiceApproveDisabled) && !saleInvoiceApproveEnabled,
                    option: 'add',
                    onClick: () => {
                        if(!info.get('currencyFlag')){
                            message.info('存在外币单据无法开票');
                            return false;
                        }
                        this.openModal('saleInvoicePopVisible')
                    }
                    // path: `/finance/saleInvoice/add?fkDisplayBillNo=${this.getInfo().get('displayBillNo')}&fkBillNo=${this.getInfo().get('billNo')}&amount=${this.totalAmount}&customer=${this.getInfo().get('customerName')}`
                },
                {
                    name: 'receipt',
                    module: 'income',
                    disabled: (interchangeStatus == InterchangeStatus.notSend && !incomeApproveDisabled) && !incomeApproveEnabled,
                    option: 'add',
                    onClick: () => this.openModal('incomePopVisible')
                    // path: `/finance/income/add?fkDisplayBillNo=${this.getInfo().get('displayBillNo')}&fkBillNo=${this.getInfo().get('billNo')}&amount=${this.totalAmount}&customer=${this.getInfo().get('customerName')}`
                },
                {
                    name: 'refund',
                    module: 'inbound',
                    option: 'add',
                    hidden: !refundApproveDisabled,
                    path: `/inventory/inbound/add?fkSaleBillNo=${billNo}&enterType=3`,
                }
            ]);
        }
        listAction = listAction.concat([
            {
                name: 'edit',
                path: '/quotation/modify/' + this.getInfo().get('billNo'),
                module: 'quotation',
            },
            {
                name: 'delete',
                module: 'quotation',
                onClick: () => {
                    this.showConfirm();
                }
            },
            {
                name: 'copy',
                module: 'quotation',
                path: '/quotation/copy/' + this.getInfo().get('billNo')
            }
        ]);

        listAction = listAction.concat([
            {
                name: 'export',
                label: intl.get("sale.show.index.export"),
                module: 'quotation',
                href: `${BASE_URL}/file/download?url=/quotationorders/excel/export/${this.getInfo().get('billNo')}`,
                displayBillNo: this.getInfo().get('billNo'),
                templateType: 'QuotationOrder'
            },
            {
                name: 'print',
               /* module: 'sale',*/
                displayBillNo: this.getInfo().get('billNo'),
                templateType: 'QuotationOrder'
            },
            {
                name: 'quotationSale',
                path: `/sale/add?quotationCode=${this.getInfo().get('billNo')}`,
            }
        ]);

        /*(interchangeStatus == InterchangeStatus.notSend) && listAction.push(
            {
                name: 'interchangeLog',
                label: intl.get("sale.show.index.operateLog"),
                icon: 'icon-operation-log',
                module: 'sale',
                hidden: !operateLogApproveDisabled,
                onClick: () => {
                    const billNo = this.getInfo().get('billNo');
                    this.props.asyncFetchOperationLog(billNo);
                    this.openModal('operationLogVisible');
                }
            },{
                name: 'approveSubmit',  //提交审批流
                label: intl.get("components.approve.approveSubmit"),
                icon: 'icon-submit',
                module: 'sale',
                hidden: !approveSubmit,
                onClick: () => {
                    let {approveModuleFlag, approveStatus} = this.state;
                    this.props.submitApproveProcess(()=>this.closeModal('selectApprove'), ()=>{
                        if(approveModuleFlag===1 && approveStatus===2){ // 当前单据的审批状态为反驳状态 2，则直接提交
                            this.asyncApproveOperate({operate: 2, type: BACKEND_TYPES.sale, billNo}, this.loadData);
                        } else {
                            this.openModal('selectApprove'); // 否则打开选择审批流弹层
                        }
                    });
                }
            },{
                name: 'approveRevert',  //撤回审批流
                label: intl.get("components.approve.approveRevert"),
                icon: 'icon-cancel-copy',
                module: 'sale',
                disabled: this.state.approveRevertBtnFlag,
                hidden: !approveRevert,
                onClick: () => {
                    let _this = this;
                    Modal.confirm({
                        title: '提示',
                        icon: <ExclamationCircleOutlined />,
                        content: '确认撤回审批么？',
                        onOk() {
                            _this.asyncApproveOperate({operate: 3, type: BACKEND_TYPES.sale,billNo}, _this.loadData);
                        }
                    });
                }
            }
        );

        interchangeStatus != 0 && listAction.push({
            icon: 'icon-log',
            name: 'interchangeLog',
            label: intl.get("sale.show.index.interchangeLog"),
            module: 'sale',
            onClick: () => {
                this.openModal('interchangeLogVisiable');
            }
        });*/

        /*listAction.push({
            icon: 'icon-lack-material',
            name: 'lackMaterial',
            label: intl.get("sale.show.index.lackMaterial"),
            module: 'goods',
            onClick: () => {
                let {saleInfo} = this.props;
                let prodList = saleInfo && saleInfo.getIn(['data', 'data', 'prodList']).toJS();
                if(prodList && prodList.length > 0){
                    prodList = prodList.map(item => {
                       return {
                           prodNo: item.productCode,
                           mainCount: item.quantity
                       }
                    });
                    this.props.asyncJudgeIsBelongBom({prodList}, (data) => {
                        localStorage.setItem('fittingProdList', JSON.stringify(data));
                        this.props.history.push('/purchase/lackMaterial?source=sale');
                    })
                }
            }
        });*/

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
                                callback={() => this.asyncApproveOperate({approveTask,operate: 4,type: BACKEND_TYPES.sale,billNo}, this.loadData)}
                                params={dealCheckWareUpperLimitData(billNo, prodList, warehouseName, 'sale')}
                                render={() => (
                                    <Button  className={cx("approve-btn")}
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
                                approveTask={approveTask}
                                billNo={billNo}
                                type={BACKEND_TYPES.sale}
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
                </div>
            </React.Fragment>
        )
    };

    saleBaseInfo = () => {
        const {saleInfo} = this.props;
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
                name: intl.get("sale.show.index.deliveryAddress"),
                value: (address.length > 0 && address.join('  ')) || ''
            },
            {
                name: intl.get("sale.show.index.projectName"),
                value: info.get('projectName')
            },
            {
                name: intl.get("sale.show.index.settlement"),
                value: info.get('settlement')
            },
            {
                name: intl.get("sale.show.index.customerOrderNo"),
                value: info.get('customerOrderNo')
            },
            {
                name: intl.get("sale.show.index.ourName"),
                value: info.get('ourName')
            },
            {
                name: intl.get("sale.show.index.ourContacterName"),
                value: info.get('ourContacterName')
            },
            {
                name: intl.get("sale.show.index.ourTelNo"),
                value: info.get('ourTelNo')
            },
            {
                name: "报价有效期至",
                value: info.get('expiredDate') && moment(info.get('expiredDate')).format('YYYY-MM-DD')
            }

        ];
        const tags = saleInfo && saleInfo.getIn(['data', 'tags']) && saleInfo.getIn(['data', 'tags']).toJS();
        const data1 = saleInfo.getIn(['data', 'data']);
        const detailData = saleInfo && data1 !== '' && data1;
        tags && tags.forEach((value) => {
            let propName = value.propName;
            let mappingName = value.mappingName;
            let propertyValues = (data1.get('propertyValues') && data1.get('propertyValues').toJS()) || {};
            if (propName && propName !== "" && mappingName) {
                data.push({
                    name: propName,
                    value: this.preProcessDataTagValue(value, propertyValues[mappingName])
                })
            }
        });
        return (
            <div className="detail-sub-attr">
                <AttributeBlock data={data}/>
                <AttributeBlock data={[{
                    name: intl.get("sale.show.index.remarks"),
                    value: info.get('remarks')
                }]}/>
                <div>
                    <div style={{
                        display: 'inline-block',
                        verticalAlign: 'top',
                        fontSize: '14px',
                        color: '#666',
                        marginRight: '10px',
                        lineHeight: '30px'
                    }}>{intl.get("sale.show.index.tempAtt")}：
                    </div>
                    <div style={{display: 'inline-block', lineHeight: '30px'}}>
                        {
                            detailData && detailData.get("fileInfo") && detailData.get("fileInfo").toJS().map((file) => {
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
        );
    };

    // 往来日志
    interchangeLog = () => {
        const {saleInfo} = this.props;
        let logInfo = saleInfo && saleInfo.getIn(['data', 'data', 'interchangeRecords']);
        const data = logInfo && logInfo.map((item, index) => {
            return {
                key: index,
                serial: index + 1,
                operateTime: getYmd(item.get('operateTime')),
                role: item.get('operatorCompanyName'),
                context: item.get('context')
            }
        });

        return (
            <LogModalTable title={intl.get("sale.show.index.interchangeLog")}
                           columns="interchangeColumns"
                           logVisible={this.state.interchangeLogVisiable}
                           logData={data||[]}
                           cancelCallBack={() => this.closeModal('interchangeLogVisiable')}
            />
        );
    };

    // 操作日志
    operationLog = () => {
        const {fetchLogInfo} = this.props;
        let logInfo = fetchLogInfo && fetchLogInfo.get('data');
        const data = logInfo ? logInfo.map((item, index) => {
            return {
                key: index,
                serial: index + 1,
                operateLoginName: item.get('operatedLoginName'),
                operation: item.get('operation'),
                operateTime: getYmd(item.get('operatedTime'))
            }
        }) : [];

        return (
            <LogModalTable title={intl.get("sale.show.index.operateLog")}
                           columns="operationColumns"
                           logVisible={this.state.operationLogVisible}
                           logData={data}
                           cancelCallBack={() => this.closeModal('operationLogVisible')}
            />
        )
    };

    closeModal = (type) => {
        this.setState({
            [type]: false
        })
    };

    openModal = (type) => {
        this.setState({
            [type]: true
        })
    };


    bindCustomerCallback = ()=>{
        if(this.state.chooseType=='accept'){
            this.acceptAndBindOkCallback();
        }else{
            this.rejectAndBindOkCallback();
        }
    };

    acceptOrder = (data) => {
        this.setState({
            billNo:data.billNo,
            customerName:data.customerName,
            chooseType:'accept',
            customerInfo:{
                customerUserId:data.customerUserId
            }
        });
        if(data.customerNo){
            this.acceptAndBindOkCallback();
        }else{
            this.openModal('saveCustomerVisible');
        }
    };
    acceptAndBindOkCallback = ()=>{
        this.setState({
            saveCustomerVisible:false,
            operateType: 'accept',
            operateModalVisiable: true
        });
    };
    rejectAndBindOkCallback = ()=>{
        this.setState({
            saveCustomerVisible:false,
            operateType: 'cancel',
            operateModalVisiable: true
        });
    };

    rejectPopOnOk = ()=>{
        if(this.state.isAllow){
            this.cancelOrderAndAllowVisit()
        }else{
            this.rejectAndAddToBlacklist()
        }
    };

    cancelOrder = (data) => {
        this.setState({
            billNo:data.billNo,
            chooseType:'reject',
            customerName:data.customerName,
            customerInfo:{
                customerUserId:data.customerUserId
            }
        });
        if(data.customerNo){
            this.rejectAndBindOkCallback()
        }else{
            this.openModal('cancelPopVisible');
        }
    };

    rejectAndAddToBlacklist = ()=>{
        let _this = this;
        Modal.confirm({
            title: intl.get("sale.show.index.remindInfo"),
            content:`${intl.get("sale.show.index.rejectAccessMallMessage1")} ${_this.state.customerName} ${intl.get("sale.show.index.rejectAccessMallMessage2")}`,
            okText: intl.get("sale.show.index.okText"),
            cancelText: intl.get("sale.show.index.cancelText"),
            onOk(){
                _this.props.asyncAddToBlackList({
                    saleOrderBillNo:_this.state.billNo,
                    type:'sale'
                },(data)=>{
                    if(data.retCode=='0'){
                        _this.closeModal('cancelPopVisible');
                        // _this.rejectAndBindOkCallback();
                    }else{
                        alert(data.retMsg);
                    }
                });
            }
        });
    };
    cancelOrderAndAllowVisit = ()=>{
        this.closeModal('cancelPopVisible');
        this.openModal('saveCustomerVisible');
    };
    allowRadioChange = (e)=>{
        let value = e.target.value;
        this.setState({
            isAllow:value==1
        });
    };

    // 取消订单成功后取消刷新页面
    orderOpCallback = (result) => {
        if (result) {
            this.loadData();
        }
    };

    renderOperatorButton = () => {
        if (!this.getInfo()) {
            return null;
        }
        const interchangeStatus = this.getInfo() && this.getInfo().get('interchangeStatus');
        const needShowInterchangeBtn = (interchangeStatus == InterchangeStatus.accepted
            || interchangeStatus == InterchangeStatus.unAccepted);
        const {match} = this.props;
        const id = match.params.id;
        const data = {
            billNo:id,
            customerName:this.getInfo().get('customerName'),
            customerUserId:this.getInfo().get('customerUserId'),
            customerNo:this.getInfo().get('customerNo'),
        }
        return needShowInterchangeBtn && (
            <div className="content-fd">
                {
                    interchangeStatus != InterchangeStatus.accepted ? (
                        <Button type="primary" htmlType="submit"
                                onClick={() => this.acceptOrder(data)}>
                            {intl.get("sale.show.index.receiveOrder")}
                        </Button>
                    ) : null
                }
                <Button type="default" onClick={() => this.cancelOrder(data)}>
                    {intl.get("sale.show.index.cancelOrder")}
                </Button>
                <SaleOrderOperate visible={this.state.operateModalVisiable}
                                  visibleFlag={'operateModalVisiable'}
                                  operateCallback={this.orderOpCallback}
                                  billNo={this.state.billNo}
                                  customerName={this.state.customerName}
                                  closeModal={this.closeModal}
                                  popType={this.state.operateType}
                />

            </div>
        )
    };

    stateDesc = () => {
        const interchangeStatus = this.getInfo() && this.getInfo().get('interchangeStatus');
        switch (interchangeStatus) {
            case InterchangeStatus.unAccepted:
                return <span className="ui-status ui-status-unaccept">{intl.get("sale.show.index.notReceive")}</span>;
            case InterchangeStatus.accepted:
                return <span className="ui-status ui-status-accepted">{intl.get("sale.show.index.receive")}</span>;
            case InterchangeStatus.cancelled:
                return <span className="ui-status ui-status-cancel">{intl.get("sale.show.index.cancel")}</span>;
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


    resetDefaultFields = (billNo)=>{
        this.props.asyncFetchQuotationById(billNo)
    };

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.match.params.id!=this.props.match.params.id){
            this.loadData(nextProps.match.params.id);
        }
    }

    render() {
        let currencyVipFlag = getCookie("currencyVipFlag");
        const {match} = this.props;
        const id = match.params.id;
        const {saleInfo} = this.props;
        const data = saleInfo.getIn(['data', 'data']);
        const listFields = saleInfo && saleInfo.getIn(['data', 'listFields']);
        const detailData = saleInfo && data !== '' && data;
        const activeKey = this.props.location.hash.replace('#', '');

        const approveModuleFlag = saleInfo.getIn(['data', 'approveModuleFlag']); //是否开启审批权
        const approveFlag = saleInfo.getIn(['data', 'approveFlag']); // 是否开启审批权限 0 无 1 有
        const approveStatus = data && data.get('approveStatus');  //审批状态 0 未通过 1通过
        const updatedTime =data && data.get('updatedTime'); //审批更新时间
        const interchangeStatus = data && data.get('interchangeStatus');
        const billNo = data && data.get('billNo');
        let printStatus = data && data.get('printState');
        const displayBillNo = data && data.get('displayBillNo');  // 销售展示编号
        const processData =  saleInfo.getIn(['data', 'flowState']) && saleInfo.getIn(['data', 'flowState']).toJS();


        let renderContent = null;
        if (saleInfo && saleInfo.get('isFetching')) {
            renderContent = <Spin className="gb-data-loading"/>;
        } else if (detailData) {
            renderContent = (
                <React.Fragment>
                    {
                        (printStatus === 0 ||  printStatus === 1)?<PrintStatus status={printStatus} billNo={billNo}/>:null
                    }
                    {this.saleBillInfo()}
                    {this.interchangeLog()}
                    {this.operationLog()}
                    {this.saleProductList()}
                    {this.saleBaseInfo()}
                   {/* {this.backlogList()}*/}
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

        return (
            <Layout>
                <div>
                    <Crumb data={[
                        {url: '/quotation', title: "报价单列表"},
                        {title: intl.get("sale.show.index.detail")}
                    ]}/>
                    <div className={cx("float-right")}>
                        <GoodsTableFieldConfigMenu
                            tableConfigList={listFields}
                            refresh={() => this.resetDefaultFields(billNo)}
                            type={'quotation'}
                        />
                    </div>
                    <div className={cx("float-right")}>
                        <IsVipJudge templateType={"QuotationOrder"}/>
                    </div>
                </div>
                <div className="detail-content"  style={{position:"relative"}}>
                    {this.operateBar()}
                    <div className="detail-content-bd"  style={{position:"relative"}}>
                        {
                            interchangeStatus == InterchangeStatus.notSend && approveModuleFlag == 1 && (
                                <div className={cx("status-img")}>
                                    <img src={backApproveStatusImg(approveStatus, intl.get("home.picFlag"))} width={120}/>
                                </div>
                            )
                        }
                        <PageTurnBtn type={"quotation"}  current={billNo}/>
                        {/*<Tabs
                        onTabClick={this.handleTabClick}
                        defaultActiveKey={activeKey}
                        className="record-tab"
                    >*/}
                       {/* <TabPane tab={
                            <span ga-data={'sale-detail-tab-order'} className={cx("tab-tit")}>
                                {intl.get("sale.show.index.orderInfo")}
                            </span>
                        } key="saleInfo">*/}
                            <PrintArea>{renderContent}</PrintArea>
                        {/*</TabPane>*/}
                        {/*<TabPane tab={
                            <span ga-data={'sale-detail-tab-outbound'} className={cx("tab-tit")}>
                                {intl.get("sale.show.index.outboundRecord")}
                                {
                                    detailData && (detailData.get('interchangeStatus') !== InterchangeStatus.unAccepted
                                        && detailData.get('interchangeStatus') !== InterchangeStatus.cancelled) ? (
                                        <Tooltip
                                            type={"info"}
                                            title={detailData && detailData.get('state') == 0 ? intl.get("sale.show.index.outboundStatus_notFinish"): intl.get("sale.show.index.outboundStatus_finish")}
                                        >
                                            {
                                                detailData && detailData.get('state') == 0 ?  <Icon type="icon-state-unfinished"  className="icon-state-unfinish"/> :
                                                    <Icon type="icon-state-finished"  className="icon-state-finished"/>
                                            }
                                        </Tooltip>
                                    ) : null
                                }
                            </span>
                        } key="outboundRecord">
                            <Button type={"primary"} style={{float: 'right', marginBottom: '5px'}}>
                                <Link to={`/report/inventory/detail?saleBillNo=${displayBillNo}`}>查询明细</Link>
                            </Button>
                            <OutboundRecord
                                onRef={(record) => this.wareOut = record}
                                module={"outbound"} option={"show"} type="saleOrder" recordFor={id}
                                noAuthRender={<span style={{paddingTop: '30px'}}>{intl.get("sale.show.index.noAuthRender")}</span>}/>
                        </TabPane>
                        <TabPane tab={
                            <span ga-data={'sale-detail-tab-saleInvoice'} className={cx("tab-tit")}>
                                {intl.get("sale.show.index.invoiceRecord")}
                                <Tooltip
                                    type={"info"}
                                    title={detailData && detailData.get('invoiceState') == 0 ? intl.get("sale.show.index.invoiceState_notFinish"): intl.get("sale.show.index.invoiceState_finish")}
                                >
                                    {
                                        detailData && detailData.get('invoiceState') == 0 ?  <Icon type="icon-state-unfinished"  className="icon-state-unfinish"/> :
                                            <Icon type="icon-state-finished"  className="icon-state-finished"/>
                                    }
                                </Tooltip>
                            </span>
                        } key="saleInvoiceRecord">
                            <SaleInvoiceRecord
                                onRef={(record) => this.invoiceRecord = record}
                                module={"saleInvoice"} option={"show"} type={'saleOrder'} recordFor={id}
                                noAuthRender={<span style={{paddingTop: '30px'}}>{intl.get("sale.show.index.noAuthRender")}</span>}/>
                        </TabPane>
                        <TabPane tab={
                            <span ga-data={'sale-detail-tab-income'} className={cx("tab-tit")}>
                                {intl.get("sale.show.index.payRecord")}
                                <Tooltip
                                    type={"open"}
                                    title={detailData && detailData.get('payState') == 0 ? intl.get("sale.show.index.payState_notFinish") : intl.get("sale.show.index.payState_finish")}
                                >
                                    {
                                        detailData && detailData.get('payState') == 0 ?  <Icon type="icon-state-unfinished"  className="icon-state-unfinish"/> :
                                            <Icon type="icon-state-finished"  className="icon-state-finished"/>
                                    }
                                </Tooltip>
                            </span>
                        } key="incomeRecord">
                            <IncomeRecord
                                onRef={(record) => this.incomeRecord = record}
                                type={'saleOrder'}
                                module={"income"}
                                option={"show"}
                                recordFor={id}
                                noAuthRender={<span style={{paddingTop: '30px'}}>{intl.get("sale.show.index.noAuthRender")}</span>}/>
                        </TabPane>
                        <TabPane tab={
                            <span  className={cx("tab-tit")}>生产记录</span>
                        } key="produceRecord">
                            <ProduceRecord
                                recordFor={id}
                                noAuthRender={<span style={{paddingTop: '30px'}}>{intl.get("sale.show.index.noAuthRender")}</span>}/>
                        </TabPane>*/}
                    {/*</Tabs>*/}
                    </div>
                    {this.renderOperatorButton()}
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
                    this.state.wareOutPopVisible && <WareOutBatchEdit
                        visible={this.state.wareOutPopVisible}
                        popTitle={intl.get("sale.show.index.outbound")}
                        billIds={[id]}
                        visibleFlag={'wareOutPopVisible'}
                        currencyVipFlag={currencyVipFlag}
                        onOk={() => {
                            this.closeModal('wareOutPopVisible');
                            this.loadData();
                            this.wareOut && this.wareOut.fetchData({page: 1});
                        }}
                        onCancel={() => this.closeModal('wareOutPopVisible')}
                    />
                }
                {
                    this.state.saleInvoicePopVisible && <FinanceSaleInvoiceBatchEdit
                        visible={this.state.saleInvoicePopVisible}
                        popTitle={intl.get("sale.show.index.invoice")}
                        billIds={[id]}
                        currencyVipFlag={currencyVipFlag}
                        onOk={() => {
                            this.closeModal('saleInvoicePopVisible');
                            this.loadData();
                            this.invoiceRecord && this.invoiceRecord.fetchData({page: 1});
                        }}
                        onCancel={() => this.closeModal('saleInvoicePopVisible')}
                    />
                }

                {
                    this.state.incomePopVisible && <FinanceIncomeBatchEdit
                        visible={this.state.incomePopVisible}
                        popTitle={intl.get("sale.show.index.pay")}
                        billIds={[id]}
                        currencyVipFlag={currencyVipFlag}
                        onOk={() => {
                            this.closeModal('incomePopVisible');
                            this.loadData();
                            this.incomeRecord && this.incomeRecord.fetchData({page: 1});
                        }}
                        onCancel={() => this.closeModal('incomePopVisible')}
                    />
                }
                <BindCustomer
                    visible={this.state.saveCustomerVisible}
                    tip={<div><p>{intl.get("sale.show.index.message3")}</p><p>{intl.get("sale.show.index.message4")}</p></div>}
                    onCancel={()=>this.closeModal('saveCustomerVisible')}
                    customerInfo={this.state.customerInfo}
                    okCallback={this.bindCustomerCallback}
                />
                <Modal
                    title={intl.get("sale.show.index.remindInfo")}
                    visible={this.state.cancelPopVisible}
                    okText={intl.get("sale.show.index.okText")}
                    cancelText={intl.get("sale.show.index.cancelText")}
                    onOk={this.rejectPopOnOk}
                    onCancel={()=>this.closeModal('cancelPopVisible')}
                >
                    <div className={cx("cancel-confirm")}>
                        <p>{intl.get("sale.show.index.message5")} </p>
                        <p>{intl.get("sale.show.index.message6")} </p>
                        <Radio.Group onChange={this.allowRadioChange}>
                            <Radio value={1}>{intl.get("sale.index.record.yes")}</Radio>
                            <Radio value={0}>{intl.get("sale.index.record.no")}</Radio>
                        </Radio.Group>
                    </div>
                </Modal>
                <LimitOnlineTip onClose={()=>this.closeModal('showTip')} show={this.state.showTip}/>
                <SelectApproveItem  // 选择审批流 ***
                    onClose={this.extendApproveCancelModal}
                    onOk={(id)=>{this.extendApproveOkModal(id,billNo,BACKEND_TYPES.sale,this.loadData)}}
                    show={this.state.selectApprove}
                    type={BACKEND_TYPES.sale}
                />
            </Layout>
        )
    }
}

