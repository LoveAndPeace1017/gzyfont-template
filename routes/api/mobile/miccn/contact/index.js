const express = require('express');
const router = express.Router();
const backend = require('../../../../../lib/backend');
const config = require('../../../../../config').getConfig();
const logger = require('../../../../../lib/logger').getLogger('default');
var crypto = require('crypto');
const uuid = require('uuid');


function removeBaseType(str){
    if(str.length>0 &&(str[str.length-1]=='=')){
        return removeBaseType(str.substr(0,str.length-1));
    }else{
        return str;
    }
}

function getMd5(acLogUserName){
    let id = uuid.v4();
    let result = `${acLogUserName}~~##~~~${id}`;
    let hash = crypto.createHash('md5');
    hash.update(result);
    let token = hash.digest('base64');
    //得到字符串，如果是等号去掉
    return {acRandomNum:id,acToken:encodeURIComponent(removeBaseType(token))}
}


//联系信列表页
router.get('/lists', function(req, res) {
    const query = req.query;
    const username = (req.query.userName?req.query.userName:req.cookies.userName)||'15261826522';

    logger.error('userName1',`${req.cookies.userName}`);
    logger.error('userName2',`${username}`);

    console.log(username,'username');
    let params = {
        pageSize: query.pageSize || 50,
        pageNo: query.pageNumber?query.pageNumber:1,
    };
    params.headers = {
        "Content-Type":'application/json',
    };
    let getMd51 = getMd5(username);
    let getMd52 = getMd5(username);
    logger.error('urls',`${config.voBackendUrl}/abizclient/supplyResource/messagebox/inbox/jxcapp/?acLogUserName=${username}&acRandomNum=${getMd51.acRandomNum}&acToken=${getMd51.acToken}`);
    logger.error('uls2',`${config.voBackendUrl}/abizclient/supplyResource/messagebox/outbox/jxcapp/?acLogUserName=${username}&acRandomNum=${getMd52.acRandomNum}&acToken=${getMd52.acToken}`);
    res.locals.tasks = {};
    let tasks = [
        {
            uri: `${config.voBackendUrl}/abizclient/supplyResource/messagebox/inbox/jxcapp/?acLogUserName=${username}&acRandomNum=${getMd51.acRandomNum}&acToken=${getMd51.acToken}`,
            method: 'get',
            params: params,
            task: function (data) {
                res.locals.tasks.tab1 = data;
            }
        },
        {
            uri: `${config.voBackendUrl}/abizclient/supplyResource/messagebox/outbox/jxcapp/?acLogUserName=${username}&acRandomNum=${getMd52.acRandomNum}&acToken=${getMd52.acToken}`,
            params: params,
            method: 'get',
            task: function (data) {
                res.locals.tasks.tab2 = data;
            }
        }
    ];


    backend.get(tasks, req, res, function(data) {
        res.json({
            tab1:res.locals.tasks.tab1,
            tab2:res.locals.tasks.tab2
        });
    });
});



//根据不同类型提供不同的数据
router.get('/list/detailType', function(req, res) {
    const query = req.query;
    const username = req.cookies.userName;
    let url;
    let getMd51 = getMd5(username);
    if(query.type == 'inbox'){
        url = `${config.voBackendUrl}/abizclient/supplyResource/messagebox/inbox/jxcapp/?acLogUserName=${username}&acRandomNum=${getMd51.acRandomNum}&acToken=${getMd51.acToken}`;
    }else{
        url = `${config.voBackendUrl}/abizclient/supplyResource/messagebox/outbox/jxcapp/?acLogUserName=${username}&acRandomNum=${getMd51.acRandomNum}&acToken=${getMd51.acToken}`;
    }
    let params = {
        pageSize: query.pageSize,
        pageNumber: query.pageNumber,
    }
    params.headers = {
        "Content-Type":'application/json',
    };
    backend.get(url,params, req, res, function(data) {
        res.json(data);
    });
});

//获取联系信的详细信息
router.get('/detailInfor', function(req, res) {
    const query = req.query;
    const username = req.cookies.userName;
    let getMd51 = getMd5(username);
    if(query.type == 'clear'){
        res.json({});
    }else{
        let url = `${config.voBackendUrl}/abizclient/supplyResource/messagebox/${query.type}/jxcapp/detail/?messageId=${query.messageId}&acLogUserName=${username}&acRandomNum=${getMd51.acRandomNum}&acToken=${getMd51.acToken}`;
        backend.get(url, req, res, function(data) {
            res.json(data);
        });
    }
});

//发送联系信
router.get('/sendInfor', function(req, res) {
    const query = req.query;
    const username = req.cookies.userName;
    let getMd51 = getMd5(username);
    let params = query;
    let url = `${config.voBackendUrl}/abizclient/supplyResource/messagebox/send/jxcapp/?acLogUserName=${username}&acRandomNum=${getMd51.acRandomNum}&acToken=${getMd51.acToken}`;
    backend.post(url,params, req, res, function(data) {
        res.json(data);
    });

});


module.exports = router;
