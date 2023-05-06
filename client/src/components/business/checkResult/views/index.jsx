import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {
    Button
} from 'antd';
import Tooltip from 'components/widgets/tooltip';

import Icon from 'components/widgets/icon';
import ExportButton from 'components/business/exportModal';
import {Auth} from "utils/authComponent";
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {
  CloseOutlined
} from '@ant-design/icons';
import {
    DeleteButton,
    WareEnterButton,
    WareOutButton,
    IncomeButton,
    ExpandButton,
    InvoiceButton,
    SaleInvoiceButton,
    ApproveButton,
    UnApproveButton,
} from "components/business/authMenu";
import {backDisabledStatus, batchBackDisabledStatusForList} from 'components/business/approve';
import PropTypes from "prop-types";
import {message} from "antd/lib/index";

const cx = classNames.bind(styles);

/**
 * 列表页批量操作
 *
 * @visibleName CheckResult（列表页批量操作）
 * @author guozhaodong
 */
class CheckResult extends Component {
    static propTypes = {
        /**
         * 是否显示批量操作
         **/
        visible: PropTypes.bool,
        /**
         * 指定选中项的 key 数组
         **/
        selectedRowKeys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
        /**
         * 指定选中项的属性 数组
         **/
        selectedRows: PropTypes.arrayOf(PropTypes.object),
        /**
         * 隐藏批量操作方法
         **/
        onRemove: PropTypes.func,
        /**
         * 删除按钮的方法
         **/
        onDelete: PropTypes.func,
        /**
         * 采购按钮的方法
         **/
        onPurchase: PropTypes.func,
        /**
         * 导出按钮的方法，详细见exportModal组件
         **/
        exportModel: PropTypes.shape({
            exportDataSource: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
            exportType: PropTypes.string
        }),
        /**
         * 分配子账号按钮的方法
         **/
        onDispatch: PropTypes.func,
        /**
         * 取消分销按钮的方法
         **/
        onCancelDistribute: PropTypes.func,
        /**
         * 入库按钮的方法
         **/
        onWareEnter: PropTypes.func,
        /**
         * 出库按钮的方法
         **/
        onWareOut: PropTypes.func,
        /**
         * 到票按钮的方法
         **/
        onInvoice: PropTypes.func,
        /**
         * 合并到票按钮的方法
         **/
        onMergeInvoice: PropTypes.func,
        /**
         * 付款按钮的方法
         **/
        onExpend: PropTypes.func,
        /**
         * 合并付款按钮的方法
         **/
        onMergeExpend: PropTypes.func,
        /**
         * 收款按钮的方法
         **/
        onIncome: PropTypes.func,
        /**
         * 合并收款按钮的方法
         **/
        onMergeIncome: PropTypes.func,
        /**
         * 开票按钮的方法
         **/
        onSaleInvoice: PropTypes.func,
        /**
         * 合并开票按钮的方法
         **/
        onMergeSaleInvoice: PropTypes.func,
        /**
         * 开启分销的方法
         **/
        onOpenDistribute: PropTypes.func,
        /**
         * 批量加入购物车的方法
         **/
        onBatchJoinShopCart: PropTypes.func,
        /**
         * 批量审核
         **/
        onBatchApprove: PropTypes.func,
        /**
         * 批量反审
         **/
        onBatchUnApprove: PropTypes.func,
        /**
         * 权限所属模块
         **/
        module:  PropTypes.string,
        /**
         *  当前账号的主账号是否开启审批功能
         **/
        approveModuleFlag:  PropTypes.number,
        /**
         *  当前账号是否具备审批权
         **/
        approveFlag:  PropTypes.number,
    };

    constructor(props) {
        super(props);
    }
    //销售模块部分按钮是否可以点击
    /*interchangeStatus = 1  "未接收"
    interchangeStatus = 2  "已接收"
    interchangeStatus = 3  "已取消"*/
    saleButtonIsClick = (data) => {
        if (data && data.some(item => item.interchangeStatus === 1 || item.interchangeStatus === 3)) {
            return false;
        }
        return true
    };
    //删除按钮是否可以点击
    saleButtonIsDelete = (data) => {
        if (data && data.some(item => item.interchangeStatus === 1 || item.interchangeStatus === 2)) {
            return false;
        }
        return true
    };

    // 气泡提示  后续再做优化太多了，改不动
    hoverPopConfirm = (props) => {
        let { tipTitle, flag, icon, theme, title } = props;
        return (
            <Tooltip title={tipTitle}>
                <Button disabled={flag}>
                    <Icon type={icon} theme={theme}/>{title}
                </Button>
            </Tooltip>
        );
    };
    // {this.hoverPopConfirm('当前订单状态不能执行此操作', !approveStatus, 'icon-delete', 'filled', '删除')}



    render() {

        const {
            visible,
            selectedRowKeys,
            selectedRows,
            onRemove,
            onDelete,
            onPurchase,
            exportModel,
            // onShare,
            onDispatch,
            onCancelDistribute,
            onWareEnter,
            onWareOut,
            onInvoice,
            onMergeInvoice,
            onExpend,
            onMergeExpend,
            onIncome,
            onMergeIncome,
            onSaleInvoice,
            onMergeSaleInvoice,
            onOpenDistribute,
            onBatchJoinShopCart,
            onBatchShelfLeft,
            // onBatchApprove,
            // onBatchUnApprove,
            onSubmitApprove,
            module,
            approveModuleFlag,
            // approveFlag
        } = this.props;

        const minCountCanMerge = selectedRows && selectedRows.length >= 2;
        //判断是否可以出库
        const isClick = this.saleButtonIsClick(selectedRows);
        //判断是否可以删除
        const isDelete = this.saleButtonIsDelete(selectedRows);

        const mergeEnabled = minCountCanMerge && selectedRows.every(item => {
            if (onInvoice) {
                return item.supplierName === selectedRows[0].supplierName
            } else {
                return item.customerName === selectedRows[0].customerName
            }
        });

        var hasOnlineOrder = false,
            inboundApproveDisabled = false,
            invoiceApproveDisabled = false,
            mergeInvoiceApproveDisabled = false,
            expendApproveDisabled = false,
            mergeExpendApproveDisabled = false,
            outboundApproveDisabled = false,
            saleInvoiceApproveDisabled = false,
            mergeSaleInvoiceApproveDisabled = false,
            incomeApproveDisabled = false,
            mergeIncomeApproveDisabled = false,
            deleteApproveDisabled = true,
            approveSubmit = false;

        let InterchangeStatus = [1,2,3]; //未接收 已接收 取消
        if(selectedRows && selectedRows.length > 0){
            hasOnlineOrder = selectedRows.some(item => InterchangeStatus.indexOf(item.interchangeStatus)!== -1);
            var {
                inboundApproveDisabled,
                invoiceApproveDisabled,
                mergeInvoiceApproveDisabled,
                expendApproveDisabled,
                mergeExpendApproveDisabled,
                outboundApproveDisabled,
                saleInvoiceApproveDisabled,
                mergeSaleInvoiceApproveDisabled,
                incomeApproveDisabled,
                mergeIncomeApproveDisabled,
                deleteApproveDisabled,
                approveSubmit
            } = batchBackDisabledStatusForList(approveModuleFlag, selectedRows, backDisabledStatus);  // 选中后获取按钮的审批权限

        }

        const shouldShowMergeTip = !mergeEnabled && minCountCanMerge;
        return (
            <div className={cx(["check-result", {"hide": !visible}])}>
                <a href="#!" className={cx("remove")} onClick={onRemove}><CloseOutlined /></a>
                <span className={cx("result")}>{intl.get("components.checkResult.index.hasChoose")}<b>{selectedRowKeys.length}</b>{intl.get("components.checkResult.index.item")}</span>
                {
                    onWareEnter && (!inboundApproveDisabled ? (
                        <Tooltip title={intl.get("components.checkResult.index.orderStatusUnableToExecute")}>
                            <Button disabled={!inboundApproveDisabled}>
                                <Icon type="icon-delete" theme="filled"/>{intl.get("components.checkResult.index.inbound")}
                            </Button>
                        </Tooltip>
                    ): isClick?<WareEnterButton
                        ga-data={'batch-wareEnter'}
                        clickHandler={() => onWareEnter(selectedRowKeys)} icon={"icon-store-in"}/>:(
                        <Tooltip title={intl.get("components.checkResult.index.orderNotContainerNotFinishReceiveOrder")}>
                            <Button disabled={!isClick}>
                                <Icon type="icon-store-in" theme="filled"/>{intl.get("components.checkResult.index.inbound")}
                            </Button>
                        </Tooltip>
                    ))
                }
                {
                    onInvoice && (!invoiceApproveDisabled ? (
                        <Tooltip title={intl.get("components.checkResult.index.orderStatusUnableToExecute")}>
                            <Button disabled={!invoiceApproveDisabled}>
                                <Icon type="icon-delete" theme="filled"/>{intl.get("components.checkResult.index.invoice")}
                            </Button>
                        </Tooltip>
                    ): isClick?<InvoiceButton
                        ga-data={'batch-invoice'}
                        clickHandler={() => onInvoice(selectedRowKeys)} icon={"icon-invoice"}/>:(
                        <Tooltip title={intl.get("components.checkResult.index.orderNotContainerNotFinishReceiveOrder")}>
                            <Button disabled={!isClick}>
                                <Icon type="icon-invoice" theme="filled"/>{intl.get("components.checkResult.index.invoice")}
                            </Button>
                        </Tooltip>
                    ))
                }
                {
                    onMergeInvoice && (
                            !mergeInvoiceApproveDisabled ? (
                                <Tooltip title={intl.get("components.checkResult.index.orderStatusUnableToExecute")}>
                                    <Button disabled={!mergeInvoiceApproveDisabled}>
                                        <Icon type="icon-delete" theme="filled"/>{intl.get("components.checkResult.index.mergeInvoice")}
                                    </Button>
                                </Tooltip>
                            ) : shouldShowMergeTip ? (
                            <Tooltip title={intl.get("components.checkResult.index.sameSupplierUnableInvoice")}>
                                <Button disabled={!mergeEnabled}>
                                    <Icon type="icon-invoice" theme="filled"/>{intl.get("components.checkResult.index.mergeInvoice")}
                                </Button>
                            </Tooltip>
                        ) : (
                            <InvoiceButton
                                ga-data={'batch-mergeInvoice'}
                                label={intl.get("components.checkResult.index.mergeInvoice")}
                                disabled={!mergeEnabled}
                                clickHandler={() => onMergeInvoice(selectedRowKeys)}
                                icon={"icon-invoice"}/>
                        )
                    )
                }
                {
                    onExpend && (!expendApproveDisabled ? (
                        <Tooltip title={intl.get("components.checkResult.index.orderStatusUnableToExecute")}>
                            <Button disabled={!expendApproveDisabled}>
                                <Icon type="icon-delete" theme="filled"/>{intl.get("components.checkResult.index.payment")}
                            </Button>
                        </Tooltip>
                    ) : isClick ? <ExpandButton
                        ga-data={'batch-expend'}
                        clickHandler={() => onExpend(selectedRowKeys)} icon={"icon-payment"}/>:(
                        <Tooltip title={intl.get("components.checkResult.index.orderNotContainerNotFinishReceiveOrder")}>
                            <Button disabled={!isClick}>
                                <Icon type="icon-payment" theme="filled"/>{intl.get("components.checkResult.index.payment")}
                            </Button>
                        </Tooltip>
                    ))
                }
                {
                    onMergeExpend && (
                        !mergeExpendApproveDisabled ? (
                            <Tooltip title={intl.get("components.checkResult.index.orderStatusUnableToExecute")}>
                                <Button disabled={!mergeExpendApproveDisabled}>
                                    <Icon type="icon-delete" theme="filled"/>{intl.get("components.checkResult.index.mergePayment")}
                                </Button>
                            </Tooltip>
                        ) : shouldShowMergeTip ? (
                            <Tooltip title={intl.get("components.checkResult.index.sameSupplierAblePayment")}>
                                <Tooltip title={intl.get("components.checkResult.index.sameSupplierUnablePayment")}>
                                    <Button disabled={!mergeEnabled}>
                                        <Icon type="icon-payment" theme="filled"/>{intl.get("components.checkResult.index.mergePayment")}
                                    </Button>
                                </Tooltip>
                            </Tooltip>
                        ) : (
                            <ExpandButton
                                ga-data={'batch-mergeExpend'}
                                label={intl.get("components.checkResult.index.mergePayment")}
                                disabled={!mergeEnabled}
                                clickHandler={() => onMergeExpend(selectedRowKeys)}
                                icon={"icon-payment"}/>
                        )
                    )
                }
                {
                    onWareOut && (!outboundApproveDisabled ? (
                        <Tooltip title={intl.get("components.checkResult.index.orderStatusUnableToExecute")}>
                            <Button disabled={!outboundApproveDisabled}>
                                <Icon type="icon-delete" theme="filled"/>{intl.get("components.checkResult.index.outbound")}
                            </Button>
                        </Tooltip>
                    ):isClick?<WareOutButton
                        ga-data={'batch-wareOut'}
                        clickHandler={() => onWareOut(selectedRowKeys)} icon={"icon-store-out"}/>:(
                        <Tooltip title={intl.get("components.checkResult.index.orderNotContainerNotFinishReceiveOrder")}>
                            <Button disabled={!isClick}>
                                <Icon type="icon-store-out" theme="filled"/>{intl.get("components.checkResult.index.outbound")}
                            </Button>
                        </Tooltip>
                    ))
                }
                {
                    onSaleInvoice && (!saleInvoiceApproveDisabled ? (
                        <Tooltip title={intl.get("components.checkResult.index.orderStatusUnableToExecute")}>
                            <Button disabled={!saleInvoiceApproveDisabled}>
                                <Icon type="icon-delete" theme="filled"/>{intl.get("components.checkResult.index.saleInvoice")}
                            </Button>
                        </Tooltip>
                    ):isClick?<SaleInvoiceButton
                        ga-data={'batch-saleInvoice'}
                        clickHandler={() => onSaleInvoice(selectedRowKeys)} icon={"icon-sale-invoice"}/>:(
                        <Tooltip title={intl.get("components.checkResult.index.orderNotContainerNotFinishReceiveOrder")}>
                            <Button disabled={!isClick}>
                                <Icon type="icon-sale-invoice" theme="filled"/>{intl.get("components.checkResult.index.saleInvoice")}
                            </Button>
                        </Tooltip>
                    ))
                }
                {
                     onMergeSaleInvoice && (
                         !mergeSaleInvoiceApproveDisabled ? (
                             <Tooltip title={intl.get("components.checkResult.index.orderStatusUnableToExecute")}>
                                 <Button disabled={!mergeSaleInvoiceApproveDisabled}>
                                     <Icon type="icon-delete" theme="filled"/>{intl.get("components.checkResult.index.mergeSaleInvoice")}
                                 </Button>
                             </Tooltip>
                         ) : shouldShowMergeTip ? (
                            <Tooltip title={intl.get("components.checkResult.index.sameCustomerUnableSaleInvoice")}>
                                <Button disabled={!mergeEnabled}>
                                    <Icon type="icon-sale-invoice" theme="filled"/>{intl.get("components.checkResult.index.mergeSaleInvoice")}
                                </Button>
                            </Tooltip>
                        ) : (
                            <SaleInvoiceButton
                                ga-data={'batch-mergeSaleInvoice'}
                                label={intl.get("components.checkResult.index.mergeSaleInvoice")}
                                disabled={!mergeEnabled}
                                clickHandler={() => onMergeSaleInvoice(selectedRowKeys)}
                                // style={{pointerEnabled: 'false'}}
                                icon={"icon-sale-invoice"}/>
                        )
                    )
                }
                {
                    onIncome && (!incomeApproveDisabled ? (
                        <Tooltip title={intl.get("components.checkResult.index.orderStatusUnableToExecute")}>
                            <Button disabled={!incomeApproveDisabled}>
                                <Icon type="icon-delete" theme="filled"/>{intl.get("components.checkResult.index.income")}
                            </Button>
                        </Tooltip>
                    ):isClick?<IncomeButton
                        ga-data={'batch-income'}
                        clickHandler={() => onIncome(selectedRowKeys)} icon={"icon-receipt"}/>:(
                        <Tooltip title={intl.get("components.checkResult.index.orderNotContainerNotFinishReceiveOrder")}>
                            <Button disabled={!isClick}>
                                <Icon type="icon-receipt" theme="filled"/>{intl.get("components.checkResult.index.income")}
                            </Button>
                        </Tooltip>
                    ))
                }
                {
                    onMergeIncome && (
                        !mergeIncomeApproveDisabled ? (
                            <Tooltip title={intl.get("components.checkResult.index.orderStatusUnableToExecute")}>
                                <Button disabled={!mergeIncomeApproveDisabled}>
                                    <Icon type="icon-delete" theme="filled"/>{intl.get("components.checkResult.index.mergeIncome")}
                                </Button>
                            </Tooltip>
                        ) : shouldShowMergeTip ? (
                            <Tooltip title={intl.get("components.checkResult.index.sameCustomerUnableIncome")}>
                                <Button disabled={!mergeEnabled}>
                                    <Icon type="icon-invoice" theme="filled"/>{intl.get("components.checkResult.index.mergeIncome")}
                                </Button>
                            </Tooltip>
                        ) : (
                            <IncomeButton
                                ga-data={'batch-mergeIncome'}
                                label={intl.get("components.checkResult.index.mergeIncome")}
                                disabled={!mergeEnabled}
                                clickHandler={() => onMergeIncome(selectedRowKeys)}
                                // style={{pointerEnabled: 'false'}}
                                icon={"icon-invoice"}/>
                        )
                    )
                }
                {
                    onDispatch ? (
                        <Auth option='main'>{
                            (isAuthed) => isAuthed ?
                                <Button
                                    ga-data={'batch-dispatch'}
                                    onClick={() => onDispatch(selectedRowKeys)}><Icon type="icon-assign-subaccount"
                                                                                      theme="filled"/>{intl.get("components.checkResult.index.assignToSubAccount")}</Button> : null
                        }</Auth>
                    ) : null
                }
                {

                    onDelete ? (
                        !deleteApproveDisabled ? (
                            <Tooltip title={intl.get("components.checkResult.index.orderStatusUnableToExecute")}>
                                    <Button disabled={!deleteApproveDisabled}>
                                        <Icon type="icon-delete" theme="filled"/>{intl.get("components.checkResult.index.delete")}
                                     </Button>
                             </Tooltip>
                        ): isDelete ? (<DeleteButton ga-data={'batch-delete'}   clickHandler={() => onDelete(selectedRowKeys, selectedRows)} icon={"icon-delete"}
                                                        iconTheme={"filled"} module={module}/>):
                                (
                                        <Tooltip title={intl.get("components.checkResult.index.unReceivedAndHasReceivedOrderUnableDelete")}>
                                            <Button disabled={!isDelete}>
                                                <Icon type="icon-delete" theme="filled"/>{intl.get("components.checkResult.index.delete")}
                                            </Button>
                                        </Tooltip>
                                )

                    ) : null
                }
                {
                    onPurchase ? (
                        <Button ga-data={'batch-delete'}   onClick={() => onPurchase(selectedRowKeys, selectedRows)}>
                            <Icon type="icon-cart"
                                  theme="filled"/>
                            采购
                        </Button>
                    ): null
                }
                {
                    exportModel ? (
                        <ExportButton
                            gadata={'batch-export-special'}
                            dataSource={exportModel.exportDataSource} type={exportModel.exportType}/>
                    ) : null
                }
                {/*{*/}
                    {/*onShare ? (*/}
                        {/*<Button onClick={() => onShare(selectedRowKeys)}><Icon type="icon-share"/>共享给客户</Button>*/}
                    {/*) : null*/}
                {/*}*/}
                {
                    onOpenDistribute ? (
                        <Button onClick={() => onOpenDistribute(selectedRowKeys,selectedRows)}><Icon type="icon-putaway"/>
                            {
                                this.props.onOpenDistributeText?this.props.onOpenDistributeText: intl.get("components.checkResult.index.allowAccessMall")
                            }
                        </Button>
                    ) : null
                }
                {
                    onCancelDistribute ? (
                        <Button onClick={() => onCancelDistribute(selectedRowKeys)}><Icon type="icon-soldout"/>
                            {
                                this.props.onCancelDistributeText?this.props.onCancelDistributeText: intl.get("components.checkResult.index.forbidAccessMall")
                            }
                        </Button>
                    ) : null
                }
                {
                    onBatchJoinShopCart ? (
                        <Button
                            ga-data={'batch-joinShopCart'}
                            onClick={() => onBatchJoinShopCart(selectedRowKeys)}><Icon
                            type="icon-cart"/>{intl.get("components.checkResult.index.batchAddToCart")}</Button>
                    ) : null
                }
                {
                    onBatchShelfLeft ? (
                        <Button
                            ga-data={'batch-joinShopCart'}
                            onClick={() => onBatchShelfLeft(selectedRowKeys,selectedRows)}><Icon
                            type="icon-batch-shelf-copy"/>批次查询</Button>
                    ) : null
                }

                {
                    approveModuleFlag === 1 && onSubmitApprove ? (
                        <>
                            {
                                !approveSubmit ? (
                                    <Tooltip title={'所选单据中存在已驳回、审批中或已审批单据，无法批量提交'}>
                                        <Button
                                            ga-data={'batch-joinShopCart'}
                                            disabled={!approveSubmit}
                                            onClick={() => onSubmitApprove(selectedRowKeys,selectedRows)}><Icon
                                            type="icon-batch-shelf-copy"/>提交审批</Button>
                                    </Tooltip>
                                ) : (
                                    <Button
                                        ga-data={'batch-joinShopCart'}
                                        disabled={!approveSubmit}
                                        onClick={() => onSubmitApprove(selectedRowKeys,selectedRows)}><Icon
                                        type="icon-batch-shelf-copy"/>提交审批</Button>
                                )
                            }
                        </>
                    ) : null
                }

            </div>
        )
    }
}

export default CheckResult;