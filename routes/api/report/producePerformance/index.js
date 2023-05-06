const express = require('express');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const Constants = require('../../../../lib/constants');
const DataFilter = require('../../../../lib/utils/DataFilter');

const map = {
    billNo: {
        label: "node.report.producePerformance.billNo",
    },
    processCode: {
        label: "node.report.producePerformance.processCode",
    },
    processName: {
        label: "node.report.producePerformance.processName",
    },
    employeeName: {
        label: "node.report.producePerformance.employeeName",
    },
    reportCount: {
        label: "node.report.producePerformance.reportCount",
    },
    finishCount: {
        label: "node.report.producePerformance.finishCount",
    },
    scrapCount: {
        label: "node.report.producePerformance.scrapCount",
    },
    yieldRate: {
        label: "node.report.producePerformance.yieldRate",
    },
    prodName: {
        label: "node.report.producePerformance.prodName",
    },
    sheetName: {
        label: "node.report.producePerformance.sheetName",
    }
};

function dealTableConfig(list) {
    let newList = [];
    let initFlag = true;
    list && list.forEach(function (item) {
        if(item.columnName==='employeeName'){
            initFlag = false;
        }
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
    if(initFlag){
        newList.splice(3, 0, {
            fieldName: 'employeeName',
            label: 'node.report.producePerformance.employeeName',
            width: Constants.TABLE_COL_WIDTH.NO,
            visibleFlag: 1,
            cannotEdit: true
        });
    }
    return newList;
}

router.post('/export', function (req, res, next) {
    const params = req.body;
    delete params.page;
    delete params.perPage;
    /*params.headers = {
        "Content-Type": 'application/json'
    };*/
    const session = Session.get(req, res);
    backend.post(`/cgi/${session.userIdEnc}/worksheet/forms/report`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let list = data.data;
            let i = 1;
            list.forEach(function (item) {
                item.key = i;
                item.serial = i++;
                if(params.group === "0"){
                    item.billNo = '-';
                    item.prodName = '-';
                    item.processCode = '-';
                    item.processName = '-';
                }
                if(params.group === "1"){
                    item.billNo = '-';
                    item.prodName = '-';
                }
            });
            let tableConfigList =  dealTableConfig(data.listFields || []);
            let tableData = DataFilter.exportData(tableConfigList,list);
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
   /* params.headers = {
        "Content-Type": 'application/json'
    };*/
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req, res);

    backend.post(`/cgi/${session.userIdEnc}/worksheet/forms/report`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let list = data.data;
            let i = 1;
            list.forEach(function (item) {
                item.key = i;
                item.serial = i++;
                if(params.group === "0"){
                    item.billNo = '-';
                    item.prodName = '-';
                    item.processCode = '-';
                    item.processName = '-';
                    item.sheetName = '-';
                }
                if(params.group === "1"){
                    item.billNo = '-';
                    item.prodName = '-';
                    item.sheetName = '-';
                }
            });
            let tableConfigList =  dealTableConfig(data.listFields || []);
            res.json({
                retCode: 0,
                list: list,
                filterConfigList: [],
                tableConfigList: tableConfigList,
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
