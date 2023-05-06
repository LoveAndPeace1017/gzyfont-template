const express = require('express');
const router = express.Router();
const backend = require('../../../lib/backend');
const Session = require('../../../lib/session');
const Auth = require('../../../lib/utils/Auth');
// const server = 'http://192.168.16.254:9037';
const server = '';

/* GET subAccount page. */

//子账号列表
router.get('/list', function(req, res) {
    // const userId = 'tlKyeJUjbxsY';
    const session = Session.get(req, res);
    backend.post(server+ `/pc/v1/${session.userIdEnc}/sub-accounts/list`, req.query, req, res, function(data) {
        res.json(data)
    });
});
//完善公司信息
router.post('/improvecompany', function(req, res) {
    const session = Session.get(req, res);
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    backend.post(`/pc/confirm/${session.userIdEnc}/company`, params, req, res, function(data) {
        res.json(data)
    });
});
//停用启用
router.post('/oprate/:type', function(req, res) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/sub-accounts/setEnable/${req.params.type}`, params, req, res, function(data) {
        res.json(data)
    });
});

//新增子账号
router.post('/add', function(req, res) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/sub-accounts`, params, req, res, function(data) {
        res.json(data)
    });
});

//子账号用户名唯一性校验
router.get('/checkChildLogUserName', function(req, res) {
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/sub-accounts/checkIsExistName`, req.query, req, res, function(data) {
        res.json(data)
    });
});

//根据子账号id获取子账号信息
router.get('/getSubDetail/:subUserId', function(req, res) {
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/sub-accounts/getSubDetail/${req.params.subUserId}`, req.query, req, res, function(data) {
        res.json(data)
    });
});

//修改子账号
router.post('/relationEmployee/:subUserId', function(req, res) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    const userId = session.mainUserIdEnc;
    params.userId = userId;
    backend.post(`/pc/v1/${session.userIdEnc}/sub-accounts/relationEmployee/${req.params.subUserId}`, params, req, res, function(data) {
        res.json(data)
    });
});

//主账号绑定员工
router.post('/mainRelationEmployee/', function(req, res) {
    const params = {};
    const value = req.body.value;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    params.deptId = value.deptId;
    params.employeeId = value.employeeId;
    backend.post(`/pc/v1/account/relationEmployee/${session.userIdEnc}/`, params, req, res, function(data) {
        res.json(data)
    });
});

//主账号获取绑定的员工部门
router.post('/mainInfoAboutEmployee/', function(req, res) {
    const params = {};
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/account/detail/relationEmployee/${session.userIdEnc}/`,params, req, res, function(data) {
        res.json(data)
    });
});

//重置子账号密码
router.post('/resetpwd/:subUserId', function(req, res) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/sub-accounts/resetpwd/${req.params.subUserId}`, params, req, res, function(data) {
        res.json(data)
    });
});

//获取子账号权限
router.get('/showChildrenAuth/:subUserId', function(req, res) {
    // const userId = 'tlKyeJUjbxsY';
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/sub-accounts/authorities/${req.params.subUserId}`, req.query, req, res, function(data) {
        data.authMap = Auth.dealAuthority(data.data.authoritys);
        res.json(data)
    });
});

//提交子账号权限
router.post('/:subUserId', function(req, res) {
    // const userId = 'tlKyeJUjbxsY';
    const session = Session.get(req, res);
    const params = {
        authoritys:req.body.authoritys,
        userName: session.mainUserName,
        userNameSub:req.body.userNameSub
    };
    params.headers = {
        "Content-Type": 'application/json'
    };
    // uri = `${uri}?authoritys=${JSON.stringify(req.body.authoritys)}&userName=${req.body.userName}&userNameSub=${req.body.userNameSub}`;
    // req.body.userName =
    backend.put(`/pc/v1/${session.userIdEnc}/sub-accounts/authorities/${req.params.subUserId}`, params, req, res, function(data) {
        res.json(data)
    });
});

module.exports = router;
