const express = require('express');
const router = express.Router();
const backend = require('../../../lib/backend');
const Session = require('../../../lib/session');
// const server = 'http://192.168.16.254:9037';
const server = '';

/* GET home page. */
router.get('/list', function(req, res, next) {
    let session = Session.get(req,res);
    backend.get(server+`/pc/v1/${session.userIdEnc}/wares`,{},req,res,function(data){
        if(data && data.retCode==0){
            let list = data.data;
            let i = 1;
            list.forEach(function(item){
                item.key = item.id;
                item.serial = i++;
            });
            res.json({
                retCode:0,
                list:list,
                info:data.warehouseVipInfo
            });
        }else{
            res.json({
                retCode:1,
                retMsg:"网络异常，请稍后重试！"
            });
        }

    });
});


/* GET home page. */
router.post('/default', function(req, res, next) {
    let session = Session.get(req,res);
    backend.put(server+`/pc/v1/${session.userIdEnc}/wares/${req.body.id}/common`,{},req,res,function(data){
        res.json(data);
    });
});

//分配仓库给子账号获取
router.get('/subAccounts/:id', function(req, res, next) {
    let session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/wares/${req.params.id}/subaccounts`,{},req,res,function(data){
        res.json(data);
    });
});
//分配仓库给子账号提交
router.post('/allocSubAccounts/:id', function(req, res, next) {
    const params = {
        visableConfig: req.body.list,
        headers:{
            "Content-Type":'application/json'
        }
    };
    let session = Session.get(req,res);
    backend.put(`/pc/v1/${session.userIdEnc}/wares/${req.params.id}/subaccounts`,params,req,res,function(data){
        res.json(data);
    });
});

/* GET home page. */
router.post('/insert', function(req, res, next) {
    const params = {
        provinceCode : req.body.cityCode[0],
        cityCode : req.body.cityCode[1],
        provinceText:req.body.provinceText,
        cityText:req.body.cityText,
        address : req.body.address,
        name : req.body.name,
        headers:{
            "Content-Type":'application/json'
        }
    };
    let session = Session.get(req,res);
    backend.post(server+`/pc/v1/${session.userIdEnc}/wares`,params,req,res,function(data){
        res.json(data);
    });
});

/* GET home page. */
router.put('/modify', function(req, res, next) {
    const params = {
        provinceCode : req.body.cityCode[0],
        cityCode : req.body.cityCode[1],
        provinceText:req.body.provinceText,
        cityText:req.body.cityText,
        address : req.body.address,
        name : req.body.name,
        headers:{
            "Content-Type":'application/json'
        }
    };
    let session = Session.get(req,res);
    backend.put(server+`/pc/v1/${session.userIdEnc}/wares/${req.body.id}`,params,req,res,function(data){
        res.json(data);
    });
});
router.delete('/delete/:id', function(req, res, next) {
    let session = Session.get(req,res);
    backend.delete(server+`/pc/v1/${session.userIdEnc}/wares/${req.params.id}`,{},req,res,function(data){
        res.json(data);
    });
});

//OSS系统VIP服务用户（增值包）添加一条开通记录
router.post('/asyncOpenVipAndSendRequestToOss', function(req, res, next) {
    const params = {
        headers:{
            "Content-Type":'application/json'
        }
    };
    let session = Session.get(req,res);


    backend.post(`/pc/v1/${session.userIdEnc}/wares/confirm`,params,req,res,function(data){
        res.json(data);
    });
});

module.exports = router;
