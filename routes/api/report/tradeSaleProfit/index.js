const express = require('express');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const Constants = require('../../../../lib/constants');
const DataFilter = require('../../../../lib/utils/DataFilter');
const Decimal = require('../../../../lib/utils/Decimal');
const PropertyFilter = require('../../../../lib/utils/PropertyFilter');

const map = {
    saleOrderDate: {
        label: "node.report.tradeSaleProfit.saleOrderDate",
        width: Constants.TABLE_COL_WIDTH.DATE,
    },
    displayBillNo: {
        label: "node.report.tradeSaleProfit.displayBillNo"
    },
    customerName: {
        label: "node.report.tradeSaleProfit.customerName"
    },
    customerContacterName: {
        label: "node.report.tradeSaleProfit.customerContacterName"
    },
    customerTelNo: {
        label: "node.report.tradeSaleProfit.customerTelNo"
    },
    currencyName: {
        label: 'node.report.tradeSaleProfit.currencyName'
    },
    quotation: {
        label: 'node.report.tradeSaleProfit.quotation'
    },
    warehouseName: {
        label: 'node.report.tradeSaleProfit.warehouseName'
    },
    deliveryAddress: {
        label: "node.report.tradeSaleProfit.deliveryAddress"
    },
    projectName: {
        label: 'node.report.tradeSaleProfit.projectName'
    },
    settlement: {
        label: 'node.report.tradeSaleProfit.settlement'
    },
    customerOrderNo: {
        label: 'node.report.tradeSaleProfit.customerOrderNo'
    },
    ourContacterName: {
        label: 'node.report.tradeSaleProfit.ourContacterName'
    },
    ourTelNo: {
        label: 'node.report.tradeSaleProfit.ourTelNo'
    },
    remarks: {
        label: 'node.report.tradeSaleProfit.remarks'
    },
    totalQuantity: {
        label: "node.report.tradeSaleProfit.totalQuantity",
        columnType: 'decimal-quantity',
    },
    taxAllAmount: {
        label: "node.report.tradeSaleProfit.taxAllAmount",
        columnType: 'decimal-money',
    },
    discountAmount: {
        label: "node.report.tradeSaleProfit.discountAmount",
        columnType: 'decimal-money',
    },
    aggregateAmount: {
        label: "node.report.tradeSaleProfit.aggregateAmount",
        columnType: 'decimal-money',
    },
    currencyAggregateAmount: {
        label: "node.report.tradeSaleProfit.currencyAggregateAmount",
        columnType: 'decimal-money',
    },
    purchaseAmount: {
        label: "node.report.tradeSaleProfit.purchaseAmount",
        columnType: 'decimal-money',
    },
    purchaseTax: {
        label: "node.report.tradeSaleProfit.purchaseTax",
        columnType: 'decimal-money',
    },
    profit: {
        label: "node.report.tradeSaleProfit.profit",
        columnType: 'decimal-money',
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

function dealCustomField(tags, saleTags) {
    let obj = {};
    tags && tags.forEach(function (item) {
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

    saleTags && saleTags.forEach(function (item) {
        if (item.propName !== "") {
            if (item.propName !== "" && item.mappingName) {
                obj['sale_' + item.mappingName] = {
                    fieldName: 'sale_' + item.mappingName,
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
/* 采购. */
router.post('/export', function (req, res, next) {
    const params = req.body;
    delete params.page;
    delete params.perPage;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/report/saleorder/trade/profit`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum, priceDecimalNum} = req.cookies;
            data.saleDataTags = PropertyFilter.initCustomTags(data.saleDataTags);
            let customMap = DataFilter.dealCustomField(data.saleDataTags);

            let list = data.data;
            list = list.map((item, index) => {
                item.key = index;
                item.serial = index + 1;
                item.totalQuantity = Decimal.fixedDecimal(item.totalQuantity, quantityDecimalNum);
                item.taxAllAmount = Decimal.fixedDecimal(item.taxAllAmount, priceDecimalNum);
                item.discountAmount = Decimal.fixedDecimal(item.discountAmount, priceDecimalNum);
                item.aggregateAmount = Decimal.fixedDecimal(item.aggregateAmount, priceDecimalNum);
                item.currencyAggregateAmount = Decimal.fixedDecimal(item.currencyAggregateAmount, priceDecimalNum);
                item.purchaseAmount = Decimal.fixedDecimal(item.purchaseAmount, priceDecimalNum);
                item.purchaseTax = Decimal.fixedDecimal(item.purchaseTax, priceDecimalNum);
                item.profit = Decimal.fixedDecimal(item.profit, priceDecimalNum);
                let salePropertyValues = PropertyFilter.initCustomProperties(data.saleDataTags, item.propertyValues);
                item = {...item, ...salePropertyValues};
                return item;
            });
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            let tableData = DataFilter.exportData(tableConfigList,list);
            let decimalMap = {quantityDecimalNum, priceDecimalNum};
            tableData = DataFilter.dealFooterTotalFieldForExport(tableConfigList,data.totalMap||{},tableData, decimalMap);
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
/* 采购. */
router.post('/detail', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req, res);

    backend.post(`/pc/v1/${session.userIdEnc}/report/saleorder/trade/profit`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum, priceDecimalNum} = req.cookies;
            data.saleDataTags = PropertyFilter.initCustomTags(data.saleDataTags);
            let customMap = DataFilter.dealCustomField(data.saleDataTags);

            let list = data.data;
            list = list.map((item, index) => {
                item.key = index;
                item.serial = index + 1;
                item.totalQuantity = Decimal.fixedDecimal(item.totalQuantity, quantityDecimalNum);
                item.taxAllAmount = Decimal.fixedDecimal(item.taxAllAmount, priceDecimalNum);
                item.discountAmount = Decimal.fixedDecimal(item.discountAmount, priceDecimalNum);
                item.aggregateAmount = Decimal.fixedDecimal(item.aggregateAmount, priceDecimalNum);
                item.currencyAggregateAmount = Decimal.fixedDecimal(item.currencyAggregateAmount, priceDecimalNum);
                item.purchaseAmount = Decimal.fixedDecimal(item.purchaseAmount, priceDecimalNum);
                item.purchaseTax = Decimal.fixedDecimal(item.purchaseTax, priceDecimalNum);
                item.profit = Decimal.fixedDecimal(item.profit, priceDecimalNum);

                let salePropertyValues = PropertyFilter.initCustomProperties(data.saleDataTags, item.propertyValues);
                item = {...item, ...salePropertyValues};
                return item;
            });
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            let tableWidth = tableConfigList && tableConfigList.reduce(function (width, item) {
                return width + (item.width ? item.width : 200) / 1;
            }, 0);
            let decimalMap = {quantityDecimalNum, priceDecimalNum};
            let tableData = DataFilter.dealFooterTotalFieldForList(tableConfigList,data.totalMap||{},list,decimalMap);

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
