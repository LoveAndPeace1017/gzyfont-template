const express = require('express');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const Constants = require('../../../../lib/constants');
const DataFilter = require('../../../../lib/utils/DataFilter');
const Decimal = require('../../../../lib/utils/Decimal');
const PropertyFilter = require('../../../../lib/utils/PropertyFilter');


const map = {
    customerName: {
        label: "node.report.check_customer.customerName"
    },
    displayBillNo: {
        label: "node.report.check_customer.displayBillNo"
    },
    saleOrderDate: {
        label: "node.report.check_customer.saleOrderDate",
        width: Constants.TABLE_COL_WIDTH.DATE
    },
    firstCatName: {
        label: "node.report.check_customer.firstCatName"
    },
    secondCatName: {
        label: "node.report.check_customer.secondCatName"
    },
    thirdCatName: {
        label: "node.report.check_customer.thirdCatName"
    },
    productCode: {
        label: "node.report.check_customer.productCode"
    },
    prodName: {
        label: "node.report.check_customer.prodName"
    },
    descItem: {
        label: 'node.report.check_customer.descItem'
    },
    unit: {
        label: 'node.report.check_customer.unit',
        width: Constants.TABLE_COL_WIDTH.UNIT
    },
    proBarCode: {
        label: 'node.report.check_customer.proBarCode',
        width: Constants.TABLE_COL_WIDTH.PROD_BAR
    },
    brand: {
        label: 'node.report.check_customer.brand',
    },
    produceModel: {
        label: 'node.report.check_customer.produceModel',
    },
    quantity: {
        label: 'node.report.check_customer.quantity',
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    amount: {
        label: 'node.report.check_customer.amount',
        totalFlag: true
    },
    unitPrice: {
        label: 'node.report.check_customer.unitPrice',
        columnType: 'decimal-money'
    },
    remarks: {
        label: 'node.report.check_customer.remarks'
    },
    outQuantity: {
        label: 'node.report.check_customer.outQuantity',
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    nonOutQuantity: {
        label: 'node.report.check_customer.nonOutQuantity',
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    projectName: {
        label: "node.report.check_customer.projectName"
    },
    customerContacterName: {
        label: "node.report.check_customer.customerContacterName"
    },
    customerTelNo: {
        label: "node.report.check_customer.customerTelNo"
    },
    ourContacterName: {
        label: "node.report.check_customer.ourContacterName"
    },
    customerOrderNo: {
        label: "node.report.check_customer.customerOrderNo"
    },
    returnQuantity: {
        label: "node.report.check_customer.returnQuantity",
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    actualOutQuantity: {
        label: "node.report.check_customer.actualOutQuantity",
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    deliveryAddress: {
        label: "node.report.check_customer.deliveryAddress"
    },
    settlement: {
        label: "node.report.check_customer.settlement"
    },
    billRemarks: {
        label: "node.report.check_customer.billRemarks"
    },
    outAmount: {
        label: "node.report.check_customer.outAmount",
        columnType: 'decimal-money',
        totalFlag: true
    },
    returnAmount: {
        label: "node.report.check_customer.returnAmount",
        columnType: 'decimal-money',
        totalFlag: true
    },
    nonOutAmount: {
        label: "node.report.check_customer.nonOutAmount",
        columnType: 'decimal-money',
        totalFlag: true
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

function dealCustomField(prodTags, customerTags, billProdDataTags, tags) {
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

    customerTags && customerTags.forEach(function (item) {
        if (item.propName !== "") {
            const propertyIndex = item.mappingName && parseInt(item.mappingName.substr(item.mappingName.length - 1));
            if (item.propName !== "" && item.mappingName) {
                obj['customerPropValue' + propertyIndex] = {
                    fieldName: 'customerPropValue' + propertyIndex,
                    label: item.propName,
                    value: item.mappingName,
                    visibleFlag: item.visibleFlag,
                    originVisibleFlag: item.visibleFlag
                };
            }
        }
    });

    billProdDataTags && billProdDataTags.forEach(function (item) {
        if (item.propName !== "") {
            if (item.propName !== "" && item.mappingName) {
                obj['item_' + item.mappingName] = {
                    fieldName: 'item_' + item.mappingName,
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
            if (item.propName !== "" && item.mappingName) {
                obj['sale_' + item.mappingName] = {
                    fieldName: 'sale_' + item.mappingName,
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

    backend.post(`/pc/v1/${session.userIdEnc}/report/saleorder/summary/by/out`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum, priceDecimalNum} = req.cookies;
            data.prodTags = PropertyFilter.initCustomTags(data.prodTags,'prod_');
            let customMap = dealCustomField(data.prodTags, data.customerTags, data.billProdDataTags, data.tags);
            data.tags = PropertyFilter.initCustomTags(data.tags);
            data.billProdDataTags = PropertyFilter.initCustomTags(data.billProdDataTags);
            let list = data.data;
            list = list.map((item, index) => {
                item.key = index;
                item.nonOutQuantity = item.quantity - item.outQuantity;
                item.serial = index+1;
                let salePropertyValues = PropertyFilter.initCustomProperties(data.tags, item.propertyValues, 'sale_');
                let itemPropertyValues = PropertyFilter.initCustomProperties(data.billProdDataTags, item.itemPropertyValues, 'item_');
                let prodPropertyValues = PropertyFilter.initCustomProperties(data.prodTags, item.prodPropertyValues,'prod_');
                item = {...item, ...salePropertyValues, ...itemPropertyValues,...prodPropertyValues};
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

    backend.post(`/pc/v1/${session.userIdEnc}/report/saleorder/summary/by/out`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum, priceDecimalNum} = req.cookies;
            data.prodTags = PropertyFilter.initCustomTags(data.prodTags,'prod_');
            let customMap = dealCustomField(data.prodTags, data.customerTags, data.billProdDataTags, data.tags);
            data.tags = PropertyFilter.initCustomTags(data.tags, 'sale_');
            data.billProdDataTags = PropertyFilter.initCustomTags(data.billProdDataTags, 'item_');
            let list = data.data;
            list = list.map((item, index) =>{
                item.key = index;
                item.serial = index + 1;
                item.quantity = Decimal.fixedDecimal(item.quantity, quantityDecimalNum);
                item.outQuantity = Decimal.fixedDecimal(item.outQuantity, quantityDecimalNum);
                item.nonOutQuantity = Decimal.fixedDecimal(item.nonOutQuantity, quantityDecimalNum);
                item.unitPrice = Decimal.fixedDecimal(item.unitPrice, priceDecimalNum);
                item.outAmount = Decimal.fixedDecimal(item.outAmount, priceDecimalNum);
                item.returnAmount = Decimal.fixedDecimal(item.returnAmount, priceDecimalNum);
                item.nonOutAmount = Decimal.fixedDecimal(item.nonOutAmount, priceDecimalNum);

                let salePropertyValues = PropertyFilter.initCustomProperties(data.tags, item.propertyValues, 'sale_');
                let itemPropertyValues = PropertyFilter.initCustomProperties(data.billProdDataTags, item.itemPropertyValues, 'item_');
                let prodPropertyValues = PropertyFilter.initCustomProperties(data.prodTags, item.prodPropertyValues,'prod_');
                item = {...item, ...salePropertyValues, ...itemPropertyValues, ...prodPropertyValues};
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
