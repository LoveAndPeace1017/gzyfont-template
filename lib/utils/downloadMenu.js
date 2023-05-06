const Constants = require('../constants');

//对不同的报表设置不同的map
const allMap = {
    //中文是后端给的
    "物品库存金额汇总表":{
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
            label: 'node.report.inventoryPrice.enterAmount'
        },
        outQuantity: {
            label: 'node.report.inventoryPrice.outQuantity',
            columnType: 'decimal-quantity',
            totalFlag: true
        },
        outCost: {
            label: "node.report.inventoryPrice.outCost"
        },
        finalQuantity: {
            label: "node.report.inventoryPrice.finalQuantity",
            columnType: 'decimal-quantity'
        },
        finalUnitCost: {
            label: "node.report.inventoryPrice.finalUnitCost",
            columnType: 'decimal-money'
        },
        finalAmount: {
            label: "node.report.inventoryPrice.finalAmount"
        }
    },
    "物品库存金额汇总表（未税）":{
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
            label: "node.report.inventoryPrice.originalUnitCostUntax",
            columnType: 'decimal-money'
        },
        originalAmount: {
            label: "node.report.inventoryPrice.originalAmountUntax",
            totalFlag: true
        },
        enterQuantity: {
            label: 'node.report.inventoryPrice.enterQuantity',
            columnType: 'decimal-quantity',
            totalFlag: true
        },
        enterAmount: {
            label: 'node.report.inventoryPrice.enterAmountUntax',
            totalFlag: true
        },
        outQuantity: {
            label: 'node.report.inventoryPrice.outQuantity',
            columnType: 'decimal-quantity',
            totalFlag: true
        },
        outCost: {
            label: "node.report.inventoryPrice.outCostUntax",
            totalFlag: true
        },
        finalQuantity: {
            label: "node.report.inventoryPrice.finalQuantity",
            columnType: 'decimal-quantity',
            totalFlag: true
        },
        finalUnitCost: {
            label: "node.report.inventoryPrice.finalUnitCostUntax",
            columnType: 'decimal-money'
        },
        finalAmount: {
            label: "node.report.inventoryPrice.finalAmountUntax",
            totalFlag: true
        }
    },
    "生产BOM展开":{
        bomCode: {
            label: "node.multiBom.bomCode"
        },
        bomVersion: {
            label: "node.multiBom.bomVersion"
        },
        defaultFlag: {
            label: "node.multiBom.defaultFlag"
        },
        dayProductivity: {
            label: "node.multiBom.dayProductivity"
        },
        prodName: {
            label: "node.multiBom.prodName1"
        },
        parentProdName: {
            label: "node.multiBom.prodName"
        },
        displayCode: {
            label: "node.multiBom.prodNo"
        },
        parentDisplayCode: {
            label: "node.multiBom.prodCustomNo"
        },
        descItem: {
            label: "node.multiBom.descItem"
        },
        brand: {
            label: "node.multiBom.brand"
        },
        unit: {
            label: "node.multiBom.unit"
        },
        produceModel: {
            label: "node.multiBom.produceModel"
        },
        quantity: {
            label: "node.multiBom.quantity"
        },
        lossRate: {
            label: "node.multiBom.lossRate"
        }
    },
    "销售毛利预测表":{
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
            label: "node.report.saleGrossProfitForecast.quantity"
        },
        unitPrice: {
            label: "node.report.saleGrossProfitForecast.unitPrice"
        },
        untaxedPrice: {
            label: "node.report.saleGrossProfitForecast.untaxedPrice"
        },
        amount: {
            label: "node.report.saleGrossProfitForecast.amount",
            totalFlag: true
        },
        untaxedAmount: {
            label: "node.report.saleGrossProfitForecast.untaxedAmount"
        },
        unitCost: {
            label: "node.report.saleGrossProfitForecast.unitCost"
        },
        untaxedUnitCost: {
            label: "node.report.saleGrossProfitForecast.untaxedUnitCost"
        },
        profit: {
            label: "node.report.saleGrossProfitForecast.profit",
            totalFlag: true
        },
        untaxedProfit: {
            label: "node.report.saleGrossProfitForecast.untaxedProfit",
            totalFlag: true
        }
    },
    "毛利润统计表（按客户）":{
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
        }
    }

}

//不同的报表对应的处理fun也不一样
const allFn = {
    "物品库存金额汇总表":{
        "dealTableConfig": function dealTableConfig(list, customMap,reportType) {
            let newList = [];
            list && list.forEach(function (item) {
                let obj = allMap[reportType][item.columnName];
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
        },
        "dealCustomField":function dealCustomField(tags, orderTags) {
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
    },
    "物品库存金额汇总表（未税）":{
        "dealTableConfig": function dealTableConfig(list, customMap,reportType) {
            let newList = [];
            list && list.forEach(function (item) {
                let obj = allMap[reportType][item.columnName];
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
        },
        "dealCustomField": function dealCustomField(tags, orderTags) {
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
    },
    "生产BOM展开":{
        "dealTableConfig": function dealTableConfig(reportType, customMap) {
            let newList = [];
            let list = [
                {
                    cannotEdit: 1,
                    columnName: "bomCode",
                    columnWidth: 170,
                    visibleFlag: 1
                },
                {
                    cannotEdit: 1,
                    columnName: "bomVersion",
                    columnWidth: 170,
                    visibleFlag: 1
                },
                {
                    cannotEdit: 1,
                    columnName: "defaultFlag",
                    columnWidth: 170,
                    visibleFlag: 1
                },
                {
                    cannotEdit: 1,
                    columnName: "dayProductivity",
                    columnWidth: 170,
                    visibleFlag: 1
                },
                {
                    cannotEdit: 1,
                    columnName: "parentDisplayCode",
                    columnWidth: 170,
                    visibleFlag: 1
                },
                {
                    cannotEdit: 1,
                    columnName: "parentProdName",
                    columnWidth: 170,
                    visibleFlag: 1
                },
                {
                    cannotEdit: 1,
                    columnName: "displayCode",
                    columnWidth: 170,
                    visibleFlag: 1
                },
                {
                    cannotEdit: 1,
                    columnName: "prodName",
                    columnWidth: 170,
                    visibleFlag: 1
                },
                {
                    cannotEdit: 1,
                    columnName: "descItem",
                    columnWidth: 170,
                    visibleFlag: 1
                },
                {
                    cannotEdit: 1,
                    columnName: "unit",
                    columnWidth: 170,
                    visibleFlag: 1
                },
                {
                    cannotEdit: 1,
                    columnName: "brand",
                    columnWidth: 170,
                    visibleFlag: 1
                },
                {
                    cannotEdit: 1,
                    columnName: "produceModel",
                    columnWidth: 170,
                    visibleFlag: 1
                },
                {
                    cannotEdit: 1,
                    columnName: "quantity",
                    columnWidth: 170,
                    visibleFlag: 1
                },
                {
                    cannotEdit: 1,
                    columnName: "lossRate",
                    columnWidth: 170,
                    visibleFlag: 1
                },
                {
                    cannotEdit: 1,
                    columnName: "propertyValue1",
                    columnWidth: 200,
                    visibleFlag: 1
                },
                {
                    cannotEdit: 1,
                    columnName: "propertyValue2",
                    columnWidth: 200,
                    visibleFlag: 1
                },
                {
                    cannotEdit: 1,
                    columnName: "propertyValue3",
                    columnWidth: 200,
                    visibleFlag: 1
                },
                {
                    cannotEdit: 1,
                    columnName: "propertyValue4",
                    columnWidth: 200,
                    visibleFlag: 1
                },
                {
                    cannotEdit: 1,
                    columnName: "propertyValue5",
                    columnWidth: 200,
                    visibleFlag: 1
                }
            ];
            list && list.forEach(function (item) {
                let obj = allMap[reportType][item.columnName];
                obj = obj || (customMap && customMap[item.columnName]);
                if (obj) {
                    newList.push({
                        fieldName: item.columnName,
                        label: obj.label,
                        columnType: obj.columnType,
                        width: item.columnWidth||obj.width||Constants.TABLE_COL_WIDTH.DEFAULT,
                        cannotEdit:item.cannotEdit||null,
                        visibleFlag: item.visibleFlag,
                        originVisibleFlag: item.visibleFlag
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
        },
        "dealCustomField": function dealCustomField(tags) {
            let obj = {};
            tags && tags.forEach(function (item) {
                if (item.propName !== "") {
                    const propertyIndex = item.mappingName && parseInt(item.mappingName.substr(item.mappingName.length - 1));
                    if (item.propName !== "" && item.mappingName) {
                        obj['propertyValue' + propertyIndex] = {
                            columnName: 'propertyValue' + propertyIndex,
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
    },
    "销售毛利预测表":{
        "dealTableConfig": function dealTableConfig(list, customMap,reportType) {
            let newList = [];
            list && list.forEach(function (item) {
                let obj = allMap[reportType][item.columnName];
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
        },
        "dealCustomField": function dealCustomField(prodTags) {
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
    },
    "毛利润统计表（按客户）":{
        "dealTableConfig": function dealTableConfig(list, customMap,reportType){
            let newList = [];
            list && list.forEach(function (item) {
                let obj = allMap[reportType][item.columnName];
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
        },
        "dealCustomField": function dealCustomField(tags){
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
    }
}

module.exports = {
    allMap:allMap,
    allFn:allFn
}

