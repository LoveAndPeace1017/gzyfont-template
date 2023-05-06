const express = require('express');
const router = express.Router();
const backend = require('../../../lib/backend');
const Session = require('../../../lib/session');


/* vip服务数据*/
router.post('/index', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
   const session = Session.get(req, res);
    backend.get(`/cgi/vip/${session.userIdEnc}/profile`, params, req, res, function (data) {
        console.log(JSON.stringify(data));
        res.json(data);
    });
});

//增值包开通使用
router.post('/value/added', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/cgi/vip/${session.userIdEnc}/value_added`, params, req, res, function (data) {
        res.json(data);
    });
});

//获取客户vip信息
router.get('/vipInfo', function(req, res) {
    const session = Session.get(req,res);
    let params = {};
    params.headers = {
        "Content-Type":'application/json'
    };
    backend.get(`/cgi/vip/${session.userIdEnc}/basic`, params, req, res, function(data) {
        res.json(data)
    });
});

router.get('/language/list', function(req, res, next) {
    const session = Session.get(req,res);
    let params = {};
    params.headers = {
        "Content-Type":'application/json'
    };
    backend.get(`/pc/v1/${session.userIdEnc}/multilanguage`,params,req, res, function(data) {
        res.json(data)
    });
});

router.post('/language/switch', function(req, res, next) {
    const session = Session.get(req,res);
    let params = req.body;
    let domain = req.headers.host;
    var opts = {domain:domain, httpOnly: false, sameSite: false};
    params.headers = {
        "Content-Type":'application/json'
    };
    res.cookie('language',params.configValue||'zhCN', opts);
    backend.put(`/pc/v1/${session.userIdEnc}/multilanguage`,params,req, res, function(data) {
        res.json(data)
    });
});

//获取可用短信数量
router.post('/notify/number', function(req, res, next) {
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/sms_notify/message/number`,req, res, function(data) {
        res.json(data)
    });
});

module.exports = router;
