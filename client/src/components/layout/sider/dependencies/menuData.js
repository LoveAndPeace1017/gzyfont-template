import React from 'react';
import IntlTranslation from 'utils/IntlTranslation'

const menuData = [
    {
        key: 'sale',
        icon: 'icon-sale',
        label: <IntlTranslation intlKey = "home.menu.sale.title"/>,
        subMenuGroup: [
            {
                title: <IntlTranslation intlKey = "home.menu.sale.title"/>,
                subMenu: [
                    {
                        key: '/sale/add',
                        path: '/sale/add',
                        label: <IntlTranslation intlKey = "home.menu.sale.add"/>,
                    }, {
                        key: '/sale/',
                        path: '/sale/',
                        label: <IntlTranslation intlKey = "home.menu.sale.list"/>,
                    }
                ]
            },
            {
                title: "报价",
                subMenu: [
                    {
                        key: '/quotation/add',
                        path: '/quotation/add',
                        label: "新建报价单",
                    }, {
                        key: '/quotation/',
                        path: '/quotation/',
                        label: "报价单列表",
                    }
                ]
            }
        ]
    },
    {
        key: 'purchase',
        icon: 'icon-cart',
        label: <IntlTranslation intlKey = "home.menu.purchase.title"/>,
        subMenuGroup: [
            {
                title:  <IntlTranslation intlKey = "home.menu.purchase.title"/>,
                subMenu: [
                    {
                        key: '/purchase/add',
                        path: '/purchase/add',
                        label: <IntlTranslation intlKey = "home.menu.purchase.add"/>,
                    }, {
                        key: '/purchase/',
                        path: '/purchase/',
                        label: <IntlTranslation intlKey = "home.menu.purchase.list"/>,
                    },
                    {
                        key: '/purchase/lackMaterial',
                        path: '/purchase/lackMaterial',
                        label: <IntlTranslation intlKey = "home.menu.purchase.lack"/>,
                    }
                ]
            },{
                title: <IntlTranslation intlKey = "home.menu.purchase.inquiryTitle"/>,
                subMenu: [
                    {
                        key: '/inquiry/add',
                        path: '/inquiry/add',
                        label: <IntlTranslation intlKey = "home.menu.purchase.inquiryAdd"/>
                    }, {
                        key: '/inquiry/',
                        path: '/inquiry/',
                        label: <IntlTranslation intlKey = "home.menu.purchase.inquiryList"/>
                    }
                ]
            },{
                title: "请购",
                subMenu: [
                    {
                        key: '/purchase/requisitionOrder/add/',
                        path: '/purchase/requisitionOrder/add/',
                        label: "新增请购单"
                    },
                    {
                        key: '/purchase/requisitionOrder/',
                        path: '/purchase/requisitionOrder/',
                        label: "请购单列表"
                    },
                    {
                        key: '/purchase/requisitionOrder/applyIndex',
                        path: '/purchase/requisitionOrder/applyIndex',
                        label: "采购申请明细"
                    }
                ]
            }
        ]
    },
    {
        key: 'store',
        icon: 'icon-store',
        label: <IntlTranslation intlKey = "home.menu.inOut.title"/>,
        subMenuGroup: [
            {
                title: <IntlTranslation intlKey = "home.menu.inOut.in"/>,
                subMenu: [
                    {
                        key: '/inventory/inbound/add',
                        path: '/inventory/inbound/add',
                        label: <IntlTranslation intlKey = "home.menu.inOut.inAdd"/>,
                    }, {
                        key: '/inventory/inbound/',
                        path: '/inventory/inbound/',
                        label: <IntlTranslation intlKey = "home.menu.inOut.inList"/>,
                    }
                ]
            }, {
                title: <IntlTranslation intlKey = "home.menu.inOut.out"/>,
                subMenu: [
                    {
                        key: '/inventory/outbound/add',
                        path: '/inventory/outbound/add',
                        label: <IntlTranslation intlKey = "home.menu.inOut.outAdd"/>,
                    }, {
                        key: '/inventory/outbound/',
                        path: '/inventory/outbound/',
                        label: <IntlTranslation intlKey = "home.menu.inOut.outList"/>,
                    }
                ]
            }, {
                title: <IntlTranslation intlKey = "home.menu.inOut.stocktaking"/>,
                subMenu: [
                    {
                        key: '/inventory/stocktaking/add',
                        path: '/inventory/stocktaking/add',
                        label: <IntlTranslation intlKey = "home.menu.inOut.stocktakingAdd"/>,
                    }, {
                        key: '/inventory/stocktaking/',
                        path: '/inventory/stocktaking/',
                        label: <IntlTranslation intlKey = "home.menu.inOut.stocktakingList"/>,
                    }
                ]
            }, {
                title: <IntlTranslation intlKey = "home.menu.inOut.scheduling"/>,
                subMenu: [
                    {
                        key: '/inventory/scheduling/add',
                        path: '/inventory/scheduling/add',
                        label: <IntlTranslation intlKey = "home.menu.inOut.schedulingAdd"/>,
                    }, {
                        key: '/inventory/scheduling/',
                        path: '/inventory/scheduling/',
                        label: <IntlTranslation intlKey = "home.menu.inOut.schedulingList"/>,
                    }
                ]
            }
        ]
    },
    {
        key: 'productControl',
        icon: 'icon-subcontract',
        label: '生产管理',
        subMenuGroup: [
            {
                title: 'MRP运算',
                subMenu: [
                    {
                        key: '/productControl/mrpCount/add',
                        path: '/productControl/mrpCount/add',
                        label: '新建模拟生产',
                        vipSource: 'productManage',
                        module: 1
                    }, {
                        key: '/productControl/mrpCount/list',
                        path: '/productControl/mrpCount/list',
                        label: '模拟生产列表',
                        vipSource: 'productManage',
                        module: 1
                    }
                ]
            }, {
                title: '生产制造',
                subMenu: [
                    {
                        key: '/produceOrder/add?produceType=0',
                        path: '/produceOrder/add?produceType=0',
                        label: '新建内部生产单',
                        vipSource: 'productManage',
                        module: 2
                    }, {
                        key: '/produceOrder?produceType=0',
                        path: '/produceOrder?produceType=0',
                        label: '内部生产单列表',
                        vipSource: 'productManage',
                        module: 2
                    }, {
                        key: '/produceOrder/add?produceType=1',
                        path: '/produceOrder/add?produceType=1',
                        label: '新建委外生产单',
                        vipSource: 'productManage',
                        module: 2
                    }, {
                        key: '/produceOrder?produceType=1',
                        path: '/produceOrder?produceType=1',
                        label: '委外生产单列表',
                        vipSource: 'productManage',
                        module: 2
                    }
                ]
            }, {
                title: '生产工单',
                subMenu: [
                    {
                        key: '/productControl/add',
                        path: '/productControl/add',
                        label: '新建生产工单',
                        vipSource: 'productManage',
                        module: 4
                    }, {
                        key: '/productControl/',
                        path: '/productControl/',
                        label: '生产工单列表',
                        vipSource: 'productManage',
                        module: 4
                    }, {
                        key: '/productControl/processList',
                        path: '/productControl/processList',
                        label: '工序任务列表',
                        vipSource: 'productManage',
                        module: 4
                    },{
                        key: '/report/workOrderProgress',
                        path: '/report/workOrderProgress',
                        label: "工单进度图",
                        vipSource: 'productManage',
                        module: 4
                    }
                ]
            }
            // , {
            //     title: '委外加工',
            //     subMenu: [
            //         {
            //             key: '/subcontract/add',
            //             path: '/subcontract/add',
            //             label: '新建委外加工单',
            //             vipSource: 'subContract'
            //         },
            //         {
            //             key: '/subcontract/',
            //             path: '/subcontract/',
            //             label: '委外加工单列表',
            //         }
            //     ]
            // }
        ]
    },
    {
        key: 'goods',
        icon: 'icon-goods',
        label: <IntlTranslation intlKey = "home.menu.goods.title"/>,
        subMenuGroup: [
            {
                title: <IntlTranslation intlKey = "home.menu.goods.title"/>,
                subMenu: [
                    {
                        key: '/goods/add',
                        path: '/goods/add',
                        label: <IntlTranslation intlKey = "home.menu.goods.add"/>,
                    }, {
                        key: '/multiGoods/add',
                        path: '/multiGoods/add',
                        label: "新建多规格物品",
                    }, {
                        key: '/goods/',
                        path: '/goods/',
                        label: <IntlTranslation intlKey = "home.menu.goods.list"/>,
                    }, {
                        key: '/report/inactiveStock/detail',
                        path: '/report/inactiveStock/detail',
                        label: <IntlTranslation intlKey = "home.menu.goods.inactiveStock"/>,
                    }, {
                        key: '/goods/serialNumQuery',
                        path: '/goods/serialNumQuery',
                        label: <IntlTranslation intlKey = "home.menu.goods.serialNumQuery"/>,
                    }, {
                        key: '/report/batchQuery/detail',
                        path: '/report/batchQuery/detail',
                        label: <IntlTranslation intlKey = "goods.serialNumQuery.crumb2"/>,
                    }
                ]
            },
            {
                title: 'BOM',
                subMenu: [
                    {
                        key: '/goods/multiBom/add',
                        path: '/multiBom/add',
                        label: '新建多级BOM',
                        vipSource: 'fitting'
                    }, {
                        key: '/goods/multiBom/list',
                        path: '/multiBom/list',
                        label: '多级BOM列表',
                        vipSource: 'fitting'
                    }
                ]
            }
        ]
    },
    {
        key: 'basic',
        icon: 'icon-in-out-com',
        label: <IntlTranslation intlKey = "home.menu.inoutUnit.title"/>,
        subMenuGroup: [
            {
                title: <IntlTranslation intlKey = "home.menu.inoutUnit.supplier"/>,
                subMenu: [
                    {
                        key: '/supplier/add',
                        path: '/supplier/add',
                        label: <IntlTranslation intlKey = "home.menu.inoutUnit.supplierAdd"/>,
                    }, {
                        key: '/supplier/',
                        path: '/supplier/',
                        label: <IntlTranslation intlKey = "home.menu.inoutUnit.supplierList"/>,
                    }
                ]
            },
            {
                title: <IntlTranslation intlKey = "home.menu.inoutUnit.customer"/>,
                subMenu: [
                    {
                        key: '/customer/add',
                        path: '/customer/add',
                        label: <IntlTranslation intlKey = "home.menu.inoutUnit.customerAdd"/>,
                    }, {
                        key: '/customer/',
                        path: '/customer/',
                        label: <IntlTranslation intlKey = "home.menu.inoutUnit.customerList"/>,
                    }
                ]
            }
        ]
    },
    {
        key: 'finance',
        icon: 'icon-finance',
        label: <IntlTranslation intlKey = "home.menu.finance.title"/>,
        subMenuGroup: [
            {
                title: <IntlTranslation intlKey = "home.menu.finance.income"/>,
                subMenu: [
                    {
                        key: '/finance/income/add',
                        path: '/finance/income/add',
                        label: <IntlTranslation intlKey = "home.menu.finance.incomeAdd"/>,
                    }, {
                        key: '/finance/income/',
                        path: '/finance/income/',
                        label: <IntlTranslation intlKey = "home.menu.finance.incomeList"/>,
                    }
                ]
            },
            {
                title: <IntlTranslation intlKey = "home.menu.finance.expend"/>,
                subMenu: [
                    {
                        key: '/finance/expend/add',
                        path: '/finance/expend/add',
                        label: <IntlTranslation intlKey = "home.menu.finance.expendAdd"/>,
                    }, {
                        key: '/finance/expend/',
                        path: '/finance/expend/',
                        label: <IntlTranslation intlKey = "home.menu.finance.expendList"/>,
                    }
                ]
            },
            {
                title: <IntlTranslation intlKey = "home.menu.finance.saleInvoice"/>,
                subMenu: [
                    {
                        key: '/finance/saleInvoice/add',
                        path: '/finance/saleInvoice/add',
                        label: <IntlTranslation intlKey = "home.menu.finance.saleInvoiceAdd"/>,
                    }, {
                        key: '/finance/saleInvoice/',
                        path: '/finance/saleInvoice/',
                        label: <IntlTranslation intlKey = "home.menu.finance.saleInvoiceList"/>,
                    }
                ]
            },
            {
                title: <IntlTranslation intlKey = "home.menu.finance.invoice"/>,
                subMenu: [
                    {
                        key: '/finance/invoice/add',
                        path: '/finance/invoice/add',
                        label: <IntlTranslation intlKey = "home.menu.finance.invoiceAdd"/>,
                    }, {
                        key: '/finance/invoice/',
                        path: '/finance/invoice/',
                        label: <IntlTranslation intlKey = "home.menu.finance.invoiceList"/>,
                    }
                ]
            },
            {
                title: <IntlTranslation intlKey = "home.menu.finance.check"/>,
                subMenu: [
                    {
                        key: '/report/check_supplier/detail',
                        path: '/report/check_supplier/detail',
                        label: <IntlTranslation intlKey = "home.menu.finance.check_supplier"/>,
                    }/*,
                    {
                        key: '/finance/check/supplier/pay_invoice',
                        path: '/finance/check/supplier/pay_invoice',
                        label: '和供应商对账（付款收票）'
                    }*/,
                    {
                        key: '/report/check_customer/detail',
                        path: '/report/check_customer/detail',
                        label: <IntlTranslation intlKey = "home.menu.finance.check_customer"/>,
                    }/*,
                    {
                        key: '/finance/check/customer/pay_invoice',
                        path: '/finance/check/customer/pay_invoice',
                        label: '和客户对账（收款开票）'
                    }*/
                ]
            }
        ]
    },
    {
        key: 'report',
        icon: 'icon-report',
        label: <IntlTranslation intlKey = "home.menu.report.title"/>,
        subMenuGroup: [
            {
                title: <IntlTranslation intlKey = "home.menu.report.purchase"/>,
                subMenu: [
                    {
                        key: '/report/purchase/detail',
                        path: '/report/purchase/detail',
                        label: <IntlTranslation intlKey = "home.menu.report.purchaseDetail"/>,
                    }, {
                        key: '/report/purchaseTrace/detail',
                        path: '/report/purchaseTrace/detail',
                        label: <IntlTranslation intlKey = "home.menu.report.purchaseTrace"/>,
                    }, {
                        key: '/report/purchaseSummaryByProd/detail',
                        path: '/report/purchaseSummaryByProd/detail',
                        label: <IntlTranslation intlKey = "home.menu.report.purchaseSummaryByProd"/>,
                    }, {
                        key: '/report/purchaseSummaryBySupplier/detail',
                        path: '/report/purchaseSummaryBySupplier/detail',
                        label: <IntlTranslation intlKey = "home.menu.report.purchaseSummaryBySupplier"/>,
                    },{
                        key: '/report/purchaseRefundSummaryByProd/detail',
                        path: '/report/purchaseRefundSummaryByProd/detail',
                        label:  <IntlTranslation intlKey = "home.menu.report.purchaseRefundSummaryByProd"/>,
                    },{
                        key: '/report/purchasePriceTrend/detail',
                        path: '/report/purchasePriceTrend/detail',
                        label: '采购价格走势表',
                    }
                ]
            },
            {
                title: '___',
                subMenu: [
                    {
                        key: '/report/purchaseSummary/detail',
                        path: '/report/purchaseSummary/detail',
                        label: "采购汇总图",
                    },
                ]
            },
            {
                title: <IntlTranslation intlKey = "home.menu.report.sale"/>,
                subMenu: [
                    {
                        key: '/report/sale/detail',
                        path: '/report/sale/detail',
                        label: <IntlTranslation intlKey = "home.menu.report.saleDetail"/>,
                    },{
                        key: '/report/saleTrace/detail',
                        path: '/report/saleTrace/detail',
                        label: <IntlTranslation intlKey = "home.menu.report.saleTrace"/>,
                    }, {
                        key: '/report/saleSummaryByProd/detail',
                        path: '/report/saleSummaryByProd/detail',
                        label: <IntlTranslation intlKey = "home.menu.report.saleSummaryByProd"/>,
                    }, {
                        key: '/report/saleSummaryByCustomer/detail',
                        path: '/report/saleSummaryByCustomer/detail',
                        label: <IntlTranslation intlKey = "home.menu.report.saleSummaryByCustomer"/>,
                    }, {
                        key: '/report/saleSummaryBySeller/detail',
                        path: '/report/saleSummaryBySeller/detail',
                        label: <IntlTranslation intlKey = "home.menu.report.saleSummaryBySeller"/>,
                    }, {
                        key: '/report/saleGrossProfitForecast/detail',
                        path: '/report/saleGrossProfitForecast/detail',
                        label: '销售毛利预测表',
                    }
                ]
            },
            {
                title: '___',
                subMenu: [
                    {
                        key: '/report/saleSummary/detail',
                        path: '/report/saleSummary/detail',
                        label: "销售汇总图",
                    },{
                        key: '/report/saleRefundSummaryByProd/detail',
                        path: '/report/saleRefundSummaryByProd/detail',
                        label: <IntlTranslation intlKey = "home.menu.report.saleRefundSummaryByProd"/>,
                    },{
                        key: '/report/tradeSaleProfit/detail',
                        path: '/report/tradeSaleProfit/detail',
                        label: <IntlTranslation intlKey = "home.menu.report.tradeSaleProfit"/>,
                    },{
                        key: '/report/quotation/detail',
                        path: '/report/quotation/detail',
                        label: "报价明细表",
                    }
                ]
            },
            {
                title: <IntlTranslation intlKey = "home.menu.report.inOut"/>,
                subMenu: [
                    {
                        key: '/report/inventory/detail',
                        path: '/report/inventory/detail',
                        label: <IntlTranslation intlKey = "home.menu.report.inOutDetail"/>,
                    }, {
                        key: '/report/ware/summary',
                        path: '/report/ware/summary',
                        label: <IntlTranslation intlKey = "home.menu.report.inOutSummary"/>,
                    }, {
                        key: '/report/inventoryPrice/detail',
                        path: '/report/inventoryPrice/detail',
                        label: <IntlTranslation intlKey = "home.menu.report.inOutPrice"/>,
                    },{
                        key: '/report/inventoryPriceUntax/detail',
                        path: '/report/inventoryPriceUntax/detail',
                        label: <IntlTranslation intlKey = "home.menu.report.inOutPriceUntax"/>,
                    },/* {
                        key: '/supplier/store/usage',
                        path: '/supplier/store/usage',
                        label: '领用出库明细表'
                    }, {
                        key: '/supplier/store/sale',
                        path: '/supplier/store/sale',
                        label: '销售出库明细表'
                    }, */{
                        key: '/report/flowmeter/detail',
                        path: '/report/flowmeter/detail',
                        label: <IntlTranslation intlKey = "home.menu.report.flowmeter"/>,
                    },{
                        key: '/report/grossProfit/detail',
                        path: '/report/grossProfit/detail',
                        label: <IntlTranslation intlKey = "home.menu.report.grossProfit"/>,
                    }
                ]
            },
            {
                title: '___',
                subMenu: [
                    {
                        key: '/report/grossProfitCustomer/detail',
                        path: '/report/grossProfitCustomer/detail',
                        label: '毛利润统计表（按客户）',
                    },{
                        key: '/report/inventoryInquiry/detail',
                        path: '/report/inventoryInquiry/detail',
                        label: <IntlTranslation intlKey = "home.menu.report.inOutInquiry"/>,
                    },{
                        key: '/report/inactiveStock/detail',
                        path: '/report/inactiveStock/detail',
                        label: <IntlTranslation intlKey = "home.menu.report.inactiveStock"/>,
                    },{
                        key: '/report/mergeDelivery/detail',
                        path: '/report/mergeDelivery/detail',
                        label: '合并送货单',
                    },{
                        key: '/report/collectionAndDelivery/detail',
                        path: '/report/collectionAndDelivery/detail',
                        label: '领用出库汇总表（按部门）',
                    },{
                        key: '/report/wareOutSummaryByEmployee/detail',
                        path: '/report/wareOutSummaryByEmployee/detail',
                        label: '领用出库汇总表（按员工）',
                    }
                ]
            },
            {
                title: <IntlTranslation intlKey = "home.menu.report.financeInOut"/>,
                subMenu: [
                    {
                        key: '/report/financeInOut/detail',
                        path: '/report/financeInOut/detail',
                        label: <IntlTranslation intlKey = "home.menu.report.financeInOutDetail"/>,
                    },
                    {
                        key: '/report/purchaseInvoice/detail',
                        path: '/report/purchaseInvoice/detail',
                        label:  <IntlTranslation intlKey = "home.menu.report.purchaseInvoice"/>,
                    },
                    {
                        key: '/report/saleInvoice/detail',
                        path: '/report/saleInvoice/detail',
                        label: <IntlTranslation intlKey = "home.menu.report.saleInvoice"/>,
                    }
                    // , {
                    //     key: '/supplier/finance/',
                    //     path: '/supplier/finance/',
                    //     label: '收支汇总表'
                    // }
                    // , {
                    //     key: '/supplier/finance/goods',
                    //     path: '/supplier/finance/goods',
                    //     label: '物品毛利润统计表'
                    // }
                ]
            },
            {
                title: "生产报表",
                subMenu: [
                    {
                        key: '/report/workOrderChart',
                        path: '/report/workOrderChart',
                        label: "工作中心进度图",
                    },{
                        key: '/report/workOrderProgress',
                        path: '/report/workOrderProgress',
                        label: "工单进度图",
                    },{
                        key: '/report/producePerformance/detail',
                        path: '/report/producePerformance/detail',
                        label: "生产绩效统计表",
                    },{
                        key: '/report/saleAndProductProcess',
                        path: '/report/saleAndProductProcess',
                        label: "销售生产进度表",
                    },{
                        key: '/report/historicalTrace/detail',
                        path: '/report/historicalTrace/detail',
                        label: "历史追溯表",
                    }

                ]
            }
        ]
    }
];

export default menuData;