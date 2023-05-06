const express = require('express');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const Constants = require('../../../../lib/constants');
const DataFilter = require('../../../../lib/utils/DataFilter');
const Decimal = require('../../../../lib/utils/Decimal');
const moment = require('moment');
const PropertyFilter = require('../../../../lib/utils/PropertyFilter');

const map = {
    quotationDate: {
        label: "node.report.quotation.quotationDate",
        width: Constants.TABLE_COL_WIDTH.DATE
    },
    expiredDate: {
        label: "node.report.quotation.expiredDate",
        width: Constants.TABLE_COL_WIDTH.DATE
    },
    warehouseName: {
        label: 'node.report.quotation.warehouseName'
    },
    deliveryAddress: {
        label: "node.report.quotation.deliveryAddress"
    },
    displayBillNo: {
        label: "node.report.quotation.displayBillNo"
    },
    currencyName: {
        label: 'node.report.quotation.currencyName'
    },
    quotation: {
        label: 'node.report.quotation.quotation'
    },
    customerName: {
        label: "node.report.quotation.customerName"
    },
    customerContacterName: {
        label: "node.report.quotation.customerContacterName",
        width: Constants.TABLE_COL_WIDTH.PERSON
    },
    customerTelNo: {
        label: "node.report.quotation.customerTelNo",
        width: Constants.TABLE_COL_WIDTH.TEL
    },
    firstCatName: {
        label: "node.report.quotation.firstCatName"
    },
    secondCatName: {
        label: "node.report.quotation.secondCatName"
    },
    thirdCatName: {
        label: "node.report.quotation.thirdCatName"
    },
    productCode: {
        label: "node.report.quotation.productCode"
    },
    prodName: {
        label: "node.report.quotation.prodName"
    },
    descItem: {
        label: 'node.report.quotation.descItem'
    },
    unit: {
        label: 'node.report.quotation.unit',
        width: 50
    },
    recUnit: {
        label: 'node.report.quotation.recUnit',
        width: 50
    },
    proBarCode: {
        label: 'node.report.quotation.proBarCode',
        width:  Constants.TABLE_COL_WIDTH.PROD_BAR
    },
    brand: {
        label: 'node.report.quotation.brand',
    },
    produceModel: {
        label: 'node.report.quotation.produceModel',
    },
    recQuantity: {
        label: 'node.report.quotation.recQuantity',
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    quantity: {
        label: 'node.report.quotation.quantity',
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    untaxedPrice: {
        label: 'node.report.quotation.untaxedPrice',
        columnType: 'decimal-money'
    },
    unitPrice: {
        label: 'node.report.quotation.unitPrice',
        columnType: 'decimal-money'
    },
    taxRate: {
        label: 'node.report.quotation.taxRate'
    },
    tax: {
        label: 'node.report.quotation.tax',
        totalFlag: true
    },
    untaxedAmount: {
        label: 'node.report.quotation.untaxedAmount',
        totalFlag: true
    },
    amount: {
        label: 'node.report.quotation.amount',
        totalFlag: true
    },
    currencyUnitPrice: {
        label: 'node.report.quotation.currencyUnitPrice',
        columnType: 'decimal-money'
    },
    currencyAmount: {
        label: 'node.report.quotation.currencyAmount',
        columnType: 'decimal-money',
        totalFlag: true
    },
    deliveryDeadlineDate: {
        label: 'node.report.quotation.deliveryDeadlineDate',
        width: Constants.TABLE_COL_WIDTH.DATE
    },
    remarks: {
        label: 'node.report.quotation.prodRemarks'
    },
    projectName: {
        label: "node.report.quotation.projectName"
    },
    settlement: {
        label: 'node.report.quotation.settlement'
    },
    customerOrderNo: {
        label: 'node.report.quotation.customerOrderNo'
    },
    billRemarks: {
        label: 'node.report.quotation.remarks'
    },
    ourName: {
        label: 'node.report.quotation.ourName'
    },
    ourContacterName: {
        label: 'node.report.quotation.ourContacterName',
        width: Constants.TABLE_COL_WIDTH.PERSON
    },
    ourTelNo: {
        label: 'node.report.quotation.ourTelNo',
        width: Constants.TABLE_COL_WIDTH.TEL
    },
};

function dealFilterConfig() {
    return [{
        label: "node.report.quotation.quotationDate",
        fieldName: 'quotationDate',
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
        label: "node.report.quotation.ourContacterName",
        fieldName: 'ourContacterName',
        visibleFlag: true,
        cannotEdit: true,
        type: 'customer'
    },{
        label: "node.report.quotation.projName",
        fieldName: 'projName',
        visibleFlag: true,
        cannotEdit: true,
        type: 'project'
    },{
        label: "node.report.quotation.expiredDate",
        fieldName: 'expiredDate',
        visibleFlag: true,
        cannotEdit: true,
        type: 'datePicker'
    }];
}

function dealTableConfig(list, customMap) {
    let newList = [];
    let initFlag = true;
    list && list.forEach(function (item) {
        if(item.columnName==='quotationDate'){
            initFlag = false;
        }
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
    if(initFlag){
        newList.splice(0, 0, {
            fieldName: 'quotationDate',
            label: 'node.report.quotation.quotationDate',
            width: Constants.TABLE_COL_WIDTH.NO,
            visibleFlag: 1,
            cannotEdit: true
        });
    }
    return newList;
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
    backend.post(`/pc/v1/${session.userIdEnc}/report/saleorder/detail/by/quotation`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum, priceDecimalNum} = req.cookies;
            data.tags = PropertyFilter.initCustomTags(data.tags);
            data.prodDataTags = PropertyFilter.initCustomTags(data.prodDataTags,'prod_');

            let customMap = PropertyFilter.dealCustomField(data.tags, data.prodDataTags);
            let list = data.data;
            list = list.map((item, index) => {
                item.key = index;
                item.serial = index + 1;
                item.recQuantity = Decimal.fixedDecimal(item.recQuantity, quantityDecimalNum);
                item.quantity = Decimal.fixedDecimal(item.quantity, quantityDecimalNum);
                item.untaxedPrice = Decimal.fixedDecimal(item.untaxedPrice, priceDecimalNum);
                item.unitPrice = Decimal.fixedDecimal(item.unitPrice, quantityDecimalNum);
                item.taxRate = item.taxRate||0;
                //处理日期
                item.deliveryDeadlineDate = new moment(item.deliveryDeadlineDate).format('YYYY-MM-DD');

                let propertyValues = PropertyFilter.initCustomProperties(data.tags, item.propertyValues);
                let prodPropertyValues = PropertyFilter.initCustomProperties(data.prodDataTags, item.prodPropertyValues, 'prod_');
                item = {...item, ...propertyValues,...prodPropertyValues};
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

    backend.post(`/pc/v1/${session.userIdEnc}/report/saleorder/detail/by/quotation`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum, priceDecimalNum} = req.cookies;
            data.tags = PropertyFilter.initCustomTags(data.tags);
            data.prodDataTags = PropertyFilter.initCustomTags(data.prodDataTags,'prod_');

            let customMap = PropertyFilter.dealCustomField(data.tags, data.prodDataTags);
            let list = data.data;
            list = list.map((item, index) => {
                item.key = index;
                item.serial = index + 1;
                item.recQuantity = Decimal.fixedDecimal(item.recQuantity, quantityDecimalNum);
                item.quantity = Decimal.fixedDecimal(item.quantity, quantityDecimalNum);
                item.untaxedPrice = Decimal.fixedDecimal(item.untaxedPrice, priceDecimalNum);
                item.unitPrice = Decimal.fixedDecimal(item.unitPrice, quantityDecimalNum);
                item.taxRate = item.taxRate||0;

                let propertyValues = PropertyFilter.initCustomProperties(data.tags, item.propertyValues);
                let prodPropertyValues = PropertyFilter.initCustomProperties(data.prodDataTags, item.prodPropertyValues, 'prod_');
                item = {...item, ...propertyValues,...prodPropertyValues};
                return item;
            });
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            let decimalMap = {quantityDecimalNum, priceDecimalNum};
            let tableData = DataFilter.dealFooterTotalFieldForList(tableConfigList, data.totalMap, list, decimalMap);
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
