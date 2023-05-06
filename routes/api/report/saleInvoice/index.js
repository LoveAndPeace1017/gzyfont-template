const express = require('express');
const moment = require('moment');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const Constants = require('../../../../lib/constants');
const DataFilter = require('../../../../lib/utils/DataFilter');

const map = {
    billNo: {
        label: "node.report.saleInvoice.billNo",
    },
    invoiceDate: {
        label: "node.report.saleInvoice.invoiceDate",
        width: Constants.TABLE_COL_WIDTH.DATE
    },
    invoiceCustomNo: {
        label: "node.report.saleInvoice.invoiceCustomNo",
    },
    invoiceType: {
        label: "node.report.saleInvoice.invoiceType",
        width: Constants.TABLE_COL_WIDTH.INCOME_TYPE
    },
    customerName: {
        label: "node.report.saleInvoice.customerName"
    },
    displayBillNo: {
        label: 'node.report.saleInvoice.displayBillNo'
    },
    damount: {
        label: "node.report.saleInvoice.damount",
        totalFlag: true
    },
    dremarks: {
        label: 'node.report.saleInvoice.dremarks'
    },
    remarks: {
        label: 'node.report.saleInvoice.remarks'
    },
    taxAllAmount: {
        label: "node.report.saleInvoice.taxAllAmount",
        totalFlag: true
    },
    ourContacterName: {
        label: 'node.report.sale.ourContacterName1'
    },
    aggregateAmount: {
        label: "node.report.saleInvoice.aggregateAmount",
        totalFlag: true
    }
};

function dealTableConfig(list) {
    let newList = [];
    list && list.forEach(function (item) {
        let obj = map[item.columnName];
        if (obj) {
            newList.push({
                fieldName: item.columnName,
                label: obj.label,
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
router.post('/export', function (req, res, next) {
    const params = req.body;
    delete params.page;
    delete params.perPage;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/report/finance/salesOrder`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let list = data.data;
            let i = 1;
            list.forEach(function (item) {
                item.key = i;
                item.nonOutQuantity = item.quantity - item.outQuantity;
                item.invoiceDate = new moment(item.invoiceDate).format('YYYY-MM-DD');
                item.serial = i++;
            });
            let tableConfigList =  dealTableConfig(data.listFields || []);
            let tableData = DataFilter.exportData(tableConfigList,list);
            tableData = DataFilter.dealFooterTotalFieldForExport(tableConfigList,data.totalMap,tableData);

            res.json({
                retCode: 0,
                tableData: tableData,
            });
        } else {
            res.json({
                retCode: 1,
                retMsg: (data && data.retMsg) || "网络异常，请稍后重试！"
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

    backend.post(`/pc/v1/${session.userIdEnc}/report/finance/salesOrder`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            // let customMap = dealCustomField(data.prodTags, data.customerTags);
            let list = data.data;
            let i = 1;
            list.forEach(function (item) {
                item.key = i;
                item.nonOutQuantity = item.quantity - item.outQuantity;
                item.invoiceDate = new moment(item.invoiceDate).format('YYYY-MM-DD');
                item.serial = i++;
            });
            let tableConfigList =  dealTableConfig(data.listFields || []);
            let tableData = DataFilter.dealFooterTotalFieldForList(tableConfigList,data.totalMap,list);

            res.json({
                retCode: 0,
                list: tableData,
                filterConfigList: [],
                tableConfigList: tableConfigList,
                tableWidth: 0,
                totalColAmount: data.totalColAmount,
                pageColAmount: data.pageColAmount,
                totalPayAmount: data.totalPayAmount,
                pagePayAmount: data.pagePayAmount,
                pagination: {
                    total: data.count,
                    current: params.page,
                    pageSize: params.perPage
                }
            });
        } else {
            res.json({
                retCode: 1,
                retMsg: (data && data.retMsg) || "网络异常，请稍后重试！"
            });
        }

    });
});

module.exports = router;
