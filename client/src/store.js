import { combineReducers } from 'redux-immutable';

//侧边及首页
import {reducer as header} from 'components/layout/header';
import {reducer as sider} from 'components/layout/sider';
import {reducer as home} from 'pages/home';

//辅助资料
import {reducer as auxiliaryProject} from 'pages/auxiliary/project';
import {reducer as auxiliaryDept} from 'pages/auxiliary/dept';
import {reducer as auxiliaryEmployee} from 'pages/auxiliary/employee';
import {reducer as auxiliaryCustomerLv} from 'pages/auxiliary/customerLv';
import {reducer as auxiliaryGoodsUnit} from 'pages/auxiliary/goodsUnit';
import {reducer as auxiliaryCate} from 'pages/auxiliary/category';
import {reducer as auxiliarySerial} from 'pages/auxiliary/serial';
import {reducer as auxiliaryCustomField} from 'pages/auxiliary/customField';
import {reducer as auxiliaryNewCustomField} from 'pages/auxiliary/newCustomField';
import {reducer as auxiliaryIncome} from 'pages/auxiliary/income';
import {reducer as auxiliaryGroup} from 'pages/auxiliary/group';
import {reducer as auxiliaryOrderType} from 'pages/auxiliary/orderType';
import {reducer as auxiliaryExpress} from 'pages/auxiliary/express';
import {reducer as auxiliaryBill} from 'pages/auxiliary/bill';
import {reducer as auxiliaryRate} from 'pages/auxiliary/rate';
import {reducer as auxiliaryAddress} from 'pages/auxiliary/deliveryAddress';
import {reducer as auxiliaryApprove} from 'pages/auxiliary/approve';
import {reducer as auxiliaryWareLimit} from 'pages/auxiliary/wareLimit';
import {reducer as auxiliaryPriceLimit} from 'pages/auxiliary/priceLimit';
import {reducer as auxiliaryDataProgress} from 'pages/auxiliary/dataProgress';
import {reducer as auxiliaryLevelApproved} from 'pages/auxiliary/levelApproval';
import {reducer as auxiliaryWorkCenter} from 'pages/auxiliary/workCenter';
import {reducer as auxiliaryWorkProcedure} from 'pages/auxiliary/workProcedure';
import {reducer as auxiliaryMultiCurrency} from 'pages/auxiliary/multiCurrency';
import {reducer as auxiliaryDeviceManage} from 'pages/auxiliary/device';
import {reducer as auxiliarySmsNotify} from 'pages/auxiliary/notification';
//报工账号
import {reducer as auxiliaryAccountReport} from 'pages/auxiliary/accountReport';

// 菜单配置
import {reducer as auxiliaryMenu} from 'pages/auxiliary/menu';

//下载中心
import {reducer as downLoadCenterReducer} from 'pages/downloadCenter';

//账号
import {reducer as accountIndex} from 'pages/account/index';
import {reducer as accountAdd} from 'pages/account/add';
import {reducer as accountAuth} from 'pages/account/auth';

//物品
import {reducer as goodsAdd} from 'pages/goods/add';
import {reducer as goodsShow} from 'pages/goods/show';
import {reducer as multiGoodsAdd} from 'pages/goods/multiGoodsAdd';
//物品
// import {reducer as goodsDetail} from 'pages/goods/show';
import {reducer as goodsIndex} from 'pages/goods/index';

//序列号查询
import {reducer as serialNumQueryIndex} from 'pages/goods/serialNumQuery/index';
//批次查询
import {reducer as batchQueryIndex} from 'pages/goods/batchQuery/index';
// 仓库
import {reducer as warehouseIndex} from 'pages/warehouse/index';
// 配件组合
import {reducer as fittingIndex} from 'pages/fitting/index';



// 在线订购
import {reducer as onlineOrderCartIndex} from 'pages/onlineOrder/cart/index';
// 在线订购提交页面
import {reducer as onlineOrderCartOrderIndex} from 'pages/onlineOrder/cartOrder/index';
// 在线订购详情页面
import {reducer as onlineOrderCartDetailIndex} from 'pages/onlineOrder/cartDetail/index';

//在线订购主页
import {reducer as onlineOrderCartListHomeIndex} from 'pages/onlineOrder/home/index';
//在线订货全部产品页
import {reducer as onlineOrderHomeIndex} from 'pages/onlineOrder/customerIndex/index';
//在线订货公司页首页
import {reducer as onlineOrderAllProdList} from 'pages/onlineOrder/customerAllProd/index';
//在线订货公司介绍页
import {reducer as onlineOrderCustomerIntroduce} from 'pages/onlineOrder/customerIntroduce/index';


// 在线订货 订货单详情
import {reducer as onlineOrderListDetails} from 'pages/onlineOrder/detail/index';

// 入库单
import {reducer as inboundOrderAdd} from 'pages/inventory/inbound/add';
import {reducer as inboundOrderIndex} from 'pages/inventory/inbound/index';
import {reducer as inboundOrderShowIndex} from 'pages/inventory/inbound/show';

// 出库单
import {reducer as outboundOrderAdd} from 'pages/inventory/outbound/add';
import {reducer as outboundOrderIndex} from 'pages/inventory/outbound/index';

// 调拨单
import {reducer as schedulingAdd} from 'pages/inventory/scheduling/add/index';
import {reducer as schedulingShow} from 'pages/inventory/scheduling/show/index';
import {reducer as schedulingIndex} from 'pages/inventory/scheduling/index';

// 盘点单
import {reducer as stocktakingIndex} from 'pages/inventory/stocktaking/index';
import {reducer as stocktakingAdd} from 'pages/inventory/stocktaking/add/index';

// 询价
import {reducer as inquiryAdd} from 'pages/inquiry/add';
import {reducer as inquiryIndex} from 'pages/inquiry/index';
// 客户
import {reducer as customerIndex} from 'pages/customer/index';
import {reducer as customerEdit} from 'pages/customer/add/index';
// 客户联系记录
import {reducer as contactRecordIndex} from 'pages/contactRecord/index';
// 供应商
import {reducer as supplierIndex} from 'pages/supplier/index';
import {reducer as supplierEdit} from 'pages/supplier/add';

//采购
import {reducer as purchaseAdd} from 'pages/purchase/add';
import {reducer as purchaseIndex} from 'pages/purchase/index';
import {reducer as purchaseDetail} from 'pages/purchase/show';
import {reducer as purchaseLackMaterial} from 'pages/purchase/lackMaterial';

//销售
import {reducer as saleAdd} from 'pages/sale/add';
import {reducer as saleIndex} from 'pages/sale/index';

//报价
import {reducer as quotationAdd} from 'pages/quotation/add';
import {reducer as quotationIndex} from 'pages/quotation/index';

// 委外加工
import {reducer as subcontractAdd} from 'pages/subcontract/add';
import {reducer as subcontractIndex} from 'pages/subcontract/index';
import {reducer as subcontractShow} from 'pages/subcontract/show';

// 生产管理
import {reducer as productControlAdd} from 'pages/productControl/add';
import {reducer as productControlIndex} from 'pages/productControl/index';
import {reducer as productControlShow} from 'pages/productControl/show';
import {reducer as productControlProcessList} from 'pages/productControl/processList';

//请购单
import {reducer as requisitionOrderAdd} from 'pages/purchase/requisitionOrder/add';
import {reducer as requisitionOrderIndex} from 'pages/purchase/requisitionOrder/index';
import {reducer as requisitionApplyOrderIndex} from 'pages/purchase/requisitionOrder/applyIndex';
import {reducer as requisitionOrderShow} from 'pages/purchase/requisitionOrder/show';


// 多级bom
import {reducer as multiBomAdd} from 'pages/multiBom/add';
import {reducer as multiBomIndex} from 'pages/multiBom/index';
import {reducer as multiBomShow} from 'pages/multiBom/show';

// 生产单
import {reducer as produceOrderAdd} from 'pages/produceOrder/add';
import {reducer as produceOrderIndex} from 'pages/produceOrder/index';
import {reducer as produceOrderShow} from 'pages/produceOrder/show';
import {reducer as produceOrderRecord} from 'pages/produceOrder/addRecord';

//财务
import {reducer as financeIncomeIndex} from 'pages/finance/income/index';
import {reducer as financeIncomeAdd} from 'pages/finance/income/add';
import {reducer as financeExpendIndex} from 'pages/finance/expend/index';
import {reducer as financeExpendAdd} from 'pages/finance/expend/add';
import {reducer as saleInvoiceIndex} from 'pages/finance/saleInvoice/index';
import {reducer as saleInvoiceAdd} from 'pages/finance/saleInvoice/add';
import {reducer as invoiceIndex} from 'pages/finance/invoice/index';
import {reducer as invoiceAdd} from 'pages/finance/invoice/add';

// 报表
import {reducer as purchaseReportIndex} from 'pages/report/purchase/index';
import {reducer as saleReportIndex} from 'pages/report/sale/index';
import {reducer as saleSummaryReport} from 'pages/report/saleSummary';
import {reducer as purchaseSummaryReport} from 'pages/report/purchaseSummary';
import {reducer as orderInReportIndex} from 'pages/report/check_supplier/index';
import {reducer as saleOutReportIndex} from 'pages/report/check_customer/index';
import {reducer as wareSumReportIndex} from 'pages/report/waresum/index';
import {reducer as financeInoutReportIndex} from 'pages/report/financeInOut/index';
import {reducer as purchaseInvoiceReportIndex} from 'pages/report/purchaseInvoice/index';
import {reducer as saleInvoiceReportIndex} from 'pages/report/saleInvoice/index';
import {reducer as inventoryReportIndex} from 'pages/report/inventory/index';
import {reducer as flowmeterReportIndex} from 'pages/report/flowmeter/index';
import {reducer as inventoryPriceReportIndex} from 'pages/report/inventoryPrice/index';
import {reducer as inventoryPriceUntaxReportIndex} from 'pages/report/inventoryPriceUntax/index';
import {reducer as grossProfitReportIndex} from 'pages/report/grossProfit/index';
import {reducer as grossProfitCustomerReportIndex} from 'pages/report/grossProfitCustomer/index';
import {reducer as inventoryReportInquiry} from 'pages/report/inventoryInquiry/index';
import {reducer as saleTraceReportIndex} from 'pages/report/saleTrace/index';
import {reducer as purchaseTraceReportIndex} from 'pages/report/purchaseTrace/index';
import {reducer as purchaseSummaryByProdReportIndex} from 'pages/report/purchaseSummaryByProd/index';
import {reducer as purchaseSummaryBySupplierReportIndex} from 'pages/report/purchaseSummaryBySupplier/index';
import {reducer as saleSummaryByProdReportIndex} from 'pages/report/saleSummaryByProd/index';
import {reducer as saleSummaryByCustomerReportIndex} from 'pages/report/saleSummaryByCustomer/index';
import {reducer as saleSummaryBySellerReportIndex} from 'pages/report/saleSummaryBySeller/index';
import {reducer as saleRefundSummaryByProdReportIndex} from 'pages/report/saleRefundSummaryByProd/index';
import {reducer as purchaseRefundSummaryByProdReportIndex} from 'pages/report/purchaseRefundSummaryByProd/index';
import {reducer as purchasePriceTrendReportIndex} from 'pages/report/purchasePriceTrend/index';
import {reducer as inactiveStockReportIndex} from 'pages/report/inactiveStock/index';
import {reducer as auxiliaryWorkChart} from 'pages/report/workOrderChart';
import {reducer as producePerformanceReportIndex} from 'pages/report/producePerformance/index';
import {reducer as saleGrossProfitForecastReportIndex} from 'pages/report/saleGrossProfitForecast/index';
import {reducer as mergeDeliveryReportIndex} from 'pages/report/mergeDelivery/index';
import {reducer as auxiliarySaleAndProductReport} from 'pages/report/saleAndProductProgressReport';
import {reducer as collectionAndDeliveryReport} from 'pages/report/collectionAndDelivery/index';
import {reducer as tradeSaleProfitReportIndex} from 'pages/report/tradeSaleProfit/index';
import {reducer as quotationReportIndex} from 'pages/report/quotation/index';
import {reducer as historicalTraceReportIndex} from 'pages/report/historicalTrace/index';
import {reducer as wareOutSummaryByEmployeeReportIndex} from 'pages/report/wareOutSummaryByEmployee/index';

//VIP落地页
import {reducer as vipHome} from 'pages/vipService/index';

//新增模板
import {reducer as customerTemplates} from 'pages/customTemplates/add/index';
import {reducer as customerTemplatesList} from 'pages/customTemplates/index/index';

//我的商城
import {reducer as mallHome} from 'pages/mall/home';

//合伙人列表
import {reducer as cooperatorList} from 'pages/cooperator/home/index';

// 省市信息
import {reducer as provinceAndCity} from 'components/widgets/area/index';

// 通用接口
import {reducer as commonInfo} from 'components/business/commonRequest/index';

//公共新增页面
import {reducer as addForm} from 'components/layout/addForm'

import {reducer as goods} from 'components/business/newGoods';

// 委外加工
import {reducer as subcontractGoods, outReducer as outSubcontractGoods} from './components/business/subcontractGoods';

import {reducer as goodsTableFieldConfigMenu} from 'components/business/goodsTableFieldConfigMenu';
import {reducer as finance} from 'components/business/finance';
import {reducer as copyFromOrder} from 'components/business/copyFromOrder';
import {reducer as copyFromSale} from 'components/business/copyFromSale';
import {reducer as selectFromBill} from 'components/business/selectFromBill';
import {reducer as deliveryAddress} from 'components/business/deliveryAddress';
import {reducer as operateOrder} from 'components/business/operateOrder';
import {reducer as suggestSearch} from 'components/business/suggestSearch';
import {reducer as abizCate} from 'components/business/abizCate';
import {reducer as importGoodsPop} from 'components/business/importGoodsPop';
import {reducer as importGoodsGuide} from 'components/business/importGoodsGuide';
import {reducer as cnGoodsCate} from 'components/business/cnGoodsCate';
import {reducer as listTable} from 'components/business/listTable';
import {reducer as vipOpe} from 'components/business/vipOpe';
import {reducer as backlog} from 'components/business/backlog';
import {reducer as mrpCountReduceAdd} from 'pages/mrpCount/add';
import {reducer as mrpCountReduceList} from 'pages/mrpCount/index';
import {reducer as mrpCountReduceDetail} from 'pages/mrpCount/show';

//订单追踪平台
import {reducer as traceSaleIndex} from 'pages/orderTrack/sale/index';
import {reducer as traceShow} from 'pages/orderTrack/sale/show';


// 切换语言
import {reducer as languageInfo} from 'components/business/switchLanguage/index';


const rootReducer = combineReducers({
    header,
    sider,
    home,
    auxiliaryProject,
    auxiliaryDept,
    auxiliaryEmployee,
    auxiliaryCustomerLv,
    auxiliaryGoodsUnit,
    auxiliaryCate,
    auxiliarySerial,
    auxiliaryCustomField,
    auxiliaryNewCustomField,
    auxiliaryIncome,
    auxiliaryOrderType,
    auxiliaryExpress,
    auxiliaryBill,
    auxiliaryRate,
    auxiliaryAddress,
    auxiliaryApprove,
    auxiliaryWareLimit,
    auxiliaryPriceLimit,
    auxiliaryDataProgress,
    auxiliaryLevelApproved,
    auxiliaryWorkCenter,
    auxiliaryWorkProcedure,
    auxiliaryAccountReport,
    auxiliaryMenu,
    auxiliaryMultiCurrency,
    auxiliaryDeviceManage,
    auxiliarySmsNotify,
    auxiliaryGroup,
    accountIndex,
    accountAdd,
    accountAuth,
    goodsAdd,
    goodsShow,
    // goodsDetail,
    goodsIndex,
    serialNumQueryIndex,
    batchQueryIndex,
    warehouseIndex,
    fittingIndex,
    supplierIndex,
    supplierEdit,
    purchaseAdd,
    purchaseIndex,
    purchaseDetail,
    purchaseLackMaterial,
    inquiryAdd,
    inquiryIndex,
    customerIndex,
    customerEdit,
    contactRecordIndex,
    saleAdd,
    saleIndex,
    saleSummaryReport,
    purchaseSummaryReport,
    quotationAdd,
    quotationIndex,
    operateOrder,
    suggestSearch,
    financeIncomeIndex,
    financeIncomeAdd,
    financeExpendIndex,
    financeExpendAdd,
    saleInvoiceIndex,
    saleInvoiceAdd,
    invoiceIndex,
    invoiceAdd,
    provinceAndCity,
    addForm,
    goods,
    multiGoodsAdd,
    subcontractGoods,
    outSubcontractGoods,
    goodsTableFieldConfigMenu,
    finance,
    copyFromOrder,
    copyFromSale,
    selectFromBill,
    onlineOrderCartIndex,
    onlineOrderCartOrderIndex,
    onlineOrderCartDetailIndex,
    onlineOrderListDetails,
    onlineOrderAllProdList,
    onlineOrderCartListHomeIndex,
    onlineOrderHomeIndex,
    onlineOrderCustomerIntroduce,
    deliveryAddress,
    inboundOrderIndex,
    inboundOrderShowIndex,
    inboundOrderAdd,
    outboundOrderIndex,
    outboundOrderAdd,
    schedulingAdd,
    schedulingShow,
    schedulingIndex,
    stocktakingAdd,
    stocktakingIndex,
    purchaseReportIndex,
    saleReportIndex,
    orderInReportIndex,
    saleOutReportIndex,
    wareSumReportIndex,
    financeInoutReportIndex,
    purchaseInvoiceReportIndex,
    saleInvoiceReportIndex,
    inventoryReportIndex,
    flowmeterReportIndex,
    inventoryPriceReportIndex,
    inventoryPriceUntaxReportIndex,
    grossProfitReportIndex,
    grossProfitCustomerReportIndex,
    inventoryReportInquiry,
    saleTraceReportIndex,
    purchaseTraceReportIndex,
    purchaseSummaryByProdReportIndex,
    purchaseSummaryBySupplierReportIndex,
    saleSummaryByProdReportIndex,
    saleSummaryByCustomerReportIndex,
    saleSummaryBySellerReportIndex,
    saleRefundSummaryByProdReportIndex,
    purchaseRefundSummaryByProdReportIndex,
    purchasePriceTrendReportIndex,
    inactiveStockReportIndex,
    auxiliaryWorkChart,
    producePerformanceReportIndex,
    saleGrossProfitForecastReportIndex,
    mergeDeliveryReportIndex,
    collectionAndDeliveryReport,
    tradeSaleProfitReportIndex,
    quotationReportIndex,
    historicalTraceReportIndex,
    wareOutSummaryByEmployeeReportIndex,
    commonInfo,
    abizCate,
    importGoodsPop,
    importGoodsGuide,
    cnGoodsCate,
    mallHome,
    listTable,
    vipHome,
    vipOpe,
    backlog,
    customerTemplates,
    customerTemplatesList,
    cooperatorList,
    languageInfo,
    subcontractAdd,
    subcontractIndex,
    subcontractShow,
    downLoadCenterReducer,
    productControlAdd,
    productControlIndex,
    productControlShow,
    productControlProcessList,
    mrpCountReduceAdd,
    mrpCountReduceList,
    mrpCountReduceDetail,
    multiBomAdd,
    multiBomIndex,
    multiBomShow,
    produceOrderAdd,
    produceOrderIndex,
    produceOrderShow,
    produceOrderRecord,
    requisitionOrderAdd,
    requisitionOrderIndex,
    requisitionApplyOrderIndex,
    requisitionOrderShow,
    auxiliarySaleAndProductReport,
    traceSaleIndex,
    traceShow
});

export default rootReducer
