const express = require('express');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const Constants = require('../../../../lib/constants');
const DataFilter = require('../../../../lib/utils/DataFilter');
const Decimal = require('../../../../lib/utils/Decimal');

const inboundType = ['采购入库', '其他入库', '盘点入库', '销售退货', '调拨入库', '生产入库', '委外成品入库', '生产退料入库'];
const outboundType = ['内部领用', '盘点出库', '销售出库', '采购退货', '其他出库', '调拨出库', '调拨出库', '委外领料', '生产领料出库'];

const map = {
    inventoryDate: {
        label: "node.report.flowmeter.inventoryDate",
        width: Constants.TABLE_COL_WIDTH.DATE
    },
    displayBillNo: {
        label: "node.report.flowmeter.displayBillNo"
    },
    enterprodQuantity: {
        label: "node.report.flowmeter.enterprodQuantity",
        columnType: 'decimal-quantity'
    },
    enterprodUnitPrice: {
        label: "node.report.flowmeter.enterprodUnitPrice",
        columnType: 'decimal-money'
    },
    enterprodAmount: {
        label: "node.report.flowmeter.enterprodAmount"
    },
    enterProdRemarks: {
        label: "node.report.flowmeter.enterProdRemarks"
    },
    outprodQuantity: {
        label: "node.report.flowmeter.outprodQuantity",
        columnType: 'decimal-quantity'
    },
    outprodUnitPrice: {
        label: "node.report.flowmeter.outprodUnitPrice",
        columnType: 'decimal-money'
    },
    outprodAmount: {
        label: "node.report.flowmeter.outprodAmount"
    },
    outProdRemarks: {
        label: "node.report.flowmeter.outProdRemarks"
    },
    inventoryNum: {
        label: "node.report.flowmeter.inventoryNum",
        columnType: 'decimal-quantity'
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

function dealCustomField(tags, orderTags) {
    let obj = {};
    tags && tags.forEach(function (item) {
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
    backend.post(`/pc/v1/${session.userIdEnc}/report/ware/flow/by/prod`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum, priceDecimalNum} = req.cookies;
            let customMap = dealCustomField(data.tags, data.OrderTags);
            let list = data.data;
            let i = 1;
            list.forEach(function(item, index){
                item.key = index;
                item.serial = i++;

                item.inventoryNum = Decimal.fixedDecimal(item.formatInventoryNum, quantityDecimalNum);
                if(inboundType.indexOf(item.billType) !== -1){
                    item.enterprodQuantity = item.prodQuantity;
                    item.enterprodUnitPrice = item.prodUnitPrice;
                    item.enterprodAmount = item.prodAmount;
                    item.enterProdRemarks = item.prodRemarks;
                }

                if(outboundType.indexOf(item.billType) !== -1){
                    item.outprodQuantity = item.prodQuantity;
                    item.outprodUnitPrice = item.prodUnitPrice;
                    item.outprodAmount = item.prodAmount;
                    item.outProdRemarks = item.prodRemarks;
                }

                item.enterprodQuantity = Decimal.fixedDecimal(item.enterprodQuantity, quantityDecimalNum);
                item.enterprodUnitPrice = Decimal.fixedDecimal(item.enterprodUnitPrice, priceDecimalNum);
                item.outprodQuantity = Decimal.fixedDecimal(item.outprodQuantity, quantityDecimalNum);
                item.outprodUnitPrice = Decimal.fixedDecimal(item.outprodUnitPrice, quantityDecimalNum);
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


/* 出入库. */
router.post('/detail', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req, res);

    backend.post(`/pc/v1/${session.userIdEnc}/report/ware/flow/by/prod`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum, priceDecimalNum} = req.cookies;
            let customMap = dealCustomField(data.tags, data.OrderTags);
            let list = data.data;
            let i = 1;
            list.forEach(function(item, index){
                item.key = index;
                item.serial = i++;

                item.inventoryNum = Decimal.fixedDecimal(item.formatInventoryNum, quantityDecimalNum);
                if(inboundType.indexOf(item.billType) !== -1){
                    item.enterprodQuantity = item.prodQuantity;
                    item.enterprodUnitPrice = item.prodUnitPrice;
                    item.enterprodAmount = item.prodAmount;
                    item.enterProdRemarks = item.prodRemarks;
                }

                if(outboundType.indexOf(item.billType) !== -1){
                    item.outprodQuantity = item.prodQuantity;
                    item.outprodUnitPrice = item.prodUnitPrice;
                    item.outprodAmount = item.prodAmount;
                    item.outProdRemarks = item.prodRemarks;
                }

                item.enterprodQuantity = Decimal.fixedDecimal(item.enterprodQuantity, quantityDecimalNum);
                item.enterprodUnitPrice = Decimal.fixedDecimal(item.enterprodUnitPrice, priceDecimalNum);
                item.outprodQuantity = Decimal.fixedDecimal(item.outprodQuantity, quantityDecimalNum);
                item.outprodUnitPrice = Decimal.fixedDecimal(item.outprodUnitPrice, quantityDecimalNum);
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

