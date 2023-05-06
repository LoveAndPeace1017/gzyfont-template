import asyncComponent from 'utils/asyncComponent';

const routes = [
    {
        path: '/',
        exact: true,
        isAuthed: '1',
        component: asyncComponent(() => import('pages/home'))
    },
    {
        path: '/home',
        current: '/',
        exact: true,
        isAuthed: '1',
        component: asyncComponent(() => import('pages/home'))
    },
    {
        path: '/purchase/',
        exact: true,
        isAuthed: '1',
        authModule: 'purchase',
        authType: 'show',
        component: asyncComponent(() => import('pages/purchase/index'))
    },
    {
        path: '/purchase/add/',
        uid: '/purchase/add/',
        isAuthed: '1',
        authModule: 'purchase',
        authType: 'add',
        component: asyncComponent(() => import('pages/purchase/add')),
    },
    {
        path: '/purchase/lackMaterial/',
        uid: '/purchase/lackMaterial/',
        isAuthed: '1',
        authModule: 'goods',
        authType: 'show',
        component: asyncComponent(() => import('pages/purchase/lackMaterial')),
    },
    {
        path: '/purchase/show/:id',
        uid: '/purchase/show/',
        current: '/purchase/',
        isAuthed: '1',
        authModule: 'purchase',
        authType: 'show',
        component: asyncComponent(() => import('pages/purchase/show')),
    },
    {
        path: '/purchase/modify/:id',
        uid: '/purchase/modify/',
        current: '/purchase/',
        isAuthed: '1',
        authModule: 'purchase',
        authType: 'modify',
        component: asyncComponent(() => import('pages/purchase/add')),
    },
    {
        path: '/purchase/copy/:copyId',
        uid: '/purchase/copy/',
        current: '/purchase/add',
        isAuthed: '1',
        authModule: 'purchase',
        authType: 'add',
        component: asyncComponent(() => import('pages/purchase/add')),
    },
    {
        path: '/goods/',
        exact: true,
        isAuthed: '1',
        authModule: 'goods',
        authType: 'show',
        component: asyncComponent(() => import('pages/goods/index'))
    },
    {
        path: '/goods/add/',
        uid: '/goods/add/',
        isAuthed: '1',
        authModule: 'goods',
        authType: 'add',
        component: asyncComponent(() => import('pages/goods/add')),
    },
    {
        path: '/multiGoods/add/',
        uid: '/multiGoods/add/',
        isAuthed: '1',
        authModule: 'goods',
        authType: 'add',
        component: asyncComponent(() => import('pages/goods/multiGoodsAdd')),
    },
    {
        path: '/goods/modify/:id',
        uid: '/goods/modify/',
        current: '/goods/',
        isAuthed: '1',
        authModule: 'goods',
        authType: 'modify',
        component: asyncComponent(() => import('pages/goods/add')),
    },
    {
        path: '/goods/copy/:copyId', //务必修改页id名称不一样
        uid: '/goods/copy/',
        current: '/goods/add',
        isAuthed: '1',
        authModule: 'goods',
        authType: 'add',
        component: asyncComponent(() => import('pages/goods/add')),
    },
    {
        path: '/goods/show/:id',
        uid: '/goods/show/',
        current: '/goods/',
        isAuthed: '1',
        authModule: 'goods',
        authType: 'show',
        component: asyncComponent(() => import('pages/goods/show')),
    },
    {
        path: '/goods/serialNumQuery/',
        uid: '/goods/serialNumQuery/',
        isAuthed: '1',
        authModule: 'goods',
        authType: 'show',
        component: asyncComponent(() => import('pages/goods/serialNumQuery/index')),
    },
    {
        path: '/supplier/add/',
        isAuthed: '1',
        authModule: 'supplier',
        authType: 'add',
        component: asyncComponent(() => import('pages/supplier/add')),
    },
    {
        path: '/supplier/show/:id',
        current: '/supplier/',
        isAuthed: '1',
        authModule: 'supplier',
        authType: 'show',
        component: asyncComponent(() => import('pages/supplier/show')),
    },
    {
        path: '/supplier/modify/:id',
        current: '/supplier/',
        isAuthed: '1',
        authModule: 'supplier',
        authType: 'modify',
        component: asyncComponent(() => import('pages/supplier/add')),
    },
    {
        path: '/supplier/',
        isAuthed: '1',
        authModule: 'supplier',
        authType: 'show',
        component: asyncComponent(() => import('pages/supplier/index')),
    },
    {
        path: '/customer/add/',
        uid: '/customer/add/',
        isAuthed: '1',
        authModule: 'customer',
        authType: 'add',
        component: asyncComponent(() => import('pages/customer/add')),
    },
    {
        path: '/customer/show/:id',
        uid: '/customer/show/',
        current: '/customer/',
        isAuthed: '1',
        authModule: 'customer',
        authType: 'show',
        component: asyncComponent(() => import('pages/customer/show')),
    },
    {
        path: '/customer/modify/:id',
        uid: '/customer/modify/',
        current: '/customer/',
        isAuthed: '1',
        authModule: 'customer',
        authType: 'modify',
        component: asyncComponent(() => import('pages/customer/add')),
    },
    {
        path: '/customer/',
        isAuthed: '1',
        authModule: 'customer',
        authType: 'show',
        component: asyncComponent(() => import('pages/customer/index')),
    },

    {
        path: '/inventory/inbound/add/',
        isAuthed: '1',
        authModule: 'inbound',
        authType: 'add',
        component: asyncComponent(() => import('pages/inventory/inbound/add')),
    },
    {
        path: '/inventory/inbound/show/:id',
        current: '/inventory/inbound/',
        isAuthed: '1',
        authModule: 'inbound',
        authType: 'show',
        component: asyncComponent(() => import('pages/inventory/inbound/show')),
    },
    {
        path: '/inventory/inbound/modify/:id',
        current: '/inventory/inbound/',
        isAuthed: '1',
        authModule: 'inbound',
        authType: 'modify',
        component: asyncComponent(() => import('pages/inventory/inbound/add')),
    },
    {
        path: '/inventory/inbound/copy/:copyId',
        current: '/inventory/inbound/add',
        isAuthed: '1',
        authModule: 'inbound',
        authType: 'add',
        component: asyncComponent(() => import('pages/inventory/inbound/add')),
    },
    {
        path: '/inventory/inbound/',
        isAuthed: '1',
        authModule: 'inbound',
        authType: 'show',
        component: asyncComponent(() => import('pages/inventory/inbound/index')),
    },
    {
        path: '/inventory/outbound/add/',
        isAuthed: '1',
        authModule: 'outbound',
        authType: 'add',
        component: asyncComponent(() => import('pages/inventory/outbound/add')),
    },
    {
        path: '/inventory/outbound/show/:id',
        current: '/inventory/outbound/',
        isAuthed: '1',
        authModule: 'outbound',
        authType: 'show',
        component: asyncComponent(() => import('pages/inventory/outbound/show')),
    },
    {
        path: '/inventory/outbound/copy/:copyId',
        current: '/inventory/outbound/add',
        isAuthed: '1',
        authModule: 'outbound',
        authType: 'add',
        component: asyncComponent(() => import('pages/inventory/outbound/add')),
    },
    {
        path: '/inventory/outbound/modify/:id',
        current: '/inventory/outbound/',
        isAuthed: '1',
        authModule: 'outbound',
        authType: 'modify',
        component: asyncComponent(() => import('pages/inventory/outbound/add')),
    },
    {
        path: '/inventory/outbound/',
        isAuthed: '1',
        authModule: 'outbound',
        authType: 'show',
        component: asyncComponent(() => import('pages/inventory/outbound/index')),
    },
    {
        path: '/inventory/scheduling/show/:id',
        current: '/inventory/scheduling/',
        isAuthed: '1',
        authModule: 'scheduling',
        authType: 'show',
        component: asyncComponent(() => import('pages/inventory/scheduling/show')),
    },
    {
        path: '/inventory/scheduling/copy/:copyId',
        current: '/inventory/scheduling/add',
        isAuthed: '1',
        authModule: 'scheduling',
        authType: 'add',
        component: asyncComponent(() => import('pages/inventory/scheduling/add')),
    },
    {
        path: '/inventory/scheduling/add',
        isAuthed: '1',
        authModule: 'scheduling',
        authType: 'add',
        component: asyncComponent(() => import('pages/inventory/scheduling/add')),
    },
    {
        path: '/inventory/scheduling/',
        isAuthed: '1',
        authModule: 'scheduling',
        authType: 'show',
        component: asyncComponent(() => import('pages/inventory/scheduling/index')),
    },
    {
        path: '/inventory/stocktaking/show/:id',
        current: '/inventory/stocktaking/',
        isAuthed: '1',
        authModule: 'stocktaking',
        authType: 'show',
        component: asyncComponent(() => import('pages/inventory/stocktaking/show')),
    },
    {
        path: '/inventory/stocktaking/add',
        isAuthed: '1',
        authModule: 'stocktaking',
        authType: 'add',
        component: asyncComponent(() => import('pages/inventory/stocktaking/add')),
    },
    {
        path: '/inventory/stocktaking/modify/:id',
        current: '/inventory/stocktaking/',
        isAuthed: '1',
        authModule: 'stocktaking',
        authType: 'modify',
        component: asyncComponent(() => import('pages/inventory/stocktaking/add')),
    },
    {
        path: '/inventory/stocktaking/copy/:copyId',
        current: '/inventory/stocktaking/add',
        isAuthed: '1',
        authModule: 'stocktaking',
        authType: 'add',
        component: asyncComponent(() => import('pages/inventory/stocktaking/add')),
    },
    {
        path: '/inventory/stocktaking/',
        isAuthed: '1',
        authModule: 'stocktaking',
        authType: 'show',
        component: asyncComponent(() => import('pages/inventory/stocktaking/index')),
    },
    {
        path: '/sale/add/',
        uid: '/sale/add/',
        isAuthed: '1',
        authModule: 'sale',
        authType: 'add',
        component: asyncComponent(() => import('pages/sale/add')),
    },
    {
        path: '/sale/show/:id',
        uid: '/sale/show/',
        current: '/sale/',
        isAuthed: '1',
        authModule: 'sale',
        authType: 'show',
        component: asyncComponent(() => import('pages/sale/show')),
    },
    {
        path: '/sale/modify/:id',
        uid: '/sale/modify/',
        current: '/sale/',
        isAuthed: '1',
        authModule: 'sale',
        authType: 'modify',
        component: asyncComponent(() => import('pages/sale/add')),
    },
    {
        path: '/sale/copy/:copyId', //务必修改页id名称不一样
        uid: '/sale/copy/',
        current: '/sale/add',
        isAuthed: '1',
        authModule: 'sale',
        authType: 'add',
        component: asyncComponent(() => import('pages/sale/add')),
    },
    {
        path: '/sale/',
        isAuthed: '1',
        authModule: 'sale',
        authType: 'show',
        component: asyncComponent(() => import('pages/sale/index')),
    },
    {
        path: '/quotation/add/',
        uid: '/quotation/add/',
        isAuthed: '1',
        authModule: 'quotation',
        authType: 'add',
        component: asyncComponent(() => import('pages/quotation/add')),
    },
    {
        path: '/quotation/show/:id',
        uid: '/quotation/show/',
        current: '/quotation/',
        isAuthed: '1',
        authModule: 'quotation',
        authType: 'show',
        component: asyncComponent(() => import('pages/quotation/show')),
    },
    {
        path: '/quotation/modify/:id',
        uid: '/quotation/modify/',
        current: '/quotation/',
        isAuthed: '1',
        authModule: 'quotation',
        authType: 'modify',
        component: asyncComponent(() => import('pages/quotation/add')),
    },
    {
        path: '/quotation/copy/:copyId', //务必修改页id名称不一样
        uid: '/quotation/copy/',
        current: '/quotation/add',
        isAuthed: '1',
        authModule: 'quotation',
        authType: 'add',
        component: asyncComponent(() => import('pages/quotation/add')),
    },
    {
        path: '/quotation/',
        isAuthed: '1',
        authModule: 'quotation',
        authType: 'show',
        component: asyncComponent(() => import('pages/quotation/index')),
    },
    {
        path: '/finance/income/',
        exact: true,
        isAuthed: '1',
        authModule: 'income',
        authType: 'show',
        component: asyncComponent(() => import('pages/finance/income/index')),
    },
    {
        path: '/finance/income/show/:id',
        current: '/finance/income/',
        isAuthed: '1',
        authModule: 'income',
        authType: 'show',
        component: asyncComponent(() => import('pages/finance/income/show')),
    },
    {
        path: '/finance/income/add',
        isAuthed: '1',
        authModule: 'income',
        authType: 'add',
        component: asyncComponent(() => import('pages/finance/income/add')),
    },
    {
        path: '/finance/income/edit/:id',
        current: '/finance/income/',
        isAuthed: '1',
        authModule: 'income',
        authType: 'modify',
        component: asyncComponent(() => import('pages/finance/income/add')),
    },
    {
        path: '/finance/income/copy/:id',
        current: '/finance/income/add',
        isAuthed: '1',
        authModule: 'income',
        authType: 'add',
        component: asyncComponent(() => import('pages/finance/income/add')),
    },
    {
        path: '/finance/expend/',
        exact: true,
        isAuthed: '1',
        authModule: 'expend',
        authType: 'show',
        component: asyncComponent(() => import('pages/finance/expend/index')),
    },
    {
        path: '/finance/expend/show/:id',
        current: '/finance/expend/',
        isAuthed: '1',
        authModule: 'expend',
        authType: 'show',
        component: asyncComponent(() => import('pages/finance/expend/show')),
    },
    {
        path: '/finance/expend/add',
        isAuthed: '1',
        authModule: 'expend',
        authType: 'add',
        component: asyncComponent(() => import('pages/finance/expend/add')),
    },
    {
        path: '/finance/expend/edit/:id',
        current: '/finance/expend/',
        isAuthed: '1',
        authModule: 'expend',
        authType: 'modify',
        component: asyncComponent(() => import('pages/finance/expend/add')),
    },
    {
        path: '/finance/expend/copy/:id',
        current: '/finance/expend/add',
        isAuthed: '1',
        authModule: 'expend',
        authType: 'add',
        component: asyncComponent(() => import('pages/finance/expend/add')),
    },
    {
        path: '/finance/saleInvoice/add',
        isAuthed: '1',
        authModule: 'saleInvoice',
        authType: 'add',
        component: asyncComponent(() => import('pages/finance/saleInvoice/add')),
    },
    {
        path: '/finance/saleInvoice/edit/:id',
        current: '/finance/saleInvoice/',
        isAuthed: '1',
        authModule: 'saleInvoice',
        authType: 'modify',
        component: asyncComponent(() => import('pages/finance/saleInvoice/add')),
    },
    {
        path: '/finance/saleInvoice/copy/:id',
        current: '/finance/saleInvoice/add',
        isAuthed: '1',
        authModule: 'saleInvoice',
        authType: 'add',
        component: asyncComponent(() => import('pages/finance/saleInvoice/add')),
    },
    {
        path: '/finance/saleInvoice/show/:id',
        current: '/finance/saleInvoice/',
        isAuthed: '1',
        authModule: 'saleInvoice',
        authType: 'show',
        component: asyncComponent(() => import('pages/finance/saleInvoice/show')),
    },
    {
        path: '/finance/saleInvoice/',
        exact: true,
        isAuthed: '1',
        authModule: 'saleInvoice',
        authType: 'show',
        component: asyncComponent(() => import('pages/finance/saleInvoice/index')),
    },

    {
        path: '/finance/invoice/add',
        isAuthed: '1',
        authModule: 'invoice',
        authType: 'add',
        component: asyncComponent(() => import('pages/finance/invoice/add')),
    },
    {
        path: '/finance/invoice/edit/:id',
        current: '/finance/invoice/',
        isAuthed: '1',
        authModule: 'invoice',
        authType: 'modify',
        component: asyncComponent(() => import('pages/finance/invoice/add')),
    },
    {
        path: '/finance/invoice/copy/:id',
        current: '/finance/invoice/add',
        isAuthed: '1',
        authModule: 'invoice',
        authType: 'add',
        component: asyncComponent(() => import('pages/finance/invoice/add')),
    },
    {
        path: '/finance/invoice/show/:id',
        current: '/finance/invoice/',
        isAuthed: '1',
        authModule: 'invoice',
        authType: 'show',
        component: asyncComponent(() => import('pages/finance/invoice/show')),
    },
    {
        path: '/finance/invoice/',
        exact: true,
        isAuthed: '1',
        authModule: 'invoice',
        authType: 'show',
        component: asyncComponent(() => import('pages/finance/invoice/index')),
    },
    {
        path: '/inquiry/add',
        isAuthed: '1',
        authModule: 'inquiry',
        authType: 'add',
        component: asyncComponent(() => import('pages/inquiry/add')),
    },
    {
        path: '/inquiry/show/:id',
        current: '/inquiry/',
        isAuthed: '1',
        authModule: 'inquiry',
        authType: 'show',
        component: asyncComponent(() => import('pages/inquiry/show')),
    },
    {
        // 询价列表
        path: '/inquiry',
        isAuthed: '1',
        authModule: 'inquiry',
        authType: 'show',
        component: asyncComponent(() => import('pages/inquiry/index')),
    },
   /* {
        //  在线订购购物车
        path: '/onlineOrder/cartList',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/onlineOrder/cart')),
    },*/
    /*{
        //  在线订购公司详情页
        path: '/onlineOrder/:id/customerIndex',
        current: '/onlineOrder/',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/onlineOrder/customerIndex')),
    },*/
   /* {
        //  在线订购公司物品列表页
        path: '/onlineOrder/customer/prodAll/:id',
        current: '/onlineOrder/',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/onlineOrder/customerAllProd')),
    },*/
    /*{
        //  在线订购公司详情页
        path: '/onlineOrder/customer/introduce/:id',
        current: '/onlineOrder/',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/onlineOrder/customerIntroduce')),
    },*/
    /*{
        //  订购提交页面
        path: '/onlineOrder/cartOrder',
        current: '/onlineOrder/',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/onlineOrder/cartOrder')),
    },*/
    /*{
        //  订购详情页面
        path: '/onlineOrder/cartDetail/:supplierUserIdEnc/:supplierProductCode',
        current: '/onlineOrder/',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/onlineOrder/cartDetail')),
    },*/
    /*{
        // 在线订购订货单详情
        path: '/onlineOrder/detail/:id',
        current: '/onlineOrder/',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/onlineOrder/detail')),
    },*/
   /* {
        //  在线订货在线采购单
        path: '/onlineOrder/purchase',
        current: '/onlineOrder/purchase/',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/onlineOrder/purchase/index')),
    },*/
    /*{
        //  在线订购列表页
        path: '/onlineOrder/',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/onlineOrder/home')),
    },*/

    {
        //采购明细表
        path: '/report/purchase/detail',
        isAuthed: '1',
        authModule: ['report', 'purchase'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/purchase/index')),
    },
    {
        //销售明细表
        path: '/report/sale/detail',
        isAuthed: '1',
        authModule: ['report', 'sale'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/sale/index')),
    },
    {
        //报价明细表
        path: '/report/quotation/detail',
        isAuthed: '1',
        authModule: ['report', 'quotation'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/quotation/index')),
    },
    {
        //销售汇总图
        path: '/report/saleSummary/detail',
        isAuthed: '1',
        authModule: ['report', 'sale'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/saleSummary')),
    },
    {
        //采购汇总图
        path: '/report/purchaseSummary/detail',
        isAuthed: '1',
        authModule: ['report', 'purchase'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/purchaseSummary')),
    },
    {
        //收支明细表
        path: '/report/financeInOut/detail',
        isAuthed: '1',
        authModule: ['report', 'income', 'expend'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/financeInOut/index')),
    },
    {
        //采购到票明细表
        path: '/report/purchaseInvoice/detail',
        isAuthed: '1',
        authModule: ['report', 'invoice'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/purchaseInvoice/index')),
    },
    {
        //销售开票明细表
        path: '/report/saleInvoice/detail',
        isAuthed: '1',
        authModule: ['report', 'saleInvoice'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/saleInvoice/index')),
    },
    {
        //和供应商对账（入库）
        path: '/report/check_supplier/detail',
        isAuthed: '1',
        authModule: ['report', 'purchase'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/check_supplier/index')),
    },
    {
        //和客户对账（出库）
        path: '/report/check_customer/detail',
        isAuthed: '1',
        authModule: ['report', 'sale'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/check_customer/index')),
    },

    {
        //出入库汇总表
        path: '/report/ware/summary',
        isAuthed: '1',
        authModule: ['report', 'inbound', 'outbound'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/waresum/index')),
    },

    {
        //出入库明细表
        path: '/report/inventory/detail/',
        isAuthed: '1',
        authModule: ['report', 'inbound', 'outbound'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/inventory/index'))
    },
    {
        // 出入库流水表
        path: '/report/flowmeter/detail',
        isAuthed: '1',
        authModule: ['report', 'inbound', 'outbound'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/flowmeter/index'))
    },
    // 物品库存金额汇总表
    {
        path: '/report/inventoryPrice/detail',
        isAuthed: '1',
        authModule: ['report', 'inbound', 'outbound'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/inventoryPrice/index'))
    },
    // 物品库存金额汇总表(未税)
    {
        path: '/report/inventoryPriceUntax/detail',
        isAuthed: '1',
        authModule: ['report', 'inbound', 'outbound'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/inventoryPriceUntax/index'))
    },
    //物品毛利润统计
    {
        path: '/report/grossProfit/detail',
        isAuthed: '1',
        authModule: [ 'customer', 'supplier', 'warehouse', 'report', 'inbound', 'outbound'],
        authType: 'show',
        // authAllDataRange: [true, true, true],
        component: asyncComponent(() => import('pages/report/grossProfit/index'))
    },
    //客户毛利润统计
    {
        path: '/report/grossProfitCustomer/detail',
        isAuthed: '1',
        authModule: [ 'customer', 'supplier', 'warehouse', 'report', 'inbound', 'outbound'],
        authType: 'show',
        // authAllDataRange: [true, true, true],
        component: asyncComponent(() => import('pages/report/grossProfitCustomer/index'))
    },
    //库存明细查询表
    {
        path: '/report/inventoryInquiry/detail',
        isAuthed: '1',
        authModule: ['report', 'goods'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/inventoryInquiry/index'))
    },
    //销售订单跟踪表
    {
        path: '/report/saleTrace/detail',
        isAuthed: '1',
        authModule: ['report', 'sale'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/saleTrace/index')),
    },
    //外贸销售毛利表
    {
        path: '/report/tradeSaleProfit/detail',
        isAuthed: '1',
        authModule: ['report', 'sale'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/tradeSaleProfit/index')),
    },
    //采购订单跟踪表
    {
        path: '/report/purchaseTrace/detail',
        isAuthed: '1',
        authModule: ['report', 'purchase'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/purchaseTrace/index')),
    },
    //采购价格走势表
    {
        path: '/report/purchasePriceTrend/detail',
        isAuthed: '1',
        authModule: ['report', 'purchase'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/purchasePriceTrend/index')),
    },
    //采购订单汇总表(物品)
    {
        path: '/report/purchaseSummaryByProd/detail',
        isAuthed: '1',
        authModule: ['report', 'purchase', 'goods'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/purchaseSummaryByProd/index')),
    },
    //采购订单汇总表(按供应商)
    {
        path: '/report/purchaseSummaryBySupplier/detail',
        isAuthed: '1',
        authModule: ['report', 'purchase', 'supplier'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/purchaseSummaryBySupplier/index')),
    },
    //销售订单汇总表(物品)
    {
        path: '/report/saleSummaryByProd/detail',
        isAuthed: '1',
        authModule: ['report', 'sale', 'goods'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/saleSummaryByProd/index')),
    },
    //销售订单汇总表(按客户)
    {
        path: '/report/saleSummaryByCustomer/detail',
        isAuthed: '1',
        authModule: ['report', 'sale', 'customer'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/saleSummaryByCustomer/index')),
    },
    //销售订单汇总表(按销售员)
    {
        path: '/report/saleSummaryBySeller/detail',
        isAuthed: '1',
        authModule: ['report', 'sale', 'customer'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/saleSummaryBySeller/index')),
    },
    //销售及退货统计表
    {
        path: '/report/saleRefundSummaryByProd/detail',
        isAuthed: '1',
        authModule: ['report', 'sale', 'inbound', 'outbound'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/saleRefundSummaryByProd/index')),
    },
    //销售毛利预测表
    {
        path: '/report/saleGrossProfitForecast/detail',
        isAuthed: '1',
        authModule: ['report', 'sale', 'inbound', 'outbound'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/saleGrossProfitForecast/index')),
    },
    //合并送货单
    {
        path: '/report/mergeDelivery/detail',
        isAuthed: '1',
        authModule: ['report', 'sale', 'inbound', 'outbound'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/mergeDelivery/index')),
    },
    //采购及退货统计表
    {
        path: '/report/purchaseRefundSummaryByProd/detail',
        isAuthed: '1',
        authModule: ['report', 'purchase', 'inbound', 'outbound'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/purchaseRefundSummaryByProd/index')),
    },
    //呆滞料报表
    {
        path: '/report/inactiveStock/detail',
        isAuthed: '1',
        authModule: ['report', 'goods', 'warehouse', 'inbound', 'outbound'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/inactiveStock/index')),
    },
    //生产绩效统计表
    {
        path: '/report/producePerformance/detail',
        isAuthed: '1',
        authModule: [ 'report'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/producePerformance/index'))
    },
    //历史追溯
    {
        path: '/report/historicalTrace/detail',
        isAuthed: '1',
        authModule: ['report','inbound', 'outbound'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/historicalTrace/index')),
    },
    //领用出库汇总表（按部门）
    {
        path: '/report/collectionAndDelivery/detail',
        isAuthed: '1',
        authModule: [ 'report'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/collectionAndDelivery/index'))
    },
    //领用出库汇总表（按员工）
    {
        path: '/report/wareOutSummaryByEmployee/detail',
        isAuthed: '1',
        authModule: [ 'report'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/wareOutSummaryByEmployee/index'))
    },
    {
        //工单进度图
        path: '/report/workOrderProgress',
        isAuthed: '1',
        authModule: ['report'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/workOrderProgressChart')),
    },
    //批次查询报表
    {
        path: '/report/batchQuery/detail',
        isAuthed: '1',
        authModule: ['report', 'goods', 'warehouse', 'inbound', 'outbound'],
        authType: 'show',
        component: asyncComponent(() => import('pages/goods/batchQuery/index')),
    },
    {
        //销售生产进度表
        path: '/report/saleAndProductProcess',
        isAuthed: '1',
        authModule: ['report'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/saleAndProductProgressReport')),
    },
    //商城客户申请列表
    {
        path: '/mall/customer/apply',
        current: '/mall/customer/',
        isAuthed: '1',
        authModule: [ 'customer', ],
        authType: 'show',
        authAllDataRange: [true, true, true],
        component: asyncComponent(() => import('pages/mall/customer/index/views/apply'))
    },
    //商城客户列表
    {
        path: '/mall/customer/',
        isAuthed: '1',
        authModule: [ 'customer', ],
        authType: 'show',
        authAllDataRange: [true, true, true],
        component: asyncComponent(() => import('pages/mall/customer/index'))
    },
    //商城物品添加
    {
        path: '/mall/goods/add',
        isAuthed: '1',
        authModule: [ 'customer', ],
        authType: 'show',
        authAllDataRange: [true, true, true],
        component: asyncComponent(() => import('pages/goods/add'))
    },
    //商城物品列表
    {
        path: '/mall/goods/',
        isAuthed: '1',
        authModule: [ 'customer', ],
        authType: 'show',
        authAllDataRange: [true, true, true],
        component: asyncComponent(() => import('pages/mall/goods/index'))
    },
    //在线销售单
    {
        path: '/mall/sale/',
        isAuthed: '1',
        authModule: [ 'customer', ],
        authType: 'show',
        authAllDataRange: [true, true, true],
        component: asyncComponent(() => import('pages/mall/sale/index'))
    },
    //商城设置
    {
        path: '/mall/setting/',
        isAuthed: '1',
        authModule: ['customer',],
        authType: 'show',
        authAllDataRange: [true, true, true],
        component: asyncComponent(() => import('pages/mall/setting/index'))
    },
    //我的商城
    {
        path: '/mall/',
        exact: true,
        isAuthed: '1',
        component: asyncComponent(() => import('pages/mall/home'))
    },
    //预览商城
    {
        path: '/mall/preview',
        current: '/mall/',
        exact: true,
        isAuthed: '1',
        component: asyncComponent(() => import('pages/mall/preview'))
    },
    {
        path: '/mall/preview/product',
        current: '/mall/',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/mall/preview/views/product'))
    },
    {
        path: '/mall/preview/introduce',
        current: '/mall/',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/mall/preview/views/introduce'))
    }
    //vip服务
    ,
    {
        path: '/vip/service',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/vipService'))
    }
    ,
    //新建自定义模板
    {
        path: '/template/new',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/customTemplates/add'))
    }
    ,
    //修改自定义模板
    {
        path: '/template/edit/:id',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/customTemplates/add'))
    }
    ,
    //自定义模板列表
    {
        path: '/template/list',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/customTemplates/index'))
    }
    ,
    //复制模板
    {
        path: '/template/copy/:copyId',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/customTemplates/add'))
    },
    //推荐模板
    {
        path: '/template/recommend/:recommendId',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/customTemplates/add'))
    },
    {
        path: '/approved/edit/:id',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/auxiliary/levelApproval/views/add'))
    },
    {
        path: '/approved/copy/:copyId',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/auxiliary/levelApproval/views/add'))
    },
    {
        path: '/approved/add/',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/auxiliary/levelApproval/views/add'))
    },
    {
        path: '/blank',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/blank/index'))
    },
    {
        path: '/subcontract/',   //委外加工
        exact: true,
        authModule: 'supplier',
        authType: 'show',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/subcontract/index'))
    },
    {
        path: '/downloadCenter/',   //下载中心
        isAuthed: '1',
        component: asyncComponent(() => import('pages/downloadCenter'))
    },
    {
        path: '/subcontract/add/',
        uid: '/subcontract/add/',
        authModule: 'supplier',
        authType: 'show',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/subcontract/add')),
    },
    {
        path: '/subcontract/modify/:id',
        uid: '/subcontract/modify/',
        authModule: 'supplier',
        authType: 'show',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/subcontract/add')),
    },
    {
        path: '/subcontract/copy/:copyId',
        uid: '/subcontract/copy/',
        authModule: 'supplier',
        authType: 'show',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/subcontract/add')),
    },
    {
        path: '/subcontract/show/:id',
        uid: '/subcontract/show/',
        authModule: 'supplier',
        authType: 'show',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/subcontract/show')),
    },
    {
        //工作中心进度图
        path: '/report/workOrderChart',
        isAuthed: '1',
        authModule: ['report'],
        authType: 'show',
        component: asyncComponent(() => import('pages/report/workOrderChart')),
    },
    {
        path: '/productControl/',
        exact: true,
        isAuthed: '1',
        authModule: 'productManage',
        authType: 'show',
        component: asyncComponent(() => import('pages/productControl/index'))
    },
    {
        path: '/productControl/add/',
        uid: '/productControl/add/',
        isAuthed: '1',
        authModule: 'productManage',
        authType: 'add',
        component: asyncComponent(() => import('pages/productControl/add')),
    },
    {
        path: '/productControl/processList/',
        uid: '/productControl/processList/',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/productControl/processList')),
    },
    {
        path: '/productControl/show/:id',
        uid: '/productControl/show/',
        current: '/productControl/',
        isAuthed: '1',
        authModule: 'productManage',
        authType: 'show',
        component: asyncComponent(() => import('pages/productControl/show')),
    },
    {
        path: '/productControl/modify/:id',
        uid: '/productControl/modify/',
        current: '/productControl/',
        isAuthed: '1',
        authModule: 'productManage',
        authType: 'modify',
        component: asyncComponent(() => import('pages/productControl/add')),
    },
    {
        path: '/productControl/copy/:copyId',
        uid: '/productControl/copy/',
        current: '/productControl/add',
        isAuthed: '1',
        authModule: 'productManage',
        authType: 'add',
        component: asyncComponent(() => import('pages/productControl/add')),
    },
    {
        path: '/productControl/mrpCount/add',
        uid: '/productControl/mrpCount/add',
        isAuthed: '1',
        authType: 'add',
        component: asyncComponent(() => import('pages/mrpCount/add')),
    },
    {
        path: '/productControl/mrpCount/list',
        uid: '/productControl/mrpCount/list',
        isAuthed: '1',
        authType: 'show',
        component: asyncComponent(() => import('pages/mrpCount/index')),
    },
    {
        path: '/productControl/mrpCount/show/:id',
        uid: '/productControl/mrpCount/show',
        current: '/productControl/mrpCount/list',
        isAuthed: '1',
        authType: 'show',
        component: asyncComponent(() => import('pages/mrpCount/show')),
    },

    {
        path: '/multiBom/list',
        uid: '/multiBom/list',
        isAuthed: '1',
        authModule: 'bom',
        authType: 'show',
        component: asyncComponent(() => import('pages/multiBom/index'))
    },
    {
        path: '/multiBom/add/',
        uid: '/multiBom/add/',
        isAuthed: '1',
        authModule: 'bom',
        authType: 'add',
        component: asyncComponent(() => import('pages/multiBom/add')),
    },
    {
        path: '/multiBom/show/:id',
        uid: '/multiBom/show/',
        current: '/multiBom/list',
        isAuthed: '1',
        authModule: 'bom',
        authType: 'show',
        component: asyncComponent(() => import('pages/multiBom/show')),
    },
    {
        path: '/multiBom/modify/:id',
        uid: '/multiBom/modify/',
        current: '/multiBom/',
        isAuthed: '1',
        authModule: 'bom',
        authType: 'modify',
        component: asyncComponent(() => import('pages/multiBom/add')),
    },
    {
        path: '/multiBom/copy/:copyId',
        uid: '/multiBom/copy/',
        current: '/multiBom/add',
        isAuthed: '1',
        authModule: 'bom',
        authType: 'add',
        component: asyncComponent(() => import('pages/multiBom/add')),
    },


    {
        path: '/produceOrder/',
        exact: true,
        isAuthed: '1',
        authModule: 'productOrder',
        authType: 'show',
        component: asyncComponent(() => import('pages/produceOrder/index'))
    },
    {
        path: '/produceOrder/add/',
        uid: '/produceOrder/add/',
        isAuthed: '1',
        authModule: 'productOrder',
        authType: 'add',
        component: asyncComponent(() => import('pages/produceOrder/add')),
    },
    {
        path: '/produceOrder/show/:id',
        uid: '/produceOrder/show/',
        current: '/produceOrder/',
        isAuthed: '1',
        authModule: 'productOrder',
        authType: 'show',
        component: asyncComponent(() => import('pages/produceOrder/show')),
    },
    {
        path: '/produceOrder/modify/:id',
        uid: '/produceOrder/modify/',
        current: '/produceOrder/',
        isAuthed: '1',
        authModule: 'productOrder',
        authType: 'modify',
        component: asyncComponent(() => import('pages/produceOrder/add')),
    },
    {
        path: '/produceOrder/copy/:copyId',
        uid: '/produceOrder/copy/',
        current: '/produceOrder/add',
        isAuthed: '1',
        authModule: 'productOrder',
        authType: 'add',
        component: asyncComponent(() => import('pages/produceOrder/add')),
    },
    {
        path: '/produceOrder/addRecord/',
        uid: '/produceOrder/addRecord/',
        isAuthed: '1',
        component: asyncComponent(() => import('pages/produceOrder/addRecord')),
    },
    //请购单
    {
        path: '/purchase/requisitionOrder/',
        exact: true,
        isAuthed: '1',
        authModule: 'requisition',
        authType: 'show',
        component: asyncComponent(() => import('pages/purchase/requisitionOrder/index')),
    },
    {
        path: '/purchase/requisitionOrder/add/',
        uid: '/purchase/requisitionOrder/add/',
        isAuthed: '1',
        authModule: 'requisition',
        authType: 'add',
        component: asyncComponent(() => import('pages/purchase/requisitionOrder/add')),
    },
    {
        path: '/purchase/requisitionOrder/modify/:id',
        uid: '/purchase/requisitionOrder/modify/',
        current: '/requisitionOrder/',
        isAuthed: '1',
        authModule: 'requisition',
        authType: 'modify',
        component: asyncComponent(() => import('pages/purchase/requisitionOrder/add')),
    },
    {
        path: '/purchase/requisitionOrder/copy/:copyId',
        uid: '/purchase/requisitionOrder/copy/',
        current: '/requisitionOrder/',
        isAuthed: '1',
        authModule: 'requisition',
        authType: 'add',
        component: asyncComponent(() => import('pages/purchase/requisitionOrder/add')),
    },
    {
        path: '/purchase/requisitionOrder/show/:id',
        uid: '/purchase/requisitionOrder/show/',
        current: '/requisitionOrder/',
        isAuthed: '1',
        authModule: 'requisition',
        authType: 'show',
        component: asyncComponent(() => import('pages/purchase/requisitionOrder/show')),
    },
    {
        path: '/purchase/requisitionOrder/applyIndex/',
        uid: '/purchase/requisitionOrder/applyIndex/',
        isAuthed: '1',
        authModule: 'requisition',
        authType: 'show',
        component: asyncComponent(() => import('pages/purchase/requisitionOrder/applyIndex')),
    }
];

export default routes;