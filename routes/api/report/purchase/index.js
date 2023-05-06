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
        label: "node.report.purchase.purchaseOrderDate",
        width: Constants.TABLE_COL_WIDTH.DATE
    },
    deliveryDeadlineDate: {
        label: 'node.report.purchase.deliveryDeadlineDate',
        width: Constants.TABLE_COL_WIDTH.DATE
    },
    deliveryAddress: {
        label: "node.report.purchase.deliveryAddress"
    },
    displayBillNo: {
        label: "node.report.purchase.displayBillNo"
    },
    supplierName: {
        label: "node.report.purchase.supplierName"
    },
    supplierContacterName: {
        label: "node.report.purchase.supplierContacterName",
        width: Constants.TABLE_COL_WIDTH.PERSON
    },
    supplierMobile: {
        label: "node.report.purchase.supplierMobile",
        width: Constants.TABLE_COL_WIDTH.TEL
    },
    firstCatName: {
        label: "node.report.purchase.firstCatName"
    },
    secondCatName: {
        label: "node.report.purchase.secondCatName"
    },
    thirdCatName: {
        label: "node.report.purchase.thirdCatName"
    },
    productCode: {
        label: "node.report.purchase.productCode"
    },
    prodName: {
        label: "node.report.purchase.prodName"
    },
    descItem: {
        label: 'node.report.purchase.descItem'
    },
    unit: {
        label: 'node.report.purchase.unit',
        width: Constants.TABLE_COL_WIDTH.UNIT
    },
    recUnit: {
        label: 'node.report.purchase.recUnit',
        width: 60
    },
    proBarCode: {
        label: 'node.report.purchase.proBarCode',
        width: Constants.TABLE_COL_WIDTH.PROD_BAR
    },
    brand: {
        label: 'node.report.purchase.brand',
    },
    produceModel: {
        label: 'node.report.purchase.produceModel',
    },
    quantity: {
        label: 'node.report.purchase.quantity',
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    recQuantity: {
        label: 'node.report.purchase.recQuantity',
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    untaxedPrice: {
        label: 'node.report.purchase.untaxedPrice',
        columnType: 'decimal-money'
    },
    unitPrice: {
        label: 'node.report.purchase.unitPrice',
        columnType: 'decimal-money'
    },
    taxRate: {
        label: 'node.report.purchase.taxRate'
    },
    tax: {
        label: 'node.report.purchase.tax',
        totalFlag: true
    },
    untaxedAmount: {
        label: 'node.report.purchase.untaxedAmount',
        totalFlag: true
    },
    amount: {
        label: 'node.report.purchase.amount',
        totalFlag: true
    },
    remarks: {
        label: 'node.report.purchase.remarks'
    },
    projectName: {
        label: "node.report.purchase.projectName"
    },
    orderRemarks: {
        label: 'node.report.purchase.orderRemarks'
    },
    ourName: {
        label: 'node.report.purchase.ourName'
    },
    ourContacterName: {
        label: 'node.report.purchase.ourContacterName',
        width: Constants.TABLE_COL_WIDTH.PERSON
    },
    ourTelNo: {
        label: 'node.report.purchase.ourTelNo',
        width: Constants.TABLE_COL_WIDTH.PERSON
    },
    settlement: {
        label: 'node.report.purchase.settlement'
    },
    warehouseName: {
        label: 'node.report.purchase.warehouseName'
    }
};

function dealFilterConfig() {
    return [{
        label: "node.report.purchase.purchaseOrderDate1",
        fieldName: 'purchaseOrderDate',
        visibleFlag: true,
        cannotEdit: true,
        type: 'datePicker'
    },{
        label: "node.report.purchase.catCode",
        fieldName: 'catCode',
        visibleFlag: true,
        cannotEdit: true,
        type: 'category'
    },{
        label: "node.report.purchase.prodNo",
        fieldName: 'prodNo',
        visibleFlag: true,
        cannotEdit: true,
        type: 'product'
    },{
        label: "node.report.purchase.supplierName",
        fieldName: 'supplierName',
        visibleFlag: true,
        cannotEdit: true,
        type: 'supplier'
    },{
        label: "node.report.purchase.projName",
        fieldName: 'projName',
        visibleFlag: true,
        cannotEdit: true,
        type: 'project'
    }];
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

function dealCustomField(tags, orderTags ,OrderProdTags) {
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


    OrderProdTags && OrderProdTags.forEach(function (item) {
        if (item.propName !== "") {
            const propertyIndex = item.mappingName && parseInt(item.mappingName.substr(item.mappingName.length - 1));
            if (item.propName !== "" && item.mappingName) {
                obj['orderProdPropertyValue' + propertyIndex] = {
                    fieldName: 'orderProdPropertyValue' + propertyIndex,
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

    backend.post(`/pc/v1/${session.userIdEnc}/report/purchase/detail/by/prod`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum, priceDecimalNum} = req.cookies;
            data.tags = PropertyFilter.initCustomTags(data.tags,'prod_');
            let customMap = dealCustomField(data.tags, data.OrderTags, data.OrderProdTags);
            let list = data.data;
            let i = 1;
            let propetyAry = ['property_value1','property_value2','property_value3','property_value4','property_value5'];
            let propetyAryFormate = ['orderProdPropertyValue1','orderProdPropertyValue2','orderProdPropertyValue3','orderProdPropertyValue4','orderProdPropertyValue5'];
            list = list.map(function (item) {
                item.key = i;
                item.serial = i++;
                item.quantity = Decimal.fixedDecimal(item.quantity, quantityDecimalNum);
                item.recQuantity = Decimal.fixedDecimal(item.recQuantity, quantityDecimalNum);
                item.untaxedPrice = Decimal.fixedDecimal(item.untaxedPrice, priceDecimalNum);
                if(item.orderProdPropertyValues){
                    let orderProdPropertyValues = item.orderProdPropertyValues;
                    for(let j=0;j<propetyAry.length;j++){
                        if(orderProdPropertyValues[propetyAry[j]]){
                            item[propetyAryFormate[j]] = orderProdPropertyValues[propetyAry[j]];
                        }
                    }

                }
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
/* 采购. */
router.post('/detail', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/report/purchase/detail/by/prod`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum, priceDecimalNum} = req.cookies;
            data.tags = PropertyFilter.initCustomTags(data.tags,'prod_');
            let customMap = dealCustomField(data.tags, data.OrderTags, data.OrderProdTags);
            let list = data.data;
            let i = 1;
            let propetyAry = ['property_value1','property_value2','property_value3','property_value4','property_value5'];
            let propetyAryFormate = ['orderProdPropertyValue1','orderProdPropertyValue2','orderProdPropertyValue3','orderProdPropertyValue4','orderProdPropertyValue5'];
            list = list.map(function (item) {
                item.key = i;
                item.serial = i++;
                item.quantity = Decimal.fixedDecimal(item.quantity, quantityDecimalNum);
                item.recQuantity = Decimal.fixedDecimal(item.recQuantity, quantityDecimalNum);
                item.untaxedPrice = Decimal.fixedDecimal(item.untaxedPrice, priceDecimalNum);
                if(item.orderProdPropertyValues){
                    let orderProdPropertyValues = item.orderProdPropertyValues;
                    for(let j=0;j<propetyAry.length;j++){
                        if(orderProdPropertyValues[propetyAry[j]]){
                            item[propetyAryFormate[j]] = orderProdPropertyValues[propetyAry[j]];
                        }
                    }

                }
                let prodPropertyValues = PropertyFilter.initCustomProperties(data.tags, item.prodPropertyValues,'prod_');
                item = {...item, ...prodPropertyValues};
                return item;

            });
            let tableConfigList = dealTableConfig(data.listFields || [], customMap);
            let decimalMap = {quantityDecimalNum, priceDecimalNum};
            let tableData = DataFilter.dealFooterTotalFieldForList(tableConfigList,data.totalMap,list, decimalMap);
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
