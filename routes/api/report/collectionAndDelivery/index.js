const express = require('express');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const Constants = require('../../../../lib/constants');
const DataFilter = require('../../../../lib/utils/DataFilter');
const Decimal = require('../../../../lib/utils/Decimal');

const map = {
    useDepartment: {
        label: "node.report.collectionAndDelivery.useDepartment"
    },
    supplierCount: {
        label: "node.report.collectionAndDelivery.supplierCount",
        totalFlag: true
    },
    amount: {
        label: "node.report.collectionAndDelivery.amount",
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    percent: {
        label: "node.report.collectionAndDelivery.percent"
    }
};

function dealTableConfig(list, customMap) {
    let newList = [];
    /*list && list.forEach(function (item) {
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
    });*/
    newList.push({
        fieldName: "useDepartment",
        label: "node.report.collectionAndDelivery.useDepartment",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:null,
        visibleFlag: true,
        originVisibleFlag: true,
    },{
        fieldName: "supplierCount",
        label: "node.report.collectionAndDelivery.supplierCount",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:null,
        visibleFlag: true,
        originVisibleFlag: true,
        totalFlag: true
    },{
        fieldName: "amount",
        label: "node.report.collectionAndDelivery.amount",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:null,
        visibleFlag: true,
        originVisibleFlag: true,
        totalFlag: true
    },{
        fieldName: "percent",
        label: "node.report.collectionAndDelivery.percent",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:null,
        visibleFlag: true,
        originVisibleFlag: true,
    });

    return newList;
}

function dealCustomField(prodTags) {
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

/* 领用出库汇总表. */
router.post('/export', function (req, res, next) {
    const params = req.body;
    delete params.page;
    delete params.perPage;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/report/ware/out/summary/by/department`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum} = req.cookies;
            let customMap = dealCustomField(data.tags);
            let list = data.data;
            let i = 1;
            list.forEach(function (item) {
                item.key = i;
                item.serial = i++;
            });
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            let tableData = DataFilter.exportData(tableConfigList,list);
            let decimalMap = {quantityDecimalNum};
            let totalMap = {
                amountTotal: data.totalAmount||0,
                supplierCountTotal: data.totalSupplierCount||0,
            };
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
/* 领用出库汇总表. */
router.post('/detail', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req, res);

    backend.post(`/pc/v1/${session.userIdEnc}/report/ware/out/summary/by/department`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum} = req.cookies;
            let customMap = dealCustomField(data.tags);
            let list = data.data;
            let i = 1;
            list.forEach(function (item) {
                item.key = i;
                item.serial = i++;
            });
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            let decimalMap = {quantityDecimalNum};
            let totalMap = {
                amountTotal: data.totalAmount||0,
                supplierCountTotal: data.totalSupplierCount||0,
            };
            let tableData = DataFilter.dealFooterTotalFieldForList(tableConfigList,totalMap,list, decimalMap);
            let tableWidth = tableConfigList && tableConfigList.reduce(function (width, item) {
                return width + (item.width ? item.width : 200) / 1;
            }, 0);
            res.json({
                retCode: 0,
                list: tableData,
                filterConfigList: [],
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
