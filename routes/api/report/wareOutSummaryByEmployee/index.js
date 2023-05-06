const express = require('express');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const Constants = require('../../../../lib/constants');
const DataFilter = require('../../../../lib/utils/DataFilter');
const Decimal = require('../../../../lib/utils/Decimal');

function dealTableConfig() {
    let newList = [];
    newList.push({
        fieldName: "useDepartment",
        label: "node.report.wareOutSummaryByEmployee.useDepartment",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:null,
        visibleFlag: true,
        originVisibleFlag: true,
    },{
        fieldName: "usePerson",
        label: "node.report.wareOutSummaryByEmployee.usePerson",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:null,
        visibleFlag: true,
        originVisibleFlag: true,
    },{
        fieldName: "supplierCount",
        label: "node.report.wareOutSummaryByEmployee.supplierCount",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:null,
        visibleFlag: true,
        originVisibleFlag: true,
        totalFlag: true
    },{
        fieldName: "amount",
        label: "node.report.wareOutSummaryByEmployee.amount",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:null,
        visibleFlag: true,
        originVisibleFlag: true,
        totalFlag: true
    },{
        fieldName: "percent",
        label: "node.report.wareOutSummaryByEmployee.percent",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        cannotEdit:null,
        visibleFlag: true,
        originVisibleFlag: true,
    });
    return newList;
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
    backend.post(`/pc/v1/${session.userIdEnc}/report/ware/out/summary/by/employee`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum} = req.cookies;
            let list = data.data;
            let i = 1;
            list.forEach(function (item) {
                item.key = i;
                item.serial = i++;
            });
            let tableConfigList =  dealTableConfig();
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

    backend.post(`/pc/v1/${session.userIdEnc}/report/ware/out/summary/by/employee`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum} = req.cookies;
            let list = data.data;
            let i = 1;
            list.forEach(function (item) {
                item.key = i;
                item.serial = i++;
            });
            let tableConfigList =  dealTableConfig();
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
