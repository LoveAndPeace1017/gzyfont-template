import {getCookie} from "utils/cookie";

//纸张类型
export const pageType = {
    a4_z:{
        w:717,
        h:1126,
        name: 'A4纵向'
    },
    a4_h:{
        w:1046,
        h:797,
        name: 'A4横向'
    },
    a5_z:{
        w:483,
        h:797,
        name: 'A5纵向'
    },
    a5_h:{
        w:717,
        h:563,
        name: 'A5横向'
    },
    a6_z:{
        w:321,
        h:563,
        name: 'A6纵向'
    },
    a6_h:{
        w:483,
        h:401,
        name: 'A6横向'
    },
    a7_z:{
        w:204,
        h:401,
        name: 'A7纵向'
    },
    a7_h:{
        w:321,
        h:284,
        name: 'A7横向'
    },
    a8_z:{
        w:120,
        h:284,
        name: 'A8纵向'
    },
    a8_h:{
        w:204,
        h:200,
        name: 'A8横向'
    },
    t3_all:{
        w:867,
        h:1129,
        name: '三联全页'
    },
    t3_2:{
        w:867,
        h:565,
        name: '三联二等分'
    },
    t3_3:{
        w:867,
        h:375,
        name: '三联三等分'
    },
    t3_4:{
        w:867,
        h:988,//特殊数字
        name: '滚轴打印'
    }
}
//模板类型
export const template = {
    "EnterWarehouse_0":{
        name:'采购入库'
    },
    "EnterWarehouse_3":{
        name:'销售退货'
    },
    "EnterWarehouse_1":{
        name:'其他入库'
    },
    "EnterWarehouse_2":{
        name:'盘点入库'
    },
    "EnterWarehouse_4":{
        name:'调拨入库'
    },
    "EnterWarehouse_5":{
        name:'生产入库'
    },
    "EnterWarehouse_6":{
        name:'委外成品入库'
    },
    "EnterWarehouse_7":{
        name:'生产退料'
    },
    "EnterWarehouse_8":{
        name:'委外退料'
    },
    "OutWarehouse_0":{
        name:'内部领用'
    },
    "OutWarehouse_1":{
        name:'盘点出库'
    },
    "OutWarehouse_2":{
        name:'销售出库'
    },
    "OutWarehouse_3":{
        name:'采购退货'
    },
    "OutWarehouse_4":{
        name:'其他出库'
    },
    "OutWarehouse_5":{
        name:'调拨出库'
    },
    "OutWarehouse_6":{
        name:'委外领料'
    },
    "OutWarehouse_7":{
        name:'生产领料'
    },
    "PurchaseOrder":{
        name:'采购订单'
    },
    "SaleOrder":{
        name:'销售订单'
    },
    "ProduceOrder":{
        name:'生产单'
    },
    "Subcontract":{
        name:'委外加工单'
    },
    "RequisitionOrder":{
        name:'请购单'
    },
    "QuotationOrder":{
        name:'报价单'
    },
    "ProduceWork": {
        name:'生产工单'
    }
}
//key=>name
export const tablekeyToCnName = {
    serialNumber: '序号',
    prodCustomNo: '物品编号',
    prodName:'物品名称',
    firstCatName:'一级类目',
    secondCatName:'二级类目',
    thirdCatName:'三级类目',
    descItem:'规格型号',
    brand:'品牌',
    produceModel:'制造商型号',
    thumbnailUri:'物品图片',
    minQuantity:'库存下限',
    maxQuantity:'库存上限',
    proBarCode:'商品条码',
    propertyValue1:'自定义字段1',
    propertyValue2:'自定义字段2',
    propertyValue3:'自定义字段3',
    propertyValue4:'自定义字段4',
    propertyValue5:'自定义字段5',
    property_value1:'单据物品自定义字段1',
    property_value2:'单据物品自定义字段2',
    property_value3:'单据物品自定义字段3',
    property_value4:'单据物品自定义字段4',
    property_value5:'单据物品自定义字段5',
    unit:'单位',
    quantity:'出库数量',
    tax:'税额',
    untaxedPrice:'未税单价',
    untaxedAmount:'未税金额',
    taxRate:'税率',
    unitPrice:'含税单价',
    amount:'价税合计',
    remarks:'备注',
    allAmount:'总数量',
    allPrice:'总价格',
    //生产订单
    bomCode: "BOM",
    saleDisplayBillNo: "销售单号",
    customerOrderNo: "客户订单号",
    saleQuantity: "销售数量",
    saleDeliveryDeadlineDate: "交付日期",
    expectCount: "投产数量",
    finishCount: "已生产数量",
    enterCount: "已入库数量",
    unEnterCount: "待入库数量",
    warehouseName: "仓库",
    supplierName: "供应商",
    receiveCount: "领用数量",
    rejectCount: "退料数量",
    totalReceiveCount: "累计领用量",
    //委外加工单
    batchNo: "批次号",
    productionDate: "生产日期",
    expirationDate: "到期日期",
    unitCost: "单位成本",
    allocatedPrice: "分摊后单价",
    allocatedAmount: "分摊后金额",
    currencyUnitPrice: '本币单价',
    currencyAmount: "本币金额"
}

export const fontSizeMap = [
    {key: "a4_z",name: "A4纵向"},
    {key: "a4_h",name: "A4横向"},
    {key: "a5_z",name: "A5纵向"},
    {key: "a5_h",name: "A5横向"},
    {key: "a6_z",name: "A6纵向"},
    {key: "a6_h",name: "A6横向"},
    {key: "a7_z",name: "A7横向"},
    {key: "a7_h",name: "A7横向"},
    {key: "a8_z",name: "A8纵向"},
    {key: "a8_h",name: "A8横向"},
    {key: "t3_all",name: "三联全页"},
    {key: "t3_2",name: "三联二等分"},
    {key: "t3_3",name: "三联三等分"},
    {key: "t3_4",name: "滚轮打印"}
];

export const templateTypeMap = [
    {key:"PurchaseOrder",name:"采购订单"},
    {key:"SaleOrder",name:"销售订单"},
    {key:"ProduceOrder",name:"生产单"},
    {key:"ProduceWork",name:"生产工单"},
    {key:"Subcontract",name:"委外加工单"},
    {key:"RequisitionOrder",name:"请购单"},
    {key:"QuotationOrder",name:"报价单"},
    //入库类型
    {key:"EnterWarehouse_0",name:"采购入库"},
    {key:"EnterWarehouse_1",name:"其他入库"},
    {key:"EnterWarehouse_2",name:"盘点入库"},
    {key:"EnterWarehouse_4",name:"调拨入库"},
    {key:"EnterWarehouse_5",name:"生产入库"},
    {key:"EnterWarehouse_6",name:"委外成品入库"},
    {key:"EnterWarehouse_3",name:"销售退货"},
    {key:"EnterWarehouse_7",name:"生产退料"},
    {key:"EnterWarehouse_8",name:"委外退料"},
    //出库类型
    {key:"OutWarehouse_0",name:"内部领用"},
    {key:"OutWarehouse_1",name:"盘点出库"},
    {key:"OutWarehouse_2",name:"销售出库"},
    {key:"OutWarehouse_3",name:"采购退货"},
    {key:"OutWarehouse_4",name:"其他出库"},
    {key:"OutWarehouse_5",name:"调拨出库"},
    {key:"OutWarehouse_6",name:"委外领料"},
    {key:"OutWarehouse_7",name:"生产领料"},
]

export const customFieldMap = {
    'SaleOrder':{
        table: 'sale_prod',
        tableLength: 40,
        other: 'sale',
        otherLength: 43,
        goods: 'prod',
        goodsLength: 43
    },
    'QuotationOrder':{
        other: 'quotation',
        otherLength: 36,
        goods: 'prod',
        goodsLength: 26
    },
    'PurchaseOrder': {
        goods: 'prod',
        goodsLength: 44
    },
    'ProduceOrder': {
        pGoods: 'prod',
        pGoodsLength: 18,
        mGoods: 'prod',
        mGoodsLength: 15
    },
    'Subcontract': {
        pGoods: 'prod',
        pGoodsLength: 15,
        mGoods: 'prod',
        mGoodsLength: 13
    },
    'RequisitionOrder': {
        goods: 'prod',
        goodsLength: 25
    },
    'EnterWarehouse_0': {
        goods: 'prod',
        goodsLength: 33
    },
    'EnterWarehouse_1': {
        goods: 'prod',
        goodsLength: 33
    },
    'EnterWarehouse_2': {
        goods: 'prod',
        goodsLength: 33
    },
    'EnterWarehouse_3': {
        goods: 'prod',
        goodsLength: 33
    },
    'EnterWarehouse_4': {
        goods: 'prod',
        goodsLength: 33
    },
    'EnterWarehouse_5': {
        goods: 'prod',
        goodsLength: 33
    },
    'EnterWarehouse_6': {
        goods: 'prod',
        goodsLength: 33
    },
    'EnterWarehouse_7': {
        goods: 'prod',
        goodsLength: 33
    },
    'EnterWarehouse_8': {
        goods: 'prod',
        goodsLength: 33
    },
    'OutWarehouse_0': {
        goods: 'prod',
        goodsLength: 38
    },
    'OutWarehouse_1': {
        goods: 'prod',
        goodsLength: 38
    },
    'OutWarehouse_2': {
        goods: 'prod',
        goodsLength: 38
    },
    'OutWarehouse_3': {
        goods: 'prod',
        goodsLength: 38
    },
    'OutWarehouse_4': {
        goods: 'prod',
        goodsLength: 38
    },
    'OutWarehouse_5': {
        goods: 'prod',
        goodsLength: 38
    },
    'OutWarehouse_6': {
        goods: 'prod',
        goodsLength: 38
    },
    'OutWarehouse_7': {
        goods: 'prod',
        goodsLength: 38
    }
}

/*PurchaseOrder,	采购
SaleOrder,	 销售
ProduceOrder  生产
Subcontract   委外加工
EnterWarehouse_0,	采购入库
EnterWarehouse_1, 	其他入库
EnterWarehouse_2, 	盘点入库
EnterWarehouse_3, 	销售退货
EnterWarehouse_4,	调拨入库
EnterWarehouse_5, 	生产入库
EnterWarehouse_6,   委外成品入库
EnterWarehouse_7,   生产退料

OutWarehouse_0,	    内部领用
OutWarehouse_1, 	盘点出库
OutWarehouse_2, 	销售出库
OutWarehouse_3, 	采购退货
OutWarehouse_4, 	其他出库
OutWarehouse_5, 	调拨出库
OutWarehouse_6,     委外领料
OutWarehouse_7,     生产领料
*/


//入库字典
export const inboundDictionaries = {
    table:[
        {
            key: 'serialNumber',
            name:'序号',
            displayShow : false
        },
        {
            key:'prodCustomNo', //prodCustomNo
            name:'物品编号',
            displayShow : true
        },
        {
            key:'prodName',
            name:'物品名称',
            displayShow : true
        },
        {
            key:'firstCatName',
            name:'一级类目',
            displayShow : false
        },
        {
            key:'secondCatName',
            name:'二级类目',
            displayShow : false
        },
        {
            key:'thirdCatName',
            name:'三级类目',
            displayShow : false
        },
        {
            key:'batchNo',
            name:'批次号',
            displayShow : false
        },
        {
            key:'productionDate',
            name:'生产日期',
            displayShow : false
        },
        {
            key:'expirationDate',
            name:'到期日期',
            displayShow : false
        },
        {
            key:'descItem',
            name:'规格型号',
            displayShow : true
        },
        {
            key:'brand',
            name:'品牌',
            displayShow : false
        },
        {
            key:'thumbnailUri',
            name:'物品图片',
            displayShow : false
        },
        {
            key:'produceModel',
            name:'制造商型号',
            displayShow : false
        },
        {
            key:'minQuantity',
            name:'库存下限',
            displayShow : false
        },
        {
            key:'maxQuantity',
            name:'库存上限',
            displayShow : false
        },
        {
            key:'proBarCode',
            name:'商品条码',
            displayShow : false
        },
        {
            key:'property_value1',
            name:'单据物品自定义字段1',
            displayShow : false
        },
        {
            key:'property_value2',
            name:'单据物品自定义字段2',
            displayShow : false
        },
        {
            key:'property_value3',
            name:'单据物品自定义字段3',
            displayShow : false
        },
        {
            key:'property_value4',
            name:'单据物品自定义字段4',
            displayShow : false
        },
        {
            key:'property_value5',
            name:'单据物品自定义字段5',
            displayShow : false
        },
        {
            key:'unit',
            name:'单位',
            displayShow : true
        },
        {
            key:'quantity',
            name:'入库数量',
            displayShow : true
        },
        {
            key:'recUnit',
            name:'辅助单位',
            displayShow : false
        },
        {
            key:'recQuantity',
            name:'辅助入库数量',
            displayShow : false
        },
        {
            key:'unitConverter',
            name:'单位关系',
            displayShow : false
        },
        {
            key:'tax',
            name:'税额',
            displayShow : false
        },
        {
            key:'untaxedPrice',
            name:'未税单价',
            displayShow : false
        },
        {
            key:'untaxedAmount',
            name:'未税金额',
            displayShow : false
        },
        {
            key:'taxRate',
            name:'税率',
            displayShow : false
        },
        {
            key:'unitPrice',
            name:'含税单价',
            displayShow : true
        },
        {
            key:'amount',
            name:'价税合计',
            displayShow : true
        },
        {
            key:'remarks',
            name:'备注',
            displayShow : true
        }
    ],
    other:[
        {
            key:'displayBillNo',
            name:'入库单号',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_3','EnterWarehouse_1','EnterWarehouse_2','EnterWarehouse_4','EnterWarehouse_5','EnterWarehouse_6','EnterWarehouse_7','EnterWarehouse_8'],
            location:'top',
            //采购入库是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: true,
            EnterWarehouse_1: true,
            EnterWarehouse_2: true,
            EnterWarehouse_4: true,
            EnterWarehouse_5: true,
            EnterWarehouse_6: true,
            EnterWarehouse_7: true,
            EnterWarehouse_8: true
        },
        {
            key:'supplierName',
            name:'供应商',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_6','EnterWarehouse_8'],
            location:'top',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: false,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: true,
            EnterWarehouse_7: false,
            EnterWarehouse_8: true
        },
        {
            key:'customerName',
            name:'客户',
            //在哪些模板显示
            display: ['EnterWarehouse_3'],
            location:'top',
            //是否默认显示
            EnterWarehouse_0: false,
            EnterWarehouse_3: true,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: false,
            EnterWarehouse_7: false,
            EnterWarehouse_8: false
        },
        {
            key:'otherEnterWarehouseName',
            name:'入库方',
            //在哪些模板显示
            display: ['EnterWarehouse_1','EnterWarehouse_5'],
            location:'top',
            //是否默认显示
            EnterWarehouse_0: false,
            EnterWarehouse_3: false,
            EnterWarehouse_1: true,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: true,
            EnterWarehouse_6: false,
            EnterWarehouse_7: false,
            EnterWarehouse_8: false
        },
        {
            key:'otherEnterWarehouseName',
            name:'生产部门',
            //在哪些模板显示
            display: ['EnterWarehouse_7'],
            location:'top',
            //是否默认显示
            EnterWarehouse_0: false,
            EnterWarehouse_3: false,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: false,
            EnterWarehouse_7: true,
            EnterWarehouse_8: false
        },
        {
            key:'otherEnterWarehouseContacterName',
            name:'生产人',
            //在哪些模板显示
            display: ['EnterWarehouse_7'],
            location:'top',
            //是否默认显示
            EnterWarehouse_0: false,
            EnterWarehouse_3: false,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: false,
            EnterWarehouse_7: true,
            EnterWarehouse_8: false
        },
        {
            key:'otherEnterWarehouseContacterName',
            name:'入库方-联系人',
            //在哪些模板显示
            display: ['EnterWarehouse_5','EnterWarehouse_1'],
            location:'top',
            //是否默认显示
            EnterWarehouse_0: false,
            EnterWarehouse_3: false,
            EnterWarehouse_1: true,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: true,
            EnterWarehouse_6: false,
            EnterWarehouse_7: false,
            EnterWarehouse_8: false
        },
        {
            key:'customerContacterName',
            name:'客户-联系人',
            //在哪些模板显示
            display: ['EnterWarehouse_3'],
            location:'top',
            //是否默认显示
            EnterWarehouse_0: false,
            EnterWarehouse_3: true,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: false,
            EnterWarehouse_7: false,
            EnterWarehouse_8: false
        },
        {
            key:'customerTelNo',
            name:'客户-联系电话',
            //在哪些模板显示
            display: ['EnterWarehouse_3'],
            location:'top',
            //是否默认显示
            EnterWarehouse_0: false,
            EnterWarehouse_3: true,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: false,
            EnterWarehouse_7: false,
            EnterWarehouse_8: false
        },
        /* start*/
        {
            key:'customerLegalRepresentative',
            name:'客户-法人姓名',
            //在哪些模板显示
            display: ['EnterWarehouse_3'],
            location:'top',
            //是否默认显示
            EnterWarehouse_0: false,
            EnterWarehouse_3: true,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: false,
            EnterWarehouse_7: false,
            EnterWarehouse_8: false
        },
        {
            key:'customerRegisteredAddress',
            name:'客户-注册地址',
            //在哪些模板显示
            display: ['EnterWarehouse_3'],
            location:'top',
            //是否默认显示
            EnterWarehouse_0: false,
            EnterWarehouse_3: true,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: false,
            EnterWarehouse_7: false,
            EnterWarehouse_8: false
        },
        {
            key:'customerLicenseNo',
            name:'客户-社会统一信用代码',
            //在哪些模板显示
            display: ['EnterWarehouse_3'],
            location:'top',
            //是否默认显示
            EnterWarehouse_0: false,
            EnterWarehouse_3: true,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: false,
            EnterWarehouse_7: false,
            EnterWarehouse_8: false
        },
        {
            key:'customerPropertyValue1',
            name:'客户-自定义字段1',
            //在哪些模板显示
            display: ['EnterWarehouse_3'],
            location:'top',
            //是否默认显示
            EnterWarehouse_0: false,
            EnterWarehouse_3: true,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: false,
            EnterWarehouse_7: false,
            EnterWarehouse_8: false
        },
        {
            key:'customerPropertyValue2',
            name:'客户-自定义字段2',
            //在哪些模板显示
            display: ['EnterWarehouse_3'],
            location:'top',
            //是否默认显示
            EnterWarehouse_0: false,
            EnterWarehouse_3: true,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: false,
            EnterWarehouse_7: false,
            EnterWarehouse_8: false
        },
        {
            key:'customerPropertyValue3',
            name:'客户-自定义字段3',
            //在哪些模板显示
            display: ['EnterWarehouse_3'],
            location:'top',
            //是否默认显示
            EnterWarehouse_0: false,
            EnterWarehouse_3: true,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: false,
            EnterWarehouse_7: false,
            EnterWarehouse_8: false
        },
        {
            key:'customerPropertyValue4',
            name:'客户-自定义字段4',
            //在哪些模板显示
            display: ['EnterWarehouse_3'],
            location:'top',
            //是否默认显示
            EnterWarehouse_0: false,
            EnterWarehouse_3: true,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: false,
            EnterWarehouse_7: false,
            EnterWarehouse_8: false
        },
        {
            key:'customerPropertyValue5',
            name:'客户-自定义字段5',
            //在哪些模板显示
            display: ['EnterWarehouse_3'],
            location:'top',
            //是否默认显示
            EnterWarehouse_0: false,
            EnterWarehouse_3: true,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: false,
            EnterWarehouse_7: false,
            EnterWarehouse_8: false
        },
        /* end*/
        {
            key:'supplierContacterName',
            name:'供应商-联系人',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_6','EnterWarehouse_8'],
            location:'top',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: false,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: true,
            EnterWarehouse_7: false,
            EnterWarehouse_8: true
        },
        {
            key:'supplierMobile',
            name:'供应商-联系电话',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_6','EnterWarehouse_8'],
            location:'top',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: false,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: true,
            EnterWarehouse_7: false,
            EnterWarehouse_8: true
        },
        {
            key:'supplierEmail',
            name:'供应商-电子邮箱',
            //在哪些模板显示
            display: ['EnterWarehouse_6','EnterWarehouse_8'],
            location:'top',
            //是否默认显示
            EnterWarehouse_0: false,
            EnterWarehouse_3: false,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: true,
            EnterWarehouse_7: false,
            EnterWarehouse_8: true
        },
        /* start*/
        {
            key:'supplierLegalRepresentative',
            name:'供应商-法人姓名',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_6','EnterWarehouse_8'],
            location:'top',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: false,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: true,
            EnterWarehouse_7: false,
            EnterWarehouse_8: true
        },
        {
            key:'supplierRegisteredAddress',
            name:'供应商-注册地址',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_6','EnterWarehouse_8'],
            location:'top',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: false,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: true,
            EnterWarehouse_7: false,
            EnterWarehouse_8: true
        },
        {
            key:'supplierLicenseNo',
            name:'供应商-社会统一信用代码',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_6','EnterWarehouse_8'],
            location:'top',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: false,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: true,
            EnterWarehouse_7: false,
            EnterWarehouse_8: true
        },
        {
            key:'supplierPropertyValue1',
            name:'供应商-自定义字段1',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_6','EnterWarehouse_8'],
            location:'top',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: false,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: true,
            EnterWarehouse_7: false,
            EnterWarehouse_8: true
        },
        {
            key:'supplierPropertyValue2',
            name:'供应商-自定义字段2',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_6','EnterWarehouse_8'],
            location:'top',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: false,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: true,
            EnterWarehouse_7: false,
            EnterWarehouse_8: true
        },
        {
            key:'supplierPropertyValue3',
            name:'供应商-自定义字段3',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_6','EnterWarehouse_8'],
            location:'top',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: false,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: true,
            EnterWarehouse_7: false,
            EnterWarehouse_8: true
        },
        {
            key:'supplierPropertyValue4',
            name:'供应商-自定义字段4',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_6','EnterWarehouse_8'],
            location:'top',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: false,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: true,
            EnterWarehouse_7: false,
            EnterWarehouse_8: true
        },
        {
            key:'supplierPropertyValue5',
            name:'供应商-自定义字段5',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_6','EnterWarehouse_8'],
            location:'top',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: false,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: true,
            EnterWarehouse_7: false,
            EnterWarehouse_8: true
        },
        /* end*/
        {
            key:'ourContacterName',
            name:'经办人',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_3','EnterWarehouse_1','EnterWarehouse_2','EnterWarehouse_4','EnterWarehouse_5','EnterWarehouse_6','EnterWarehouse_7','EnterWarehouse_8'],
            location:'top',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: true,
            EnterWarehouse_1: true,
            EnterWarehouse_2: true,
            EnterWarehouse_4: true,
            EnterWarehouse_5: true,
            EnterWarehouse_6: true,
            EnterWarehouse_7: true,
            EnterWarehouse_8: true
        },
        {
            key:'enterDate',
            name:'入库日期',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_3','EnterWarehouse_1','EnterWarehouse_2','EnterWarehouse_4','EnterWarehouse_5','EnterWarehouse_6','EnterWarehouse_7','EnterWarehouse_8'],
            location:'bottom',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: true,
            EnterWarehouse_1: true,
            EnterWarehouse_2: true,
            EnterWarehouse_4: true,
            EnterWarehouse_5: true,
            EnterWarehouse_6: true,
            EnterWarehouse_7: true,
            EnterWarehouse_8: true
        },
        {
            key:'warehouseName',
            name:'仓库',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_3','EnterWarehouse_1','EnterWarehouse_2','EnterWarehouse_4','EnterWarehouse_5','EnterWarehouse_6','EnterWarehouse_7','EnterWarehouse_8'],
            location:'bottom',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: true,
            EnterWarehouse_1: true,
            EnterWarehouse_2: true,
            EnterWarehouse_4: true,
            EnterWarehouse_5: true,
            EnterWarehouse_6: true,
            EnterWarehouse_7: true,
            EnterWarehouse_8: true
        },
        {
            key:'enterType',
            name:'入库类型',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_3','EnterWarehouse_1','EnterWarehouse_2','EnterWarehouse_4','EnterWarehouse_5','EnterWarehouse_6','EnterWarehouse_7','EnterWarehouse_8'],
            location:'bottom',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: true,
            EnterWarehouse_1: true,
            EnterWarehouse_2: true,
            EnterWarehouse_4: true,
            EnterWarehouse_5: true,
            EnterWarehouse_6: true,
            EnterWarehouse_7: true,
            EnterWarehouse_8: true
        },
        {
            key:'projectName',
            name:'项目',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_3','EnterWarehouse_1','EnterWarehouse_2','EnterWarehouse_4','EnterWarehouse_5','EnterWarehouse_6','EnterWarehouse_7','EnterWarehouse_8'],
            location:'bottom',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: true,
            EnterWarehouse_1: true,
            EnterWarehouse_2: true,
            EnterWarehouse_4: true,
            EnterWarehouse_5: true,
            EnterWarehouse_6: true,
            EnterWarehouse_7: true,
            EnterWarehouse_8: true
        },
        {
            key:'displayOrderNo',
            name:'上游单号',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_6'],
            location:'other',
            //是否默认显示
            EnterWarehouse_0: false,
            EnterWarehouse_3: false,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: true,
            EnterWarehouse_7: false,
            EnterWarehouse_8: false

        },
        {
            key:'fkProduceNo',
            name:'上游单据',
            //在哪些模板显示
            display: ['EnterWarehouse_7','EnterWarehouse_8'],
            location:'other',
            //是否默认显示
            EnterWarehouse_0: false,
            EnterWarehouse_3: false,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: false,
            EnterWarehouse_7: true,
            EnterWarehouse_8: true
        },
        {
            key:'remarks',
            name:'备注',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_3','EnterWarehouse_1','EnterWarehouse_2','EnterWarehouse_4','EnterWarehouse_5','EnterWarehouse_6','EnterWarehouse_7','EnterWarehouse_8'],
            location:'other',
            //是否默认显示
            EnterWarehouse_0: false,
            EnterWarehouse_3: false,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: true,
            EnterWarehouse_7: true,
            EnterWarehouse_8: true
        },
        {
            key:'propertyValue1',
            name:'自定义字段1',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_3','EnterWarehouse_1','EnterWarehouse_2','EnterWarehouse_4','EnterWarehouse_5','EnterWarehouse_6','EnterWarehouse_8'],
            location:'other',
            //是否默认显示
            EnterWarehouse_0: false,
            EnterWarehouse_3: false,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: true,
            EnterWarehouse_7: false,
            EnterWarehouse_8: true
        },
        {
            key:'propertyValue2',
            name:'自定义字段2',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_3','EnterWarehouse_1','EnterWarehouse_2','EnterWarehouse_4','EnterWarehouse_5','EnterWarehouse_6','EnterWarehouse_8'],
            location:'other',
            //是否默认显示
            EnterWarehouse_0: false,
            EnterWarehouse_3: false,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: true,
            EnterWarehouse_7: false,
            EnterWarehouse_8: true
        },
        {
            key:'propertyValue3',
            name:'自定义字段3',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_3','EnterWarehouse_1','EnterWarehouse_2','EnterWarehouse_4','EnterWarehouse_5','EnterWarehouse_6','EnterWarehouse_8'],
            location:'other',
            //是否默认显示
            EnterWarehouse_0: false,
            EnterWarehouse_3: false,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: true,
            EnterWarehouse_7: false,
            EnterWarehouse_8: true
        },
        {
            key:'propertyValue4',
            name:'自定义字段4',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_3','EnterWarehouse_1','EnterWarehouse_2','EnterWarehouse_4','EnterWarehouse_5','EnterWarehouse_6','EnterWarehouse_8'],
            location:'other',
            //是否默认显示
            EnterWarehouse_0: false,
            EnterWarehouse_3: false,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: true,
            EnterWarehouse_7: false,
            EnterWarehouse_8: true
        },
        {
            key:'propertyValue5',
            name:'自定义字段5',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_3','EnterWarehouse_1','EnterWarehouse_2','EnterWarehouse_4','EnterWarehouse_5','EnterWarehouse_6','EnterWarehouse_8'],
            location:'other',
            //是否默认显示
            EnterWarehouse_0: false,
            EnterWarehouse_3: false,
            EnterWarehouse_1: false,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: false,
            EnterWarehouse_6: true,
            EnterWarehouse_7: false,
            EnterWarehouse_8: true
        },
        {
            key:'addedName',
            name:'制单人',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_3','EnterWarehouse_1','EnterWarehouse_2','EnterWarehouse_4','EnterWarehouse_5','EnterWarehouse_6','EnterWarehouse_7','EnterWarehouse_8'],
            location:'bottom',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: true,
            EnterWarehouse_1: true,
            EnterWarehouse_2: true,
            EnterWarehouse_4: true,
            EnterWarehouse_5: true,
            EnterWarehouse_6: true,
            EnterWarehouse_7: true,
            EnterWarehouse_8: true
        },
        {
            key:'addedTime',
            name:'制单时间',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_3','EnterWarehouse_1','EnterWarehouse_2','EnterWarehouse_4','EnterWarehouse_5','EnterWarehouse_6','EnterWarehouse_7','EnterWarehouse_8'],
            location:'bottom',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: true,
            EnterWarehouse_1: true,
            EnterWarehouse_2: true,
            EnterWarehouse_4: true,
            EnterWarehouse_5: true,
            EnterWarehouse_6: true,
            EnterWarehouse_7: true,
            EnterWarehouse_8: true
        },
        {
            key:'updatedName',
            name:'最后修改人',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_3','EnterWarehouse_1','EnterWarehouse_5','EnterWarehouse_6','EnterWarehouse_7','EnterWarehouse_8'],
            location:'bottom',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: true,
            EnterWarehouse_1: true,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: true,
            EnterWarehouse_6: true,
            EnterWarehouse_7: true,
            EnterWarehouse_8: true
        },
        {
            key:'updatedTime',
            name:'最后修改时间',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_3','EnterWarehouse_1','EnterWarehouse_5','EnterWarehouse_6','EnterWarehouse_7','EnterWarehouse_8'],
            location:'bottom',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: true,
            EnterWarehouse_1: true,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: true,
            EnterWarehouse_6: true,
            EnterWarehouse_7: true,
            EnterWarehouse_8: true
        },
        {
            key:'approvedLoginName',
            name:'审批人',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_3','EnterWarehouse_1','EnterWarehouse_5','EnterWarehouse_6','EnterWarehouse_7','EnterWarehouse_8'],
            location:'bottom',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: true,
            EnterWarehouse_1: true,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: true,
            EnterWarehouse_6: true,
            EnterWarehouse_7: true,
            EnterWarehouse_8: true
        },
        {
            key:'approvedTime',
            name:'审批时间',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_3','EnterWarehouse_1','EnterWarehouse_5','EnterWarehouse_6','EnterWarehouse_7','EnterWarehouse_8'],
            location:'bottom',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: true,
            EnterWarehouse_1: true,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: true,
            EnterWarehouse_6: true,
            EnterWarehouse_7: true,
            EnterWarehouse_8: true
        },
        {
            key:'approveStatus',
            name:'审批状态',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_3','EnterWarehouse_1','EnterWarehouse_5','EnterWarehouse_6','EnterWarehouse_7','EnterWarehouse_8'],
            location:'bottom',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: true,
            EnterWarehouse_1: true,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: true,
            EnterWarehouse_6: true,
            EnterWarehouse_7: true,
            EnterWarehouse_8: true
        },
        {
            key:'totalQuantity',
            name:'总数量',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_3','EnterWarehouse_1','EnterWarehouse_5','EnterWarehouse_6','EnterWarehouse_7','EnterWarehouse_8'],
            location:'bottom',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: true,
            EnterWarehouse_1: true,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: true,
            EnterWarehouse_6: true,
            EnterWarehouse_7: true,
            EnterWarehouse_8: true
        },
        {
            key:'taxAllAmount',
            name:'总金额',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_3','EnterWarehouse_1','EnterWarehouse_5','EnterWarehouse_6','EnterWarehouse_7','EnterWarehouse_8'],
            location:'bottom',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: true,
            EnterWarehouse_1: true,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: true,
            EnterWarehouse_6: true,
            EnterWarehouse_7: true,
            EnterWarehouse_8: true
        },
        {
            key:'taxAllAmountUp',
            name:'总金额大写',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_3','EnterWarehouse_1','EnterWarehouse_5','EnterWarehouse_6','EnterWarehouse_7','EnterWarehouse_8'],
            location:'bottom',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: true,
            EnterWarehouse_1: true,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: true,
            EnterWarehouse_6: true,
            EnterWarehouse_7: true,
            EnterWarehouse_8: true
        },
        {
            key:'discountAmount',
            name:'优惠金额',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_3','EnterWarehouse_1','EnterWarehouse_5','EnterWarehouse_6','EnterWarehouse_7','EnterWarehouse_8'],
            location:'bottom',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: true,
            EnterWarehouse_1: true,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: true,
            EnterWarehouse_6: true,
            EnterWarehouse_7: true,
            EnterWarehouse_8: true
        },
        {
            key:'aggregateAmount',
            name:'优惠后金额',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_3','EnterWarehouse_1','EnterWarehouse_5','EnterWarehouse_6','EnterWarehouse_7','EnterWarehouse_8'],
            location:'bottom',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: true,
            EnterWarehouse_1: true,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: true,
            EnterWarehouse_6: true,
            EnterWarehouse_7: true,
            EnterWarehouse_8: true
        },
        {
            key:'aggregateAmountUp',
            name:'优惠后金额大写',
            //在哪些模板显示
            display: ['EnterWarehouse_0','EnterWarehouse_3','EnterWarehouse_1','EnterWarehouse_5','EnterWarehouse_6','EnterWarehouse_7','EnterWarehouse_8'],
            location:'bottom',
            //是否默认显示
            EnterWarehouse_0: true,
            EnterWarehouse_3: true,
            EnterWarehouse_1: true,
            EnterWarehouse_2: false,
            EnterWarehouse_4: false,
            EnterWarehouse_5: true,
            EnterWarehouse_6: true,
            EnterWarehouse_7: true,
            EnterWarehouse_8: true
        }
    ]
}
//出库字典
export const outboundDictionaries = {
    table:[
        {
            key: 'serialNumber',
            name:'序号',
            displayShow : false
        },
        {
            key:'prodCustomNo',
            name:'物品编号',
            displayShow : true
        },
        {
            key:'prodName',
            name:'物品名称',
            displayShow : true
        },
        {
            key:'firstCatName',
            name:'一级类目',
            displayShow : false
        },
        {
            key:'secondCatName',
            name:'二级类目',
            displayShow : false
        },
        {
            key:'thirdCatName',
            name:'三级类目',
            displayShow : false
        },
        {
            key:'batchNo',
            name:'批次号',
            displayShow : false
        },
        {
            key:'productionDate',
            name:'生产日期',
            displayShow : false
        },
        {
            key:'expirationDate',
            name:'到期日期',
            displayShow : false
        },
        {
            key:'descItem',
            name:'规格型号',
            displayShow : true
        },
        {
            key:'brand',
            name:'品牌',
            displayShow : false
        },
        {
            key:'produceModel',
            name:'制造商型号',
            displayShow : false
        },
        {
            key:'thumbnailUri',
            name:'物品图片',
            displayShow : false
        },
        {
            key:'minQuantity',
            name:'库存下限',
            displayShow : false
        },
        {
            key:'maxQuantity',
            name:'库存上限',
            displayShow : false
        },
        {
            key:'proBarCode',
            name:'商品条码',
            displayShow : false
        },
        {
            key:'propertyValue1',
            name:'自定义字段1',
            displayShow : false
        },
        {
            key:'propertyValue2',
            name:'自定义字段2',
            displayShow : false
        },
        {
            key:'propertyValue3',
            name:'自定义字段3',
            displayShow : false
        },
        {
            key:'propertyValue4',
            name:'自定义字段4',
            displayShow : false
        },
        {
            key:'propertyValue5',
            name:'自定义字段5',
            displayShow : false
        },
        {
            key:'property_value1',
            name:'单据物品自定义字段1',
            displayShow : false
        },
        {
            key:'property_value2',
            name:'单据物品自定义字段2',
            displayShow : false
        },
        {
            key:'property_value3',
            name:'单据物品自定义字段3',
            displayShow : false
        },
        {
            key:'property_value4',
            name:'单据物品自定义字段4',
            displayShow : false
        },
        {
            key:'property_value5',
            name:'单据物品自定义字段5',
            displayShow : false
        },
        {
            key:'unit',
            name:'单位',
            displayShow : true
        },
        {
            key:'quantity',
            name:'出库数量',
            displayShow : true
        },
        {
            key:'recUnit',
            name:'辅助单位',
            displayShow : false
        },
        {
            key:'recQuantity',
            name:'辅助出库数量',
            displayShow : false
        },
        {
            key:'unitConverter',
            name:'单位关系',
            displayShow : false
        },
        {
            key:'tax',
            name:'税额',
            displayShow : false
        },
        {
            key:'untaxedPrice',
            name:'未税单价',
            displayShow : false
        },
        {
            key:'untaxedAmount',
            name:'未税金额',
            displayShow : false
        },
        {
            key:'taxRate',
            name:'税率',
            displayShow : false
        },
        {
            key:'unitPrice',
            name:'含税单价',
            displayShow : true
        },
        {
            key:'amount',
            name:'价税合计',
            displayShow : true
        },
        {
            key:'remarks',
            name:'备注',
            displayShow : true
        }
    ],
    other:[
        {
            key:'displayBillNo',
            name:'出库单号',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_1','OutWarehouse_2','OutWarehouse_3','OutWarehouse_4','OutWarehouse_5','OutWarehouse_6','OutWarehouse_7'],
            location:'top',
            //采购入库是否默认显示
            OutWarehouse_0: true,
            OutWarehouse_1: true,
            OutWarehouse_2: true,
            OutWarehouse_3: true,
            OutWarehouse_4: true,
            OutWarehouse_5: true,
            OutWarehouse_6: true,
            OutWarehouse_7: true
        },
        {
            key:'useDepartment',
            name:'出库对象',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_4'],
            location:'top',
            //采购入库是否默认显示
            OutWarehouse_0: true,
            OutWarehouse_1: false,
            OutWarehouse_2: false,
            OutWarehouse_3: false,
            OutWarehouse_4: true,
            OutWarehouse_5: false,
            OutWarehouse_6: false,
            OutWarehouse_7: false
        },
        {
            key:'useDepartment',
            name:'生产部门',
            //在哪些模板显示
            display: ['OutWarehouse_7'],
            location:'top',
            //采购入库是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: false,
            OutWarehouse_3: false,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: false,
            OutWarehouse_7: true
        },
        {
            key:'usePerson',
            name:'生产人',
            //在哪些模板显示
            display: ['OutWarehouse_7'],
            location:'top',
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: false,
            OutWarehouse_3: false,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: false,
            OutWarehouse_7: true
        },
        {
            key:'usePerson',
            name:'出库对象-联系人',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_4'],
            location:'top',
            OutWarehouse_0: true,
            OutWarehouse_1: false,
            OutWarehouse_2: false,
            OutWarehouse_3: false,
            OutWarehouse_4: true,
            OutWarehouse_5: false,
            OutWarehouse_6: false,
            OutWarehouse_7: false
        },
        {
            key:'ourContacterName',
            name:'经办人',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_1','OutWarehouse_2','OutWarehouse_3','OutWarehouse_4','OutWarehouse_5','OutWarehouse_6','OutWarehouse_7'],
            location:'top',
            //是否默认显示
            OutWarehouse_0: true,
            OutWarehouse_1: true,
            OutWarehouse_2: true,
            OutWarehouse_3: true,
            OutWarehouse_4: true,
            OutWarehouse_5: true,
            OutWarehouse_6: true,
            OutWarehouse_7: true
        },
        {
            key:'customerName',
            name:'客户',
            //在哪些模板显示
            display: ['OutWarehouse_2'],
            location:'top',
            //采购入库是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: true,
            OutWarehouse_3: false,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: false,
            OutWarehouse_7: false
        },
        {
            key:'customerContacterName',
            name:'客户-联系人',
            //在哪些模板显示
            display: ['OutWarehouse_2'],
            location:'top',
            //采购入库是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: true,
            OutWarehouse_3: false,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: false,
            OutWarehouse_7: false
        },
        {
            key:'customerTelNo',
            name:'客户-联系电话',
            //在哪些模板显示
            display: ['OutWarehouse_2'],
            location:'top',
            //采购入库是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: true,
            OutWarehouse_3: false,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: false,
            OutWarehouse_7: false
        },
        /* start*/
        {
            key:'customerLegalRepresentative',
            name:'客户-法人姓名',
            //在哪些模板显示
            display: ['OutWarehouse_2'],
            location:'top',
            //采购入库是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: true,
            OutWarehouse_3: false,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: false,
            OutWarehouse_7: false
        },
        {
            key:'customerRegisteredAddress',
            name:'客户-注册地址',
            //在哪些模板显示
            display: ['OutWarehouse_2'],
            location:'top',
            //采购入库是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: true,
            OutWarehouse_3: false,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: false,
            OutWarehouse_7: false
        },
        {
            key:'customerLicenseNo',
            name:'客户-社会统一信用代码',
            //在哪些模板显示
            display: ['OutWarehouse_2'],
            location:'top',
            //采购入库是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: true,
            OutWarehouse_3: false,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: false,
            OutWarehouse_7: false
        },
        {
            key:'customerPropertyValue1',
            name:'客户-自定义字段1',
            //在哪些模板显示
            display: ['OutWarehouse_2'],
            location:'top',
            //采购入库是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: true,
            OutWarehouse_3: false,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: false,
            OutWarehouse_7: false
        },
        {
            key:'customerPropertyValue2',
            name:'客户-自定义字段2',
            //在哪些模板显示
            display: ['OutWarehouse_2'],
            location:'top',
            //采购入库是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: true,
            OutWarehouse_3: false,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: false,
            OutWarehouse_7: false
        },
        {
            key:'customerPropertyValue3',
            name:'客户-自定义字段3',
            //在哪些模板显示
            display: ['OutWarehouse_2'],
            location:'top',
            //采购入库是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: true,
            OutWarehouse_3: false,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: false,
            OutWarehouse_7: false
        },
        {
            key:'customerPropertyValue4',
            name:'客户-自定义字段4',
            //在哪些模板显示
            display: ['OutWarehouse_2'],
            location:'top',
            //采购入库是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: true,
            OutWarehouse_3: false,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: false,
            OutWarehouse_7: false
        },
        {
            key:'customerPropertyValue5',
            name:'客户-自定义字段5',
            //在哪些模板显示
            display: ['OutWarehouse_2'],
            location:'top',
            //采购入库是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: true,
            OutWarehouse_3: false,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: false,
            OutWarehouse_7: false
        },
        /* end*/
        {
            key:'supplierName',
            name:'供应商',
            //在哪些模板显示
            display: ['OutWarehouse_3','OutWarehouse_6'],
            location:'top',
            //是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: false,
            OutWarehouse_3: true,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: false
        },
        {
            key:'supplierContacterName',
            name:'供应商-联系人',
            //在哪些模板显示
            display: ['OutWarehouse_3','OutWarehouse_6'],
            location:'top',
            //是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: false,
            OutWarehouse_3: true,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: false
        },
        {
            key:'supplierTelNo',
            name:'供应商-联系电话',
            //在哪些模板显示
            display: ['OutWarehouse_3','OutWarehouse_6'],
            location:'top',
            //是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: false,
            OutWarehouse_3: true,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: false
        },
        /* start*/
        {
            key:'supplierLegalRepresentative',
            name:'供应商-法人姓名',
            //在哪些模板显示
            display: ['OutWarehouse_3','OutWarehouse_6'],
            location:'top',
            //是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: false,
            OutWarehouse_3: true,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: false
        },
        {
            key:'supplierRegisteredAddress',
            name:'供应商-注册地址',
            //在哪些模板显示
            display: ['OutWarehouse_3','OutWarehouse_6'],
            location:'top',
            //是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: false,
            OutWarehouse_3: true,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: false
        },
        {
            key:'ourName',
            name:'销售方',
            //在哪些模板显示
            display: ['OutWarehouse_2'],
            location:'top',
            //采购入库是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: true,
            OutWarehouse_3: false,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: false,
            OutWarehouse_7: false
        },
        {
            key:'ourContacterName',
            name:'销售员',
            //在哪些模板显示
            display: ['OutWarehouse_2'],
            location:'top',
            //采购入库是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: true,
            OutWarehouse_3: false,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: false,
            OutWarehouse_7: false
        },
        {
            key:'ourMobile',
            name:'销售电话',
            //在哪些模板显示
            display: ['OutWarehouse_2'],
            location:'top',
            //采购入库是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: true,
            OutWarehouse_3: false,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: false,
            OutWarehouse_7: false
        },
        {
            key:'supplierEmail',
            name:'供应商-电子邮件',
            //在哪些模板显示
            display: ['OutWarehouse_6'],
            location:'top',
            //是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: false,
            OutWarehouse_3: false,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: false
        },
        {
            key:'supplierLicenseNo',
            name:'供应商-社会统一信用代码',
            //在哪些模板显示
            display: ['OutWarehouse_3','OutWarehouse_6'],
            location:'top',
            //是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: false,
            OutWarehouse_3: true,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: false
        },
        {
            key:'supplierPropertyValue1',
            name:'供应商-自定义字段1',
            //在哪些模板显示
            display: ['OutWarehouse_3','OutWarehouse_6'],
            location:'top',
            //是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: false,
            OutWarehouse_3: true,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: false
        },
        {
            key:'supplierPropertyValue2',
            name:'供应商-自定义字段2',
            //在哪些模板显示
            display: ['OutWarehouse_3','OutWarehouse_6'],
            location:'top',
            //是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: false,
            OutWarehouse_3: true,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: false
        },
        {
            key:'supplierPropertyValue3',
            name:'供应商-自定义字段3',
            //在哪些模板显示
            display: ['OutWarehouse_3','OutWarehouse_6'],
            location:'top',
            //是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: false,
            OutWarehouse_3: true,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: false
        },
        {
            key:'supplierPropertyValue4',
            name:'供应商-自定义字段4',
            //在哪些模板显示
            display: ['OutWarehouse_3','OutWarehouse_6'],
            location:'top',
            //是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: false,
            OutWarehouse_3: true,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: false
        },
        {
            key:'supplierPropertyValue5',
            name:'供应商-自定义字段5',
            //在哪些模板显示
            display: ['OutWarehouse_3','OutWarehouse_6'],
            location:'top',
            //是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: false,
            OutWarehouse_3: true,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: false
        },
        /* end*/
        {
            key:'outDate',
            name:'出库日期',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_1','OutWarehouse_2','OutWarehouse_3','OutWarehouse_4','OutWarehouse_5','OutWarehouse_6','OutWarehouse_7'],
            location:'bottom',
            //是否默认显示
            OutWarehouse_0: true,
            OutWarehouse_1: true,
            OutWarehouse_2: true,
            OutWarehouse_3: true,
            OutWarehouse_4: true,
            OutWarehouse_5: true,
            OutWarehouse_6: true,
            OutWarehouse_7: true
        },
        {
            key:'warehouseName',
            name:'仓库',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_1','OutWarehouse_2','OutWarehouse_3','OutWarehouse_4','OutWarehouse_5','OutWarehouse_6','OutWarehouse_7'],
            location:'bottom',
            //是否默认显示
            OutWarehouse_0: true,
            OutWarehouse_1: true,
            OutWarehouse_2: true,
            OutWarehouse_3: true,
            OutWarehouse_4: true,
            OutWarehouse_5: true,
            OutWarehouse_6: true,
            OutWarehouse_7: true
        },
        {
            key:'outType',
            name:'出库类型',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_1','OutWarehouse_2','OutWarehouse_3','OutWarehouse_4','OutWarehouse_5','OutWarehouse_6','OutWarehouse_7'],
            location:'bottom',
            //是否默认显示
            OutWarehouse_0: true,
            OutWarehouse_1: true,
            OutWarehouse_2: true,
            OutWarehouse_3: true,
            OutWarehouse_4: true,
            OutWarehouse_5: true,
            OutWarehouse_6: true,
            OutWarehouse_7: true
        },
        {
            key:'projectName',
            name:'项目',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_1','OutWarehouse_2','OutWarehouse_3','OutWarehouse_4','OutWarehouse_5','OutWarehouse_6','OutWarehouse_7'],
            location:'bottom',
            //是否默认显示
            OutWarehouse_0: true,
            OutWarehouse_1: true,
            OutWarehouse_2: true,
            OutWarehouse_3: true,
            OutWarehouse_4: true,
            OutWarehouse_5: true,
            OutWarehouse_6: true,
            OutWarehouse_7: true
        },
        {
            key:'logistics',
            name:'物流公司',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_1','OutWarehouse_2','OutWarehouse_3','OutWarehouse_4','OutWarehouse_5','OutWarehouse_6','OutWarehouse_7'],
            location:'bottom',
            //是否默认显示
            OutWarehouse_0: true,
            OutWarehouse_1: true,
            OutWarehouse_2: true,
            OutWarehouse_3: true,
            OutWarehouse_4: true,
            OutWarehouse_5: true,
            OutWarehouse_6: true,
            OutWarehouse_7: true
        },
        {
            key:'waybillNo',
            name:'物流单号',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_1','OutWarehouse_2','OutWarehouse_3','OutWarehouse_4','OutWarehouse_5','OutWarehouse_6','OutWarehouse_7'],
            location:'bottom',
            //是否默认显示
            OutWarehouse_0: true,
            OutWarehouse_1: true,
            OutWarehouse_2: true,
            OutWarehouse_3: true,
            OutWarehouse_4: true,
            OutWarehouse_5: true,
            OutWarehouse_6: true,
            OutWarehouse_7: true
        },
        {
            key:'saleCustomerOrderNo',
            name:'客户订单号',
            //在哪些模板显示
            display: ['OutWarehouse_2'],
            location:'other',
            //是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: false,
            OutWarehouse_3: false,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: false,
            OutWarehouse_7: false
        },
        {
            key:'displaySaleOrderNo',
            name:'上游单号',
            //在哪些模板显示
            display: ['OutWarehouse_2','OutWarehouse_6'],
            location:'other',
            //是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: false,
            OutWarehouse_3: false,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: false
        },
        {
            key:'fkProduceNo',
            name:'上游单据',
            //在哪些模板显示
            display: ['OutWarehouse_7'],
            location:'other',
            //是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: false,
            OutWarehouse_3: false,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: false,
            OutWarehouse_7: true
        },
        {
            key:'deliveryAddress',
            name:'交货地址',
            //在哪些模板显示
            display: ['OutWarehouse_2'],
            location:'other',
            //是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: false,
            OutWarehouse_3: false,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: false
        },
        {
            key:'remarks',
            name:'备注',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_1','OutWarehouse_2','OutWarehouse_3','OutWarehouse_4','OutWarehouse_5','OutWarehouse_6','OutWarehouse_7'],
            location:'other',
            //是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: false,
            OutWarehouse_3: false,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: true
        },
        {
            key:'propertyValue1',
            name:'自定义字段1',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_1','OutWarehouse_2','OutWarehouse_3','OutWarehouse_4','OutWarehouse_5','OutWarehouse_6','OutWarehouse_7'],
            location:'other',
            //是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: false,
            OutWarehouse_3: false,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: false
        },
        {
            key:'propertyValue2',
            name:'自定义字段2',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_1','OutWarehouse_2','OutWarehouse_3','OutWarehouse_4','OutWarehouse_5','OutWarehouse_6','OutWarehouse_7'],
            location:'other',
            //是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: false,
            OutWarehouse_3: false,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: false
        },
        {
            key:'propertyValue3',
            name:'自定义字段3',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_1','OutWarehouse_2','OutWarehouse_3','OutWarehouse_4','OutWarehouse_5','OutWarehouse_6','OutWarehouse_7'],
            location:'other',
            //是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: false,
            OutWarehouse_3: false,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: true
        },
        {
            key:'propertyValue4',
            name:'自定义字段4',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_1','OutWarehouse_2','OutWarehouse_3','OutWarehouse_4','OutWarehouse_5','OutWarehouse_6','OutWarehouse_7'],
            location:'other',
            //是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: false,
            OutWarehouse_3: false,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: true
        },
        {
            key:'propertyValue5',
            name:'自定义字段5',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_1','OutWarehouse_2','OutWarehouse_3','OutWarehouse_4','OutWarehouse_5','OutWarehouse_6','OutWarehouse_7'],
            location:'other',
            //是否默认显示
            OutWarehouse_0: false,
            OutWarehouse_1: false,
            OutWarehouse_2: false,
            OutWarehouse_3: false,
            OutWarehouse_4: false,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: true
        },
        {
            key:'addedName',
            name:'制单人',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_1','OutWarehouse_2','OutWarehouse_3','OutWarehouse_4','OutWarehouse_5','OutWarehouse_6','OutWarehouse_7'],
            location:'top',
            //是否默认显示
            OutWarehouse_0: true,
            OutWarehouse_1: true,
            OutWarehouse_2: true,
            OutWarehouse_3: true,
            OutWarehouse_4: true,
            OutWarehouse_5: true,
            OutWarehouse_6: true,
            OutWarehouse_7: true
        },
        {
            key:'addedTime',
            name:'制单时间',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_1','OutWarehouse_2','OutWarehouse_3','OutWarehouse_4','OutWarehouse_5','OutWarehouse_6','OutWarehouse_7'],
            location:'top',
            //是否默认显示
            OutWarehouse_0: true,
            OutWarehouse_1: true,
            OutWarehouse_2: true,
            OutWarehouse_3: true,
            OutWarehouse_4: true,
            OutWarehouse_5: true,
            OutWarehouse_6: true,
            OutWarehouse_7: true
        },
        {
            key:'updatedName',
            name:'最后修改人',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_2','OutWarehouse_3','OutWarehouse_4','OutWarehouse_6','OutWarehouse_7'],
            location:'top',
            //是否默认显示
            OutWarehouse_0: true,
            OutWarehouse_1: false,
            OutWarehouse_2: true,
            OutWarehouse_3: true,
            OutWarehouse_4: true,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: false
        },
        {
            key:'updatedTime',
            name:'最后修改时间',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_2','OutWarehouse_3','OutWarehouse_4','OutWarehouse_6','OutWarehouse_7'],
            location:'top',
            //是否默认显示
            OutWarehouse_0: true,
            OutWarehouse_1: false,
            OutWarehouse_2: true,
            OutWarehouse_3: true,
            OutWarehouse_4: true,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: true
        },
        {
            key:'approvedLoginName',
            name:'审批人',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_2','OutWarehouse_3','OutWarehouse_4','OutWarehouse_6','OutWarehouse_7'],
            location:'top',
            //是否默认显示
            OutWarehouse_0: true,
            OutWarehouse_1: false,
            OutWarehouse_2: true,
            OutWarehouse_3: true,
            OutWarehouse_4: true,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: true
        },
        {
            key:'approvedTime',
            name:'审批时间',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_2','OutWarehouse_3','OutWarehouse_4','OutWarehouse_6','OutWarehouse_7'],
            location:'top',
            //是否默认显示
            OutWarehouse_0: true,
            OutWarehouse_1: false,
            OutWarehouse_2: true,
            OutWarehouse_3: true,
            OutWarehouse_4: true,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: true
        },
        {
            key:'approveStatus',
            name:'审批状态',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_2','OutWarehouse_3','OutWarehouse_4','OutWarehouse_6','OutWarehouse_7'],
            location:'top',
            //是否默认显示
            OutWarehouse_0: true,
            OutWarehouse_1: false,
            OutWarehouse_2: true,
            OutWarehouse_3: true,
            OutWarehouse_4: true,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: true
        },
        {
            key:'totalQuantity',
            name:'总数量',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_2','OutWarehouse_3','OutWarehouse_4','OutWarehouse_6','OutWarehouse_7'],
            location:'top',
            //是否默认显示
            OutWarehouse_0: true,
            OutWarehouse_1: false,
            OutWarehouse_2: true,
            OutWarehouse_3: true,
            OutWarehouse_4: true,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: true
        },
        {
            key:'taxAllAmount',
            name:'总金额',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_2','OutWarehouse_3','OutWarehouse_4','OutWarehouse_6','OutWarehouse_7'],
            location:'top',
            //是否默认显示
            OutWarehouse_0: true,
            OutWarehouse_1: false,
            OutWarehouse_2: true,
            OutWarehouse_3: true,
            OutWarehouse_4: true,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: true
        },
        {
            key:'taxAllAmountUp',
            name:'总金额大写',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_2','OutWarehouse_3','OutWarehouse_4','OutWarehouse_6','OutWarehouse_7'],
            location:'top',
            //是否默认显示
            OutWarehouse_0: true,
            OutWarehouse_1: false,
            OutWarehouse_2: true,
            OutWarehouse_3: true,
            OutWarehouse_4: true,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: true
        },
        {
            key:'discountAmount',
            name:'优惠金额',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_2','OutWarehouse_3','OutWarehouse_4','OutWarehouse_6','OutWarehouse_7'],
            location:'top',
            //是否默认显示
            OutWarehouse_0: true,
            OutWarehouse_1: false,
            OutWarehouse_2: true,
            OutWarehouse_3: true,
            OutWarehouse_4: true,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: true
        },
        {
            key:'aggregateAmount',
            name:'优惠后金额',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_2','OutWarehouse_3','OutWarehouse_4','OutWarehouse_6','OutWarehouse_7'],
            location:'top',
            //是否默认显示
            OutWarehouse_0: true,
            OutWarehouse_1: false,
            OutWarehouse_2: true,
            OutWarehouse_3: true,
            OutWarehouse_4: true,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: true
        },
        {
            key:'aggregateAmountUp',
            name:'优惠后金额大写',
            //在哪些模板显示
            display: ['OutWarehouse_0','OutWarehouse_2','OutWarehouse_3','OutWarehouse_4','OutWarehouse_6','OutWarehouse_7'],
            location:'top',
            //是否默认显示
            OutWarehouse_0: true,
            OutWarehouse_1: false,
            OutWarehouse_2: true,
            OutWarehouse_3: true,
            OutWarehouse_4: true,
            OutWarehouse_5: false,
            OutWarehouse_6: true,
            OutWarehouse_7: true
        }
    ]
}
//采购订单
export const purchaseDictionaries = {
    table:[
        {
            key: 'serialNumber',
            name:'序号',
            displayShow : false
        },
        {
            key:'prodCustomNo',
            name:'物品编号',
            displayShow : true
        },
        {
            key:'prodName',
            name:'物品名称',
            displayShow : true
        },
        {
            key:'firstCatName',
            name:'一级类目',
            displayShow : false
        },
        {
            key:'secondCatName',
            name:'二级类目',
            displayShow : false
        },
        {
            key:'thirdCatName',
            name:'三级类目',
            displayShow : false
        },
        {
            key:'batchNo',
            name:'批次号',
            displayShow : false
        },
        {
            key:'productionDate',
            name:'生产日期',
            displayShow : false
        },
        {
            key:'expirationDate',
            name:'到期日期',
            displayShow : false
        },
        {
            key:'descItem',
            name:'规格型号',
            displayShow : true
        },
        {
            key:'brand',
            name:'品牌',
            displayShow : false
        },
        {
            key:'thumbnailUri',
            name:'物品图片',
            displayShow : false
        },
        {
            key:'produceModel',
            name:'制造商型号',
            displayShow : false
        },
        {
            key:'minQuantity',
            name:'库存下限',
            displayShow : false
        },
        {
            key:'maxQuantity',
            name:'库存上限',
            displayShow : false
        },
        {
            key:'proBarCode',
            name:'商品条码',
            displayShow : false
        },
        {
            key:'propertyValue1',
            name:'自定义字段1',
            displayShow : false
        },
        {
            key:'propertyValue2',
            name:'自定义字段2',
            displayShow : false
        },
        {
            key:'propertyValue3',
            name:'自定义字段3',
            displayShow : false
        },
        {
            key:'propertyValue4',
            name:'自定义字段4',
            displayShow : false
        },
        {
            key:'propertyValue5',
            name:'自定义字段5',
            displayShow : false
        },
        {
            key:'property_value1',
            name:'单据物品自定义字段1',
            displayShow : false
        },
        {
            key:'property_value2',
            name:'单据物品自定义字段2',
            displayShow : false
        },
        {
            key:'property_value3',
            name:'单据物品自定义字段3',
            displayShow : false
        },
        {
            key:'property_value4',
            name:'单据物品自定义字段4',
            displayShow : false
        },
        {
            key:'property_value5',
            name:'单据物品自定义字段5',
            displayShow : false
        },
        {
            key:'unit',
            name:'单位',
            displayShow : true
        },
        {
            key:'quantity',
            name:'采购数量',
            displayShow : true
        },
        {
            key:'recUnit',
            name:'辅助单位',
            displayShow : false
        },
        {
            key:'recQuantity',
            name:'辅助采购数量',
            displayShow : false
        },
        {
            key:'unitConverter',
            name:'单位关系',
            displayShow : false
        },
        {
            key:'tax',
            name:'税额',
            displayShow : false
        },
        {
            key:'untaxedPrice',
            name:'未税单价',
            displayShow : false
        },
        {
            key:'untaxedAmount',
            name:'未税金额',
            displayShow : false
        },
        {
            key:'taxRate',
            name:'税率',
            displayShow : false
        },
        {
            key:'unitPrice',
            name:'含税单价',
            displayShow : true
        },
        {
            key:'amount',
            name:'价税合计',
            displayShow : true
        },
        {
            key:'remarks',
            name:'备注',
            displayShow : true
        },
        {
            key:'saleBillNo',
            name:'上游单号',
            displayShow : false
        },
        {
            key:'deliveryDeadlineDate',
            name:'交付日期',
            displayShow : true
        },
        {
            key:'entNum',
            name:'已入库数量',
            displayShow : false
        },
        {
            key:'returnNum',
            name:'退货数量',
            displayShow : false
        },
        {
            key:'actualNum',
            name:'实际入库数量',
            displayShow : false
        },
        {
            key:'unEntNum',
            name:'未入库数量',
            displayShow : false
        }
    ],
    other:[
        {
            key:'displayBillNo',
            name:'采购单号',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'warehouseName',
            name:'仓库',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'ourName',
            name:'采购方',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'ourContacterName',
            name:'采购方-联系人',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'ourTelNo',
            name:'采购方-联系电话',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'supplierName',
            name:'供应商',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'supplierContacterName',
            name:'供应商-联系人',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'supplierMobile',
            name:'供应商-联系电话',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        /* start*/
        {
            key:'supplierLegalRepresentative',
            name:'供应商-法人姓名',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'supplierRegisteredAddress',
            name:'供应商-注册地址',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'supplierLicenseNo',
            name:'供应商-社会统一信用代码',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'supplierPropertyValue1',
            name:'供应商-自定义字段1',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'supplierPropertyValue2',
            name:'供应商-自定义字段2',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'supplierPropertyValue3',
            name:'供应商-自定义字段3',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'supplierPropertyValue4',
            name:'供应商-自定义字段4',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'supplierPropertyValue5',
            name:'供应商-自定义字段5',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        /* end*/
        {
            key:'deliveryProvinceText',
            name:'交付地址',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'bottom',
            //是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'purchaseOrderDate',
            name:'采购日期',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'bottom',
            //是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'projectName',
            name:'项目',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'bottom',
            //是否默认显示
            PurchaseOrder: true
        },
        {
            key:'settlement',
            name:'结算方式',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'bottom',
            //是否默认显示
            PurchaseOrder: true
        },
        {
            key:'contractTerms',
            name:'备注',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'other',
            //是否默认显示
            PurchaseOrder: false
        },
        {
            key:'propertyValue1',
            name:'自定义字段1',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'other',
            //是否默认显示
            PurchaseOrder: false
        },
        {
            key:'propertyValue2',
            name:'自定义字段2',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'other',
            //是否默认显示
            PurchaseOrder: false
        },
        {
            key:'propertyValue3',
            name:'自定义字段3',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'other',
            //是否默认显示
            PurchaseOrder: false
        },
        {
            key:'propertyValue4',
            name:'自定义字段4',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'other',
            //是否默认显示
            PurchaseOrder: false
        },
        {
            key:'propertyValue5',
            name:'自定义字段5',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'other',
            //是否默认显示
            PurchaseOrder: false
        },
        {
            key:'addedName',
            name:'制单人',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'addedTime',
            name:'制单时间',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'updatedName',
            name:'最后修改人',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'updatedTime',
            name:'最后修改时间',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'approvedLoginName',
            name:'审批人',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'approvedTime',
            name:'审批时间',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'approveStatus',
            name:'审批状态',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'totalQuantity',
            name:'总数量',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'taxAllAmount',
            name:'总金额',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'taxAllAmountUp',
            name:'总金额大写',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'discountAmount',
            name:'优惠金额',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'aggregateAmount',
            name:'优惠后金额',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'aggregateAmountUp',
            name:'优惠后金额大写',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'invoiceAmount',
            name:'已到票金额',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'waitInvoiceAmount',
            name:'未到票金额',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'payAmount',
            name:'已付款金额',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        },
        {
            key:'waitPay',
            name:'未付款金额',
            //在哪些模板显示
            display: ['PurchaseOrder'],
            location:'top',
            //采购入库是否默认显示
            PurchaseOrder: true,
        }
    ]
}
//销售订单
export const saleDictionaries = {
    table:[
        {
            key: 'serialNumber',
            name:'序号',
            displayShow : false
        },
        {
            key:'prodCustomNo',
            name:'物品编号',
            displayShow : true
        },
        {
            key:'prodName',
            name:'物品名称',
            displayShow : true
        },
        {
            key:'firstCatName',
            name:'一级类目',
            displayShow : false
        },
        {
            key:'secondCatName',
            name:'二级类目',
            displayShow : false
        },
        {
            key:'thirdCatName',
            name:'三级类目',
            displayShow : false
        },
        {
            key:'batchNo',
            name:'批次号',
            displayShow : false
        },
        {
            key:'productionDate',
            name:'生产日期',
            displayShow : false
        },
        {
            key:'expirationDate',
            name:'到期日期',
            displayShow : false
        },
        {
            key:'descItem',
            name:'规格型号',
            displayShow : true
        },
        {
            key:'brand',
            name:'品牌',
            displayShow : false
        },
        {
            key:'thumbnailUri',
            name:'物品图片',
            displayShow : false
        },
        {
            key:'produceModel',
            name:'制造商型号',
            displayShow : false
        },
        {
            key:'minQuantity',
            name:'库存下限',
            displayShow : false
        },
        {
            key:'maxQuantity',
            name:'库存上限',
            displayShow : false
        },
        {
            key:'proBarCode',
            name:'商品条码',
            displayShow : false
        },
        {
            key:'propertyValue1',
            name:'自定义字段1',
            displayShow : false
        },
        {
            key:'propertyValue2',
            name:'自定义字段2',
            displayShow : false
        },
        {
            key:'propertyValue3',
            name:'自定义字段3',
            displayShow : false
        },
        {
            key:'propertyValue4',
            name:'自定义字段4',
            displayShow : false
        },
        {
            key:'propertyValue5',
            name:'自定义字段5',
            displayShow : false
        },
        {
            key:'unit',
            name:'单位',
            displayShow : true
        },
        {
            key:'quantity',
            name:'销售数量',
            displayShow : true
        },
        {
            key:'recUnit',
            name:'辅助单位',
            displayShow : false
        },
        {
            key:'recQuantity',
            name:'辅助销售数量',
            displayShow : false
        },
        {
            key:'unitConverter',
            name:'单位关系',
            displayShow : false
        },
        {
            key:'tax',
            name:'税额',
            displayShow : false
        },
        {
            key:'untaxedPrice',
            name:'未税单价',
            displayShow : false
        },
        {
            key:'untaxedAmount',
            name:'未税金额',
            displayShow : false
        },
        {
            key:'taxRate',
            name:'税率',
            displayShow : false
        },
        {
            key:'unitPrice',
            name:getCookie('currencyVipFlag') === 'true'?'单价':'含税单价',
            displayShow : true
        },
        {
            key:'currencyUnitPrice',
            name:'本币单价',
            displayShow : false
        },
        {
            key:'amount',
            name:getCookie('currencyVipFlag') === 'true'?'金额':'价税合计',
            displayShow : true
        },
        {
            key:'currencyAmount',
            name:'本币金额',
            displayShow : false
        },
        {
            key:'remarks',
            name:'备注',
            displayShow : true
        },
        {
            key:'deliveryDeadlineDate',
            name:'交货日期',
            displayShow : true
        },{
            key:'outNum',
            name:'已出库数量',
            displayShow : false
        },
        {
            key:'returnNum',
            name:'退货数量',
            displayShow : false
        },
        {
            key:'actualNum',
            name:'实际出库数量',
            displayShow : false
        },
        {
            key:'unOutNum',
            name:'未出库数量',
            displayShow : false
        }
    ],
    other:[
        {
            key:'displayBillNo',
            name:'销售单号',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            //采购入库是否默认显示
            SaleOrder: true,
        },
        {
            key:'warehouseName',
            name:'仓库',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            //采购入库是否默认显示
            SaleOrder: true,
        },
        {
            key:'ourName',
            name:'销售方',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            //采购入库是否默认显示
            SaleOrder: true,
        },
        {
            key:'ourContacterName',
            name:'销售方-联系人',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            //采购入库是否默认显示
            SaleOrder: true,
        },
        {
            key:'ourTelNo',
            name:'销售方-联系电话',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            SaleOrder: true,
        },
        {
            key:'customerName',
            name:'客户',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            SaleOrder: true,
        },
        {
            key:'customerContacterName',
            name:'客户-联系人',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            SaleOrder: true,
        },
        {
            key:'customerTelNo',
            name:'客户-联系电话',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            SaleOrder: true,
        },
        /* start*/
        {
            key:'customerLegalRepresentative',
            name:'客户-法人姓名',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            SaleOrder: true,
        },
        {
            key:'customerRegisteredAddress',
            name:'客户-注册地址',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            SaleOrder: true,
        },
        {
            key:'customerLicenseNo',
            name:'客户-社会统一信用代码',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            SaleOrder: true,
        },
        {
            key:'customerPropertyValue1',
            name:'客户-自定义字段1',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            SaleOrder: true,
        },
        {
            key:'customerPropertyValue2',
            name:'客户-自定义字段2',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            SaleOrder: true,
        },
        {
            key:'customerPropertyValue3',
            name:'客户-自定义字段3',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            SaleOrder: true,
        },
        {
            key:'customerPropertyValue4',
            name:'客户-自定义字段4',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            SaleOrder: true,
        },
        {
            key:'customerPropertyValue5',
            name:'客户-自定义字段5',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            SaleOrder: true,
        },
        /* end*/
        {
            key:'deliveryProvinceText',
            name:'交付地址',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'bottom',
            //是否默认显示
            SaleOrder: true,
        },
        {
            key:'saleOrderDate',
            name:'销售日期',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'bottom',
            //是否默认显示
            SaleOrder: true,
        },
        {
            key:'projectName',
            name:'项目',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'bottom',
            //是否默认显示
            SaleOrder: true
        },
        {
            key:'settlement',
            name:'结算方式',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'bottom',
            //是否默认显示
            SaleOrder: true
        },
        {
            key:'remarks',
            name:'备注',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'other',
            //是否默认显示
            SaleOrder: false
        },
        {
            key:'customerOrderNo',
            name:'客户订单号',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'other',
            //是否默认显示
            SaleOrder: false
        },
        {
            key:'currencyName',
            name:'币种',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'other',
            //是否默认显示
            SaleOrder: false
        },
        {
            key:'quotation',
            name:'牌价',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'other',
            //是否默认显示
            SaleOrder: false
        },
        {
            key:'addedName',
            name:'制单人',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            //采购入库是否默认显示
            SaleOrder: true,
        },
        {
            key:'addedTime',
            name:'制单时间',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            //采购入库是否默认显示
            SaleOrder: true,
        },
        {
            key:'updatedName',
            name:'最后修改人',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            //采购入库是否默认显示
            SaleOrder: true,
        },
        {
            key:'updatedTime',
            name:'最后修改时间',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            //采购入库是否默认显示
            SaleOrder: true,
        },
        {
            key:'approvedLoginName',
            name:'审批人',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            //采购入库是否默认显示
            SaleOrder: true,
        },
        {
            key:'approvedTime',
            name:'审批时间',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            //采购入库是否默认显示
            SaleOrder: true,
        },
        {
            key:'approveStatus',
            name:'审批状态',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            //采购入库是否默认显示
            SaleOrder: true,
        },
        {
            key:'totalQuantity',
            name:'总数量',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            //采购入库是否默认显示
            SaleOrder: true,
        },
        {
            key:'taxAllAmount',
            name:'总金额',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            //采购入库是否默认显示
            SaleOrder: true,
        },
        {
            key:'taxAllAmountUp',
            name:'总金额大写',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            //采购入库是否默认显示
            SaleOrder: true,
        },
        {
            key:'discountAmount',
            name:'优惠金额',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            //采购入库是否默认显示
            SaleOrder: true,
        },
        {
            key:'aggregateAmount',
            name:'优惠后金额',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            //采购入库是否默认显示
            SaleOrder: true,
        },
        {
            key:'aggregateAmountUp',
            name:'优惠后金额大写',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            //采购入库是否默认显示
            SaleOrder: true,
        },
        {
            key:'currencyAggregateAmount',
            name:'本币总金额',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            //采购入库是否默认显示
            SaleOrder: true,
        },
        {
            key:'currencyAggregateAmountUp',
            name:'本币总金额大写',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            //采购入库是否默认显示
            SaleOrder: true,
        },
        {
            key:'invoiceAmount',
            name:'已开票金额',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            //采购入库是否默认显示
            SaleOrder: true,
        },
        {
            key:'waitInvoiceAmount',
            name:'未开票金额',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            //采购入库是否默认显示
            SaleOrder: true,
        },
        {
            key:'payAmount',
            name:'已收款金额',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            //采购入库是否默认显示
            SaleOrder: true,
        },
        {
            key:'waitPay',
            name:'未收款金额',
            //在哪些模板显示
            display: ['SaleOrder'],
            location:'top',
            //采购入库是否默认显示
            SaleOrder: true,
        }
    ]
}
//报价订单
export const quotationDictionaries = {
    table:[
        {
            key: 'serialNumber',
            name:'序号',
            displayShow : false
        },
        {
            key:'prodCustomNo',
            name:'物品编号',
            displayShow : true
        },
        {
            key:'prodName',
            name:'物品名称',
            displayShow : true
        },
        {
            key:'firstCatName',
            name:'一级类目',
            displayShow : false
        },
        {
            key:'secondCatName',
            name:'二级类目',
            displayShow : false
        },
        {
            key:'thirdCatName',
            name:'三级类目',
            displayShow : false
        },
        {
            key:'descItem',
            name:'规格型号',
            displayShow : true
        },
        {
            key:'brand',
            name:'品牌',
            displayShow : false
        },
        {
            key:'thumbnailUri',
            name:'物品图片',
            displayShow : false
        },
        {
            key:'produceModel',
            name:'制造商型号',
            displayShow : false
        },
        {
            key:'minQuantity',
            name:'库存下限',
            displayShow : false
        },
        {
            key:'maxQuantity',
            name:'库存上限',
            displayShow : false
        },
        {
            key:'proBarCode',
            name:'商品条码',
            displayShow : false
        },
        {
            key:'unit',
            name:'单位',
            displayShow : true
        },
        {
            key:'quantity',
            name:'数量',
            displayShow : true
        },
        {
            key:'recQuantity',
            name:'基本单位数量',
            displayShow : true
        },
        {
            key:'unitConverter',
            name:'单位关系',
            displayShow : false
        },
        {
            key:'tax',
            name:'税额',
            displayShow : false
        },
        {
            key:'untaxedPrice',
            name:'未税单价',
            displayShow : false
        },
        {
            key:'untaxedAmount',
            name:'未税金额',
            displayShow : false
        },
        {
            key:'unitPrice',
            name:getCookie('currencyVipFlag') === 'true'?'单价':'含税单价',
            displayShow : true
        },
        {
            key:'currencyUnitPrice',
            name:'本币单价',
            displayShow : false
        },
        {
            key:'amount',
            name:getCookie('currencyVipFlag') === 'true'?'金额':'价税合计',
            displayShow : true
        },
        {
            key:'currencyAmount',
            name:'本币金额',
            displayShow : false
        },
        {
            key:'remarks',
            name:'备注',
            displayShow : true
        },
        {
            key:'deliveryDeadlineDate',
            name:'交货日期',
            displayShow : true
        }
    ],
    other:[
        {
            key:'displayBillNo',
            name:'报价单号',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'top',
            //采购入库是否默认显示
            QuotationOrder: true,
        },
        {
            key:'quotationDate',
            name:'报价日期',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'top',
            //采购入库是否默认显示
            QuotationOrder: true,
        },
        {
            key:'warehouseName',
            name:'仓库',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'top',
            //采购入库是否默认显示
            QuotationOrder: true,
        },
        {
            key:'customerName',
            name:'客户',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'top',
            QuotationOrder: true,
        },
        {
            key:'customerContacterName',
            name:'客户-联系人',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'top',
            QuotationOrder: true,
        },
        {
            key:'customerTelNo',
            name:'客户-联系电话',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'top',
            QuotationOrder: true,
        },
        /* start*/
        {
            key:'customerLegalRepresentative',
            name:'客户-法人姓名',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'top',
            QuotationOrder: true,
        },
        {
            key:'customerRegisteredAddress',
            name:'客户-注册地址',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'top',
            QuotationOrder: true,
        },
        {
            key:'customerLicenseNo',
            name:'客户-社会统一信用代码',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'top',
            QuotationOrder: true,
        },
        {
            key:'customerPropertyValue1',
            name:'客户-自定义字段1',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'top',
            QuotationOrder: true,
        },
        {
            key:'customerPropertyValue2',
            name:'客户-自定义字段2',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'top',
            QuotationOrder: true,
        },
        {
            key:'customerPropertyValue3',
            name:'客户-自定义字段3',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'top',
            QuotationOrder: true,
        },
        {
            key:'customerPropertyValue4',
            name:'客户-自定义字段4',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'top',
            QuotationOrder: true,
        },
        {
            key:'customerPropertyValue5',
            name:'客户-自定义字段5',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'top',
            QuotationOrder: true,
        },
        /* end*/
        {
            key:'deliveryProvinceText',
            name:'交付地址',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'bottom',
            //是否默认显示
            QuotationOrder: true,
        },
        {
            key:'settlement',
            name:'结算方式',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'bottom',
            //是否默认显示
            QuotationOrder: true
        },
        {
            key:'ourName',
            name:'销售方',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'bottom',
            //是否默认显示
            QuotationOrder: true
        },
        {
            key:'ourContacterName',
            name:'销售员',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'bottom',
            //是否默认显示
            QuotationOrder: true
        },
        {
            key:'ourTelNo',
            name:'销售员电话',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'bottom',
            //是否默认显示
            QuotationOrder: true
        },
        {
            key:'expiredDate',
            name:'报价有效期至',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'other',
            //是否默认显示
            QuotationOrder: false
        },
        {
            key:'remarks',
            name:'备注',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'other',
            //是否默认显示
            QuotationOrder: false
        },
        {
            key:'customerOrderNo',
            name:'客户订单号',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'other',
            //是否默认显示
            QuotationOrder: false
        },
        {
            key:'currencyName',
            name:'币种',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'other',
            //是否默认显示
            QuotationOrder: false
        },
        {
            key:'quotation',
            name:'牌价',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'other',
            //是否默认显示
            QuotationOrder: false
        },
        {
            key:'addedName',
            name:'制单人',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'top',
            //采购入库是否默认显示
            QuotationOrder: true,
        },
        {
            key:'addedTime',
            name:'制单时间',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'top',
            //采购入库是否默认显示
            QuotationOrder: true,
        },
        {
            key:'updatedName',
            name:'最后修改人',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'top',
            //采购入库是否默认显示
            QuotationOrder: true,
        },
        {
            key:'updatedTime',
            name:'最后修改时间',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'top',
            //采购入库是否默认显示
            QuotationOrder: true,
        },
        {
            key:'totalQuantity',
            name:'总数量',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'top',
            //采购入库是否默认显示
            QuotationOrder: true,
        },
        {
            key:'taxAllAmount',
            name:'总金额',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'top',
            //采购入库是否默认显示
            QuotationOrder: true,
        },
        {
            key:'taxAllAmountUp',
            name:'总金额大写',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'top',
            //采购入库是否默认显示
            QuotationOrder: true,
        },
        {
            key:'discountAmount',
            name:'优惠金额',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'top',
            //采购入库是否默认显示
            QuotationOrder: true,
        },
        {
            key:'aggregateAmount',
            name:'优惠后金额',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'top',
            //采购入库是否默认显示
            QuotationOrder: true,
        },
        {
            key:'aggregateAmountUp',
            name:'优惠后金额大写',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'top',
            //采购入库是否默认显示
            QuotationOrder: true,
        },
        {
            key:'currencyAggregateAmount',
            name:'本币总金额',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'top',
            //采购入库是否默认显示
            QuotationOrder: true,
        },
        {
            key:'currencyAggregateAmountUp',
            name:'本币总金额大写',
            //在哪些模板显示
            display: ['QuotationOrder'],
            location:'top',
            //采购入库是否默认显示
            QuotationOrder: true,
        }
    ]
}
//生产单字典
export const produceDictionaries = {
    productTable:[
        {
            key: 'serialNumber',
            name:'序号',
            displayShow : true
        },
        {
            key:'prodCustomNo',
            name:'物品编号',
            displayShow : true
        },
        {
            key:'prodName',
            name:'物品名称',
            displayShow : true
        },
        {
            key:'descItem',
            name:'规格型号',
            displayShow : true
        },
        {
            key:'unit',
            name:'单位',
            displayShow : false
        },
        {
            key:'brand',
            name:'品牌',
            displayShow : false
        },
        {
            key:'produceModel',
            name:'制造商型号',
            displayShow : false
        },
        {
            key:'bomCode',
            name:'BOM',
            displayShow : true
        },
        {
            key:'saleDisplayBillNo',
            name:'销售单号',
            displayShow : false
        },
        {
            key:'customerOrderNo',
            name:'客户订单号',
            displayShow : false
        },
        {
            key:'saleQuantity',
            name:'销售数量',
            displayShow : false
        },
        {
            key:'saleDeliveryDeadlineDate',
            name:'交付日期',
            displayShow : false
        },
        {
            key:'quantity',
            name:'计划生产数量',
            displayShow : true
        },
        {
            key:'expectCount',
            name:'投产数量',
            displayShow : false
        },
        {
            key:'finishCount',
            name:'已生产数量',
            displayShow : false
        },
        {
            key:'enterCount',
            name:'已入库数量',
            displayShow : false
        },
        {
            key:'unEnterCount',
            name:'待入库数量',
            displayShow : false
        },
        {
            key:'remarks',
            name:'备注',
            displayShow : true
        }
    ],
    materialTable:[
        {
            key: 'serialNumber',
            name:'序号',
            displayShow : true
        },
        {
            key:'prodCustomNo',
            name:'物品编号',
            displayShow : true
        },
        {
            key:'prodName',
            name:'物品名称',
            displayShow : true
        },
        {
            key:'descItem',
            name:'规格型号',
            displayShow : true
        },
        {
            key:'unit',
            name:'单位',
            displayShow : false
        },
        {
            key:'brand',
            name:'品牌',
            displayShow : false
        },
        {
            key:'produceModel',
            name:'制造商型号',
            displayShow : false
        },
        {
            key:'warehouseName',
            name:'仓库',
            displayShow : false
        },
        {
            key:'supplierName',
            name:'供应商',
            displayShow : false
        },
        {
            key:'unitConsump',
            name:'单位用量',
            displayShow : false
        },
        {
            key:'quantity',
            name:'计划消耗数量',
            displayShow : true
        },
        {
            key:'receiveCount',
            name:'领用数量',
            displayShow : false
        },
        {
            key:'rejectCount',
            name:'退料数量',
            displayShow : false
        },
        {
            key:'totalReceiveCount',
            name:'累计领用量',
            displayShow : false
        },
        {
            key:'remarks',
            name:'备注',
            displayShow : true
        }
    ],
    other:[
        {
            key:'billNo',
            name:'生产单号',
            //在哪些模板显示
            display: ['ProduceOrder'],
            location:'top',
            //采购入库是否默认显示
            ProduceOrder: true,
        },
        {
            key:'orderDate',
            name:'单据日期',
            //在哪些模板显示
            display: ['ProduceOrder'],
            location:'top',
            //采购入库是否默认显示
            ProduceOrder: true,
        },
        {
            key:'departmentName',
            name:'生产部门',
            //在哪些模板显示
            display: ['ProduceOrder'],
            location:'top',
            //采购入库是否默认显示
            ProduceOrder: true,
        },
        {
            key:'employeeName',
            name:'生产人',
            //在哪些模板显示
            display: ['ProduceOrder'],
            location:'top',
            //采购入库是否默认显示
            ProduceOrder: true,
        },
        {
            key:'orderStatus',
            name:'状态',
            //在哪些模板显示
            display: ['ProduceOrder'],
            location:'top',
            //采购入库是否默认显示
            ProduceOrder: true,
        },
        {
            key:'property_value1',
            name:'自定义字段1',
            //在哪些模板显示
            display: ['ProduceOrder'],
            location:'top',
            //采购入库是否默认显示
            ProduceOrder: true,
        },
        {
            key:'property_value2',
            name:'自定义字段2',
            //在哪些模板显示
            display: ['ProduceOrder'],
            location:'top',
            //采购入库是否默认显示
            ProduceOrder: true,
        },
        {
            key:'property_value3',
            name:'自定义字段3',
            //在哪些模板显示
            display: ['ProduceOrder'],
            location:'top',
            //采购入库是否默认显示
            ProduceOrder: true,
        },
        {
            key:'property_value4',
            name:'自定义字段4',
            //在哪些模板显示
            display: ['ProduceOrder'],
            location:'top',
            //采购入库是否默认显示
            ProduceOrder: true,
        },
        {
            key:'property_value5',
            name:'自定义字段5',
            //在哪些模板显示
            display: ['ProduceOrder'],
            location:'top',
            //采购入库是否默认显示
            ProduceOrder: true,
        },
        {
            key:'planeQuantity',
            name:'成品计划总数量',
            //在哪些模板显示
            display: ['ProduceOrder'],
            location:'top',
            //采购入库是否默认显示
            ProduceOrder: true,
        },
        {
            key:'produceType',
            name:'生产类型',
            //在哪些模板显示
            display: ['ProduceOrder'],
            location:'top',
            //采购入库是否默认显示
            ProduceOrder: true,
        },
        {
            key:'projectName',
            name:'项目',
            //在哪些模板显示
            display: ['ProduceOrder'],
            location:'top',
            //采购入库是否默认显示
            ProduceOrder: true,
        },
        {
            key:'supplierName',
            name:'供应商',
            //在哪些模板显示
            display: ['ProduceOrder'],
            location:'top',
            //采购入库是否默认显示
            ProduceOrder: true,
        },
        {
            key:'contacterName',
            name:'联系人',
            //在哪些模板显示
            display: ['ProduceOrder'],
            location:'top',
            //采购入库是否默认显示
            ProduceOrder: true,
        },
        {
            key:'contacterTelNo',
            name:'联系电话',
            //在哪些模板显示
            display: ['ProduceOrder'],
            location:'top',
            //采购入库是否默认显示
            ProduceOrder: true,
        },
        {
            key:'produceQuantity',
            name:'成品生产总数量',
            //在哪些模板显示
            display: ['ProduceOrder'],
            location:'top',
            //采购入库是否默认显示
            ProduceOrder: true,
        },
        {
            key:'inQuantity',
            name:'成品入库总数量',
            //在哪些模板显示
            display: ['ProduceOrder'],
            location:'top',
            //采购入库是否默认显示
            ProduceOrder: true,
        },
        {
            key:'materialPlaneQuantity',
            name:'原料计划总数量',
            //在哪些模板显示
            display: ['ProduceOrder'],
            location:'top',
            //采购入库是否默认显示
            ProduceOrder: true,
        },
        {
            key:'materialTotalQuantity',
            name:'原料累计总领用数量',
            //在哪些模板显示
            display: ['ProduceOrder'],
            location:'top',
            //采购入库是否默认显示
            ProduceOrder: true,
        },
        {
            key:'addedName',
            name:'制单人',
            //在哪些模板显示
            display: ['ProduceOrder'],
            location:'top',
            //采购入库是否默认显示
            ProduceOrder: true,
        },
        {
            key:'addedTime',
            name:'制单时间',
            //在哪些模板显示
            display: ['ProduceOrder'],
            location:'top',
            //采购入库是否默认显示
            ProduceOrder: true,
        },
        {
            key:'updatedName',
            name:'最后修改人',
            //在哪些模板显示
            display: ['ProduceOrder'],
            location:'top',
            //采购入库是否默认显示
            ProduceOrder: true,
        },
        {
            key:'updatedTime',
            name:'最后修改时间',
            //在哪些模板显示
            display: ['ProduceOrder'],
            location:'top',
            //采购入库是否默认显示
            ProduceOrder: true,
        }
    ]
}
//委外加工字典
export const subcontractDictionaries = {
    productTable:[
        {
            key: 'serialNumber',
            name:'序号',
            displayShow : true
        },
        {
            key:'prodCustomNo',
            name:'物品编号',
            displayShow : true
        },
        {
            key:'prodName',
            name:'物品名称',
            displayShow : true
        },
        {
            key:'descItem',
            name:'规格型号',
            displayShow : true
        },
        {
            key:'unit',
            name:'单位',
            displayShow : false
        },
        {
            key:'brand',
            name:'品牌',
            displayShow : false
        },
        {
            key:'produceModel',
            name:'制造商型号',
            displayShow : false
        },
        {
            key:'batchNo',
            name:'批次号',
            displayShow : false
        },
        {
            key:'productionDate',
            name:'生产日期',
            displayShow : false
        },
        {
            key:'expirationDate',
            name:'到期日期',
            displayShow : false
        },
        {
            key:'quantity',
            name:'入库数量',
            displayShow : true
        },
        {
            key:'unitCost',
            name:'单位成本',
            displayShow : false
        },
        {
            key:'amount',
            name:'金额',
            displayShow : true
        },
        {
            key:'allocatedPrice',
            name:'分摊后单价',
            displayShow : true
        },
        {
            key:'allocatedAmount',
            name:'分摊后金额',
            displayShow : true
        }
    ],
    materialTable:[
        {
            key: 'serialNumber',
            name:'序号',
            displayShow : true
        },
        {
            key:'prodCustomNo',
            name:'物品编号',
            displayShow : true
        },
        {
            key:'prodName',
            name:'物品名称',
            displayShow : true
        },
        {
            key:'descItem',
            name:'规格型号',
            displayShow : true
        },
        {
            key:'unit',
            name:'单位',
            displayShow : false
        },
        {
            key:'brand',
            name:'品牌',
            displayShow : false
        },
        {
            key:'produceModel',
            name:'制造商型号',
            displayShow : false
        },
        {
            key:'batchNo',
            name:'批次号',
            displayShow : false
        },
        {
            key:'productionDate',
            name:'生产日期',
            displayShow : false
        },
        {
            key:'expirationDate',
            name:'到期日期',
            displayShow : false
        },
        {
            key:'quantity',
            name:'消耗数量',
            displayShow : true
        },
        {
            key:'unitCost',
            name:'单位成本',
            displayShow : true
        },
        {
            key:'amount',
            name:'金额',
            displayShow : true
        }
    ],
    other:[
        {
            key:'billNo',
            name:'加工单号',
            //在哪些模板显示
            display: ['Subcontract'],
            location:'top',
            //采购入库是否默认显示
            Subcontract: true,
        },
        {
            key:'orderDate',
            name:'录单日期',
            //在哪些模板显示
            display: ['Subcontract'],
            location:'top',
            //采购入库是否默认显示
            Subcontract: true,
        },
        {
            key:'remindDate',
            name:'提醒日期',
            //在哪些模板显示
            display: ['Subcontract'],
            location:'top',
            //采购入库是否默认显示
            Subcontract: true,
        },
        {
            key:'warehouseNameIn',
            name:'入库仓库',
            //在哪些模板显示
            display: ['Subcontract'],
            location:'top',
            //采购入库是否默认显示
            Subcontract: true,
        },
        {
            key:'inState',
            name:'入库状态',
            //在哪些模板显示
            display: ['Subcontract'],
            location:'top',
            //采购入库是否默认显示
            Subcontract: true,
        },
        {
            key:'warehouseNameOut',
            name:'出库仓库',
            //在哪些模板显示
            display: ['Subcontract'],
            location:'top',
            //采购入库是否默认显示
            Subcontract: true,
        },
        {
            key:'outState',
            name:'出库状态',
            //在哪些模板显示
            display: ['Subcontract'],
            location:'top',
            //采购入库是否默认显示
            Subcontract: true,
        },

        {
            key:'supplierName',
            name:'供应商',
            //在哪些模板显示
            display: ['Subcontract'],
            location:'top',
            //采购入库是否默认显示
            Subcontract: true,
        },
        {
            key:'supplierContacterName',
            name:'供应商联系人',
            //在哪些模板显示
            display: ['Subcontract'],
            location:'top',
            //采购入库是否默认显示
            Subcontract: true,
        },
        {
            key:'supplierMobile',
            name:'供应商联系电话',
            //在哪些模板显示
            display: ['Subcontract'],
            location:'top',
            //采购入库是否默认显示
            Subcontract: true,
        },
        {
            key:'projectName',
            name:'项目',
            //在哪些模板显示
            display: ['Subcontract'],
            location:'top',
            //采购入库是否默认显示
            Subcontract: true,
        },
        {
            key:'ourContacterName',
            name:'经办人',
            //在哪些模板显示
            display: ['Subcontract'],
            location:'top',
            //采购入库是否默认显示
            Subcontract: true,
        },
        {
            key:'remark',
            name:'备注',
            //在哪些模板显示
            display: ['Subcontract'],
            location:'top',
            //采购入库是否默认显示
            Subcontract: true,
        },
        {
            key:'productQuantity',
            name:'成品总数量',
            //在哪些模板显示
            display: ['Subcontract'],
            location:'top',
            //采购入库是否默认显示
            Subcontract: true,
        },
        {
            key:'productAmount',
            name:'成品总成本',
            //在哪些模板显示
            display: ['Subcontract'],
            location:'top',
            //采购入库是否默认显示
            Subcontract: true,
        },
        {
            key:'productProcessCost',
            name:'加工费',
            //在哪些模板显示
            display: ['Subcontract'],
            location:'top',
            //采购入库是否默认显示
            Subcontract: true,
        },
        {
            key:'productAllocatedAmount',
            name:'成品总金额',
            //在哪些模板显示
            display: ['Subcontract'],
            location:'top',
            //采购入库是否默认显示
            Subcontract: true,
        },
        {
            key:'materialQuantity',
            name:'原料总数量',
            //在哪些模板显示
            display: ['Subcontract'],
            location:'top',
            //采购入库是否默认显示
            Subcontract: true,
        },
        {
            key:'materialAmount',
            name:'原料总成本',
            //在哪些模板显示
            display: ['Subcontract'],
            location:'top',
            //采购入库是否默认显示
            Subcontract: true,
        },
        {
            key:'addedName',
            name:'制单人',
            //在哪些模板显示
            display: ['Subcontract'],
            location:'top',
            //采购入库是否默认显示
            Subcontract: true,
        },
        {
            key:'addedTime',
            name:'制单时间',
            //在哪些模板显示
            display: ['Subcontract'],
            location:'top',
            //采购入库是否默认显示
            Subcontract: true,
        },
        {
            key:'updatedName',
            name:'最后修改人',
            //在哪些模板显示
            display: ['Subcontract'],
            location:'top',
            //采购入库是否默认显示
            Subcontract: true,
        },
        {
            key:'updatedTime',
            name:'最后修改时间',
            //在哪些模板显示
            display: ['Subcontract'],
            location:'top',
            //采购入库是否默认显示
            Subcontract: true,
        }
    ]
}
//请购单
export const requisitionDictionaries = {
    table:[
        {
            key: 'serialNumber',
            name:'序号',
            displayShow : false
        },
        {
            key:'prodCustomNo',
            name:'物品编号',
            displayShow : true
        },
        {
            key:'prodName',
            name:'物品名称',
            displayShow : true
        },
        {
            key:'firstCatName',
            name:'一级类目',
            displayShow : false
        },
        {
            key:'secondCatName',
            name:'二级类目',
            displayShow : false
        },
        {
            key:'thirdCatName',
            name:'三级类目',
            displayShow : false
        },
        {
            key:'descItem',
            name:'规格型号',
            displayShow : true
        },
        {
            key:'brand',
            name:'品牌',
            displayShow : false
        },
        {
            key:'thumbnailUri',
            name:'物品图片',
            displayShow : false
        },
        {
            key:'produceModel',
            name:'制造商型号',
            displayShow : false
        },
        {
            key:'minQuantity',
            name:'库存下限',
            displayShow : false
        },
        {
            key:'maxQuantity',
            name:'库存上限',
            displayShow : false
        },
        {
            key:'proBarCode',
            name:'商品条码',
            displayShow : false
        },
        {
            key:'propertyValue1',
            name:'自定义字段1',
            displayShow : false
        },
        {
            key:'propertyValue2',
            name:'自定义字段2',
            displayShow : false
        },
        {
            key:'propertyValue3',
            name:'自定义字段3',
            displayShow : false
        },
        {
            key:'propertyValue4',
            name:'自定义字段4',
            displayShow : false
        },
        {
            key:'propertyValue5',
            name:'自定义字段5',
            displayShow : false
        },
        {
            key:'unit',
            name:'单位',
            displayShow : true
        },
        {
            key:'quantity',
            name:'请购数量',
            displayShow : true
        },
        {
            key:'unitPrice',
            name:'预计单价',
            displayShow : true
        },
        {
            key:'amount',
            name:'预计金额',
            displayShow : true
        },
        {
            key:'remarks',
            name:'备注',
            displayShow : true
        },
        {
            key:'deliveryDeadlineDate',
            name:'期待交付日期',
            displayShow : false
        },
        {
            key:'purpose',
            name:'用途',
            displayShow : false
        }
    ],
    other:[
        {
            key:'displayBillNo',
            name:'请购单号',
            //在哪些模板显示
            display: ['RequisitionOrder'],
            location:'top',
            //采购入库是否默认显示
            RequisitionOrder: true,
        },
        {
            key:'requestDate',
            name:'请购日期',
            //在哪些模板显示
            display: ['RequisitionOrder'],
            location:'top',
            //采购入库是否默认显示
            RequisitionOrder: true,
        },
        {
            key:'departmentName',
            name:'请购部门',
            //在哪些模板显示
            display: ['RequisitionOrder'],
            location:'top',
            //采购入库是否默认显示
            RequisitionOrder: true,
        },
        {
            key:'employeeName',
            name:'请购人',
            //在哪些模板显示
            display: ['RequisitionOrder'],
            location:'top',
            //采购入库是否默认显示
            RequisitionOrder: true,
        },
        {
            key:'purchaseStatus',
            name:'采购状态',
            //在哪些模板显示
            display: ['RequisitionOrder'],
            location:'top',
            //采购入库是否默认显示
            RequisitionOrder: true,
        },
        {
            key:'projectName',
            name:'项目',
            //在哪些模板显示
            display: ['RequisitionOrder'],
            location:'top',
            //采购入库是否默认显示
            RequisitionOrder: true,
        },
        {
            key:'requestDesc',
            name:'请购说明',
            //在哪些模板显示
            display: ['RequisitionOrder'],
            location:'top',
            //采购入库是否默认显示
            RequisitionOrder: true,
        },
        {
            key:'property_value1',
            name:'自定义字段1',
            //在哪些模板显示
            display: ['RequisitionOrder'],
            location:'other',
            //是否默认显示
            RequisitionOrder: false
        },
        {
            key:'property_value2',
            name:'自定义字段2',
            //在哪些模板显示
            display: ['RequisitionOrder'],
            location:'other',
            //是否默认显示
            RequisitionOrder: false
        },
        {
            key:'property_value3',
            name:'自定义字段3',
            //在哪些模板显示
            display: ['RequisitionOrder'],
            location:'other',
            //是否默认显示
            RequisitionOrder: false
        },
        {
            key:'property_value4',
            name:'自定义字段4',
            //在哪些模板显示
            display: ['RequisitionOrder'],
            location:'other',
            //是否默认显示
            RequisitionOrder: false
        },
        {
            key:'property_value5',
            name:'自定义字段5',
            //在哪些模板显示
            display: ['RequisitionOrder'],
            location:'other',
            //是否默认显示
            RequisitionOrder: false
        },
        {
            key:'addedName',
            name:'制单人',
            //在哪些模板显示
            display: ['RequisitionOrder'],
            location:'top',
            //采购入库是否默认显示
            RequisitionOrder: true,
        },
        {
            key:'addedTime',
            name:'制单时间',
            //在哪些模板显示
            display: ['RequisitionOrder'],
            location:'top',
            //采购入库是否默认显示
            RequisitionOrder: true,
        },
        {
            key:'updatedName',
            name:'最后修改人',
            //在哪些模板显示
            display: ['RequisitionOrder'],
            location:'top',
            //采购入库是否默认显示
            RequisitionOrder: true,
        },
        {
            key:'updatedTime',
            name:'最后修改时间',
            //在哪些模板显示
            display: ['RequisitionOrder'],
            location:'top',
            //采购入库是否默认显示
            RequisitionOrder: true,
        },
        {
            key:'approvedLoginName',
            name:'审批人',
            //在哪些模板显示
            display: ['RequisitionOrder'],
            location:'top',
            //采购入库是否默认显示
            RequisitionOrder: true,
        },
        {
            key:'approvedTime',
            name:'审批时间',
            //在哪些模板显示
            display: ['RequisitionOrder'],
            location:'top',
            //采购入库是否默认显示
            RequisitionOrder: true,
        },
        {
            key:'approveStatus',
            name:'审批状态',
            //在哪些模板显示
            display: ['RequisitionOrder'],
            location:'top',
            //采购入库是否默认显示
            RequisitionOrder: true,
        },
        {
            key:'totalQuantity',
            name:'总数量',
            //在哪些模板显示
            display: ['RequisitionOrder'],
            location:'top',
            //采购入库是否默认显示
            RequisitionOrder: true,
        },
        {
            key:'taxAllAmount',
            name:'总金额',
            //在哪些模板显示
            display: ['RequisitionOrder'],
            location:'top',
            //采购入库是否默认显示
            RequisitionOrder: true,
        }
    ]
}
//生产工单
export const produceWorkDictionaries = {
    table:[
        {
            key: 'orderNo',
            name:'顺序号',
            displayShow : true
        },
        {
            key:'processCode',
            name:'工序编号',
            displayShow : false
        },
        {
            key:'processName',
            name:'工序名称',
            displayShow : true
        },
        {
            key:'processStatus',
            name:'状态',
            displayShow : true
        },
        {
            key:'expectStartDate',
            name:'计划开始时间',
            displayShow : true
        },
        {
            key:'expectEndDate',
            name:'计划结束时间',
            displayShow : false
        },
        {
            key:'actualStartDate',
            name:'实际开始时间',
            displayShow : false
        },
        {
            key:'actualEndDate',
            name:'实际结束时间',
            displayShow : false
        },
        {
            key:'expectCount',
            name:'计划产量',
            displayShow : true
        },
        {
            key:'reportCount',
            name:'完工数量',
            displayShow : false
        },
        {
            key:'finishCount',
            name:'良品数量',
            displayShow : true
        },
        {
            key:'scrapCount',
            name:'不良数量',
            displayShow : false
        },
        {
            key:'yieldRate',
            name:'良品率',
            displayShow : false
        },
        {
            key:'caName',
            name:'工作中心',
            displayShow : true
        },
        {
            key:'officerName',
            name:'负责人',
            displayShow : true
        }
    ],
    other:[
        {
            key:'billNo',
            name:'工单编号',
            //在哪些模板显示
            display: ['ProduceWork'],
            location:'top',
            ProduceWork: true,
        },
        {
            key:'sheetName',
            name:'工单名称',
            //在哪些模板显示
            display: ['ProduceWork'],
            location:'top',
            ProduceWork: true,
        },
        {
            key:'displaySaleBillNo',
            name:'销售单号',
            //在哪些模板显示
            display: ['ProduceWork'],
            location:'top',
            ProduceWork: true,
        },
        {
            key:'saleCustomerOrderNo',
            name:'客户订单号',
            //在哪些模板显示
            display: ['ProduceWork'],
            location:'top',
            ProduceWork: true,
        },
        {
            key:'officerName',
            name:'负责人',
            //在哪些模板显示
            display: ['ProduceWork'],
            location:'top',
            ProduceWork: true,
        },
        {
            key:'sheetStatus',
            name:'状态',
            //在哪些模板显示
            display: ['ProduceWork'],
            location:'top',
            ProduceWork: true,
        },
        {
            key:'expectStartDate',
            name:'计划开始时间',
            //在哪些模板显示
            display: ['ProduceWork'],
            location:'top',
            ProduceWork: true,
        },
        {
            key:'expectEndDate',
            name:'计划结束时间',
            //在哪些模板显示
            display: ['ProduceWork'],
            location:'top',
            ProduceWork: true,
        },
        {
            key:'actualStartDate',
            name:'实际开始时间',
            //在哪些模板显示
            display: ['ProduceWork'],
            location:'top',
            ProduceWork: true,
        },
        {
            key:'actualEndDate',
            name:'实际结束时间',
            //在哪些模板显示
            display: ['ProduceWork'],
            location:'top',
            ProduceWork: true,
        },
        {
            key:'fkProduceNo',
            name:'上游单号',
            //在哪些模板显示
            display: ['ProduceWork'],
            location:'top',
            ProduceWork: true,
        },
        {
            key:'prodDisplayCode',
            name:'成品编号',
            //在哪些模板显示
            display: ['ProduceWork'],
            location:'top',
            ProduceWork: true,
        },
        {
            key:'prodName',
            name:'成品名称',
            //在哪些模板显示
            display: ['ProduceWork'],
            location:'top',
            ProduceWork: true,
        },
        {
            key:'descItem',
            name:'成品-规格型号',
            //在哪些模板显示
            display: ['ProduceWork'],
            location:'top',
            ProduceWork: true,
        },
        {
            key:'prodBrand',
            name:'成品-品牌',
            //在哪些模板显示
            display: ['ProduceWork'],
            location:'top',
            ProduceWork: true,
        },
        {
            key:'produceModel',
            name:'成品-制造商型号',
            //在哪些模板显示
            display: ['ProduceWork'],
            location:'top',
            ProduceWork: true,
        },
        {
            key:'expectCount',
            name:'成品-计划产量',
            //在哪些模板显示
            display: ['ProduceWork'],
            location:'top',
            ProduceWork: true,
        },
        {
            key:'finishCount',
            name:'成品-良品数量',
            //在哪些模板显示
            display: ['ProduceWork'],
            location:'top',
            ProduceWork: true,
        },
        {
            key:'scrapCount',
            name:'成品-不良数量',
            //在哪些模板显示
            display: ['ProduceWork'],
            location:'top',
            ProduceWork: true,
        },
        {
            key:'yieldRate',
            name:'成品-良品率',
            //在哪些模板显示
            display: ['ProduceWork'],
            location:'top',
            ProduceWork: true,
        },
        {
            key:'remarks',
            name:'备注',
            //在哪些模板显示
            display: ['ProduceWork'],
            location:'top',
            ProduceWork: true,
        },
        {
            key:'addedName',
            name:'制单人',
            //在哪些模板显示
            display: ['ProduceWork'],
            location:'top',
            //采购入库是否默认显示
            ProduceWork: true,
        },
        {
            key:'addedTime',
            name:'制单时间',
            //在哪些模板显示
            display: ['ProduceWork'],
            location:'top',
            //采购入库是否默认显示
            ProduceWork: true,
        },
        {
            key:'updatedName',
            name:'最后修改人',
            //在哪些模板显示
            display: ['ProduceWork'],
            location:'top',
            //采购入库是否默认显示
            ProduceWork: true,
        },
        {
            key:'updatedTime',
            name:'最后修改时间',
            //在哪些模板显示
            display: ['ProduceWork'],
            location:'top',
            //采购入库是否默认显示
            ProduceWork: true,
        },
    ]
}

