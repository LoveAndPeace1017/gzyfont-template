const express = require('express');
const router = express.Router();
const backend = require('../../../lib/backend');
const Session = require('../../../lib/session');
const Constants = require('../../../lib/constants');
const DataFilter = require('../../../lib/utils/DataFilter');
const Decimal = require('decimal.js');

// const server = 'http://192.168.16.254:9048';
const server = '';

const map = {
    billNo: {
        label: "node.purchase.billNo",
    },
    orderDate:{
        label: "node.purchase.orderDate",
    },
    warehouseNameIn:{
        label: "node.purchase.warehouseNameIn",
    },
    warehouseNameOut:{
        label: "node.purchase.warehouseNameOut",
    },
    supplierCode:{
        label: "node.purchase.supplierCode",
    },
    remindDate:{
        label: "node.purchase.remindDate",
    },
    ourContacterName:{
        label: "node.purchase.ourContacterName",
    },
    remark:{
        label: "node.purchase.remark",
    },
    materialCost:{
        label: "node.purchase.materialCost",
    },
    inState:{
        label: "node.purchase.inState",
    },
    outState:{
        label: "node.purchase.outState",
    },
    aggregateAmount: {
        label: "node.purchase.aggregateAmount",
        width: Constants.TABLE_COL_WIDTH.FUND_ACCOUNT,
    },
    projectName: {
        label: "node.purchase.projectName",
        width: Constants.TABLE_COL_WIDTH.CUSTOMER_LEVEL,
    },
    supplierContacterName: {
        label: "node.purchase.supplierContacterName",
        width: Constants.TABLE_COL_WIDTH.PERSON
    },
    supplierMobile: {
        label: "node.purchase.supplierMobile",
    },
    supplierName:{
        label: 'node.purchase.supplierName',
        width: Constants.TABLE_COL_WIDTH.TEL,
    }
};

const filterMap = {
    orderDate: {
        label: "node.subcontract.orderDate",
        width: '200',
        type: 'datePicker'
    },
    inState: {
        label: "node.subcontract.inState",
        width: '200',
        type: 'select',
        options: [
            {label: "node.subcontract.inboundDone", value: "1"},
            {label: "node.subcontract.inboundWait", value: "0"}
        ]
    },
    outState: {
        label: "node.subcontract.outState",
        width: '200',
        type: 'select',
        options: [
            {label: "node.subcontract.outboundDone", value: "1"},
            {label: "node.subcontract.outboundWait", value: "0"}
        ]
    },
    outProd: {
        label:"node.subcontract.outProd",
        type:'input',
        placeholder:'消耗原料物品'
    },
    inProd: {
        label:"node.subcontract.inProd",
        type:'input',
        placeholder:'加工成品物品'
    },
    warehouseNameIn: {
        label:"node.subcontract.warehouseNameIn",
        fieldName:'warehouseNameIn',
        type: 'warehouse',
    },
    warehouseNameOut: {
        label:"node.subcontract.warehouseNameOut",
        fieldName:'warehouseNameOut',
        type: 'warehouse',
    },
    remindDate: {
        label: "node.purchase.remindDate",
        width: '200',
        type: 'datePicker'
    }
};

function dealFilterConfig(list, warehouses) {
    const warehouseNames = warehouses.map((item)=>{
        return {
            label:item.name,
            value:item.name,
        };
    });
    let arr = list && list.map(function (item) {
        let config = filterMap[item.columnName];
        config.fieldName = item.columnName;
        config.visibleFlag = item.visibleFlag;
        config.originVisibleFlag = item.visibleFlag;
        config.recId = item.recId;
        config.displayFlag = false;
        if(config.fieldName === 'warehouseNameIn' || config.fieldName === 'warehouseNameOut'){
            config.options = warehouseNames;
        }
        return config
    });
    return arr;
}

function dealTableConfig(list, invisibleGroup) {

    let newList = [];
    let initFlag = true;
    // 初始阶段数据库中没有不可配置字段
    list.forEach(function (item) {
        if(invisibleGroup.indexOf(item.columnName) !== -1){
            item.visibleFlag = false;
            item.displayFlag = true;
        }
        if(item.columnName=='billNo'){
            initFlag = false;
        }
        let obj = map[item.columnName];
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
            fieldName: 'displayBillNo',
            label: 'node.purchase.billNo',
            visibleFlag: 1,
            width: Constants.TABLE_COL_WIDTH.NO,
            cannotEdit: true
        });
        newList.push({
            fieldName: 'prodAbstract',
            label: 'node.purchase.prodAbstract1',
            visibleFlag: 1,
            width: Constants.TABLE_COL_WIDTH.NO,
            cannotEdit: true
        });
    }

    return newList;
}

/* 委外加工列表. */
router.get('/list', function (req, res, next) {
    const params = req.query;
    params.perPage = params.perPage ? parseInt(params.perPage) : Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req, res);
    // const userId = 'nEoAUdKFbkYs';
    let url = `/cgi/${session.userIdEnc}/outsource/list`;
    backend.post(server+url, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let list = data.data;
            let i = 1;
            list.forEach(function (item) {
                item.key = item.billNo;
                item.serial = i++;
            });

            let invisibleGroup = []; //数组中的属性在页面中将隐藏
            let tableConfigList = dealTableConfig(data.listFields,invisibleGroup);
            let filterConfigList = dealFilterConfig(data.searchFields, data.warehouses);
            res.json({
                retCode: 0,
                list: list,
                filterConfigList: filterConfigList,
                tableConfigList: tableConfigList,
                totalAmount: data.totalAmount,
                pageAmount: data.pageAmount,
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

/*删除委外加工单*/
router.post('/delete', function (req, res) {
    let isCascaded = req.body.isCascaded;
    const params = {
        array:req.body.ids
    };
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.delete(`/cgi/${session.userIdEnc}/outsource?isCascaded=${isCascaded}`, params, req, res, function (data) {
        res.json(data);
    });
});


/* 进入委外加工后需要加载的一些信息*/
router.get('/pre/create', function (req, res, next) {
    const params = req.query;
    const session = Session.get(req, res);
    // const userId = 'nEoAUdKFbkYs';
    backend.get(`/cgi/${session.userIdEnc}/outsource/pre/create`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            data.listFields = DataFilter.dealGoodsTableConfig(data.listFields);
            res.json(data);
        } else {
            res.json({
                retCode: '1',
                retMsg: "网络异常，请稍后重试！"
            });
        }
    });
});

/* 新增委外加工 */
router.post('/add', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/cgi/${session.userIdEnc}/outsource`, params, req, res, function (data) {
        res.json(data);
    });
});
/* 修改委外加工 */
router.post('/modify/:billNo', function (req, res, next) {
    const params = req.body;
    // const userId = 'nEoAUdKFbkYs';
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.put(`/cgi/${session.userIdEnc}/outsource/${req.params.billNo}`, params, req, res, function (data) {
        res.json(data);
    });
});

//委外加工详情页
router.get('/detail/:id', function (req, res) {
    const session = Session.get(req, res);
    backend.get(server+`/cgi/${session.userIdEnc}/outsource/${req.params.id}`, req, res, function (data) {
        if (data && data.retCode == 0) {
            data.listFields = DataFilter.dealGoodsTableConfig(data.listFields);
            res.json(data);
        } else {
            res.json({
                retCode: '1',
                retMsg: (data.retMsg&&data.retMsg)||"网络异常"
            });
        }
    });
});


//根据单号获取物品概要的总类
router.get('/listCheck', function (req, res) {
    const session = Session.get(req, res);
    const params = {};
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.userId = session.userIdEnc;
    params.billNo = req.query.billNo;
    backend.get(`/cgi/${session.userIdEnc}/outsource/list/inProd`, params, req, res, function (data) {
        res.json(data)
    });
});

// 成品入库
router.post('/generateOut/:billNo', function (req, res, next) {
    const params = {};
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/cgi/${session.userIdEnc}/outsource/generateOut/${req.params.billNo}`, params, req, res, function (data) {
        res.json(data);
    });
});

// 原料出库
router.post('/generateIn/:billNo', function (req, res, next) {
    const params = {};
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/cgi/${session.userIdEnc}/outsource/generateEnter/${req.params.billNo}`, params, req, res, function (data) {
        res.json(data);
    });
});




module.exports = router;
