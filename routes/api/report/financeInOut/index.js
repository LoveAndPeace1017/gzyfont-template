const express = require('express');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const Constants = require('../../../../lib/constants');
const DataFilter = require('../../../../lib/utils/DataFilter');

const map = {
    billNo: {
        label: "node.report.financeInOut.billNo",
        width: Constants.TABLE_COL_WIDTH.DATE
    },
    billDate: {
        label: "node.report.financeInOut.billDate",
        width: Constants.TABLE_COL_WIDTH.DATE
    },
    typeName: {
        label: "node.report.financeInOut.typeName",
        width: Constants.TABLE_COL_WIDTH.INCOME_TYPE
    },
    // 07版本删除
    // billNo: {
    //     label: "上游订单"
    // },
    accountName: {
        label: "node.report.financeInOut.accountName",
        width: Constants.TABLE_COL_WIDTH.FUND_ACCOUNT
    },
    paymentAmount: {
        label: 'node.report.financeInOut.paymentAmount',
        totalFlag: true
    },
    paymentRemarks: {
        label: 'node.report.financeInOut.paymentRemarks'
    },
    paymentName: {
        label: 'node.report.financeInOut.paymentName'
    },
    collectionName: {
        label: "node.report.financeInOut.collectionName"
    },
    collectionAmount: {
        label: 'node.report.financeInOut.collectionAmount',
        totalFlag: true
    },
    collectionRemarks: {
        label: 'node.report.financeInOut.collectionRemarks'
    },
    currencyName: {
        label: 'node.report.sale.currencyName'
    },
    quotation: {
        label: 'node.report.sale.quotation'
    },
    ourContacterName: {
        label: 'node.report.sale.ourContacterName1'
    },
    currencyPaymentAmount: {
        label: 'node.report.sale.currencyPaymentAmount',
        columnType: 'decimal-money',
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
    backend.post(`/pc/v1/${session.userIdEnc}/report/saleorder/paymentWithPurchaseAndSale`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let list = data.data;
            let i = 1;
            list.forEach(function (item) {
                let billNo = item.billNo;
                const Type = billNo.split('-')[0];
                if(Type === 'FK'){
                    item.ourContacterName = item.purchaseOurContacterName;
                }else if(Type === 'SK'){
                    item.ourContacterName = item.saleOurContacterName;
                }
                item.key = i;
                item.nonOutQuantity = item.quantity - item.outQuantity;
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

    backend.post(`/pc/v1/${session.userIdEnc}/report/saleorder/paymentWithPurchaseAndSale`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let list = data.data;
            let i = 1;
            list.forEach(function (item) {
                let billNo = item.billNo;
                const Type = billNo.split('-')[0];
                if(Type === 'FK'){
                    item.ourContacterName = item.purchaseOurContacterName;
                }else if(Type === 'SK'){
                    item.ourContacterName = item.saleOurContacterName;
                }
                item.key = i;
                item.nonOutQuantity = item.quantity - item.outQuantity;
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
