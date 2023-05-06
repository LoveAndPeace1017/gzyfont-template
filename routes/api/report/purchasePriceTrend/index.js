const express = require('express');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const Constants = require('../../../../lib/constants');
const DataFilter = require('../../../../lib/utils/DataFilter');
const Decimal = require('../../../../lib/utils/Decimal');



router.post('/export', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
    };

    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/report/purchase/price/trend`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let tableData = [['物品编号','物品名称','采购日期','规格型号','单位','品牌','制造商型号','数量','单价']];

            for(let i=0;i<data.data.length;i++){
                tableData.push([data.data[i].productCode,data.data[i].prodName,data.data[i].purchaseOrderDate,data.data[i].descItem,data.data[i].unit,data.data[i].brand,data.data[i].produceModel,data.data[i].quantity,data.data[i].unitPrice]);
            }
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
        "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
    };

    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/report/purchase/price/trend`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
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
