const express = require('express');
const router = express.Router();
const backend = require('../../../lib/backend');
const Session = require('../../../lib/session');
const Constants = require('../../../lib/constants');
const DataFilter = require('../../../lib/utils/DataFilter');
const Decimal = require('decimal.js');
const Decimals = require('../../../lib/utils/Decimal');
const PropertyFilter = require('../../../lib/utils/PropertyFilter');


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
        label: 'node.sale.displayBillNo1',
        width: Constants.TABLE_COL_WIDTH.NO,
    },
    customerName:{
        label: 'node.sale.customerName',
        width: Constants.TABLE_COL_WIDTH.NO,
    },
    quotationDate:{
        label: 'node.sale.quotationDate',
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
    ourName: {
        label: 'node.sale.ourName',
        width: Constants.TABLE_COL_WIDTH.NO,
    },
    expiredDate: {
        label: 'node.sale.expiredDate',
        width: Constants.TABLE_COL_WIDTH.NO,
    }
};

const filterMap = {
    interchangeStatus: {
        label: "node.sale.interchangeStatus",
        width: '200',
        type: 'select',
        options: [
            {label: "node.sale.interchangeStatusOption1", value: "1"},
            {label: "node.sale.interchangeStatusOption2", value: "2"},
            {label: "node.sale.interchangeStatusOption3", value: "3"},
        ]
    },
    expiredDate:{
        label: "node.sale.expiredDate",
        fieldName: 'expiredDate',
        type: 'datePicker'
    },
    approveStatus: {  // 审批状态 0 未通过  1 通过  2 反驳  3 审批中
        label: "components.approve.approveStatus",
        width: '200',
        type: 'select',
        options: [
            {label: "components.approve.approveStatus_0", value: "0"},
            {label: "components.approve.approveStatus_3", value: "3"},
            {label: "components.approve.approveStatus_2", value: "2"},
            {label: "components.approve.approveStatus_1", value: "1"}
        ]
    },
    attachmentState: {
        label: "components.approve.attachmentState",
        width: '200',
        type: 'select',
        options: [
            {label: "components.approve.attachmentStatus_1", value: "1"},
            {label: "components.approve.attachmentStatus_2", value: "2"},
        ]
    },
    assignee:{
        label: "node.purchase.assignee",
        width: '200',
        type: 'select',
        options: [
            {label: "node.purchase.assigneeOption", value: "1"}
        ]
    },
    approvePerson: {
        label: "components.approve.approvePerson",
        width: '200',
        type: 'select',
        options: [
            {label: "components.approve.approvePerson_0", value: "0"},
            {label: "components.approve.approvePerson_1", value: "1"}
        ]
    },
    state: {
        label: "node.sale.state",
        width: '200',
        type: 'select',
        options: [
            {label: "node.sale.stateOption1", value: "0"},
            {label: "node.sale.stateOption2", value: "1"}
        ]
    },
    payState: {
        label: "node.sale.payState",
        width: '200',
        type: 'select',
        options: [
            {label: "node.sale.payStateOption1", value: "0"},
            {label: "node.sale.payStateOption2", value: "1"},
        ],
    },
    invoiceState: {
        label: "node.sale.invoiceState",
        width: '200',
        type: 'select',
        options: [
            {label: "node.sale.invoiceStateOption1", value: "0"},
            {label: "node.sale.invoiceStateOption2", value: "1"},
        ],
    },
    deliveryDate: {
        label: "node.sale.deliveryDate",
        width: '200',
        type: 'datePicker'
    },
    /*prop_value: {
        label: "node.sale.prop_value",
        width: '200',
        type: 'custom'
    },*/
    settlement: {
        label: "node.sale.settlement",
        type: 'settlement'
    },
    customerOrderNo: {
        label: "node.sale.customerOrderNo",
        width: '200',
        type: "input"
    },
    ourName: {
        label: "node.sale.ourName",
        width: '200',
        type: "input"
    },
    currencyId: {
        label: "node.sale.currencyName",
        width: '200',
        type: 'currency'
    },
};

function dealFilterConfig(list, wareList, customMap, invisibleGroup) {
    let arr = [];
    list && list.map(function(item) {
        let config = filterMap[item.columnName];
        if(config){
            config.fieldName = item.columnName;
            config.visibleFlag = item.visibleFlag;
            config.originVisibleFlag = item.visibleFlag;
            config.recId = item.recId;
            config.displayFlag = false;
            if(invisibleGroup.indexOf(item.columnName) !== -1){
                config.displayFlag = true;
                config.visibleFlag = false;
            }
            arr.push(config);
        }
    });

    arr.splice(4, 0, {
        label: "node.sale.quotationDate",
        fieldName: 'quotationDate',
        visibleFlag: true,
        cannotEdit: true,
        type: 'datePicker'
    },{
        label: "node.sale.depEmployee",
        fieldName: 'depEmployee',
        visibleFlag: true,
        cannotEdit: true,
        type: 'depEmployee'
    });
    return arr;
}

function dealTableConfig(list, customMap, invisibleGroup) {

    let prodAbstractList = [],
        newList = [];
    // 初始阶段数据库中没有不可配置字段
    let initFlag = true;
    list.forEach(function(item) {
        let obj = map[item.columnName];
        if(item.columnName=='displayBillNo'){
            initFlag = false;
        }
        if(invisibleGroup.indexOf(item.columnName) !== -1){
            item.visibleFlag = false;
            item.displayFlag = true;
        }
        obj = obj || customMap[item.columnName];
        if (obj) {
           if(item.columnName === 'prodAbstract'&&initFlag){
                prodAbstractList.push({
                    fieldName: item.columnName,
                    label: obj.label,
                    width: item.width||obj.width||Constants.TABLE_COL_WIDTH.DEFAULT,
                    fixed: obj.fixed,
                    recId:item.recId,
                    visibleFlag: item.visibleFlag,
                    originVisibleFlag: item.visibleFlag,
                    displayFlag: item.displayFlag||null
                })
            } else {
                newList.push({
                    fieldName: item.columnName,
                    label: obj.label,
                    recId:item.recId,
                    visibleFlag: item.visibleFlag,
                    originVisibleFlag: item.visibleFlag,
                    width: item.columnWidth||obj.width,
                    cannotEdit:item.cannotEdit||null,
                    displayFlag: item.displayFlag||null
                });
            }

        }
    });

    if(initFlag){
        const customerColumns = [{
            fieldName: 'displayBillNo',
            label: 'node.sale.displayBillNo1',
            visibleFlag: 1,
            width: Constants.TABLE_COL_WIDTH.NO,
            cannotEdit: true
        },{
            fieldName: 'customerName',
            label: 'node.sale.customerName',
            visibleFlag: 1,
            width: Constants.TABLE_COL_WIDTH.DEFAULT,
            cannotEdit: true,
        }, {
            fieldName: 'quotationDate',
            label: 'node.sale.quotationDate',
            visibleFlag: 1,
            cannotEdit: true,
            width: Constants.TABLE_COL_WIDTH.DATE
        }];
        newList = customerColumns.concat(prodAbstractList, newList);
    }
    return newList;
}


router.get('/list', function(req, res, next) {
    const params = req.query;
    params.perPage = params.perPage ? parseInt(params.perPage) : Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req, res);
    let url = `/pc/v1/${session.userIdEnc}/quotationorders/list`;

    backend.post(url, params, req, res, function(data) {
        if (data && data.retCode == 0) {
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

            if(params.source === 'mall'){ //来源于在线销售前端手动关闭审批权
                data.approveFlag = 0;
                data.approveModuleFlag = 0;
            }

            let invisibleGroup = []; //数组中的属性在页面中将隐藏
            data.approveModuleFlag != 1 && (invisibleGroup.push('approveStatus'),invisibleGroup.push('assignee')); // approveModuleFlag 主账号审批是否开启并非权限

            let tableConfigList = dealTableConfig(data.listFields, customMap, invisibleGroup);
            let filterConfigList = dealFilterConfig(data.searchFields, data.warehouseList, customMap, invisibleGroup);
            filterConfigList = PropertyFilter.searchFilter(data.tags,data.searchFields,filterConfigList);

            res.json({
                retCode: 0,
                list: list,
                approveFlag: data.approveFlag||0, //是否有审批权
                approveModuleFlag: data.approveModuleFlag,
                filterConfigList: filterConfigList,
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
            res.json({
                retCode: 1,
                retMsg: "网络异常，请稍后重试！"
            });
        }

    });
});
/*删除销售前的确认*/
router.post('/beforeDelete', function(req, res) {
    const params = {
        vo1: req.body.ids
    };
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    // const userId = 'nEoAUdKFbkYs';
    backend.post(`/pc/v1/${session.userIdEnc}/saleorders/popop/window`, params, req, res, function(data) {
        res.json(data);
    });
});
/*删除销售*/
router.post('/delete', function(req, res) {
    const params = {
        vo1: req.body.ids
    };
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    // const userId = 'nEoAUdKFbkYs';
    backend.delete(`/pc/v1/${session.userIdEnc}/quotationorders`, params, req, res, function(data) {
        res.json(data);
    });
});

/* 设置隐藏显示 */
router.post('/status/:opeType/:code', function(req, res, next) {
    const params = {};
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    // const userId = 'nEoAUdKFbkYs';
    backend.post(`/pc/v1/${session.userIdEnc}/saleorders/${req.params.opeType}/${req.params.code}`, {}, req, res, function(data) {
        res.json(data);
    });
});

//根据销售code获取销售仓库数量
router.get('/:code/inventories', function(req, res) {
    const session = Session.get(req, res);
    // const userId = 'nEoAUdKFbkYs';
    backend.get(`/pc/v1/${session.userIdEnc}/saleorders/${req.params.code}/inventories`, req, res, function(data) {
        res.json(data)
    });
});

//根据单号获取物品概要的总类
router.get('/listSale', function (req, res) {
    const session = Session.get(req, res);
    const params = {};
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.userId = session.userIdEnc;
    params.billNo = req.query.billNo;
    backend.get(`/pc/v1/${session.userIdEnc}/quotationorders/listQuotation`, params, req, res, function (data) {
        res.json(data)
    });
});

/* 进入新增销售后需要加载的一些信息*/
router.get('/pre/create', function(req, res, next) {
    const params = req.query;
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/quotationorders/pre/create`, params, req, res, function(data) {
        if (data && data.retCode == 0) {
            data.tags = PropertyFilter.initCustomTags(data.tags);
            data.billProdDataTags = PropertyFilter.initCustomTags(data.billProdDataTags, 'item_');
            data.prodDataTags = PropertyFilter.initCustomTags(data.prodDataTags, 'prod_');

            const prodCustomMap = PropertyFilter.dealCustomField(data.prodDataTags);
            const billProdDataMap = PropertyFilter.dealCustomField(data.billProdDataTags);
            data.listFields = PropertyFilter.dealGoodsTableConfig(data.listFields, prodCustomMap, billProdDataMap);

            if(req.cookies.currencyVipFlag === 'false'){
                data.listFields = data.listFields.filter((item) => item.columnName !== 'currencyUnitPrice' && item.columnName !== 'currencyAmount');
            }
            res.json(data);
        } else {
            res.json({
                retCode: '1',
                retMsg: "网络异常，请稍后重试！"
            });
        }
    });
});

/* 新增销售 */
router.post('/add', function(req, res, next) {
    const params = req.body;
    // const userId = 'nEoAUdKFbkYs';
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/quotationorders`, params, req, res, function(data) {
        res.json(data);
    });
});
/* 修改销售 */
router.post('/modify/:billNo', function(req, res, next) {
    const params = req.body;
    // const userId = 'nEoAUdKFbkYs';
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.put(`/pc/v1/${session.userIdEnc}/quotationorders/${req.params.billNo}`, params, req, res, function(data) {
        res.json(data);
    });
});

//销售详情页
router.get('/detail/:id', function(req, res) {
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/quotationorders/${req.params.id}`, req, res, function(data) {
        if (data && data.retCode == 0) {
            data.tags = PropertyFilter.initCustomTags(data.tags);
            data.prodDataTags = PropertyFilter.initCustomTags(data.prodDataTags, 'prod_');

            const prodCustomMap = PropertyFilter.dealCustomField(data.prodDataTags);
            data.listFields = PropertyFilter.dealGoodsTableConfig(data.listFields, prodCustomMap, {});
            if(req.cookies.currencyVipFlag === 'false'){
                data.listFields = data.listFields.filter((item) => item.columnName !== 'currencyUnitPrice' && item.columnName !== 'currencyAmount');
            }
            if(data.data && data.data.prodList){
                data.data.prodList = PropertyFilter.dealProdCustomField({list: data.data.prodList, prefix: 'prod_', propertyKey: 'prodPropertyValues'});
            }
            data.data.isCreator = data.isCreator;
            data.data.isAssignee = (data.approveTask?true:false);
            data.approveFlag =  data.approveFlag||0;
            data.approveModuleFlag = data.approveModuleFlag||0; // approveModuleFlag 主账号审批是否开启并非权限
            res.json(data);
        } else {
            res.json({
                retCode: '1',
                retMsg: "网络异常，请稍后重试！"
            });
        }
    });
});

//扫码录单（根据销售条码获取销售信息）
router.get('/scan/:barCode', function(req, res) {
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/saleorders/detail/by/barcode?barcode=${req.params.barCode}`, req, res, function(data) {
        res.json(data)
    });
});

//销售联想（根据销售编号或者名称所搜）
router.get('/search/by/field', function(req, res) {
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/saleorders/search/by/field`, req.query, req, res, function(data) {
        res.json(data)
    });
});

/*取消分销*/
router.post('/cancelDistribute', function(req, res) {
    const params = {};
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.delete(`/pc/v1/${session.userIdEnc}/saleorders?jsonArray=${JSON.stringify(req.body.ids)}`, params, req, res, function(data) {
        res.json(data);
    });
});
/*设置分销销售*/
router.post('/setDistribute', function(req, res) {
    const params = {};
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.delete(`/pc/v1/${session.userIdEnc}/saleorders?jsonArray=${JSON.stringify(req.body.ids)}`, params, req, res, function(data) {
        res.json(data);
    });
});

/*取消销售订单*/
router.post('/cancel/:code', function (req, res, next) {
    const params = {
        reason: req.body.reason
    };
    params.headers = {
        "Content-Type" : 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/saleorders/cancel/${req.params.code}`, params, req, res, function (data) {
        res.json(data);
    });
});

/*接收销售订单*/
router.post('/confirm/:code', function (req, res, next) {
    const session = Session.get(req, res);
    backend.post (`/pc/v1/${session.userIdEnc}/saleorders/confirm/${req.params.code}`, {}, req, res, function (data) {
        res.json(data);
    });
});


//从销售订单复制弹层（根据销售订单号获取销售订单信息）
router.get('/:billNo/purchase/pre/create', function(req, res) {
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/saleorders/${req.params.billNo}/purchase/pre/create`, req.query, req, res, function(data) {
        res.json(data)
    });
});


/*接收销售订单*/
router.post('/convertToLocalProd', function (req, res, next) {
    const session = Session.get(req, res);
    const params = {
        array:req.body.ids
    };
    params.headers = {
        "Content-Type" : 'application/json'
    };
    backend.post (`/pc/v1/${session.userIdEnc}/saleorders/convertToLocalProd`, params, req, res, function (data) {
        res.json(data);
    });
});

//关键词搜索联想
router.get('/search/tips', function(req, res) {
    const params = {
        ...req.query,
        key: encodeURIComponent(req.query.key)
    };
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/saleorders/search/tips`, params, req, res, function(data) {
        res.json(data)
    });
});

//销售记录
router.get('/record/for/:recordFor', function(req, res) {
    const session = Session.get(req, res);
    let params = req.query;
    let path;
    if (params.type == 'prods') {
        path = `/pc/v1/${session.userIdEnc}/${req.query.type}/query/sellgoods/${req.params.recordFor}`;
    } else {
        path = `/pc/v1/${session.userIdEnc}/customers/detail/saleorder`;
        params.customerNo = req.params.recordFor;
    }

    backend.get(path, params, req, res, function (data) {
        if (data.retCode=='0') {
            let i = 1;
            data.data && data.data.forEach((item, index) => {
                item.key = item.recId || index ;
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

/*销售批量出库获取初始信息*/
router.post('/outs/batch/pre/create', function (req, res, next) {
    const session = Session.get(req, res);
    const params = {
        jsonArray: JSON.stringify(req.body.ids)
    };

    backend.post(`/pc/v1/${session.userIdEnc}/saleorders/outs/batch/pre/create`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            data.data.forEach(item => {
                item.prodList.forEach((item, index) => {
                    item.serial = index + 1;
                    item.key = index;
                    let quantity = new Decimal(item.quantity);
                    item.pendingOut = Math.max(0, quantity.minus(item.receiverQuantity));
                    item.outQuantity = item.pendingOut !== 0 ? item.pendingOut : '';
                    delete item.recId;
                })
            });

            res.json(data);
        } else {
            res.json(data);
        }
    });
});

/*销售批量出库*/
router.post('/outs/batch', function (req, res, next) {
    const session = Session.get(req, res);
    const params = {
        warehouseName: req.body.warehouseName,
        jsonArray: JSON.stringify(req.body.dataList)
    };

    backend.post(`/pc/v1/${session.userIdEnc}/saleorders/outs/batch`, params, req, res, function (data) {
        res.json(data)
    });
});

/*获取销售批量收款初始信息*/
router.post('/payments/batch/pre/create', function (req, res, next) {
    const session = Session.get(req, res);
    const params = {
        jsonArray: JSON.stringify(req.body.ids)
    };

    backend.post(`/pc/v1/${session.userIdEnc}/saleorders/payments/batch/pre/create`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            data.data.forEach((item, index) => {
                item.key = index;
                item.amount = item.waitPay !== 0 ? item.waitPay : '';
                item.serial = index + 1;
                item.receivedAmount = new Decimal(item.aggregateAmount).minus(item.waitPay || 0).toString();
                item.aggregateAmount = Decimals.fixedDecimal(item.aggregateAmount, 2);
                item.receivedAmount = Decimals.fixedDecimal(item.receivedAmount, 2);
                item.currencyAmount = Decimals.fixedDecimal(item.amount * item.quotation / 100, 2);
            });

            res.json(data);
        } else {
            res.json(data);
        }
    });
});

/*销售批量收款*/
router.post('/payments/batch', function (req, res, next) {
    const session = Session.get(req, res);

    let url;
    let params;
    if (req.body.dataList.paymentDate) {
        url = `/pc/v1/${session.userIdEnc}/salepayments/merge`;
        params = req.body.dataList;
        params.headers = {
            "Content-Type": 'application/json'
        };
    } else {
        url = `/pc/v1/${session.userIdEnc}/saleorders/payments/batch`;
        params = {
            jsonArray: JSON.stringify(req.body.dataList)
        };
    }

    backend.post(url, params, req, res, function (data) {
        res.json(data)
    });
});


/*获取销售批量开票初始信息*/
router.post('/invoices/batch/pre/create', function (req, res, next) {
    const session = Session.get(req, res);
    const params = {
        jsonArray: JSON.stringify(req.body.ids)
    };

    backend.post(`/pc/v1/${session.userIdEnc}/saleorders/invoices/batch/pre/create`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            data.data.forEach((item, index) => {
                item.key = index;
                item.amount = item.waitInvoiceAmount !== 0 ? item.waitInvoiceAmount : '';
                item.serial = index + 1;
                item.invoicedAmount = new Decimal(item.aggregateAmount).minus(item.waitInvoiceAmount || 0).toString();

                item.aggregateAmount = Decimals.fixedDecimal(item.aggregateAmount, 2);
                item.invoicedAmount = Decimals.fixedDecimal(item.invoicedAmount, 2);
            });

            res.json(data);
        } else {
            res.json(data);
        }
    });
});

/*销售批量开票*/
router.post('/invoices/batch', function (req, res, next) {
    const session = Session.get(req, res);
    const params = {
        jsonArray: JSON.stringify(req.body.dataList)
    };

    let url = `/pc/v1/${session.userIdEnc}/saleorders/invoices/batch`;
    if (req.body.dataList.invoiceDate) {
        url = `/pc/v1/${session.userIdEnc}/saleinvoices/merge`;
    }

    backend.post(url, params, req, res, function (data) {
        res.json(data)
    });
});

/*
*审批通过(单条) 后端无法合并
* params: string  userId
*         string  billNo
*         string updatedTime
*/
router.post('/approve/single', function (req, res, next) {
    const session = Session.get(req, res);
    let { billNo, updatedTime } = req.body;
    const params = {
        userId: session.userIdEnc,
        billNo,
        updatedTime
    };
    backend.post(`/pc/v1/${session.userIdEnc}/saleorders/approve/${billNo}`, params, req, res, function (data) {
        res.json(data);
    });
});


/*
*审批通过(多条)
* params: string  userId
*         string  jsonArray
*/
router.post('/approve/list', function (req, res, next) {
    const session = Session.get(req, res);
    const params = {
        userId: session.userIdEnc,
        jsonArray: JSON.stringify(req.body.dataList)
    };
    backend.post(`/pc/v1/${session.userIdEnc}/saleorders/batchApprove`, params, req, res, function (data) {
        res.json(data);
    });
});


/*
*反审批通过(单条) 后端无法合并
* params: string  userId
*         string  billNo
*/

router.post('/approve/counter/single', function (req, res, next) {
    const session = Session.get(req, res);
    let { billNo, updatedTime } = req.body;
    const params = {
        userId: session.userIdEnc,
        billNo,
        updatedTime
    };
    backend.post(`/pc/v1/${session.userIdEnc}/saleorders/counter/approve/${billNo}`, params, req, res, function (data) {
        res.json(data);
    });
});

/*
*反审批通过(多条)
* params: string  userId
*         string  jsonArray
*/
router.post('/approve/counter/list', function (req, res, next) {
    const session = Session.get(req, res);
    const params = {
        userId: session.userIdEnc,
        jsonArray: JSON.stringify(req.body.dataList)
    };
    backend.post(`/pc/v1/${session.userIdEnc}/saleorders/counter/batchApprove`, params, req, res, function (data) {
        res.json(data);
    });
});

/*
*查看操作日志接口
* params: string  userId
*         string  billNo
*/
router.get('/approve/log/:billNo', function (req, res, next) {
    const session = Session.get(req, res);
    let billNo = req.params.billNo;
    const params = {
        userId: session.userIdEnc,
        billNo
    };
    backend.get(`/pc/v1/${session.userIdEnc}/saleorders/log/${billNo}`, params, req, res, function (data) {
        res.json(data);
    });
});


module.exports = router;
