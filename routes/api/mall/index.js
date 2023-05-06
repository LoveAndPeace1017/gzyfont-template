const express = require('express');
const router = express.Router();
const backend = require('../../../lib/backend');
const Session = require('../../../lib/session');


/* 进入新增后需要加载的一些信息*/
router.get('/baseInfo', function (req, res, next) {
    const params = req.query;
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/mall/baseInfo`, params, req, res, function (data) {
        res.json(data);
    });
});

/* 开通商城*/
router.post('/openMall', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/mall/openMall`, params, req, res, function (data) {
        res.json(data);
    });
});

/* 开通小程序商城*/
router.post('/openAppletsMall', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/mall/openAppletsMall`, params, req, res, function (data) {
        res.json(data);
    });
});

/* 查询商城设置*/
router.get('/views/setting', function (req, res, next) {
    let params = {
        headers: {
            "Content-Type": 'application/json'
        }
    };
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/mall/pre/create`, params, req, res, function (data) {
        res.json(data);
    });
});
/* 修改商城设置*/
router.post('/edit/setting', function (req, res, next) {
    let params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.put(`/pc/v1/${session.userIdEnc}/mall/`, params, req, res, function (data) {
        res.json(data);
    });
});

module.exports = router;
