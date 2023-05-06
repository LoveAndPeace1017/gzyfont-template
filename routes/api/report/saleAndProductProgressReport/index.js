const express = require('express');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const Constants = require('../../../../lib/constants');
const qs = require('querystring');
var crypto = require('crypto');

//销售生产进度表
router.post('/chart', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/report/saleorder/schedule`, params, req, res, function (data) {
        //当存在工序实际结束时间为空，则图表中，实际进度条结束时间按照当前系统时间显示
        let workOrderList = data.data;
        if(workOrderList && workOrderList.length>0){
            for(let i=0;i<workOrderList.length;i++){
                if(workOrderList[i].pwspList && workOrderList[i].pwspList.length>0){
                    let pwspList = workOrderList[i].pwspList;
                    for(let j=0;j<pwspList.length;j++){
                        if(pwspList[j].actualStartDate && !pwspList[j].actualEndDate){
                            pwspList[j].actualEndDate = new Date().getTime();
                        }
                    }
                }
            }
        }
        data.data = workOrderList;
        res.json(data);
    });
});


module.exports = router;
