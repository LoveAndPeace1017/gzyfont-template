const express = require('express');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const Constants = require('../../../../lib/constants');
const DataFilter = require('../../../../lib/utils/DataFilter');
const Decimal = require('../../../../lib/utils/Decimal');

const map = {
    displayBillNo: {
        label: "node.report.saleGrossProfitForecast.displayBillNo"
    },
    warehouseName: {
        label: "node.report.saleGrossProfitForecast.warehouseName"
    },
    customerName: {
        label: "node.report.saleGrossProfitForecast.customerName"
    },
    customerContacterName: {
        label: "node.report.saleGrossProfitForecast.customerContacterName"
    },
    customerTelNo: {
        label: "node.report.saleGrossProfitForecast.customerTelNo"
    },
    prodDisplayCode: {
        label: "node.report.saleGrossProfitForecast.prodDisplayCode"
    },
    prodName: {
        label: "node.report.saleGrossProfitForecast.prodName"
    },
    descItem: {
        label: "node.report.saleGrossProfitForecast.descItem"
    },
    unit: {
        label: "node.report.saleGrossProfitForecast.unit"
    },
    brand: {
        label: "node.report.saleGrossProfitForecast.brand"
    },
    produceModel: {
        label: "node.report.saleGrossProfitForecast.produceModel"
    },
    quantity: {
        label: "node.report.saleGrossProfitForecast.quantity",
        columnType: 'decimal-quantity'
    },
    unitPrice: {
        label: "node.report.saleGrossProfitForecast.unitPrice",
        columnType: 'decimal-money'
    },
    untaxedPrice: {
        label: "node.report.saleGrossProfitForecast.untaxedPrice",
        columnType: 'decimal-money'
    },
    amount: {
        label: "node.report.saleGrossProfitForecast.amount",
        totalFlag: true
    },
    untaxedAmount: {
        label: "node.report.saleGrossProfitForecast.untaxedAmount",
        columnType: 'decimal-money'
    },
    unitCost: {
        label: "node.report.saleGrossProfitForecast.unitCost",
        columnType: 'decimal-money'
    },
    untaxedUnitCost: {
        label: "node.report.saleGrossProfitForecast.untaxedUnitCost",
        columnType: 'decimal-money'
    },
    profit: {
        label: "node.report.saleGrossProfitForecast.profit",
        totalFlag: true,
        columnType: 'decimal-money'
    },
    untaxedProfit: {
        label: "node.report.saleGrossProfitForecast.untaxedProfit",
        totalFlag: true,
        columnType: 'decimal-money'
    },
    ourContacterName: {
        label: 'node.report.sale.ourContacterName',
        width: Constants.TABLE_COL_WIDTH.PERSON
    }
};

function dealTableConfig(list, customMap) {
    let newList = [];
    list && list.forEach(function (item) {
        let obj = map[item.columnName];
        obj = obj || (customMap && customMap[item.columnName]);
        if (obj) {
            if(item.columnName === 'customerName'){
                item.cannotEdit = true;
                item.visibleFlag = 1;
            }
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

/* 销售及退货汇总表. */
router.post('/export', function (req, res, next) {
    const params = req.body;
    delete params.page;
    delete params.perPage;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}}/report/saleorder/profit`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum} = req.cookies;
            let customMap = dealCustomField(data.tags);
            let list = data.data;
            let i = 1;
            list.forEach(function (item) {
                item.key = i;
                item.serial = i++;
            });
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            let tableData = DataFilter.exportData(tableConfigList,list);
            let decimalMap = {quantityDecimalNum};
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
/* 销售毛利预测表 */
router.post('/detail', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req, res);

    backend.post(`/pc/v1/${session.userIdEnc}/report/saleorder/profit`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum} = req.cookies;
            let customMap = dealCustomField(data.tags);
            let list = data.data;
            let i = 1;
            list.forEach(function (item) {
                item.key = i;
                item.serial = i++;
            });
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            let decimalMap = {quantityDecimalNum};
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
