const express = require('express');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const Constants = require('../../../../lib/constants');
const DataFilter = require('../../../../lib/utils/DataFilter');
const Decimal = require('../../../../lib/utils/Decimal');


//采购汇总图导出
router.post('/export', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };

    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/report/saleorder/summary/figure`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let tableData = [['','销售金额','销售订单','销售均价']];

            for(let i=0;i<data.data.length;i++){
                tableData.push([data.data[i].time,Decimal.fixedDecimal(data.data[i].amount, 2),data.data[i].total,Decimal.fixedDecimal((data.data[i].amount)/(data.data[i].total), 2)]);
            }
            let totalMap = data.totalMap || {};
            tableData.push(['合计',totalMap.totalAmount, totalMap.totalCount]);
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

//采购汇总图详情
router.post('/detail', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };

    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/report/saleorder/summary/figure`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            if(data.data){
                let list = data.data;
                list.forEach(function (item) {
                    item.amount = Decimal.fixedDecimal(item.amount, 2);
                });
                let totalMap = data.totalMap || {};
                data.footer = {
                    time: '合计',
                    amount: totalMap.totalAmount,
                    total: totalMap.totalCount
                };
            }
            res.json(data);
        } else {
            res.json({
                retCode: 1,
                retMsg:  (data && data.retMsg) || "网络异常，请稍后重试！"
            });
        }

    });
});

module.exports = router;
