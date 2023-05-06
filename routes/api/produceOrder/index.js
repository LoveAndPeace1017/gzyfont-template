const express = require('express');
const router = express.Router();
const backend = require('../../../lib/backend');
const Session = require('../../../lib/session');
const Constants = require('../../../lib/constants');
const DataFilter = require('../../../lib/utils/DataFilter');
const PropertyFilter = require('../../../lib/utils/PropertyFilter');


let map={
    billNo: {
        label: "node.produceOrder.billNo",
        width: Constants.TABLE_COL_WIDTH.NO
    },
    orderDate: {
        label: "node.produceOrder.orderDate",
        width: Constants.TABLE_COL_WIDTH.NO
    },
    productAbstract: {
        label: "node.produceOrder.prodAbstract",
        width: Constants.TABLE_COL_WIDTH.NO
    },
    orderStatus: {
        label: "node.produceOrder.orderStatus",
        width: Constants.TABLE_COL_WIDTH.NO
    },
    departmentName: {
        label: "node.produceOrder.departmentName",
        width: Constants.TABLE_COL_WIDTH.NO
    },
    employeeName: {
        label: "node.produceOrder.employeeName",
        width: Constants.TABLE_COL_WIDTH.NO
    },
    produceType: {
        label: "node.produceOrder.produceType",
        width: Constants.TABLE_COL_WIDTH.NO
    },
    supplierName: {
        label: "node.produceOrder.supplierName",
        width: Constants.TABLE_COL_WIDTH.NO
    },
    contacterName: {
        label: "node.produceOrder.contacterName",
        width: Constants.TABLE_COL_WIDTH.NO
    },
    projectName: {
        label: "node.produceOrder.projectName",
        width: Constants.TABLE_COL_WIDTH.NO
    },
    deliveryDeadlineDate:{
        label: "node.produceOrder.deliveryDeadlineDate1",
        width: Constants.TABLE_COL_WIDTH.NO
    }
};

function dealTableConfig(list, customMap, invisibleGroup) {
    let newList = [];
    // 初始阶段数据库中没有不可配置字段
    let initFlag = true;
    list.forEach(function (item) {
        if(item.columnName === 'billNo'){
            initFlag = false;
        }
        if(invisibleGroup.indexOf(item.columnName) !== -1){
            item.visibleFlag = false;
            item.displayFlag = true;
        }
        let obj = map[item.columnName];
        obj = obj || customMap[item.columnName];
        if (obj) {
            newList.push({
                fieldName: item.columnName,
                label: obj.label,
                recId: item.recId,
                visibleFlag: item.visibleFlag,
                originVisibleFlag: item.visibleFlag,
                width: item.columnWidth||obj.width,
                cannotEdit:item.cannotEdit||null,
                displayFlag: item.displayFlag||null
            });
        }
    });
    if(initFlag){
        newList.unshift({
            cannotEdit: true,
            fieldName: "billNo",
            label: "node.produceOrder.billNo",
            visibleFlag: 1,
            width: Constants.TABLE_COL_WIDTH.NO
        },{
            cannotEdit: true,
            fieldName: "orderDate",
            label: "node.produceOrder.orderDate",
            visibleFlag: 1,
            width: Constants.TABLE_COL_WIDTH.NO
        },{
            cannotEdit: true,
            fieldName: "productAbstract",
            label: "node.produceOrder.prodAbstract",
            visibleFlag: 1,
            width: Constants.TABLE_COL_WIDTH.NO
        },{
            cannotEdit: true,
            fieldName: "orderStatus",
            label: "node.produceOrder.orderStatus",
            visibleFlag: 1,
            width: Constants.TABLE_COL_WIDTH.NO
        })
    }
    return newList;
}

let GOODS_TABLE_FIELD_MAP = {
    descItem: 'node.report.purchase.descItem',
    unit: 'node.report.purchase.recUnit',
    brand: 'node.report.purchase.brand',
    produceModel: 'node.report.purchase.produceModel',
    bomcode: 'node.produceOrder.bomcode',   // bom
    saleDisplayBillNo: 'node.produceOrder.saleDisplayBillNo',  // 销售单号
    customerOrderNo: 'node.produceOrder.customerOrderNo',  // 客户订单号
    saleQuantity: 'node.produceOrder.saleQuantity',  // 销售数量
    deliveryDeadlineDate: 'node.produceOrder.deliveryDeadlineDate',  // 交付日期
    unitConsump: 'node.produceOrder.unitConsump', //  单位用量
    expectCount: 'node.produceOrder.expectCount',
    finishCount: 'node.produceOrder.finishCount',
    enterCount: 'node.produceOrder.enterCount',
    unEnterCount: 'node.produceOrder.unEnterCount',
    remarks: 'node.produceOrder.remarks',
    warehouseName: 'node.produceOrder.warehouseName',
    supplierName: 'node.produceOrder.supplierName',
    receiveCount: 'node.produceOrder.receiveCount',
    rejectCount: 'node.produceOrder.rejectCount',
    totalReceiveCount: 'node.produceOrder.totalReceiveCount'
};

const dealGoodsTableConfig =  function(list, customMap) {
    const resolvedList = list.map(function (item) {
        let label = GOODS_TABLE_FIELD_MAP[item.columnName] ||
            (customMap[item.columnName] && customMap[item.columnName].label);
        if (label) {
            return {
                ...item,
                label
            };
        }
        return item
    });
    return resolvedList.filter(item=> item.label);
};

/* 生产单列表. */
router.get('/list', function(req, res, next) {
    const params = {
        ...req.query
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page?params.page:1;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req,res);
    backend.post(`/pc/v1/${session.userIdEnc}/produceorder/list`,params,req,res,function(data){
        if(data && data.retCode==0){
            let customMap = DataFilter.dealCustomField(data.tags);
            let list = data.data;
            let i = 1;
            list.forEach(function(item){
                item.serial = i++;
                item.key = item.recId;
                let ppoList = item.ppoList;
                let propertyValue = {};
                ppoList.forEach((value)=>{
                    propertyValue[value["propName"]] = value["propValue"]
                });
                [1,2,3,4,5].forEach((index)=>{
                    item['property_value'+index] = propertyValue['property_value'+index] && propertyValue['property_value'+index];
                });
            });
            let tableConfigList = dealTableConfig(data.listFields, customMap, []);
            res.json({
                retCode:0,
                list:list,
                filterConfigList:[],
                tableConfigList:tableConfigList,
                customMap: customMap,
                pagination:{
                    total:data.count,
                    current:params.page*1,
                    pageSize:params.perPage*1
                }
            });
        }else{
            res.json({
                retCode:1,
                retMsg:"网络异常，请稍后重试！"
            });
        }

    });
});

//删除生产单列表
router.post('/delete', function(req, res, next) {
    const params = {
        vo1: req.body.ids
    };
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.delete(`/pc/v1/${session.userIdEnc}/produceorder`,params,req,res,function(data){
        res.json(data);
    });

});

/* 进入新增生产单后需要加载的一些信息*/
router.get('/pre/create', function (req, res, next) {
    const params = req.query;
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/produceorder/pre/create`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            data.prodDataTags = PropertyFilter.initCustomTags(data.prodDataTags, 'prod_');

            const prodCustomMap = PropertyFilter.dealCustomField(data.prodDataTags);
            data.listProduceFields = dealGoodsTableConfig(data.listProduceFields, prodCustomMap);
            data.listMaterialFields = dealGoodsTableConfig(data.listMaterialFields, prodCustomMap);
            res.json(data);
        } else {
            res.json({
                retCode: '1',
                retMsg: "网络异常，请稍后重试！"
            });
        }
    });
});

/* 新增生产单 */
router.post('/add', function (req, res, next) {
    const params = req.body;
    // const userId = 'nEoAUdKFbkYs';
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/produceorder`, params, req, res, function (data) {
        res.json(data);
    });
});

/* 修改生产单 */
router.post('/modify/:billNo', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.put(`/pc/v1/${session.userIdEnc}/produceorder/${req.params.billNo}`, params, req, res, function (data) {
        res.json(data);
    });
});

//生产单详情页
router.get('/detail/:id', function (req, res) {
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/produceorder/detail/${req.params.id}`, req, res, function (data) {
        if (data && data.retCode == 0) {
            let resData = data.pmsProduceOrder || {};
            let propertyValues = {};
            data.prodDataTags = PropertyFilter.initCustomTags(data.prodDataTags, 'prod_');
            const prodCustomMap = PropertyFilter.dealCustomField(data.prodDataTags);
            let listProduceFields = dealGoodsTableConfig(data.listProduceFields, prodCustomMap);
            let listMaterialFields = dealGoodsTableConfig(data.listMaterialFields, prodCustomMap);
            resData.ppopList = PropertyFilter.dealProdCustomField({list: data.pmsProduceOrderProductList, prefix: 'prod_', propertyKey: 'prodPropertyValues'});
            resData.ppomList = PropertyFilter.dealProdCustomField({list: data.pmsProduceOrderMaterialList, prefix: 'prod_', propertyKey: 'prodPropertyValues'});
            data.pmsProduceOrderPropList.forEach(item => {
                if(item.propValue){
                    propertyValues[item.propName] = item.propValue;
                }
            });
            resData.propertyValues = propertyValues;
            res.json({
                retCode: '0',
                tags: data.tags,
                prodDataTags: data.prodDataTags,
                listProduceFields,
                listMaterialFields,
                data: resData
            });
        } else {
            res.json({
                retCode: '1',
                retMsg: data.retMsg || "网络异常，请稍后重试！"
            });
        }
    });
});

// 生产单详情-领料记录
router.get('/gain/material/:billNo', function (req, res) {
    const params = req.query;
    params.perPage = params.perPage ? parseInt(params.perPage) : Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req,res);
    let billNo = req.params.billNo;
    backend.get(`/pc/v1/${session.userIdEnc}/produceorder/gain/material/${billNo}`,params, req,res,function(data){
        if (data && data.retCode == 0) {
            res.json({
                retCode: 0,
                list: data.data,
                pagination: {
                    total: data.count,
                    current: params.page,
                    pageSize: params.perPage
                }
            });
        } else {
            res.json({
                retCode: data.retCode || '1',
                retMsg: data.retMsg || "网络异常，请稍后重试！"
            });
        }
    });
});

// 生产单详情-退料记录
router.get('/quit/material/:billNo', function (req, res) {
    const params = req.query;
    params.perPage = params.perPage ? parseInt(params.perPage) : Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req,res);
    let billNo = req.params.billNo;
    backend.get(`/pc/v1/${session.userIdEnc}/produceorder/quit/material/${billNo}`,params, req,res,function(data){
        if (data && data.retCode == 0) {
            res.json({
                retCode: 0,
                list: data.data,
                pagination: {
                    total: data.count,
                    current: params.page,
                    pageSize: params.perPage
                }
            });
        } else {
            res.json({
                retCode: data.retCode || '1',
                retMsg: data.retMsg || "网络异常，请稍后重试！"
            });
        }
    });
});

// 生产单详情-成品入库记录
router.get('/product/enter/:billNo', function (req, res) {
    const params = req.query;
    params.perPage = params.perPage ? parseInt(params.perPage) : Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req,res);
    let billNo = req.params.billNo;
    backend.get(`/pc/v1/${session.userIdEnc}/produceorder/product/enter/${billNo}`,params, req,res,function(data){
        if (data && data.retCode == 0) {
            res.json({
                retCode: 0,
                list: data.data,
                pagination: {
                    total: data.count,
                    current: params.page,
                    pageSize: params.perPage
                }
            });
        } else {
            res.json({
                retCode: data.retCode || '1',
                retMsg: data.retMsg || "网络异常，请稍后重试！"
            });
        }
    });
});

// 生产单详情-工单记录
router.get('/worksheet/:billNo', function (req, res) {
    const params = req.query;
    params.perPage = params.perPage ? parseInt(params.perPage) : Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req,res);
    let billNo = req.params.billNo;
    backend.get(`/pc/v1/${session.userIdEnc}/produceorder/worksheet/${billNo}`,params, req,res,function(data){
        if (data && data.retCode == 0) {
            res.json({
                retCode: 0,
                list: data.data,
                pagination: {
                    total: data.count,
                    current: params.page,
                    pageSize: params.perPage
                }
            });
        } else {
            res.json({
                retCode: data.retCode || '1',
                retMsg: data.retMsg || "网络异常，请稍后重试！"
            });
        }
    });
});

// 批量选择bom，返回配件
router.post('/multi/bom', function (req, res) {
    const session = Session.get(req,res);
    let bomList = req.body.bomList.map(item => {
       item.q = item.quantity;
       return item
    });
    const params = {
        array: bomList || [],
        headers: {"Content-Type":'application/json'}
    };
    backend.post(`/pc/v1/${session.userIdEnc}/produceorder/popup/bom`,params, req,res,function(data){
        if (data && data.retCode === "0") {
            let list = data.data;
            list = list.map((item)=>{
                let propertyValues = PropertyFilter.initCustomProperties(data.tags, item.propertyValues);
                let prodPropertyValues = PropertyFilter.addPrefixToCustomProperties(propertyValues, 'prod_');
                item = {...item, ...prodPropertyValues};
                return item
            });
            res.json({
                retCode: '0',
                list: list,
                tags: data.tags
            });
        } else {
            res.json({
                retCode: data.retCode || '1',
                retMsg: data.retMsg || "网络异常，请稍后重试！"
            });
        }
    });
});

//根据单号获取物品概要的总类
router.get('/listEnter', function (req, res) {
    const session = Session.get(req, res);
    const params = {};
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.billNo = req.query.billNo;
    backend.get(`/pc/v1/${session.userIdEnc}/produceorder/mainProdAbstract`, params, req, res, function (data) {
        res.json(data)
    });
});

/* 完成按钮 */
router.get('/complete/:billNo', function (req, res, next) {
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/produceorder/complete/${req.params.billNo}`, {}, req, res, function (data) {
        res.json(data);
    });
});

/* 撤回按钮 */
router.get('/repeal/:billNo', function (req, res, next) {
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/produceorder/repeal/${req.params.billNo}`, {}, req, res, function (data) {
        res.json(data);
    });
});

/* 新建生产单-选择销售物品 */
router.get('/saleOrder/pop/list', function(req, res, next) {
    const params = {
        ...req.query
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page?params.page:1;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req,res);
    backend.post(`/pc/v1/${session.userIdEnc}/produceorder/sale/products/list`,params,req,res,function(data){
        if(data && data.retCode==0){
            let list = data.data;
            let i = 1;
            list = list.map((item)=>{
                item.level = 1;
                item.serial = i++;
                item.prodNo = item.productCode;
                item.key = item.id;
                let propertyValues = PropertyFilter.initCustomProperties(data.tags, item.propertyValues);
                let prodPropertyValues = PropertyFilter.addPrefixToCustomProperties(propertyValues, 'prod_');
                delete item.productCode;
                item = {...item, ...prodPropertyValues};
                return item
            });
            res.json({
                retCode:0,
                list:list,
                pagination:{
                    total:data.count,
                    current:params.page*1,
                    pageSize:params.perPage*1
                }
            });
        }else{
            res.json({
                retCode:1,
                retMsg:"网络异常，请稍后重试！"
            });
        }

    });
});


//生产记录
router.get('/record', function (req, res) {
    const session = Session.get(req, res);
    const params = req.query;
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page || 1;

    backend.post(`/pc/v1/${session.userIdEnc}/saleorders/produce/${params.recordFor}`, params, req, res, function (data) {
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
            res.json({
                retCode: 1,
                retMsg: (data && data.retMsg) || "网络异常，请稍后重试！"
            });
        }
    });
});


/* 进入新增生产单后需要加载的一些信息*/
router.get('/record/pre/create', function (req, res, next) {
    const params = req.query;
    const session = Session.get(req, res);
    backend.get(`/cgi/${session.userIdEnc}/worksheet/produceRecord/pre/create`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            data.tags = PropertyFilter.initCustomTags(data.tags);
            res.json(data);
        } else {
            res.json({
                retCode: '1',
                retMsg: "网络异常，请稍后重试！"
            });
        }
    });
});

/* 新增生产单 */
router.post('/record/add', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/cgi/${session.userIdEnc}/worksheet/produceRecord`, params, req, res, function (data) {
        res.json(data);
    });
});


module.exports = router;
