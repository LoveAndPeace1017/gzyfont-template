const express = require('express');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const Constants = require('../../../../lib/constants');
const DataFilter = require('../../../../lib/utils/DataFilter');

const map = {
    customerName: {
        label: "node.report.grossProfit.customerName"
    },
    contacterName: {
        label: "node.report.grossProfit.contacterName"
    },
    telNo: {
        label: "node.report.grossProfit.telNo"
    },
    email: {
        label: "node.report.grossProfit.email"
    },
    customerLevel: {
        label: "node.report.grossProfit.customerLevel"
    },
    legalRepresentative: {
        label: "node.report.grossProfit.legalRepresentative"
    },
    registeredAddress: {
        label: "node.report.grossProfit.registeredAddress"
    },
    licenseNo: {
        label: "node.report.grossProfit.licenseNo"
    },
    saleName: {
        label: "node.report.grossProfit.saleName"
    },
    inventoryPrice: {
        label: "node.report.grossProfit.inventoryPrice",
        totalFlag: true
    },
    saleCostAmountAll: {
        label: "node.report.grossProfit.saleCostAmountAll",
        totalFlag: true
    },
    prodProfit: {
        label: "node.report.grossProfit.prodProfit",
        totalFlag: true
    },
    profitRate: {
        label: "node.report.grossProfit.profitRate1"
    },
    noTaxInventoryPrice: {
        label: "node.report.grossProfit.noTaxInventoryPrice",
        totalFlag: true
    },
    noTaxSaleCostAmountAll: {
        label: "node.report.grossProfit.noTaxSaleCostAmountAll",
        totalFlag: true
    },
    noTaxProdProfit: {
        label: "node.report.grossProfit.noTaxProdProfit",
        totalFlag: true
    },
    noTaxProfitRate: {
        label: "node.report.grossProfit.noTaxProfitRate"
    },
};


function dealFilterConfig() {
}

function dealTableConfig(list, customMap) {
    let newList = [];
    list && list.forEach(function (item) {
        let obj = map[item.columnName];
        obj = obj || (customMap && customMap[item.columnName]);
        if (obj) {
            newList.push({
                fieldName: item.columnName,
                label: obj.label,
                width: item.columnWidth||obj.width||Constants.TABLE_COL_WIDTH.DEFAULT,
                cannotEdit:item.cannotEdit||null,
                recId: item.recId,
                visibleFlag: item.visibleFlag,
                originVisibleFlag: item.visibleFlag,
                totalFlag: obj.totalFlag
            });
        }else {
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

function dealCustomField(tags) {
    let obj = {};
    tags && tags.forEach(function (item) {
        if (item.propName !== "") {
            const propertyIndex = item.mappingName && parseInt(item.mappingName.slice(-1));
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


router.post('/export', function (req, res, next) {
    const params = req.body;
    params.customerName = params.customerName && params.customerName.join(',');
    delete params.page;
    delete params.perPage;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/report/ware/customer/profit`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let customMap = dealCustomField(data.tags);
            let list = data.data;
            list.forEach(function(item, index){
                item.key = index;
                item.serial = index+1;
            });
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            let tableData = DataFilter.exportData(tableConfigList,list);
            tableData = DataFilter.dealFooterTotalFieldForExport(tableConfigList,data.totalMap,tableData);
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
/* 物品毛利润报表 */
router.post('/detail', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    params.customerName = params.customerName && params.customerName.join(',');
    const session = Session.get(req, res);

    backend.post(`/pc/v1/${session.userIdEnc}/report/ware/customer/profit`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let customMap = dealCustomField(data.tags, data.OrderTags);
            let list = data.data;

            list.forEach(function(item, index){
                item.key = index;
                item.serial = index+1;
            });
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            let tableData = DataFilter.dealFooterTotalFieldForList(tableConfigList,data.totalMap,list);
            let tableWidth = tableConfigList && tableConfigList.reduce(function (width, item) {
                return width + (item.width ? item.width : 200) / 1;
            }, 0);
            res.json({
                retCode: 0,
                list: tableData,
                filterConfigList: dealFilterConfig(),
                tableConfigList: tableConfigList,
                tableWidth: tableWidth,
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

