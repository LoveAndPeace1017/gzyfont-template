const express = require('express');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const TraceSession = require('../../../../lib/session/trace');
const Constants = require('../../../../lib/constants');
const DataFilter = require('../../../../lib/utils/DataFilter');
const Decimal = require('decimal.js');
const Decimals = require('../../../../lib/utils/Decimal');
const PropertyFilter = require('../../../../lib/utils/PropertyFilter');


const map = {
    prodAbstract: {
        label: "node.sale.prodAbstract",
        width: Constants.TABLE_COL_WIDTH.DEFAULT
    },
    taxAllAmount: {
        label: "node.sale.taxAllAmount",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
    },
    discountAmount: {
        label: "node.sale.discountAmount",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
    },
    aggregateAmount: {
        label: "node.sale.aggregateAmount",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
    },
    payAmount: {
        label: "node.sale.payAmount",
        width: Constants.TABLE_COL_WIDTH.DEFAULT
    },
    invoiceAmount: {
        label: "node.sale.invoiceAmount",
        width: Constants.TABLE_COL_WIDTH.DEFAULT
    },
    state: {
        label: "node.sale.state",
        width: Constants.TABLE_COL_WIDTH.ACCEPT_STATUS
    },
    paymentState: {
        label: "node.sale.paymentState",
        width: Constants.TABLE_COL_WIDTH.ACCEPT_STATUS
    },
    invoiceState: {
        label: "node.sale.invoiceState",
        width: Constants.TABLE_COL_WIDTH.ACCEPT_STATUS
    },
    interchangeState: {
        label: "node.sale.interchangeState",
        width: Constants.TABLE_COL_WIDTH.ACCEPT_STATUS
    },
    approveStatus: {
        label: "node.sale.approveStatus",
        width: Constants.TABLE_COL_WIDTH.ACCEPT_STATUS
    },
    projectName: {
        label: "node.sale.projectName",
        width: Constants.TABLE_COL_WIDTH.DEFAULT
    },
    deliveryAddress: {
        label: "node.sale.deliveryAddress",
        width: Constants.TABLE_COL_WIDTH.ADDRESS
    },
    settlement: {
        label: "node.sale.settlement",
        width: Constants.TABLE_COL_WIDTH.DEFAULT
    },
    customerOrderNo: {
        label: "node.sale.customerOrderNo",
        width: Constants.TABLE_COL_WIDTH.DEFAULT
    },
    remarks: {
        label: "node.sale.remarks",
    },
    customerContacterName: {
        label: "node.sale.customerContacterName",
        width: Constants.TABLE_COL_WIDTH.PERSON
    },
    customerTelNo: {
        label: "node.sale.customerTelNo",
        width: Constants.TABLE_COL_WIDTH.TEL
    },
    ourContacterName: {
        label: "node.sale.ourContacterName",
        width: Constants.TABLE_COL_WIDTH.DEFAULT
    },
    ourTelNo: {
        label: "node.sale.ourTelNo",
        width: Constants.TABLE_COL_WIDTH.TEL
    },
    displayBillNo:{
        label: 'node.sale.displayBillNo',
        width: Constants.TABLE_COL_WIDTH.NO,
    },
    customerName:{
        label: 'node.sale.customerName',
        width: Constants.TABLE_COL_WIDTH.NO,
    },
    saleOrderDate:{
        label: 'node.sale.saleOrderDate',
        width: Constants.TABLE_COL_WIDTH.NO,
    },
    currencyName:{
        label: 'node.sale.currencyName',
        width: Constants.TABLE_COL_WIDTH.NO,
    },
    currencyAggregateAmount:{
        label: 'node.sale.currencyAggregateAmount',
        width: Constants.TABLE_COL_WIDTH.NO,
    },
};

const outType = {
    0:'node.inventory.out.outTypeOption1',
    1:'node.inventory.out.outTypeOption2',
    2:'node.inventory.out.outTypeOption3',
    3:'node.inventory.out.outTypeOption4',
    4:'node.inventory.out.outTypeOption6',
    5:'node.inventory.out.outTypeOption5',
    6:'node.inventory.out.outTypeOption7',
    7:'node.inventory.out.outTypeOption8',
};

function dealTableConfig(tags,approveModuleFlag) {
    let newList = [];

    newList.push({
        fieldName: "displayBillNo",
        label: "node.sale.displayBillNo",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:true,
        visibleFlag: true,
        originVisibleFlag: true,
    },{
        fieldName: "saleOrderDate",
        label: "node.sale.saleOrderDate",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:true,
        visibleFlag: true,
        originVisibleFlag: true,
        totalFlag: true
    },{
        fieldName: "prodAbstract",
        label: "node.sale.prodAbstract",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:null,
        visibleFlag: true,
        originVisibleFlag: true,
        totalFlag: true
    },{
        fieldName: "currencyName",
        label: "node.sale.currencyName",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:null,
        visibleFlag: false,
        originVisibleFlag: false,
        totalFlag: true
    },{
        fieldName: "aggregateAmount",
        label: "node.sale.aggregateAmount",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:null,
        visibleFlag: true,
        originVisibleFlag: true,
        totalFlag: true
    },{
        fieldName: "currencyAggregateAmount",
        label: "node.sale.currencyAggregateAmount",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:null,
        visibleFlag: false,
        originVisibleFlag: false,
        totalFlag: true
    },{
        fieldName: "discountAmount",
        label: "node.sale.discountAmount",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:null,
        visibleFlag: false,
        originVisibleFlag: false,
        totalFlag: true
    },{
        fieldName: "taxAllAmount",
        label: "node.sale.taxAllAmount",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:null,
        visibleFlag: true,
        originVisibleFlag: true,
        totalFlag: true
    },{
        fieldName: "payAmount",
        label: "node.sale.payAmount",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:null,
        visibleFlag: true,
        originVisibleFlag: true,
        totalFlag: true
    },{
        fieldName: "invoiceAmount",
        label: "node.sale.invoiceAmount",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:null,
        visibleFlag: true,
        originVisibleFlag: true,
        totalFlag: true
    },{
        fieldName: "state",
        label: "node.sale.state",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:null,
        visibleFlag: true,
        originVisibleFlag: true,
        totalFlag: true
    },{
        fieldName: "invoiceState",
        label: "node.sale.invoiceState",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:null,
        visibleFlag: true,
        originVisibleFlag: true,
        totalFlag: true
    },{
        fieldName: "paymentState",
        label: "node.sale.paymentState",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:null,
        visibleFlag: true,
        originVisibleFlag: true,
        totalFlag: true
    },{
        fieldName: "projectName",
        label: "node.sale.projectName",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:null,
        visibleFlag: false,
        originVisibleFlag: false,
        totalFlag: true
    },{
        fieldName: "deliveryAddress",
        label: "node.sale.deliveryAddress",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:null,
        visibleFlag: false,
        originVisibleFlag: false,
        totalFlag: true
    },{
        fieldName: "settlement",
        label: "node.sale.settlement",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:null,
        visibleFlag: false,
        originVisibleFlag: false,
        totalFlag: true
    },{
        fieldName: "customerOrderNo",
        label: "node.sale.customerOrderNo",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:null,
        visibleFlag: false,
        originVisibleFlag: false,
        totalFlag: true
    },{
        fieldName: "customerContacterName",
        label: "node.sale.customerContacterName",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:null,
        visibleFlag: false,
        originVisibleFlag: false,
        totalFlag: true
    },{
        fieldName: "customerTelNo",
        label: "node.sale.customerTelNo",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:null,
        visibleFlag: false,
        originVisibleFlag: false,
        totalFlag: true
    },{
        fieldName: "ourContacterName",
        label: "node.sale.ourContacterName",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:null,
        visibleFlag: false,
        originVisibleFlag: false,
        totalFlag: true
    },{
        fieldName: "ourTelNo",
        label: "node.sale.ourTelNo",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:null,
        visibleFlag: false,
        originVisibleFlag: false,
        totalFlag: true
    });

    if(approveModuleFlag){
        newList.push({
            fieldName: "approveStatus",
            label: "node.sale.approveStatus",
            width: Constants.TABLE_COL_WIDTH.DEFAULT,
            cannotEdit:null,
            visibleFlag: true,
            originVisibleFlag: true,
            totalFlag: true
        });
    }

    tags.forEach((item)=>{
        newList.push({
            fieldName: item.mappingName,
            label: item.propName,
            width: Constants.TABLE_COL_WIDTH.DEFAULT,
            cannotEdit:null,
            visibleFlag: false,
            originVisibleFlag: false,
        });
    });

    return newList;
}

/* 销售列表. */
router.get('/list', function(req, res, next) {
    const params = req.query;
    params.perPage = params.perPage ? parseInt(params.perPage) : Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const traceSession = TraceSession.get(req, res);
    let url = `/openTrace/${traceSession.userIdEnc}/saleorder/list`;
    backend.post(url, params, req, res, function(data) {
        if (data && data.retCode === "0") {
            data.tags = PropertyFilter.initCustomTags(data.tags);
            let customMap = DataFilter.dealCustomField(data.tags);
            let list = data.data;
            list = list.map((item, index) => {
                item.key = item.billNo;
                item.serial = index+1;
                let propertyValues = PropertyFilter.initCustomProperties(data.tags, item.propertyValues);
                item = {...item, ...propertyValues};
                return item;
            });

            let tableConfigList = dealTableConfig(data.tags,data.approveModuleFlag || 0);

            res.json({
                retCode: 0,
                list: list,
                filterConfigList: [],
                tableConfigList: tableConfigList,
                totalAmount: data.totalAmount,
                pageAmount: data.pageAmount,
                pageCurrencyAmount: data.pageCurrencyAmount,
                totalCurrencyAmount: data.totalCurrencyAmount,
                tags: data.tags,
                pagination: {
                    total: data.count,
                    current: params.page,
                    pageSize: params.perPage
                }
            });
        }
        else {
            data.errorPlateForm = 'openTrace';
            res.json(data);
        }

    });
});


//销售详情页
router.get('/detail/:id', function(req, res) {
    const session = TraceSession.get(req, res);
    backend.get(`/openTrace/${session.userIdEnc}/saleorder/detail/${req.params.id}`, req, res, function(data) {
        if (data && data.retCode == 0) {
            data.tags = PropertyFilter.initCustomTags(data.tags);
            data.billProdDataTags = PropertyFilter.initCustomTags(data.billProdDataTags, 'item_');
            data.prodDataTags = PropertyFilter.initCustomTags(data.prodDataTags, 'prod_');

            const prodCustomMap = PropertyFilter.dealCustomField(data.prodDataTags);
            const billProdDataMap = PropertyFilter.dealCustomField(data.billProdDataTags);
            data.listFields = PropertyFilter.dealGoodsTableConfig(data.listFields, prodCustomMap, billProdDataMap);
            data.listFields = data.listFields.filter(item => item.columnName !== 'remarks');
            if(req.cookies.currencyVipFlag === 'false'){
                data.listFields = data.listFields.filter((item) => item.columnName !== 'currencyUnitPrice' && item.columnName !== 'currencyAmount');
            }
            if(data.data && data.data.prodList){
                data.data.prodList = PropertyFilter.dealBillProdCustomField(data.data.prodList, 'item_');
                data.data.prodList = PropertyFilter.dealProdCustomField({list: data.data.prodList, prefix: 'prod_', propertyKey: 'prodPropertyValues'});
            }
            data.data.isCreator = data.isCreator;
            data.data.isAssignee = (data.approveTask?true:false);
            data.approveFlag =  data.approveFlag||0;
            data.approveModuleFlag = data.approveModuleFlag||0; // approveModuleFlag 主账号审批是否开启并非权限
            res.json(data);
        } else {
            data.errorPlateForm = 'openTrace';
            res.json(data);
        }
    });
});


//出库记录
router.get('/out/record/for/:recordFor', function(req, res) {
    const session = TraceSession.get(req, res);
    let params = req.query;
    let path;
   if (params.type === 'saleOrder') {
        path = `/openTrace/${session.userIdEnc}/saleorder/wareout/${req.params.recordFor}`;
        params.saleOrderBillNo = req.params.recordFor;
    }

    backend.get(path, params, req, res, function (data) {
        if (data.retCode=='0') {
            let i = 1;
            data.data && data.data.forEach((item, index) => {
                item.key = item.recId || index ;
                item.serial = i++;
                item.outType = outType[item.outType];
            });
            res.json({
                data: data.data,
                pagination: {
                    total: data.count,
                    current: params.page * 1,
                    pageSize: params.perPage * 1
                },
                retCode: '0'
            });
        } else {
            data.errorPlateForm = 'openTrace';
            res.json(data);
        }
    });
});

//收入记录
router.get('/income/record', function (req, res) {
    const session = TraceSession.get(req, res);
    const params = req.query;
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page || 1;
    let path;
    if (params.type === 'saleOrder') {
        params.saleOrderBillNo = encodeURIComponent(params.recordFor);
        path = `/openTrace/${session.userIdEnc}/saleorder/payment/${params.saleOrderBillNo}`;
    }
    delete params.recordFor;

    backend.get(path, params, req, res, function (data) {
        if (data.retCode == '0') {
            let i = 1;
            data.data && data.data.forEach((item, index) => {
                item.key = item.id || index;
                item.serial = i++;
            });
            res.json({
                data: data.data,
                pagination: {
                    total: data.count,
                    current: params.page * 1,
                    pageSize: params.perPage * 1
                },
                retCode: '0'
            });
        } else {
            data.errorPlateForm = 'openTrace';
            res.json(data);
        }
    });
});

//开票记录
router.get('/saleinvoice/record', function (req, res) {
    const session = TraceSession.get(req, res);
    const params = req.query;
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page || 1;
    let path;
    if (params.type === 'saleOrder') {
        params.saleOrderBillNo = encodeURIComponent(params.recordFor);
        path = `/openTrace/${session.userIdEnc}/saleorder/invoice/${params.saleOrderBillNo}`;
    }
    delete params.recordFor;

    backend.get(path, params, req, res, function (data) {
        if (data.retCode == '0') {
            let i = 1;
            data.data && data.data.forEach((item, index) => {
                item.key = item.id || index;
                item.serial = i++;
            });
            res.json({
                data: data.data,
                pagination: {
                    total: data.count,
                    current: params.page * 1,
                    pageSize: params.perPage * 1
                },
                retCode: '0'
            });
        } else {
            data.errorPlateForm = 'openTrace';
            res.json(data);
        }
    });
});

//生产记录
router.get('/produceOrder/record', function (req, res) {
    const session = TraceSession.get(req, res);
    const params = req.query;
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page || 1;

    backend.get(`/openTrace/${session.userIdEnc}/saleorder/produce/${params.recordFor}`, params, req, res, function (data) {
        if (data.retCode == '0') {
            let i = 1;
            data.data && data.data.forEach((item, index) => {
                item.key = item.id || index;
                item.serial = i++;
            });
            res.json({
                data: data.data,
                pagination: {
                    total: data.count,
                    current: params.page * 1,
                    pageSize: params.perPage * 1
                },
                retCode: '0'
            });
        } else {
            data.errorPlateForm = 'openTrace';
            res.json(data);
        }
    });
});

module.exports = router;
