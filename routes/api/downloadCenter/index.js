const express = require('express');
const router = express.Router();
const backend = require('../../../lib/backend');
const Session = require('../../../lib/session');
const Constants = require('../../../lib/constants');
const DataFilter = require('../../../lib/utils/DataFilter');
const Decimal = require('../../../lib/utils/Decimal');
const downloadMenu = require('../../../lib/utils/downloadMenu');
const PropertyFilter = require('../../../lib/utils/PropertyFilter');
const allMap = downloadMenu.allMap;
const allFn = downloadMenu.allFn;


//下载中心列表
router.post('/list', function(req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req,res);

    backend.get(`/pc/v1/${session.userIdEnc}/report/task/list`, params, req, res, function(data) {
        let pagination = {
            total:data.count,
            current:params.page*1,
            pageSize:params.perPage*1
        }
        data.pagination = pagination;
        res.json(data)
    });
});

//物品库存金额汇总表
router.post('/report/inventoryPrice/', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req, res);

    backend.post(`/pc/v1/${session.userIdEnc}/report/task/InventoryPrice/by/prod`, params, req, res, function (data) {
        res.json(data);
    });

});

//物品库存金额汇总表（未税）
router.post('/report/inventoryPriceUntax/', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req, res);

    backend.post(`/pc/v1/${session.userIdEnc}/report/task/InventoryNotaxPrice/by/prod`, params, req, res, function (data) {
        res.json(data);
    });

});

//生产BOM下载
router.post('/report/multiBom/', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/report/task/production-bom/detail/export`, params, req, res, function (data) {
        res.json(data);
    });
});

//销售毛利预测表
router.post('/report/saleGrossProfitForecast/', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    /*params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;*/

    params.perPage && delete params.perPage;
    params.page && delete params.page;

    const session = Session.get(req, res);

    backend.post(`/pc/v1/${session.userIdEnc}/report/task/saleOrderProfit`, params, req, res, function (data) {
        res.json(data);
    });

});

//毛利润统计表（按客户）
router.post('/report/grossProfitCustomer/', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req, res);

    backend.post(`/pc/v1/${session.userIdEnc}/report/task/customer/profit/export`, params, req, res, function (data) {
        res.json(data);
    });

});

//下载接口
router.post('/download/', function (req, res, next) {
    const params = req.body;
    let taskId = params.taskId;
    let reportType = params.reportType;
    let param={};
    param.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    let url = `/pc/v1/${session.userIdEnc}/report/task/info/${taskId}`;
    backend.get(url, param,req, res, function (data) {
        if (data && data.retCode == 0) {
            if(reportType === '物品库存金额汇总表' || reportType === '物品库存金额汇总表（未税）'){
                let {quantityDecimalNum, priceDecimalNum} = req.cookies;
                data.tags = PropertyFilter.initCustomTags(data.tags,'prod_');
                let customMap =  allFn[reportType].dealCustomField(data.tags, data.OrderTags);
                let list = data.data;
                let i = 1;
                list = list.map(function(item, index){
                    item.key = index;
                    item.serial = i++;
                    item.originalAmount = item.originalCost;
                    item.finalAmount = item.finalCost;

                    item.originalQuantity = Decimal.fixedDecimal(item.originalQuantity, quantityDecimalNum);
                    item.originalUnitCost = Decimal.fixedDecimal(item.originalUnitCost, priceDecimalNum);
                    item.enterQuantity = Decimal.fixedDecimal(item.enterQuantity, quantityDecimalNum);
                    item.outQuantity = Decimal.fixedDecimal(item.outQuantity, quantityDecimalNum);
                    item.finalUnitCost = Decimal.fixedDecimal(item.finalUnitCost, priceDecimalNum);
                    item.finalQuantity = Decimal.fixedDecimal(item.finalQuantity, quantityDecimalNum);

                    if(item.finalQuantity<0 || item.originalQuantity<0){
                        item.originalUnitCost = '--';
                        item.finalUnitCost = '--';
                        item.finalCost = '--';
                        item.originalCost = '--';
                        //item.enterAmount = '--';
                        item.outCost = '--';
                        item.originalAmount = '--';
                        item.finalAmount =  '--';
                    }
                    let prodPropertyValues = PropertyFilter.initCustomProperties(data.tags, item.prodPropertyValues,'prod_');
                    item = {...item, ...prodPropertyValues};
                    return item;
                });

                let tableConfigList =  allFn[reportType].dealTableConfig(data.listFields || [], customMap,reportType);
                let tableData = DataFilter.exportData(tableConfigList,list,reportType);
                let totalMap = data.totalMap;
                totalMap["originalAmountTotal"] = data.originalCostTotal;
                totalMap["finalAmountTotal"] = data.finalCostTotal;
                totalMap["outCostTotal"] = data.outCostTotal;
                let decimalMap = {quantityDecimalNum, priceDecimalNum};
                tableData = DataFilter.dealFooterTotalFieldForExport(tableConfigList,totalMap,tableData, decimalMap,reportType);
                res.json({
                    retCode: 0,
                    tableData: tableData,
                });
            }else if(reportType === '生产BOM展开'){
                let list = data.data.resultList;
                let i = 1;
                let customMap =  allFn[reportType].dealCustomField(data.data.tags);
                list.forEach(function(item, index) {
                    item.key = index;
                    item.serial = i++;
                    item.defaultFlag = item.defaultFlag?"是":"否";
                });
                let tableConfigList =  allFn[reportType].dealTableConfig(reportType, customMap);
                let tableData = DataFilter.exportData(tableConfigList,list,reportType);
                res.json({
                    retCode: 0,
                    tableData: tableData,
                });
            }else if(reportType === '销售毛利预测表'){
                let {quantityDecimalNum} = req.cookies;
                let customMap = allFn[reportType].dealCustomField(data.tags);
                let list = data.data;
                let i = 1;
                list.forEach(function (item) {
                    item.key = i;
                    item.serial = i++;
                });
                let tableConfigList =  allFn[reportType].dealTableConfig(data.listFields || [], customMap,reportType);
                let tableData = DataFilter.exportData(tableConfigList,list,reportType);
                let decimalMap = {quantityDecimalNum};
                tableData = DataFilter.dealFooterTotalFieldForExport(tableConfigList,data.totalMap,tableData, decimalMap, reportType);
                res.json({
                    retCode: 0,
                    tableData: tableData,
                });
            }else if(reportType === '毛利润统计表（按客户）'){

                let customMap = allFn[reportType].dealCustomField(data.tags);
                let list = data.data;
                list.forEach(function(item, index){
                    item.key = index;
                    item.serial = index+1;
                });
                let tableConfigList =  allFn[reportType].dealTableConfig(data.listFields || [], customMap,reportType);
                let tableData = DataFilter.exportData(tableConfigList,list,reportType);
                tableData = DataFilter.dealFooterTotalFieldForExport(tableConfigList,data.totalMap,tableData,{},reportType);
                res.json({
                    retCode: 0,
                    tableData: tableData,
                });

            }

        } else {
            res.json({
                retCode: 1,
                retMsg:  (data && data.retMsg) || "网络异常，请稍后重试！"
            });
        }
    });
});


module.exports = router;
