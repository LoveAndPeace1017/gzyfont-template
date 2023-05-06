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
        label: "node.report.grossProfit.firstCatName"
    },
    secondCatName: {
        label: "node.report.grossProfit.secondCatName"
    },
    thirdCatName: {
        label: "node.report.grossProfit.thirdCatName"
    },
    prodNo: {
        label: "node.report.grossProfit.prodNo"
    },
    prodName: {
        label: "node.report.grossProfit.prodName"
    },
    descItem: {
        label: "node.report.grossProfit.descItem"
    },
    unit: {
        label: "node.report.grossProfit.unit",
        width: Constants.TABLE_COL_WIDTH.UNIT
    },
    proBarCode: {
        label: "node.report.grossProfit.proBarCode",
        width: Constants.TABLE_COL_WIDTH.PROD_BAR
    },
    brand: {
        label: 'node.report.grossProfit.brand',
    },
    produceModel: {
        label: 'node.report.grossProfit.produceModel',
    },
    enterQuantity: {
        label: 'node.report.grossProfit.enterQuantity',
        columnType: 'decimal-quantity'
    },
    enterAmount: {
        label: 'node.report.grossProfit.enterAmount'
    },
    outQuantity: {
        label: 'node.report.grossProfit.outQuantity',
        columnType: 'decimal-quantity'
    },
    outAmount: {
        label: "node.report.grossProfit.outAmount"
    },
    profit: {
        label: "node.report.grossProfit.profit"
    },
    profitRate: {
        label: "node.report.grossProfit.profitRate"
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
    backend.post(`/pc/v1/${session.userIdEnc}/report/ware/prodFit`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum} = req.cookies;
            data.tags = PropertyFilter.initCustomTags(data.tags,'prod_');
            let customMap = dealCustomField(data.tags);
            let list = data.data;
            list =  list.map(function(item, index){
                item.key = index;
                item.serial = index+1;
                item.enterQuantity = Decimal.fixedDecimal(item.enterQuantity, quantityDecimalNum);
                item.outQuantity = Decimal.fixedDecimal(item.outQuantity, quantityDecimalNum);

                let prodPropertyValues = PropertyFilter.initCustomProperties(data.tags, item.prodPropertyValues,'prod_');
                item = {...item, ...prodPropertyValues};
                return item;
            });
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            let tableData = DataFilter.exportData(tableConfigList,list);
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
/* 物品毛利润报表 */
router.post('/detail', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req, res);

    backend.post(`/pc/v1/${session.userIdEnc}/report/ware/prodFit`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum} = req.cookies;
            data.tags = PropertyFilter.initCustomTags(data.tags,'prod_');
            let customMap = dealCustomField(data.tags, data.OrderTags);
            let list = data.data;

            list =  list.map(function(item, index){
                item.key = index;
                item.serial = index+1;
                item.enterQuantity = Decimal.fixedDecimal(item.enterQuantity, quantityDecimalNum);
                item.outQuantity = Decimal.fixedDecimal(item.outQuantity, quantityDecimalNum);

                let prodPropertyValues = PropertyFilter.initCustomProperties(data.tags, item.prodPropertyValues,'prod_');
                item = {...item, ...prodPropertyValues};
                return item;
            });
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            let tableWidth = tableConfigList && tableConfigList.reduce(function (width, item) {
                return width + (item.width ? item.width : 200) / 1;
            }, 0);
            res.json({
                retCode: 0,
                list: list,
                filterConfigList: dealFilterConfig(),
                tableConfigList: tableConfigList,
                tableWidth: tableWidth,
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

