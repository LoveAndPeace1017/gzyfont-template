const express = require('express');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const Constants = require('../../../../lib/constants');
const DataFilter = require('../../../../lib/utils/DataFilter');
const Decimal = require('../../../../lib/utils/Decimal');
const PropertyFilter = require('../../../../lib/utils/PropertyFilter');

const map = {
    firstCatName: {
        label: "node.report.inventoryPrice.firstCatName"
    },
    secondCatName: {
        label: "node.report.inventoryPrice.secondCatName"
    },
    thirdCatName: {
        label: "node.report.inventoryPrice.thirdCatName"
    },
    prodNo: {
        label: "node.report.inventoryPrice.prodNo"
    },
    prodName: {
        label: "node.report.inventoryPrice.prodName"
    },
    descItem: {
        label: "node.report.inventoryPrice.descItem"
    },
    unit: {
        label: "node.report.inventoryPrice.unit",
        width: Constants.TABLE_COL_WIDTH.UNIT
    },
    proBarCode: {
        label: "node.report.inventoryPrice.proBarCode",
        width: Constants.TABLE_COL_WIDTH.PROD_BAR
    },
    brand: {
        label: 'node.report.inventoryPrice.brand',
    },
    produceModel: {
        label: 'node.report.inventoryPrice.produceModel',
    },
    originalQuantity: {
        label: "node.report.inventoryPrice.originalQuantity",
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    originalUnitCost: {
        label: "node.report.inventoryPrice.originalUnitCost",
        columnType: 'decimal-money'
    },
    originalAmount: {
        label: "node.report.inventoryPrice.originalAmount",
        totalFlag: true
    },
    enterQuantity: {
        label: 'node.report.inventoryPrice.enterQuantity',
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    enterAmount: {
        label: 'node.report.inventoryPrice.enterAmount',
        totalFlag: true
    },
    outQuantity: {
        label: 'node.report.inventoryPrice.outQuantity',
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    outCost: {
        label: "node.report.inventoryPrice.outCost",
        totalFlag: true
    },
    finalQuantity: {
        label: "node.report.inventoryPrice.finalQuantity",
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    finalUnitCost: {
        label: "node.report.inventoryPrice.finalUnitCost",
        columnType: 'decimal-money'
    },
    finalAmount: {
        label: "node.report.inventoryPrice.finalAmount",
        totalFlag: true
    }
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
                columnType: obj.columnType,
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

function dealCustomField(tags, orderTags) {
    let obj = {};
    tags && tags.forEach(function (item) {
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

    orderTags && orderTags.forEach(function (item) {
        if (item.propName !== "") {
            const propertyIndex = item.mappingName && parseInt(item.mappingName.substr(item.mappingName.length - 1));
            if (item.propName !== "" && item.mappingName) {
                obj['orderPropertyValue' + propertyIndex] = {
                    fieldName: 'orderPropertyValue' + propertyIndex,
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


/* 出入库. */
router.post('/export', function (req, res, next) {
    const params = req.body;
    delete params.page;
    delete params.perPage;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/report/ware/InventoryPrice/by/prod`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum, priceDecimalNum} = req.cookies;
            data.tags = PropertyFilter.initCustomTags(data.tags,'prod_');
            let customMap = dealCustomField(data.tags, data.OrderTags);
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
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            let tableData = DataFilter.exportData(tableConfigList,list);
            let decimalMap = {quantityDecimalNum, priceDecimalNum};
            //含税期初结存金额、含税出库成本金额、含税期末结存金额
            let totalMap = data.totalMap;
            totalMap["originalAmountTotal"] = data.originalCostTotal;
            totalMap["finalAmountTotal"] = data.finalCostTotal;
            totalMap["outCostTotal"] = data.outCostTotal;
            tableData = DataFilter.dealFooterTotalFieldForExport(tableConfigList,totalMap,tableData, decimalMap);
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
/* 出入库. */
router.post('/detail', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req, res);

    backend.post(`/pc/v1/${session.userIdEnc}/report/ware/InventoryPrice/by/prod`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum, priceDecimalNum} = req.cookies;
            data.tags = PropertyFilter.initCustomTags(data.tags,'prod_');
            let customMap = dealCustomField(data.tags, data.OrderTags);
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
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            let decimalMap = {quantityDecimalNum, priceDecimalNum};
            //含税期初结存金额、含税出库成本金额、含税期末结存金额
            let totalMap = data.totalMap;
            totalMap["originalAmountTotal"] = data.originalCostTotal;
            totalMap["finalAmountTotal"] = data.finalCostTotal;
            totalMap["outCostTotal"] = data.outCostTotal;
            let tableData = DataFilter.dealFooterTotalFieldForList(tableConfigList,totalMap,list, decimalMap);
            let tableWidth = tableConfigList && tableConfigList.reduce(function (width, item) {
                return width + (item.width ? item.width : 200) / 1;
            }, 0);
            res.json({
                retCode: 0,
                list: tableData,
                filterConfigList: dealFilterConfig(),
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

