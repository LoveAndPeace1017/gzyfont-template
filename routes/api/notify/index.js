const express = require('express');
const router = express.Router();
const backend = require('../../../lib/backend');
const Session = require('../../../lib/session');
// const server = 'http://192.168.16.254:9045';
const server = '';

/* 消息列表 */
router.get('/list', function (req, res, next) {
    const params = req.query;
    params.type = 1;
    const session = Session.get(req, res);
    backend.get(server +`/pc/v1/${session.userIdEnc}/notify/list`, params, req, res, function (data) {
        res.json(data);
    });
});

/* 消息置为已读 */
router.put('/read', function (req, res, next) {
    const params = req.body;
    if(req.body.id){
        params.ids = [req.body.id];
    }
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.put(server +`/pc/v1/${session.userIdEnc}/notify/read`, params, req, res, function (data) {
        res.json(data);
    });
});

router.get('/count', function (req, res, next) {
    const params = req.query;
    const session = Session.get(req, res);
    params.type = 1;
    backend.get(server +`/pc/v1/${session.userIdEnc}/notify/count`, params, req, res, function (data) {
        res.json(data);
    });
});

/* 获取审批信息提醒 */
router.get('/approve', function (req, res, next) {
    const params = req.query;
    const session = Session.get(req, res);
    backend.get(server +`/cgi/approval/${session.userIdEnc}/popup`, params, req, res, function (data) {
        res.json(data);
    });
});
module.exports = router;
