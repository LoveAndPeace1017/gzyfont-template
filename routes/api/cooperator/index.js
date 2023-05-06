const express = require('express');
const moment = require('moment');
const router = express.Router();
const backend = require('../../../lib/backend');
const Session = require('../../../lib/session');
const CooperatorSession = require('../../../lib/session/cooperator');
const Constants = require('../../../lib/constants');
const DataFilter = require('../../../lib/utils/DataFilter');
// const server = 'http://192.168.16.254:3009';
const server = '';

const map = {
    dataTime:{
        label: "日期",
    },
    registerCount: {
        label: "注册用户数",
    },
    payCount: {
        label: "付费用户数",
    },
    payAmountTotal: {
        label: "付费金额（元）",
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
                originVisibleFlag: item.visibleFlag
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


router.post('/detail', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const cooperatorSession = CooperatorSession.get(req, res);
    params.id = cooperatorSession.userIdEnc;
    const newUrl = params.newUrl;
    const url = (newUrl?`${server}/partner/list/search`:`${server}/partner/list`);
    backend.get(url, params, req, res, function (data) {
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
            let tableConfigList =  [{
                fieldName: "datatime",
                label: "cooperator.datatime",
                width: 170,
                recId: 397499,
                visibleFlag: 1,
                originVisibleFlag: 1,
                cannotEdit: 1
            },{
                fieldName: "registerCount",
                label: "cooperator.registerCount",
                width: 170,
                recId: 397499,
                visibleFlag: 1,
                originVisibleFlag: 1,
                cannotEdit: 1
            },{
                fieldName: "payCount",
                label: "cooperator.payCount",
                width: 170,
                recId: 397499,
                visibleFlag: 1,
                originVisibleFlag: 1,
                cannotEdit: 1
            },{
                fieldName: "payAmountTotal",
                label: "cooperator.payAmountTotal",
                width: 170,
                recId: 397499,
                visibleFlag: 1,
                originVisibleFlag: 1,
                cannotEdit: 1
            },];

            res.json({
                retCode: 0,
                list: list,
                filterConfigList: [],
                tableConfigList: tableConfigList,
                tableWidth: 0,
                pageRegNum: data.pageRegNum,
                pagePayAmount: data.pagePayAmount,
                countRegister: data.countRegister,
                totalPayMoney: data.totalPayMoney,
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
