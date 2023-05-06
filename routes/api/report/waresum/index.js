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
        label: "node.report.waresum.firstCatName"
    },
    secondCatName: {
        label: "node.report.waresum.secondCatName"
    },
    thirdCatName: {
        label: "node.report.waresum.thirdCatName"
    },
    prodNo: {
        label: "node.report.waresum.prodNo"
    },
    prodName: {
        label: "node.report.waresum.prodName"
    },
    descItem: {
        label: 'node.report.waresum.descItem'
    },
    unit: {
        label: 'node.report.waresum.unit',
        width: Constants.TABLE_COL_WIDTH.UNIT
    },
    proBarCode: {
        label: 'node.report.waresum.proBarCode',
        width: Constants.TABLE_COL_WIDTH.PROD_BAR
    },
    brand: {
        label: "node.report.waresum.brand"
    },
    produceModel: {
        label: "node.report.waresum.produceModel"
    },
    originalQuantity: {
        label: 'node.report.waresum.originalQuantity',
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    enterCount: {
        label: 'node.report.waresum.enterCount',
        totalFlag: true
    },
    enterQuantity: {
        label: 'node.report.waresum.enterQuantity',
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    avgEnterAmount: {
        label: 'node.report.waresum.avgEnterAmount',
        columnType: 'decimal-money'
    },
    enterAmount: {
        label: 'node.report.waresum.enterAmount',
        totalFlag: true
    },
    outCount: {
        label: 'node.report.waresum.outCount',
        totalFlag: true
    },
    outQuantity: {
        label: 'node.report.waresum.outQuantity',
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    avgOutAmount: {
        label: 'node.report.waresum.avgOutAmount',
        columnType: 'decimal-money'
    },
    outAmount: {
        label: 'node.report.waresum.outAmount',
        totalFlag: true
    },
    finalQuantity: {
        label: 'node.report.waresum.finalQuantity',
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    projName: {
        label: "node.report.waresum.projName"
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

function dealCustomField(tags) {
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
    backend.post(`/pc/v1/${session.userIdEnc}/report/ware/summary/by/prod`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum, priceDecimalNum} = req.cookies;
            data.tags = PropertyFilter.initCustomTags(data.tags,'prod_');
            let customMap = dealCustomField(data.tags);
            let list = data.data;
            let i = 1;
            list = list.map(function (item) {
                item.key = i;
                item.nonOutQuantity = item.quantity - item.outQuantity;
                item.serial = i++;
                item.originalQuantity =  params.projName ?  '' : Decimal.fixedDecimal(item.originalQuantity, quantityDecimalNum);
                item.enterQuantity = Decimal.fixedDecimal(item.enterQuantity, quantityDecimalNum);
                item.avgEnterAmount = Decimal.fixedDecimal(item.avgEnterAmount, priceDecimalNum);
                item.outQuantity = Decimal.fixedDecimal(item.outQuantity, quantityDecimalNum);
                item.avgOutAmount = Decimal.fixedDecimal(item.avgOutAmount, priceDecimalNum);
                item.finalQuantity =  params.projName ?  '' : Decimal.fixedDecimal(item.finalQuantity, quantityDecimalNum);

                let prodPropertyValues = PropertyFilter.initCustomProperties(data.tags, item.prodPropertyValues,'prod_');
                item = {...item, ...prodPropertyValues};
                return item;
            });
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            let tableData = DataFilter.exportData(tableConfigList,list);
            let decimalMap = {quantityDecimalNum, priceDecimalNum};
            if(data.totalMap && params.projName){
                data.totalMap.originalQuantityTotal = '';
                data.totalMap.finalQuantityTotal = '';
            }
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

    backend.post(`/pc/v1/${session.userIdEnc}/report/ware/summary/by/prod`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum, priceDecimalNum} = req.cookies;
            data.tags = PropertyFilter.initCustomTags(data.tags,'prod_');
            let customMap = dealCustomField(data.tags);
            let list = data.data;
            let i = 1;
            list =  list.map(function (item) {
                item.key = i;
                item.nonOutQuantity = item.quantity - item.outQuantity;
                item.serial = i++;
                item.originalQuantity = params.projName ?  '' : Decimal.fixedDecimal(item.originalQuantity, quantityDecimalNum);
                item.enterQuantity = Decimal.fixedDecimal(item.enterQuantity, quantityDecimalNum);
                item.avgEnterAmount = Decimal.fixedDecimal(item.avgEnterAmount, priceDecimalNum);
                item.outQuantity = Decimal.fixedDecimal(item.outQuantity, quantityDecimalNum);
                item.avgOutAmount = Decimal.fixedDecimal(item.avgOutAmount, priceDecimalNum);
                item.finalQuantity = params.projName ?  '' : Decimal.fixedDecimal(item.finalQuantity, quantityDecimalNum);

                let prodPropertyValues = PropertyFilter.initCustomProperties(data.tags, item.prodPropertyValues,'prod_');
                item = {...item, ...prodPropertyValues};
                return item;
            });
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            let decimalMap = {quantityDecimalNum, priceDecimalNum};
            if(data.totalMap && params.projName){
                data.totalMap.originalQuantityTotal = '';
                data.totalMap.finalQuantityTotal = '';
            }
            let tableData = DataFilter.dealFooterTotalFieldForList(tableConfigList,data.totalMap,list, decimalMap);
            res.json({
                retCode: 0,
                list: tableData,
                filterConfigList: [],
                tableConfigList: tableConfigList,
                tableWidth: 0,
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
