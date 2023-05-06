const express = require('express');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const Constants = require('../../../../lib/constants');
const DataFilter = require('../../../../lib/utils/DataFilter');
const Decimal = require('../../../../lib/utils/Decimal');

const map = {
    customerName: {
        label: "node.report.saleRefundSummaryByProd.customerName"
    },
    firstCatName: {
        label: "node.report.saleRefundSummaryByProd.firstCatName"
    },
    secondCatName: {
        label: "node.report.saleRefundSummaryByProd.secondCatName"
    },
    thirdCatName: {
        label: "node.report.saleRefundSummaryByProd.thirdCatName"
    },
    saleOrderDate: {
        label: "node.report.saleRefundSummaryByProd.saleOrderDate",
        width: Constants.TABLE_COL_WIDTH.DATE
    },
    displayCode: {
        label: "node.report.saleRefundSummaryByProd.displayCode"
    },
    prodName: {
        label: "node.report.saleRefundSummaryByProd.prodName"
    },
    descItem: {
        label: "node.report.saleRefundSummaryByProd.descItem"
    },
    actualShipmentQuantity: {
        label: "node.report.saleRefundSummaryByProd.actualShipmentQuantity",
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    proBarCode: {
        label: "node.report.saleRefundSummaryByProd.proBarCode"
    },
    brand: {
        label: "node.report.saleRefundSummaryByProd.brand"
    },
    produceModel: {
        label: "node.report.saleRefundSummaryByProd.produceModel"
    },
    saleQuantity: {
        label: "node.report.saleRefundSummaryByProd.saleQuantity",
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    saleInQuantity: {
        label: "node.report.saleRefundSummaryByProd.saleInQuantity",
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    saleOutQuantity: {
        label: "node.report.saleRefundSummaryByProd.saleOutQuantity",
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    saleAmount: {
        label: "node.report.saleRefundSummaryByProd.saleAmount",
        columnType: 'money',
        totalFlag: true
    },
    saleInAmount: {
        label: "node.report.saleRefundSummaryByProd.saleInAmount",
        columnType: 'money',
        totalFlag: true
    },
    saleOutAmount: {
        label: "node.report.saleRefundSummaryByProd.saleOutAmount",
        columnType: 'money',
        totalFlag: true
    },
    outcomingQuantity: {
        label: "node.report.saleRefundSummaryByProd.outcomingQuantity",
        columnType: 'money',
        totalFlag: true
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
    backend.post(`/pc/v1/${session.userIdEnc}/report/saleorder/return/by/prod`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum} = req.cookies;
            let customMap = dealCustomField(data.tags);
            let list = data.data;
            let i = 1;
            list.forEach(function (item) {
                item.key = i;
                item.serial = i++;
                item.saleQuantity = Decimal.fixedDecimal(item.saleQuantity, quantityDecimalNum);
                item.saleInQuantity = Decimal.fixedDecimal(item.saleInQuantity, quantityDecimalNum);
                item.saleOutQuantity = Decimal.fixedDecimal(item.saleOutQuantity, quantityDecimalNum);
                item.actualShipmentQuantity = Decimal.fixedDecimal(item.actualShipmentQuantity, quantityDecimalNum);
                if(item.outcomingQuantity < 0) item.outcomingQuantity = 0;
                item.outcomingQuantity = Decimal.fixedDecimal(item.outcomingQuantity, quantityDecimalNum);
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
/* 销售及退货汇总表. */
router.post('/detail', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req, res);

    backend.post(`/pc/v1/${session.userIdEnc}/report/saleorder/return/by/prod`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum} = req.cookies;
            let customMap = dealCustomField(data.tags);
            let list = data.data;
            let i = 1;
            list.forEach(function (item) {
                item.key = i;
                item.serial = i++;
                item.saleQuantity = Decimal.fixedDecimal(item.saleQuantity, quantityDecimalNum);
                item.saleInQuantity = Decimal.fixedDecimal(item.saleInQuantity, quantityDecimalNum);
                item.saleOutQuantity = Decimal.fixedDecimal(item.saleOutQuantity, quantityDecimalNum);
                item.actualShipmentQuantity = Decimal.fixedDecimal(item.actualShipmentQuantity, quantityDecimalNum);
                if(item.outcomingQuantity < 0) item.outcomingQuantity = 0;
                item.outcomingQuantity = Decimal.fixedDecimal(item.outcomingQuantity, quantityDecimalNum);
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
