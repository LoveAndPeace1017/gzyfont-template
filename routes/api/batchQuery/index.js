const express = require('express');
const router = express.Router();
const moment = require('moment');
const backend = require('../../../lib/backend');
const Session = require('../../../lib/session');
const Constants = require('../../../lib/constants');
const DataFilter = require('../../../lib/utils/DataFilter');
const Decimal = require('../../../lib/utils/Decimal');
const PropertyFilter = require('../../../lib/utils/PropertyFilter');

const map = {
    productCode: {
        label: "report.batchQuery.productCode"
    },
    batchNo: {
        label: "report.batchQuery.batchNo"
    },
    productionDate: {
        label: "report.batchQuery.productionDate"
    },
    expirationDate: {
        label: "report.batchQuery.expirationDate"
    },
    warehouseName: {
        label: "report.batchQuery.warehouseName"
    },
    currentQuantity: {
        label: "report.batchQuery.currentQuantity",
        // columnType: 'decimal-quantity'
    },
    displayCode: {
        label: "report.batchQuery.displayCode"
    },
    name: {
        label: "report.batchQuery.name"
    },
    description: {
        label: "report.batchQuery.description"
    },
    unit: {
        label: "report.batchQuery.unit"
    },
    brand: {
        label: "report.batchQuery.brand"
    },
    produceModel: {
        label: "report.batchQuery.produceModel"
    },
    remarks: {
        label: "report.batchQuery.remarks"
    }
};


function dealTableConfig(list, customMap) {
    let newList = [];
    list && list.forEach(function (item) {
        let obj = map[item.columnName];
        obj = obj || (customMap && customMap[item.columnName]);
        if (obj) {
            newList.push({
                fieldName: item.columnName,
                label: obj.label,
                columnType: obj.columnType,
                width: item.columnWidth||obj.width||Constants.TABLE_COL_WIDTH.DEFAULT,
                cannotEdit:item.cannotEdit||null,
                recId: item.recId,
                visibleFlag: item.visibleFlag,
                originVisibleFlag: item.visibleFlag
            });
        } else {
            newList.push({
                fieldName: item.columnName,
                label: undefined,
                width: 0,
                recId: item.recId,
                visibleFlag: item.visibleFlag,
                originVisibleFlag: item.visibleFlag
            });
        }
    });
    return newList;
}

//首页批次管理列表
router.post('/home/batchnumber', function(req, res) {
    const params = req.body;
    const session = Session.get(req,res);
    params.headers = {
        "Content-Type":'application/json'
    };
    backend.post(`/pc/v1/${session.userIdEnc}/prods/home/display/batchnumber/list`, params, req, res, function(data) {
        res.json(data)
    });
});

//物品批次管理列表
router.post('/popup/batchnumber', function(req, res) {
    const session = Session.get(req,res);
    let params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };
    backend.post(`/pc/v1/${session.userIdEnc}/prods/popup/batchnumber/list`, params, req, res, function(data) {
        res.json(data)
    });
});

//报表批次管理导出
router.post('/batchnumber/export', function(req, res) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/prods/batchnumber/list`, params, req, res, function(data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum} = req.cookies;
            data.tags = PropertyFilter.initCustomTags(data.tags,'prod_');
            let customMap = DataFilter.dealCustomField(data.tags);
            let list = data.data;
            let i = 1;
            list =  list.map(function (item) {
                item.key = i;
                item.serial = i++;
                item.currentQuantity = Decimal.fixedDecimal(item.currentQuantity, quantityDecimalNum);
                item.productionDate = moment(item.productionDate).format('YYYY-MM-DD');
                item.expirationDate = moment(item.expirationDate).format('YYYY-MM-DD');

                let propertyValues = PropertyFilter.initCustomProperties(data.tags, item.propertyValues,'prod_');
                item = {...item, ...propertyValues};
                return item;
            });
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            let tableData = DataFilter.exportData(tableConfigList,list);
            res.json({
                retCode: 0,
                tableData: tableData,
            });

        } else {
            res.json({
                retCode: 1,
                retMsg:  (data && data.retMsg) || "网络异常，请稍后重试！"
            });
        }
    });
});
//报表批次管理列表
router.post('/batchnumber', function(req, res) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/prods/batchnumber/list`, params, req, res, function(data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum} = req.cookies;
            data.tags = PropertyFilter.initCustomTags(data.tags,'prod_');
            let customMap = DataFilter.dealCustomField(data.tags);
            let list = data.data;
            let i = 1;
            list =  list.map(function (item) {
                item.key = i;
                item.serial = i++;
                item.currentQuantity = Decimal.fixedDecimal(item.currentQuantity, quantityDecimalNum);
                let propertyValues = PropertyFilter.initCustomProperties(data.tags, item.propertyValues,'prod_');
                item = {...item, ...propertyValues};
                return item;
            });
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            let tableWidth = tableConfigList && tableConfigList.reduce(function (width, item) {
                return width + (item.width ? item.width : 200) / 1;
            }, 0);
            res.json({
                retCode: 0,
                list: list,
                filterConfigList: [],
                tableConfigList: tableConfigList,
                tableWidth: tableWidth,
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
                retCode: 1,
                retMsg:  (data && data.retMsg) || "网络异常，请稍后重试！"
            });
        }
    });
});


/* 修改批次管理 */
router.post('/modify', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.put(`/pc/v1/${session.userIdEnc}/prods/batch/edit`, params, req, res, function (data) {
        res.json(data);
    });
});

/* 修改记录列表. */
router.get('/record/list', function(req, res, next) {
    const params = {
        ...req.query
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page?params.page:1;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req,res);
    backend.post(`/pc/v1/${session.userIdEnc}/prods/batch/edit/list `,params,req,res,function(data){
        if(data && data.retCode === "0"){
            let list = data.data;
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

module.exports = router;
