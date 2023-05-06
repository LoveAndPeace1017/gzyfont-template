const express = require('express');
const router = express.Router();
const backend = require('../../lib/backend');
const Session = require('../../lib/session');
const CooperatorSession = require('../../lib/session/cooperator');
const TraceSession = require('../../lib/session/trace');
const conf = require('../../config').getConfig();
const logger = require('../../lib/logger').getLogger('default');

// const server = 'http://192.168.16.254:2017';
const server = '';


/**
 *  登录 - 订单追踪平台
 */
router.get('/:userId/trace', function(req, res, next) {
    if(req.headers.referer&&req.headers.referer.indexOf('/register')!==-1){
        backend.get(server+'/client_log/write',{serviceKey:'regist_login'},req,res,function(data){
            res.end();
        });
    }
    res.render('traceLogin/index', {
        title: '订单追踪平台登录',
        form: req.params
    });
});


router.post('/trace', function(req, res, next) {
    let params = {
        serialNo:req.body.logonUserName,
        serialPwd:req.body.logonPassword,
    };
    params.headers = {
        "Content-Type": 'application/json'
    };
    let userId = req.body.userId;

    backend.post(server+`/openTrace/${userId}/logon`,params,req,res,function(data){
        if(data && data.retCode==0){
            let logonData = data.data;
            logonData.id = userId;
            TraceSession.logon(req, res, logonData);
            res.redirect('/');
        }else{
            //如果登录失败调回登录页，需要记录id
            res.cookie('traceLoginUserId',userId);
            params.error = data.retMsg;
            params.userId = userId;
             res.render('traceLogin/index', {
                 title: '订单追踪云平台登录',
                 form:params
             });
        }

    });
});




/**
 *  登录 - 合伙人登录
 */
router.get('/cooperator', function(req, res, next) {
    if(req.headers.referer&&req.headers.referer.indexOf('/register')!==-1){
        backend.get(server+'/client_log/write',{serviceKey:'regist_login'},req,res,function(data){
            res.end();
        });
    }
    res.render('cooperatorLogin/index', {
        title: '合伙人登录',
    });
});


router.post('/cooperator', function(req, res, next) {
    let params = {
        mobilePhone:req.body.logonUserName,
        password:req.body.logonPassword,
    };

    backend.post(server+'/partner/logon',params,req,res,function(data){
        if(data && data.retCode==0){
            CooperatorSession.logon(req, res, data.order);
            res.redirect('/');
        }else{
            params.error = data.retMsg;
            res.render('cooperatorLogin/index', {
                title: '合伙人登录',
                form:params
            });
        }

    });
});



/* 切换子账号 */
router.get('/changeAccount', function(req, res, next) {
    let session = Session.get(req,res);
    let params = {
        changeUserIdEnc: req.query.changeUserIdEnc,
        logonUserName:session.loginUsername,
        token:session.xtoken,
        clientId:session.id,
        userType:''
    };
    backend.post(server+'/web/account/changelogin',params,req,res,function(data){
        if(data && data.retCode==0){
            data.fromMain = !data.mainUserFlag;
            Session.logon(req, res, data);
        }
        res.json(data)
    });
});
/**
 * cd 登录 - 用户正式环境
 */
router.get('/', function(req, res, next) {
    if(req.headers.referer&&req.headers.referer.indexOf('/register')!==-1){
        backend.get(server+'/client_log/write',{serviceKey:'regist_login'},req,res,function(data){
            res.end();
        });
    }
    let domainUrl = conf.domainUrl;
    res.render('login/logon', {
        title: '登录',
        form:{
            baseNextPage:req.query.from?req.query.from.indexOf('://')==-1?'//'+domainUrl+req.query.from:req.query.from:"",
        },
        source: req.query.source
    });
});


/**
 * 普通登录 - 开发环境下必须用此方式登录
 */
router.get('/inner', function(req, res, next) {
    if(req.headers.referer&&req.headers.referer.indexOf('/register')!==-1){
        backend.get(server+'/client_log/write',{serviceKey:'regist_login'},req,res,function(data){
            res.end();
        });
    }

    let domainUrl = conf.domainUrl;
    res.render('login/index', {
        title: '登录',
        form:{
            baseNextPage:req.query.from?req.query.from.indexOf('://')==-1?'//'+domainUrl+req.query.from:req.query.from:"",
        },
        source: req.query.source
    });
});

/**
 * 触屏邀请注册，绑定账号
 */
router.get('/bind', function(req, res, next) {

    res.render('login/bind', {
        title: '登录',
        source: req.query.source
    });
});
router.post('/bind', function(req, res, next) {
    backend.post(server+'/web/account/login',params,req,res,function(data){
        if(data && data.retCode==0){
            res.render('register/inviteRegisterSuccess', {
                title: '绑定成功',
                source: req.query.source
            });
        }else{
            params.error = data.businessError;
            res.render('login/bind', {
                title: '登录',
                form:params
            });
        }
    });
});


router.post('/', function(req, res, next) {
    let params = {
        logonUserName:req.body.logonUserName,
        token:req.realIp,
        logonPassword:req.body.logonPassword,
        clientId:req.realIp
    };
    //如果是非#zzzabiz的请求进入这个接口，直接返回页面
    if(params.logonUserName.length > 8 && params.logonUserName.slice(-8) === '#zzzabiz') {
        backend.post(server+'/web/account/login',params,req,res,function(data){
            logger.info('登录/web/account/login' + JSON.stringify(data));
            if(data && data.retCode==0){
                Session.logon(req, res, data);
                res.redirect('/');
            }else{
                params.error = data.businessError;
                res.render('login/index', {
                    title: '登录',
                    form:params
                });
            }

        });
    }else{
        params.error = '非法登录';
        res.render('login/index', {
            title: '登录',
            form:params
        });
    }

});

router.post('/dz', function(req, res, next) {
    let params = {
        logonUserName:req.body.logonUserName,
        token:req.realIp,
        logonPassword:req.body.logonPassword,
        clientId:req.realIp
    };

    backend.post(server+'/web/account/login',params,req,res,function(data){
        logger.info('登录/web/account/login' + JSON.stringify(data));
        if(data && data.retCode==0){
            // 定制系统公司名称
            if(req.body.dzCompanyName){
                data.dzCompanyName = req.body.dzCompanyName;
            }
            Session.logon(req, res, data);
            res.redirect('/home');
        }else{
            params.error = data.businessError;
            res.render('login/index', {
                title: '登录',
                form:params
            });
        }

    });
});

/**获取二维码*/
router.get('/getQrcode', function(req, res, next) {
    const session = Session.get(req,res);
    backend.post(server+'/qr_code/client',{
        clientId:session.id
    },req,res,function(data){
        if(data && data.retCode=="1") {
            backend.post(server + '/qr_code/getcode', {
                client_id: data.clientId,
                hashCode:data.hashCode
            }, req, res, function(data) {
                res.json(data)
            });
        }else{
            res.json({
                retCode:-1,
                retMsg:"请求clientId失败"
            })
        }
    });
});

/**扫面二维码登录*/
router.post('/qrcode', function(req, res, next) {
    // const session = Session.get(req,res);
    logger.info('扫码登录: url + /qrcode:');
    backend.post(server+'/qr_code/getresult',{
        qr_code:req.body.qr_code
    },req,res,function(data){
        logger.info('url: /qr_code/getresult + result' + JSON.stringify(data), req.body.qr_code);
        if(data && data.retCode==0){
            Session.logon(req, res, data);
        }
        res.json(data);
    });
});

/**扫面二维码登录*/
router.post('/app_qrcode', function(req, res, next) {
    // const session = Session.get(req,res);
    backend.post(server+'/qr_code/getresult',{
        qr_code:req.body.qr_code
    },req,res,function(data){
        res.json(data);
    });
});


router.get('/sildingImage/show', function(req, res, next) {
    let session = Session.get(req,res);
    logger.info('/sildingImage/show + cookie' + session.id);
    backend.post(server+'/web/verification/sildingImage/show',{
        uid:session.id
    },req,res,function(data){
        res.json(data);
    });
});
router.post('/sildingImage/validate', function(req, res, next) {
    backend.post(server+'/web/verification/sildingImage/validate',req.body,req,res,function(data){
        res.json(data);
    });
});

module.exports = router;
