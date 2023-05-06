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
        label: "node.report.sale.saleOrderDate",
        width: Constants.TABLE_COL_WIDTH.DATE
    },
    deliveryDeadlineDate: {
        label: 'node.report.sale.deliveryDeadlineDate',
        width: Constants.TABLE_COL_WIDTH.DATE
    },
    deliveryAddress: {
        label: "node.report.sale.deliveryAddress"
    },
    displayBillNo: {
        label: "node.report.sale.displayBillNo"
    },
    customerName: {
        label: "node.report.sale.customerName"
    },
    customerContacterName: {
        label: "node.report.sale.customerContacterName",
        width: Constants.TABLE_COL_WIDTH.PERSON
    },
    customerTelNo: {
        label: "node.report.sale.customerTelNo",
        width: Constants.TABLE_COL_WIDTH.TEL
    },
    firstCatName: {
        label: "node.report.sale.firstCatName"
    },
    secondCatName: {
        label: "node.report.sale.secondCatName"
    },
    thirdCatName: {
        label: "node.report.sale.thirdCatName"
    },
    productCode: {
        label: "node.report.sale.productCode"
    },
    prodName: {
        label: "node.report.sale.prodName"
    },
    descItem: {
        label: 'node.report.sale.descItem'
    },
    unit: {
        label: 'node.report.sale.unit',
        width: 40
    },
    recUnit: {
        label: 'node.report.sale.recUnit',
        width: 50
    },
    proBarCode: {
        label: 'node.report.sale.proBarCode',
        width:  Constants.TABLE_COL_WIDTH.PROD_BAR
    },
    brand: {
        label: 'node.report.sale.brand',
    },
    produceModel: {
        label: 'node.report.sale.produceModel',
    },
    quantity: {
        label: 'node.report.sale.quantity',
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    recQuantity: {
        label: 'node.report.sale.recQuantity',
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    untaxedPrice: {
        label: 'node.report.sale.untaxedPrice',
        columnType: 'decimal-money'
    },
    unitPrice: {
        label: 'node.report.sale.unitPrice',
        columnType: 'decimal-money'
    },
    taxRate: {
        label: 'node.report.sale.taxRate'
    },
    tax: {
        label: 'node.report.sale.tax',
        totalFlag: true
    },
    untaxedAmount: {
        label: 'node.report.sale.untaxedAmount',
        totalFlag: true
    },
    amount: {
        label: 'node.report.sale.amount',
        totalFlag: true
    },
    remarks: {
        label: 'node.report.sale.remarks'
    },
    projectName: {
        label: "node.report.sale.projectName"
    },
    billRemarks: {
        label: 'node.report.sale.billRemarks'
    },
    ourName: {
        label: 'node.report.sale.ourName'
    },
    ourContacterName: {
        label: 'node.report.sale.ourContacterName',
        width: Constants.TABLE_COL_WIDTH.PERSON
    },
    ourTelNo: {
        label: 'node.report.sale.ourTelNo',
        width: Constants.TABLE_COL_WIDTH.TEL
    },
    settlement: {
        label: 'node.report.sale.settlement'
    },
    warehouseName: {
        label: 'node.report.sale.warehouseName'
    },
    customerOrderNo: {
        label: 'node.report.sale.customerOrderNo'
    },
    currencyName: {
        label: 'node.report.sale.currencyName'
    },
    quotation: {
        label: 'node.report.sale.quotation'
    },
    currencyUnitPrice: {
        label: 'node.report.sale.currencyUnitPrice',
        columnType: 'decimal-money'
    },
    currencyAmount: {
        label: 'node.report.sale.currencyAmount',
        columnType: 'decimal-money',
        totalFlag: true
    }
};

function dealFilterConfig() {
    return [{
        label: "node.report.sale.saleOrderDate",
        fieldName: 'saleOrderDate',
        visibleFlag: true,
        cannotEdit: true,
        type: 'datePicker'
    },{
        label: "node.report.sale.catCode",
        fieldName: 'catCode',
        visibleFlag: true,
        cannotEdit: true,
        type: 'category'
    },{
        label: "node.report.sale.prodNo",
        fieldName: 'prodNo',
        visibleFlag: true,
        cannotEdit: true,
        type: 'product'
    },{
        label: "node.report.sale.customerName",
        fieldName: 'customerName',
        visibleFlag: true,
        cannotEdit: true,
        type: 'customer'
    },{
        label: "node.report.sale.projName",
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

function dealCustomField(tags, saleTags ,OrderProdTags) {
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

    OrderProdTags && OrderProdTags.forEach(function (item) {
        if (item.propName !== "") {
            if (item.propName !== "" && item.mappingName) {
                obj['item_' + item.mappingName] = {
                    fieldName: 'item_' + item.mappingName,
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
    backend.post(`/pc/v1/${session.userIdEnc}/report/saleorder/detail/by/prod`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum, priceDecimalNum} = req.cookies;
            data.tags = PropertyFilter.initCustomTags(data.tags,'prod_');
            let customMap = dealCustomField(data.tags, data.saleDataTags, data.saleProdDataTags);
            data.saleDataTags = PropertyFilter.initCustomTags(data.saleDataTags, 'sale_');
            data.saleProdDataTags = PropertyFilter.initCustomTags(data.saleProdDataTags, 'item_');
            let list = data.data;
            list = list.map((item, index) => {
                item.key = index;
                item.serial = index + 1;
                item.taxRate = item.taxRate||0;
                item.unitPrice = Decimal.fixedDecimal(item.unitPrice, quantityDecimalNum);
                item.quantity = Decimal.fixedDecimal(item.quantity, quantityDecimalNum);
                item.recQuantity = Decimal.fixedDecimal(item.recQuantity, quantityDecimalNum);
                item.untaxedPrice = Decimal.fixedDecimal(item.untaxedPrice, priceDecimalNum);
                let salePropertyValues = PropertyFilter.initCustomProperties(data.saleDataTags, item.propertyValues, 'sale_');
                let itemPropertyValues = PropertyFilter.initCustomProperties(data.saleProdDataTags, item.itemPropertyValues, 'item_');
                let prodPropertyValues = PropertyFilter.initCustomProperties(data.tags, item.prodPropertyValues,'prod_');
                item = {...item, ...salePropertyValues, ...itemPropertyValues,...prodPropertyValues};
                return item;
            });
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            //如果是在开通多币种期间，需要将相关字段名称进行调整
            //unitPrice 含税单价=》单价
            //amount  优惠前价税合计 =》金额
            if(req.cookies.currencyVipFlag === 'true'){
                tableConfigList.forEach((item)=>{
                    if(item.fieldName === 'unitPrice'){
                        item.label = 'node.report.sale.price';
                    }else if(item.fieldName === 'amount'){
                        item.label = 'node.report.sale.amount1';
                    }
                })
            }
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

    backend.post(`/pc/v1/${session.userIdEnc}/report/saleorder/detail/by/prod`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum, priceDecimalNum} = req.cookies;
            data.tags = PropertyFilter.initCustomTags(data.tags,'prod_');
            let customMap = dealCustomField(data.tags, data.saleDataTags, data.saleProdDataTags);
            data.saleDataTags = PropertyFilter.initCustomTags(data.saleDataTags, 'sale_');
            data.saleProdDataTags = PropertyFilter.initCustomTags(data.saleProdDataTags, 'item_');

            let list = data.data;
            list = list.map((item, index) => {
                item.key = index;
                item.serial = index + 1;
                item.taxRate = item.taxRate||0;
                item.unitPrice = Decimal.fixedDecimal(item.unitPrice, quantityDecimalNum);
                item.quantity = Decimal.fixedDecimal(item.quantity, quantityDecimalNum);
                item.recQuantity = Decimal.fixedDecimal(item.recQuantity, quantityDecimalNum);
                item.untaxedPrice = Decimal.fixedDecimal(item.untaxedPrice, priceDecimalNum);
                let salePropertyValues = PropertyFilter.initCustomProperties(data.saleDataTags, item.propertyValues, 'sale_');
                let itemPropertyValues = PropertyFilter.initCustomProperties(data.saleProdDataTags, item.itemPropertyValues, 'item_');
                let prodPropertyValues = PropertyFilter.initCustomProperties(data.tags, item.prodPropertyValues,'prod_');
                item = {...item, ...salePropertyValues, ...itemPropertyValues,...prodPropertyValues};
                return item;
            });
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            let decimalMap = {quantityDecimalNum, priceDecimalNum};
            let tableData = DataFilter.dealFooterTotalFieldForList(tableConfigList,data.totalMap,list, decimalMap);
            let tableWidth = tableConfigList && tableConfigList.reduce(function (width, item) {
                return width + (item.width ? item.width : 200) / 1;
            }, 0);
            //如果是在开通多币种期间，需要将相关字段名称进行调整
            //unitPrice 含税单价=》单价
            //amount  优惠前价税合计 =》金额
            if(req.cookies.currencyVipFlag === 'true'){
                tableConfigList.forEach((item)=>{
                    if(item.fieldName === 'unitPrice'){
                        item.label = 'node.report.sale.price';
                    }else if(item.fieldName === 'amount'){
                        item.label = 'node.report.sale.amount1';
                    }
                })
            }

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
