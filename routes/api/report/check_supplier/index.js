const express = require('express');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const Constants = require('../../../../lib/constants');
const DataFilter = require('../../../../lib/utils/DataFilter');
const Decimal = require('../../../../lib/utils/Decimal');
const PropertyFilter = require('../../../../lib/utils/PropertyFilter');

const map = {
    supplierName: {
        label: "node.report.check_supplier.supplierName"
    },
    displayBillNo: {
        label: "node.report.check_supplier.displayBillNo"
    },
    purchaseOrderDate: {
        label: "node.report.check_supplier.purchaseOrderDate",
        width: Constants.TABLE_COL_WIDTH.DATE
    },
    firstCatName: {
        label: "node.report.check_supplier.firstCatName"
    },
    secondCatName: {
        label: "node.report.check_supplier.secondCatName"
    },
    thirdCatName: {
        label: "node.report.check_supplier.thirdCatName"
    },
    productCode: {
        label: "node.report.check_supplier.productCode"
    },
    prodName: {
        label: "node.report.check_supplier.prodName"
    },
    descItem: {
        label: 'node.report.check_supplier.descItem'
    },
    unit: {
        label: 'node.report.check_supplier.unit',
        width: Constants.TABLE_COL_WIDTH.UNIT
    },
    proBarCode: {
        label: 'node.report.check_supplier.proBarCode',
        width: Constants.TABLE_COL_WIDTH.PROD_BAR
    },
    brand: {
        label: 'node.report.check_supplier.brand',
    },
    produceModel: {
        label: 'node.report.check_supplier.produceModel',
    },
    quantity: {
        label: 'node.report.check_supplier.quantity',
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    amount: {
        label: 'node.report.check_supplier.amount',
        totalFlag: true
    },
    unitPrice: {
        label: 'node.report.check_supplier.unitPrice',
        columnType: 'decimal-money'
    },
    remarks: {
        label: 'node.report.check_supplier.remarks'
    },
    enterQuantity: {
        label: 'node.report.check_supplier.enterQuantity',
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    nonEnterQuantity: {
        label: 'node.report.check_supplier.nonEnterQuantity',
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    projectName: {
        label: "node.report.check_supplier.projectName"
    },
    supplierContacterName: {
        label: "node.report.check_supplier.supplierContacterName"
    },
    supplierMobile: {
        label: "node.report.check_supplier.supplierMobile"
    },
    returnQuantity: {
        label: "node.report.check_supplier.returnQuantity",
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    actualEnterQuantity: {
        label: "node.report.check_supplier.actualEnterQuantity",
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    deliveryAddress: {
        label: "node.report.check_supplier.deliveryAddress"
    },
    settlement: {
        label: "node.report.check_supplier.settlement"
    },
    ourContacterName: {
        label: "node.report.check_supplier.ourContacterName"
    },
    ourTelNo: {
        label: "node.report.check_supplier.ourTelNo"
    },
    billRemarks: {
        label: "node.report.check_supplier.billRemarks"
    },
    untaxedPrice:{
        label: "node.report.check_supplier.untaxedPrice",
        columnType: 'decimal-money'
    },
    untaxedAmount:{
        label: "node.report.check_supplier.untaxedAmount",
        columnType: 'decimal-money',
        totalFlag: true
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
        }
    });
    return newList;
}

function dealCustomField(prodTags, supplierTags, billProdDataTags, tags) {
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

    supplierTags && supplierTags.forEach(function (item) {
        if (item.propName !== "") {
            const propertyIndex = item.mappingName && parseInt(item.mappingName.substr(item.mappingName.length - 1));
            if (item.propName !== "" && item.mappingName) {
                obj['supplierPropertyValue' + propertyIndex] = {
                    fieldName: 'supplierPropertyValue' + propertyIndex,
                    label: item.propName,
                    value: item.mappingName,
                    visibleFlag: item.visibleFlag,
                    width: '200',
                    originVisibleFlag: item.visibleFlag
                };
            }
        }
    });

    billProdDataTags && billProdDataTags.forEach(function (item) {
        if (item.propName !== "") {
            const propertyIndex = item.mappingName && parseInt(item.mappingName.substr(item.mappingName.length - 1));
            if (item.propName !== "" && item.mappingName) {
                obj['item_property_value' + propertyIndex] = {
                    fieldName: 'item_property_value' + propertyIndex,
                    label: item.propName,
                    value: item.mappingName,
                    visibleFlag: item.visibleFlag,
                    width: '200',
                    originVisibleFlag: item.visibleFlag
                };
            }
        }
    });

    tags && tags.forEach(function (item) {
        if (item.propName !== "") {
            const propertyIndex = item.mappingName && parseInt(item.mappingName.substr(item.mappingName.length - 1));
            if (item.propName !== "" && item.mappingName) {
                obj['purchasePropertyValue' + propertyIndex] = {
                    fieldName: 'purchasePropertyValue' + propertyIndex,
                    label: item.propName,
                    value: item.mappingName,
                    visibleFlag: item.visibleFlag,
                    width: '200',
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

    backend.post(`/pc/v1/${session.userIdEnc}/report/purchase/summary/by/enter`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum, priceDecimalNum} = req.cookies;
            data.prodTags = PropertyFilter.initCustomTags(data.prodTags,'prod_');
            let customMap = dealCustomField(data.prodTags, data.supplierTags);
            let list = data.data;
            let i = 1;
            list =  list.map(function (item) {
                item.key = i;
                // item.nonEnterQuantity = Decimal.fixedDecimal(item.quantity - item.enterQuantity, quantityDecimalNum);
                item.serial = i++;
                item.quantity = Decimal.fixedDecimal(item.quantity, quantityDecimalNum);
                item.enterQuantity = Decimal.fixedDecimal(item.enterQuantity, quantityDecimalNum);
                item.nonEnterQuantity = Decimal.fixedDecimal(item.nonEnterQuantity, quantityDecimalNum);
                item.unitPrice = Decimal.fixedDecimal(item.unitPrice, priceDecimalNum);

                let propertyValues = item.itemPropertyValues||{};
                [1,2,3,4,5].forEach((index)=>{
                    item['item_property_value'+index] = propertyValues['property_value'+index] && propertyValues['property_value'+index];
                });

                let prodPropertyValues = PropertyFilter.initCustomProperties(data.prodTags, item.prodPropertyValues,'prod_');
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


router.post('/detail', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req, res);

    backend.post(`/pc/v1/${session.userIdEnc}/report/purchase/summary/by/enter`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum, priceDecimalNum} = req.cookies;
            data.prodTags = PropertyFilter.initCustomTags(data.prodTags,'prod_');
            let customMap = dealCustomField(data.prodTags, data.supplierTags,  data.billProdDataTags, data.tags);
            //let customMaps = DataFilter.dealCustomField(data.tags);
            let list = data.data;
            let i = 1;
            list =  list.map(function (item) {
                item.key = i;
                //item.nonEnterQuantity = item.quantity - item.enterQuantity;
                item.serial = i++;
                item.quantity = Decimal.fixedDecimal(item.quantity, quantityDecimalNum);
                item.enterQuantity = Decimal.fixedDecimal(item.enterQuantity, quantityDecimalNum);
                item.nonEnterQuantity = Decimal.fixedDecimal(item.nonEnterQuantity, quantityDecimalNum);
                item.unitPrice = Decimal.fixedDecimal(item.unitPrice, priceDecimalNum);
                let propertyValues = item.propertyValues||{};
                [1,2,3,4,5].forEach((index)=>{
                    item['item_property_value'+index] = propertyValues['property_value'+index] && propertyValues['property_value'+index];
                })

                let prodPropertyValues = PropertyFilter.initCustomProperties(data.prodTags, item.prodPropertyValues,'prod_');
                item = {...item, ...prodPropertyValues};
                return item;
            });
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            let decimalMap = {quantityDecimalNum, priceDecimalNum};
            let tableData = DataFilter.dealFooterTotalFieldForList(tableConfigList,data.totalMap,list, decimalMap);

            res.json({
                retCode: 0,
                list: tableData,
                filterConfigList: [],
                tableConfigList: tableConfigList,
                tableWidth: 0,
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
