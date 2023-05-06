const express = require('express');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const Constants = require('../../../../lib/constants');
const DataFilter = require('../../../../lib/utils/DataFilter');
const Decimal = require('../../../../lib/utils/Decimal');
const PropertyFilter = require('../../../../lib/utils/PropertyFilter');

const map = {
    purchaseOrderDate: {
        label: "node.report.purchaseSummaryByProd.purchaseOrderDate",
        width: Constants.TABLE_COL_WIDTH.DATE
    },
    productCode: {
        label: "node.report.purchaseSummaryByProd.productCode"
    },
    prodName: {
        label: "node.report.purchaseSummaryByProd.prodName"
    },
    supplierName: {
        label: "node.report.purchaseSummaryByProd.supplierName"
    },
    descItem: {
        label: "node.report.purchaseSummaryByProd.descItem"
    },
    brand: {
        label: "node.report.purchaseSummaryByProd.brand"
    },
    produceModel: {
        label: "node.report.purchaseSummaryByProd.produceModel"
    },
    unit: {
        label: "node.report.purchaseSummaryByProd.unit"
    },
    proBarCode: {
        label: "node.report.purchaseSummaryByProd.proBarCode"
    },
    enterCount: {
        label: "node.report.purchaseSummaryByProd.enterCount",
        totalFlag: true
    },
    quantity: {
        label: "node.report.purchaseSummaryByProd.quantity",
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    avgAmount: {
        label: "node.report.purchaseSummaryByProd.avgAmount",
        columnType: 'decimal-money'
    },
    amount: {
        label: "node.report.purchaseSummaryByProd.amount",
        columnType: 'money',
        totalFlag: true
    },
    firstCatName: {
        label: "node.report.purchaseSummaryByProd.firstCatName"
    },
    secondCatName: {
        label: "node.report.purchaseSummaryByProd.secondCatName"
    },
    thirdCatName: {
        label: "node.report.purchaseSummaryByProd.thirdCatName"
    },
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

/* 采购汇总表(按物品). */
router.post('/export', function (req, res, next) {
    const params = req.body;
    delete params.page;
    delete params.perPage;
    params.headers = {
        "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/report/purchase/summary/by/prod`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum, priceDecimalNum} = req.cookies;
            data.tags = PropertyFilter.initCustomTags(data.tags,'prod_');
            let customMap = dealCustomField(data.tags);
            let list = data.data;
            let i = 1;
            list = list.map(function (item) {
                item.key = i;
                item.serial = i++;
                item.quantity = Decimal.fixedDecimal(item.quantity, quantityDecimalNum);
                item.avgAmount = Decimal.fixedDecimal(item.avgAmount, priceDecimalNum);

                let prodPropertyValues = PropertyFilter.initCustomProperties(data.tags, item.prodPropertyValues,'prod_');
                item = {...item, ...prodPropertyValues};
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
/* 采购汇总表(按物品). */
router.post('/detail', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req, res);

    backend.post(`/pc/v1/${session.userIdEnc}/report/purchase/summary/by/prod`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum, priceDecimalNum} = req.cookies;
            data.tags = PropertyFilter.initCustomTags(data.tags,'prod_');
            let customMap = dealCustomField(data.tags);
            let list = data.data;
            let i = 1;
            list = list.map(function (item) {
                item.key = i;
                item.serial = i++;
                item.quantity = Decimal.fixedDecimal(item.quantity, quantityDecimalNum);
                item.avgAmount = Decimal.fixedDecimal(item.avgAmount, priceDecimalNum);
                let prodPropertyValues = PropertyFilter.initCustomProperties(data.tags, item.prodPropertyValues,'prod_');
                item = {...item, ...prodPropertyValues};
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
