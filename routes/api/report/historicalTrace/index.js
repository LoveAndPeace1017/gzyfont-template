const express = require('express');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const Constants = require('../../../../lib/constants');
const DataFilter = require('../../../../lib/utils/DataFilter');
const Decimal = require('../../../../lib/utils/Decimal');
const PropertyFilter = require('../../../../lib/utils/PropertyFilter');
const moment = require('moment');

const map = {
    productCode: {
        label: "node.report.saleSummaryByProd.productCode"
    },
    displayCode: {
        label: "node.report.saleSummaryByProd.productCode"
    },
    productName: {
        label: "node.report.saleSummaryByProd.prodName"
    },
    description: {
        label: "node.report.saleSummaryByProd.descItem"
    },
    brand: {
        label: "node.report.saleSummaryByProd.brand"
    },
    produceModel: {
        label: "node.report.saleSummaryByProd.produceModel"
    },
    serialNumber: {
        label: "node.report.saleSummaryByProd.serialize"
    },
   batchNo: {
       label: "node.report.saleSummaryByProd.batchNo"
   },
   warehouseName: {
       label: "node.report.saleSummaryByProd.warehouseName"
   },
   produceBillNo: {
       label: "node.report.saleSummaryByProd.produceBillNo"
   },
   workBillNo: {
       label: "node.report.saleSummaryByProd.workBillNo"
   },
   ourContacterName: {
       label: "node.report.saleSummaryByProd.ourContacterName"
   },
   billType: {
        label: "node.report.saleSummaryByProd.billType"
   },
   date: {
       label: "node.report.saleSummaryByProd.date"
   },
   billNo: {
        label: "node.report.saleSummaryByProd.billNo"
   },
   processName:{
       label: "node.report.saleSummaryByProd.processName"
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
                originVisibleFlag: item.visibleFlag,
                totalFlag: obj.totalFlag
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

function dealCustomField(prodTags) {
    let obj = {};
    prodTags && prodTags.forEach(function (item) {
        if (item.propName !== "") {
            if (item.propName !== "" && item.mappingName) {
                obj[item.mappingName] = {
                    fieldName: item.mappingName,
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
router.post('/export', function (req, res, next) {
    const params = req.body;
    delete params.page;
    delete params.perPage;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/report/ware/historical/retrospection`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum, priceDecimalNum} = req.cookies;
            data.tags = PropertyFilter.initCustomTags(data.tags);
            let customMap = dealCustomField(data.tags);
            let list = data.data;
            let i = 1;
            list = list.map(function (item) {
                item.key = i;
                item.serial = i++;
                let propertyValues = PropertyFilter.initCustomProperties(data.tags, item.propertyValues);
                item.date = item.date?moment(item.date).format('YYYY-MM-DD'):'';
                item = {...item, ...propertyValues};
                return item;
            });
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            let tableData = DataFilter.exportData(tableConfigList,list);
            let decimalMap = {quantityDecimalNum, priceDecimalNum};
            tableData = DataFilter.dealFooterTotalFieldForExport(tableConfigList,data.totalMap,tableData, decimalMap);
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

router.post('/detail', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req, res);

    backend.post(`/pc/v1/${session.userIdEnc}/report/ware/historical/retrospection`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum, priceDecimalNum} = req.cookies;
            data.tags = PropertyFilter.initCustomTags(data.tags);
            let customMap = dealCustomField(data.tags);
            let list = data.data;
            let i = 1;
            list = list.map(function (item) {
                item.key = i;
                item.serial = i++;
                let propertyValues = PropertyFilter.initCustomProperties(data.tags, item.propertyValues);
                item = {...item,...propertyValues};
                return item;
            });
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            let decimalMap = {quantityDecimalNum, priceDecimalNum};
            let tableData = DataFilter.dealFooterTotalFieldForList(tableConfigList,data.totalMap,list, decimalMap);

            let tableWidth = tableConfigList && tableConfigList.reduce(function (width, item) {
                return width + (item.width ? item.width : 200) / 1;
            }, 0);
            res.json({
                retCode: 0,
                list: tableData,
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

module.exports = router;
