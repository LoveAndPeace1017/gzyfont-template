const express = require('express');
const router = express.Router();
const backend = require('../../../lib/backend');
const Session = require('../../../lib/session');
const Constants = require('../../../lib/constants');
const DataFilter = require('../../../lib/utils/DataFilter');
const Decimal = require('../../../lib/utils/Decimal');
const PropertyFilter = require('../../../lib/utils/PropertyFilter');
const logger = require('../../../lib/logger').getLogger('default');


const map = {
    prodNo: {
        label: "node.requisition.prodNo",
        width: Constants.TABLE_COL_WIDTH.NO
    },
    prodCustomNo: {
        label: "node.requisition.prodNo",
        width: Constants.TABLE_COL_WIDTH.NO
    },
    prodName: {
        label: "node.requisition.prodName",
        width: Constants.TABLE_COL_WIDTH.PERSON
    },
    descItem: {
        label: "node.requisition.descItem",
        width: Constants.TABLE_COL_WIDTH.PERSON
    },
    brand: {
        label: "node.requisition.brand",
        width: Constants.TABLE_COL_WIDTH.PERSON
    },
    produceModel: {
        label: "node.requisition.produceModel",
        width: Constants.TABLE_COL_WIDTH.PERSON
    },
    unit: {
        label: "node.requisition.unit",
        width: Constants.TABLE_COL_WIDTH.UNIT
    },
    quantity: {
        label: "node.requisition.quantity",
        width: Constants.TABLE_COL_WIDTH.UNIT
    },
    unitPrice: {
        label: "node.requisition.unitPrice",
        width: Constants.TABLE_COL_WIDTH.BIND_ACCOUNT
    },
    amount: {
        label: "node.requisition.amount",
        width: Constants.TABLE_COL_WIDTH.BIND_ACCOUNT
    },
    firstCatName: {
        label: "node.requisition.firstCatName",
        width: Constants.TABLE_COL_WIDTH.BIND_ACCOUNT
    },
    secondCatName: {
        label: "node.requisition.secondCatName",
        width: Constants.TABLE_COL_WIDTH.BIND_ACCOUNT
    },
    thirdCatName: {
        label: "node.requisition.thirdCatName",
        width: Constants.TABLE_COL_WIDTH.BIND_ACCOUNT
    },
    deliveryDeadlineDate: {
        label: "node.requisition.deliveryDeadlineDate",
        width: Constants.TABLE_COL_WIDTH.FUND_ACCOUNT
    },
    purpose: {
        label: "node.requisition.purpose",
        width: Constants.TABLE_COL_WIDTH.BOUND_TYPE
    },
    remarks: {
        label: "node.requisition.remarks",
        width: Constants.TABLE_COL_WIDTH.BOUND_TYPE
    },
    requestDate: {
        label: "node.requisition.requestDate",
        width: Constants.TABLE_COL_WIDTH.FUND_ACCOUNT
    },
    departmentName: {
        label: "node.requisition.departmentName",
        width: Constants.TABLE_COL_WIDTH.FUND_ACCOUNT
    },
    employeeName: {
        label: "node.requisition.employeeName",
        width: Constants.TABLE_COL_WIDTH.FUND_ACCOUNT
    },
    approveStatus: {
        label: "node.requisition.approveStatus",
        width: Constants.TABLE_COL_WIDTH.BOUND_TYPE
    },
    purchaseStatus: {
        label: "node.requisition.purchaseStatus",
        width: Constants.TABLE_COL_WIDTH.BOUND_TYPE
    },
    projectName: {
        label: "node.requisition.projectName",
        width: Constants.TABLE_COL_WIDTH.FUND_ACCOUNT
    },
    requestDesc: {
        label: "node.requisition.requestDesc",
        width: Constants.TABLE_COL_WIDTH.FUND_ACCOUNT
    },
    billNo: {
        label: "node.requisition.billNo",
        width: Constants.TABLE_COL_WIDTH.FUND_ACCOUNT
    },
    productAbstract: {
        label: "node.requisition.productAbstract",
        width: Constants.TABLE_COL_WIDTH.FUND_ACCOUNT
    },
    requisitionQuantity: {
        label: "node.requisition.requisitionQuantity",
        width: Constants.TABLE_COL_WIDTH.FUND_ACCOUNT
    },
    purchaseQuantity: {
        label: "node.requisition.purchaseQuantity",
        width: Constants.TABLE_COL_WIDTH.FUND_ACCOUNT
    },
    toPurchaseQuantity: {
        label: "node.requisition.toPurchaseQuantity",
        width: Constants.TABLE_COL_WIDTH.FUND_ACCOUNT
    },
    enterQuantity: {
        label: "node.requisition.enterQuantity",
        width: Constants.TABLE_COL_WIDTH.FUND_ACCOUNT
    },
    returnNum: {
        label: "node.requisition.returnNum",
        width: Constants.TABLE_COL_WIDTH.FUND_ACCOUNT
    }
};

const filterMap = {

    deliveryDeadlineDate: {
        label: "node.requisition.deliveryDeadlineDate1",
        width: '200',
        type: 'datePicker'
    },
    requestDate: {
        label: "node.requisition.requestDate",
        width: '200',
        type: 'datePicker'
    },
    projectName: {
        label: "node.requisition.projectName",
        width: '200',
        type: 'project'
    },
    property_value: {
        label: "node.purchase.property_value",
        width: '200',
        type: 'custom'
    },
    purpose: {
        label: "node.requisition.purpose",
        width: '200',
        type: 'input'
    },
    purchaseStatus: {
        label: "node.requisition.purchaseStatus",
        width: '200',
        type: 'select',
        options: [
            {label: "node.requisition.purchaseStatusOption0", value: "0"},
            {label: "node.requisition.purchaseStatusOption1", value: "1"},
            {label: "node.requisition.purchaseStatusOption2", value: "2"}
        ]
    },
    catCode:{
        label: "report.purchaseRefundSummaryByProd.catCode",
        width: '200',
        type: 'category'
    }
};

function dealFilterConfig(list, customMap, invisibleGroup) {
    let arr = list && list.map(function (item) {
        let config = filterMap[item.columnName];
        config.fieldName = item.columnName;
        config.visibleFlag = item.visibleFlag;
        config.originVisibleFlag = item.visibleFlag;
        config.recId = item.recId;
        config.displayFlag = false;
        if (config.fieldName === "property_value") {
            config.options = Object.values(customMap);
        }
        if(invisibleGroup.indexOf(item.columnName) !== -1){
            config.displayFlag = true;
            config.visibleFlag = false;
        }
        return config
    });
    return arr;
}

function dealTableConfig(list, customMap, invisibleGroup) {
    let newList = [];
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
                columnName: item.columnName,
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
        const supplierColumns = [{
            fieldName: 'billNo',
            columnName: 'billNo',
            label: 'node.requisition.billNo',
            width: Constants.TABLE_COL_WIDTH.NO,
            visibleFlag: 1,
            cannotEdit: true
        },{
            fieldName: 'purchaseStatus',
            columnName: 'purchaseStatus',
            label: 'node.requisition.purchaseStatus',
            width: Constants.TABLE_COL_WIDTH.NO,
            visibleFlag: 1,
            cannotEdit: true
        },{
            fieldName: 'productAbstract',
            columnName: 'purchaseStatus',
            label: 'node.requisition.productAbstract',
            width: Constants.TABLE_COL_WIDTH.NO,
            visibleFlag: 1,
            cannotEdit: true
        }];
        newList = supplierColumns.concat(newList);
    }
    return newList;
}


/* 请购单列表. */
router.get('/list', function (req, res, next) {
    const params = req.query;
    params.perPage = params.perPage ? parseInt(params.perPage) : Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req, res);
    params.headers = {
        "Content-Type": 'application/json'
    };
    let url = `/pc/v1/${session.userIdEnc}/requisition/list`;
    backend.post(url, params, req, res, function (data) {
        logger.info('ppggddd', JSON.stringify(data));
        if (data && data.retCode == 0) {
            let {quantityDecimalNum, priceDecimalNum} = req.cookies;
            let customMap = DataFilter.dealCustomField(data.tags);
            let list = data.data;
            let i = 1;
            list.forEach(function (item) {
                item.key = item.recId;
                item.serial = i++;
                let drList = item.drList;
                let propertyValue = {};
                drList.forEach((value)=>{
                    propertyValue[value["propName"]] = value["propValue"]
                });

                item.purchaseQuantity = Decimal.fixedDecimal(item.purchaseQuantity, quantityDecimalNum);
                item.toPurchaseQuantity = Decimal.fixedDecimal(item.toPurchaseQuantity, quantityDecimalNum);
                item.enterQuantity = Decimal.fixedDecimal(item.enterQuantity, quantityDecimalNum);
                item.requisitionQuantity = Decimal.fixedDecimal(item.requisitionQuantity, quantityDecimalNum);

                [1,2,3,4,5].forEach((index)=>{
                    item['property_value'+index] = propertyValue['property_value'+index] && propertyValue['property_value'+index];
                })
            });

            let invisibleGroup = []; //数组中的属性在页面中将隐藏
            data.approveModuleFlag !== 1 && (invisibleGroup.push('approveStatus')); // approveModuleFlag 主账号审批是否开启并非权限

            let tableConfigList = dealTableConfig(data.listFields, customMap, invisibleGroup);
            res.json({
                retCode: 0,
                list: list,
                approveFlag: data.approveFlag||0, //是否有审批权
                approveModuleFlag: data.approveModuleFlag,
                filterConfigList: dealFilterConfig(data.searchFields,customMap,invisibleGroup),
                tableConfigList: tableConfigList,
                totalAmount: data.totalAmount,
                pageAmount: data.pageAmount,
                customMap: customMap,
                pagination: {
                    total: data.count,
                    current: params.page,
                    pageSize: params.perPage
                }
            });
        } else {
            res.json({
                retCode: 1,
                retMsg: "网络异常，请稍后重试！"
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
    backend.get(`/pc/v1/${session.userIdEnc}/requisition/mainProdAbstract`, params, req, res, function (data) {
        res.json(data)
    });
});


/*删除请购单*/
router.post('/delete', function (req, res) {
    const params = {
        vo1: req.body.ids
    };
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.delete(`/pc/v1/${session.userIdEnc}/requisition`, params, req, res, function (data) {
        res.json(data);
    });
});

/*删除前判断是否删除*/
router.post('/pre/delete', function (req, res) {
    const params = {
        vo1: req.body.ids
    };
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/requisition/pre/delete`, params, req, res, function (data) {
        res.json(data);
    });
});

/* 请购单预加载*/
router.get('/pre/create', function (req, res, next) {
    const params = req.query;
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/requisition/pre/create`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            data.prodDataTags = PropertyFilter.initCustomTags(data.prodDataTags, 'prod_');
            const prodCustomMap = DataFilter.dealCustomField(data.prodDataTags);
            data.listFields = PropertyFilter.dealGoodsTableConfig(data.listFields, prodCustomMap,{});
            res.json(data);
        } else {
            res.json({
                retCode: '1',
                retMsg: "网络异常，请稍后重试！"
            });
        }
    });
});

/* 新增请购单 */
router.post('/add', function (req, res, next) {
    const params = req.body;
    // const userId = 'nEoAUdKFbkYs';
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/requisition`, params, req, res, function (data) {
        res.json(data);
    });
});

/* 修改请购单 */
router.post('/modify/:billNo', function (req, res, next) {
    const params = req.body;
    // const userId = 'nEoAUdKFbkYs';
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.put(`/pc/v1/${session.userIdEnc}/requisition/${req.params.billNo}`, params, req, res, function (data) {
        res.json(data);
    });
});

//请购单详情页
router.get('/detail/:id', function (req, res) {
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/requisition/detail/${req.params.id}`, req, res, function (data) {
        if (data && data.retCode == 0) {
            data.prodDataTags = PropertyFilter.initCustomTags(data.prodDataTags, 'prod_');
            const prodCustomMap = DataFilter.dealCustomField(data.prodDataTags);
            data.listFields = PropertyFilter.dealGoodsTableConfig(data.listRequisitionFields, prodCustomMap,[]);
            if(data.data && data.data.prodList){
                data.data.prodList = PropertyFilter.dealProdCustomField({list: data.data.prodList, prefix: 'prod_', propertyKey: 'prodPropertyValues'});
            }
            data.approveFlag =  data.approveFlag||0;
            data.approveModuleFlag = data.approveModuleFlag||0; // approveModuleFlag 主账号审批是否开启并非权限
            data.data.isCreator = data.isCreator;
            data.data.isAssignee = (data.approveTask?true:false);
            data.data.approveCancel = data.approveCancel;
            //自定义字段
            let propertyValues = {};
            data.requisitionPropList && data.requisitionPropList.forEach(item => {
                if(item.propValue){
                    propertyValues[item.propName] = item.propValue;
                }
            });
            data.data.propertyValues = propertyValues;
            res.json(data);
        } else {
            res.json({
                retCode: '1',
                retMsg: "网络异常，请稍后重试！"
            });
        }
    });
});

// 操作日志
router.get('/approve/log/:billNo', function (req, res, next) {
    const session = Session.get(req, res);
    let billNo = req.params.billNo;
    const params = {
        userId: session.userIdEnc,
        billNo
    };
    backend.get(`/pc/v1/${session.userIdEnc}/requisition/approve/log/${billNo}`, params, req, res, function (data) {
        res.json(data);
    });
});

// 工序列表 联想功能
router.get('/search/by/field', function (req, res) {
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/workprocess/search/tips`, req.query, req, res, function (data) {
        res.json(data)
    });
});

// 采购申请明细列表
function dealTableConfigForApplyList(list, customMap, invisibleGroup) {
    let newList = [];
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
        const supplierColumns = [{
            fieldName: 'billNo',
            label: 'node.requisition.billNo',
            width: Constants.TABLE_COL_WIDTH.NO,
            visibleFlag: 1,
            cannotEdit: true
        },{
            fieldName: 'prodName',
            label: 'node.requisition.prodName',
            width: Constants.TABLE_COL_WIDTH.NO,
            visibleFlag: 1,
            cannotEdit: true
        },{
            fieldName: 'requisitionQuantity',
            label: 'node.requisition.requisitionQuantity',
            width: Constants.TABLE_COL_WIDTH.NO,
            visibleFlag: 1,
            cannotEdit: true
        }];
        newList = supplierColumns.concat(newList);
    }
    return newList;
}

function dealCustomField(prodTags) {
    let obj = {};
    prodTags && prodTags.forEach(function (item) {
        if (item.propName !== "") {
            const propertyIndex = item.mappingName && parseInt(item.mappingName.substr(item.mappingName.length - 1));
            if (item.propName !== "" && item.mappingName) {
                obj['prodPropertyValue' + propertyIndex] = {
                    columnName: 'prodPropertyValue' + propertyIndex,
                    label: item.propName,
                    value: item.mappingName,
                    visibleFlag: item.visibleFlag,
                    originVisibleFlag: item.visibleFlag
                };
            }

        }
    });

    return obj;
}




/* 采购申请明细列表. */
router.get('/apply/list', function (req, res, next) {
    const params = req.query;
    params.perPage = params.perPage ? parseInt(params.perPage) : Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req, res);
    params.headers = {
        "Content-Type": 'application/json'
    };
    let url = `/pc/v1/${session.userIdEnc}/requisition/purchase/requisition/list`;
    backend.post(url, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            data.tags = PropertyFilter.initCustomTags(data.tags);
            data.prodDataTags = PropertyFilter.initCustomTags(data.prodDataTags,'prod_');

            let customMap = PropertyFilter.dealCustomField(data.tags, data.prodDataTags);
            let {quantityDecimalNum} = req.cookies;
            let list = data.data;
            list = list.map((item, index) => {
                item.key = index;
                item.serial = index + 1;
                item.purchaseQuantity = Decimal.fixedDecimal(item.purchaseQuantity, quantityDecimalNum);
                item.toPurchaseQuantity = Decimal.fixedDecimal(item.toPurchaseQuantity, quantityDecimalNum);
                item.enterQuantity = Decimal.fixedDecimal(item.enterQuantity, quantityDecimalNum);
                item.requisitionQuantity = Decimal.fixedDecimal(item.requisitionQuantity, quantityDecimalNum);

                let propertyValues = PropertyFilter.initCustomProperties(data.tags, item.propertyValues);
                let prodPropertyValues = PropertyFilter.initCustomProperties(data.prodDataTags, item.prodPropertyValues, 'prod_');
                item = {...item, ...propertyValues,...prodPropertyValues};
                return item;
            });
            let invisibleGroup = []; //数组中的属性在页面中将隐藏
            //data.approveModuleFlag !== 1 && (invisibleGroup.push('approveStatus')); // approveModuleFlag 主账号审批是否开启并非权限
            let tableConfigList = dealTableConfigForApplyList(data.listFields,customMap,invisibleGroup);

            res.json({
                retCode: 0,
                list: list,
                approveFlag: data.approveFlag||0, //是否有审批权
                approveModuleFlag: data.approveModuleFlag,
                filterConfigList: dealFilterConfig(data.searchFields,customMap,invisibleGroup),
                tableConfigList: tableConfigList,
                totalAmount: data.totalAmount,
                pageAmount: data.pageAmount,
                customMap: customMap,
                pagination: {
                    total: data.count,
                    current: params.page,
                    pageSize: params.perPage
                }
            });
        } else {
            res.json({
                retCode: 1,
                retMsg: "网络异常，请稍后重试！"
            });
        }
    });
});



module.exports = router;
