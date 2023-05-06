const express = require('express');
const router = express.Router();
const backend = require('../../../lib/backend');
const Session = require('../../../lib/session');
const Constants = require('../../../lib/constants');

// 获取当前模块单据的审批状态是否开启
router.post('/getStatus', function(req, res) {
    const session = Session.get(req,res);
    let params = {};
    params.headers = {
        "Content-Type":'application/json'
    };
    backend.get(`/cgi/approval/${session.userIdEnc}/state?type=${req.body.types}`, params, req, res, function(data) {
        res.json(data)
    });
});

router.post('/submit', function(req, res, next) {
    const session = Session.get(req,res);
    let data = req.body;
    let params = {};
    params.headers = {
        "Content-Type":'application/json'
    };
    let url =`/cgi/approval/${session.userIdEnc}/${data.billNo}/check`;
    //operate 反驳1  提交 2  撤回 3  审批通过4
    let operate = data.operate;
    switch(operate){
        case 1:
            params.task = data.approveTask;
            params.type = data.type;
            params.node = data.backType;
            params.reject = data.reason;
            break;
        case 2:
            url =`/cgi/approval/${session.userIdEnc}/${data.billNo}/commit`;
            params.type = data.type;
            params.process = data.approveId;
            break;
        case 3:
            url =`/cgi/approval/${session.userIdEnc}/${data.billNo}/cancel`;
            params.type = data.type;
            break;
        case 4:
            params.task = data.approveTask;
            params.type = data.type;
            break;
    }
    backend.post(url,params,req, res, function(data) {
        res.json(data)
    });
});

// 批量审批
router.post('/batch/submit', function(req, res, next) {
    const session = Session.get(req,res);
    let {type, list} = req.body;
    let params = {};
    params.headers = {
        "Content-Type":'application/json'
    };
    params.array = list;
    backend.post(`/cgi/approval/${session.userIdEnc}/commit?type=${type}`,params,req, res, function(data) {
        res.json(data)
    });
});

//审批列表
router.post('/list', function(req, res, next) {
    const session = Session.get(req,res);
    let params = req.body;
    // params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    // params.page = params.page?parseInt(params.page):1;
    params.headers = {
        "Content-Type":'application/json'
    };
    /*res.json({data:[{
            createTime: "2020-11-27 12:11:58",
            displayName: "请假流程测试",
            id: "7b63e2b40e78401ea4269f84070609de",
            modifyTime: "2020-11-27 14:21:55",
            name: "WjAKyxoeHLUe-1",
            state: 1,
            type: "12",
            version: 0
        }]});*/
    backend.get(`/cgi/process/${session.userIdEnc}/list`,params,req, res, function(data) {
        res.json(data)
    });
});
//审批流详情
router.post('/detail/', function(req, res, next) {
    const session = Session.get(req,res);
    let params = req.body;
    let id = params && params.id;
    params.headers = {
        "Content-Type":'application/json'
    };
   /* res.json({
        data:{
            createTime: "2020-11-27 12:11:58",
            dBContent: "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjxwcm9jZXNzIGRpc3BsYXlOYW1lPSLor7flgYfmtYHnqIvmtYvor5UiIG5hbWU9IldqQUt5eG9lSExVZS0xIj4NCjxzdGFydCBkaXNwbGF5TmFtZT0ic3RhcnQxIiBsYXlvdXQ9IjI0LDEyNCwtMSwtMSIgbmFtZT0ic3RhcnQxIj4NCjx0cmFuc2l0aW9uIGc9IiIgbmFtZT0idHJhbnNpdGlvbjEiIG9mZnNldD0iMCwwIiB0bz0iYXBwbHkiIC8+DQo8L3N0YXJ0Pg0KPGVuZCBkaXNwbGF5TmFtZT0iZW5kMSIgbGF5b3V0PSI1NzAsMTI0LC0xLC0xIiBuYW1lPSJlbmQxIiAvPg0KPHRhc2sgYXNzaWduZWU9ImFwcGx5Lm9wZXJhdG9yIiBkaXNwbGF5TmFtZT0i6K+35YGH55Sz6K+3IiBmb3JtPSIvZmxvdy9sZWF2ZS9hcHBseSIgbGF5b3V0PSIxMTcsMTIyLC0xLC0xIiBuYW1lPSJhcHBseSIgcGVyZm9ybVR5cGU9IkFOWSI+DQo8dHJhbnNpdGlvbiBnPSIiIG5hbWU9InRyYW5zaXRpb24yIiBvZmZzZXQ9IjAsMCIgdG89ImFwcHJvdmVEZXB0IiAvPg0KPC90YXNrPg0KPHRhc2sgYXNzaWduZWU9ImFwcHJvdmVEZXB0Lm9wZXJhdG9yIiBkaXNwbGF5TmFtZT0i6YOo6Zeo57uP55CG5a6h5om5IiBmb3JtPSIvZmxvdy9sZWF2ZS9hcHByb3ZlRGVwdCIgbGF5b3V0PSIyNzIsMTIyLC0xLC0xIiBuYW1lPSJhcHByb3ZlRGVwdCIgcGVyZm9ybVR5cGU9IkFOWSI+DQo8dHJhbnNpdGlvbiBnPSIiIG5hbWU9InRyYW5zaXRpb24zIiBvZmZzZXQ9IjAsMCIgdG89ImRlY2lzaW9uMSIgLz4NCjwvdGFzaz4NCjxkZWNpc2lvbiBkaXNwbGF5TmFtZT0iZGVjaXNpb24xIiBleHByPSIjZGF5ICZndDsgMiA/ICd0cmFuc2l0aW9uNScgOiAndHJhbnNpdGlvbjQnIiBsYXlvdXQ9IjQyNiwxMjQsLTEsLTEiIG5hbWU9ImRlY2lzaW9uMSI+DQo8dHJhbnNpdGlvbiBkaXNwbGF5TmFtZT0iJmx0Oz0y5aSpIiBnPSIiIG5hbWU9InRyYW5zaXRpb240IiBvZmZzZXQ9IjAsMCIgdG89ImVuZDEiIC8+DQo8dHJhbnNpdGlvbiBkaXNwbGF5TmFtZT0iJmd0OzLlpKkiIGc9IiIgbmFtZT0idHJhbnNpdGlvbjUiIG9mZnNldD0iMCwwIiB0bz0iYXBwcm92ZUJvc3MiIC8+DQo8L2RlY2lzaW9uPg0KPHRhc2sgYXNzaWduZWU9ImFwcHJvdmVCb3NzLm9wZXJhdG9yIiBkaXNwbGF5TmFtZT0i5oC757uP55CG5a6h5om5IiBmb3JtPSIvZmxvdy9sZWF2ZS9hcHByb3ZlQm9zcyIgbGF5b3V0PSI0MDQsMjMxLC0xLC0xIiBuYW1lPSJhcHByb3ZlQm9zcyIgcGVyZm9ybVR5cGU9IkFOWSI+DQo8dHJhbnNpdGlvbiBnPSIiIG5hbWU9InRyYW5zaXRpb242IiBvZmZzZXQ9IjAsMCIgdG89ImVuZDEiIC8+DQo8L3Rhc2s+DQo8L3Byb2Nlc3M+DQo=",
            displayName: "请假流程测试",
            id: "7b63e2b40e78401ea4269f84070609de",
            instanceUrl: "",
            name: "WjAKyxoeHLUe-1",
            state: 1,
            type: "12",
            version: 0
        }
    });*/
    backend.get(`/cgi/process/${session.userIdEnc}/${id}`,params,req, res, function(data) {
         res.json(data)
    });
});
//审批流发布
router.post('/process', function(req, res, next) {
    const session = Session.get(req,res);
    let body = req.body;
    let params = {};
    let xml = body.xml;
    params.headers = {
        "Content-Type":'application/json'
    };
    params.model = xml;
    params.type = body.type;
    body.id?(params.id = body.id):null;
    backend.post(`/cgi/process/${session.userIdEnc}/deploy`,params,req, res, function(data) {
        res.json(data)
    });
});
//审批流删除
router.post('/delete', function(req, res, next) {
    const session = Session.get(req,res);
    let params = req.body;
    let id = params && params.id;
    params.headers = {
        "Content-Type":'application/json'
    };
    backend.post(`/cgi/process/${session.userIdEnc}/delete/${id}`,params,req, res, function(data) {
        res.json(data)
    });
});
module.exports = router;
