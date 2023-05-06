const express = require('express');
const router = express.Router();
const backend = require('../../lib/backend');
const Session = require('../../lib/session');
const logger = require('../../lib/logger').getLogger('default');

router.post('/cooperator/sendMobileCode', function(req, res, next) {
    let session = Session.get(req,res);
    let params = {
        mobile:req.body.mobile,
        guid:session.id,
        type:'PC_WEB',
        captcha:req.body.captcha,
    };
    backend.get('/partner/register/uncheck/code',params,req,res,function(data){
        res.json(data);
    });

});


/*router.post('/sendMobileCode', function(req, res, next) {
    let session = Session.get(req,res);
    let params = {
        mobile:req.body.mobile,
        guid:session.id,
        type:'PC_WEB',
        captcha:req.body.captcha,
    };
    backend.get('/web/verification/register/code',params,req,res,function(data){
        res.json(data);
    });

});*/

router.post('/sendMobileCodeV2', function(req, res, next) {
    let session = Session.get(req,res);
    let params = {
        mobile:req.body.mobile,
        guid:session.id,
        type:'PC_WEB',
        captcha:req.body.captcha,
        captchaVerification: encodeURIComponent(req.body.captchaVerification)
    };
    params.headers = {
        "Content-Type":'application/json'
    };
    backend.get('/web/verification/register/code/dual',params,req,res,function(data){
        if(data.retCode !== '0'){
            logger.error( `手机号：${params.mobile}注册异常，错误信息：${JSON.stringify(data)}`);
        }
        res.json(data);
    });

});

module.exports = router;
