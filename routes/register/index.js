const express = require('express');
const router = express.Router();
const backend = require('../../lib/backend');
const Session = require('../../lib/session');
const CooperatorSession = require('../../lib/session/cooperator');
const logger = require('../../lib/logger').getLogger('default');
const Constants = require('../../lib/constants');
const config = require('../../config').getConfig();
var crypto = require('crypto');
const server = '';
const txH5Map = Constants.txH5Map;


function md5Crypto(num){
    let hash = crypto.createHash('md5');
    hash.update(num);
    //得到字符串，如果是等号去掉
    const md5Password = hash.digest('hex');
    console.log(md5Password, 'md5Password');
    return md5Password;
}


function transformParams(req){
    let form = {
        userIdEnc: req.query.userIdEnc,
        comName:req.query.comName,
        inviteType:req.query.inviteType,
        source: req.query.source,
        trench: req.query.trench,
        type: req.query.type,
        gender:1,
        referer:req.headers.referer,
        clickId: req.query.qz_gdt,  // 腾讯推广注册所需参数
        nextPage: encodeURIComponent(req.query.nextPage||'/home'),
    };
    /***
     * trench 指的是大的来源， source 指的是小的来源
     * trench 对应后台的字段为source
     * source 对应的后台字段为channel
     * 因为先前的url里面的对应关系就错了，所以先这样去写
     */

    if(req.query.userIdEnc){
        // 邀请注册，在提交时需要将邀请链接提交到后台
        form.url = encodeURIComponent(req.url);
    }
    return form;
}
/* web注册入口 */
router.get('/', function(req, res, next) {
    let mobile = req.query.mobile;
    if(mobile){
        mobile = mobile.replace(new RegExp(" ",'g'),"")
    }
    let form = transformParams(req);
    form.mobilePhone = mobile;
    backend.get(server+'/client_log/write',{serviceKey:'regist_page'},req,res,function(data){
        res.end();
    });
    res.render('register/index', {
        title: '注册',
        form:form
    });
});


/* h5注册 */
router.get('/invite', function(req, res, next) {
    let form = transformParams(req);
    if(req.query.trench == '9'){
        logger.info(req.url, 'txUrl');
    }
    let paths = req.url.split('?');
    form.query = paths.length>1?'?'+paths[1]:'';
    form.source = form.source ? form.source : form.inviteType === 'mult' ? '002' : '001';
    form.trench = form.trench || 6;  //邀请注册的url里是没有trench
    // 腾讯推广注册页面
    if(form.trench == '9') {
        res.render(txH5Map[form.source].uri, {
            title: txH5Map[form.source].title,
            keywords: txH5Map[form.source].keywords,
            description: txH5Map[form.source].description,
            form:form,
            source: form.source,
            isVivo: !!txH5Map[form.source].isVivo,  // vivo 渠道
            isJwexin: !!txH5Map[form.source].isJwexin || false,  // 是否需要微信分享
        });
    } else {
        res.render('register/inviteRegister', {
            title: '百卓云进销存/云ERP-简捷好用',
            form:form
        });
    }
});

router.post('/', function(req, res, next) {
    let session = Session.get(req,res);
    let mobile = req.body.mobilePhone;
    var inviteType = req.body.inviteType;
    var clickId = req.body.clickId;
    if(mobile){
        mobile = mobile.replace(new RegExp(" ",'g'),"")
    }
    let params = {
        promotionCode:req.body.promotionCode,
        logonPassword:req.body.logonPassword,
        job:req.body.job,
        mobilePhone:mobile,
        gender:req.body.gender,
        companyContacts:req.body.companyContacts||'N/A',
        companyName:req.body.companyName||'N/A',
        source: req.body.source, // 大的来源
        channel:req.body.channel,
        guid:session.id,
        code:req.body.code,
        identity:req.body.identity,
        supplierUserIdEnc:req.body.userIdEnc,
        type:req.body.type,
        url:req.body.url,
        ref:req.body.referer
    };
    if(params.source == '9'){
        params.euid = {
            click_id: clickId,
            hash_phone: md5Crypto(mobile)
        }
    }
    let nextPage = req.body.nextPage||'/home';
    if(params.supplierUserIdEnc){
        params.qr_code = req.body.url;
    }
    let url = '/web/register';
    if(inviteType=='mult'){
        url = '/web/batch/register';
    }
    logger.info('注册返回+/web/register,params',JSON.stringify(params));
    backend.post(server + url,params,req,res,function(data){
        var source = '';
        if(['6','7','8'].indexOf(params.source) !== -1) source = 'h5';
        if(params.source == '9') source = 'tx_h5';  // 腾讯推广注册页面

        logger.info('注册返回+/web/register,result',JSON.stringify(data));
        if(data && data.retCode=='0'){
            backend.post(server+'/web/account/login',{
                logonUserName:params.mobilePhone,
                token:req.realIp,
                logonPassword:params.logonPassword,
                clientId:req.realIp
            },req,res,function(data){
                logger.info('注册登录返回+/web/account/login',JSON.stringify(data));
                if(data && data.retCode==0){
                    if(source === 'h5'){
                        // 邀请注册-触屏端
                        res.render('register/inviteRegisterSuccess', {
                            title: '注册成功',
                            trench: params.source,
                            channel: params.channel
                        });
                    } else if(source === 'tx_h5') {
                        // 如果为ajax提交
                        if(txH5Map[params.channel].ajaxSubmit){
                            res.json({
                                retCode: '0',
                                title: '注册成功',
                                channel: params.channel,
                                toSuccessUrl: txH5Map[params.channel].toSuccessUrl ? txH5Map[params.channel].toSuccessUrl: 'invite/success'
                            })
                        } else {
                            // 否则为form提交
                            res.render('register/inviteRegisterSuccess', {
                                title: '注册成功',
                                trench: params.source,
                                soleId: md5Crypto(mobile),
                                channel: params.channel,
                                appUploadUri: txH5Map[params.channel].appUploadUri
                            });
                        }
                    }else{
                        Session.logon(req, res, data);
                        if(params.userIdEnc){
                            // 邀请注册-电脑端
                            res.redirect('/mall');
                        }else if(nextPage){
                            // 注册完成后跳转指定页面
                            res.redirect(decodeURIComponent(nextPage));
                        }
                        else {
                            res.redirect('/home');
                        }
                    }
                }else{
                    params.error = data.retMsg;
                    params.trench = params.source; //url里的对应关系有问题
                    params.source = params.channel;
                    params.clickId = clickId;
                    params.inviteType = inviteType=='mult' ? 'mult' : '';
                    if(source === 'h5'){
                        res.render('register/inviteRegister', {
                            title: '注册百卓优采',
                            form:params
                        });
                    } else if (source === 'tx_h5') {
                        res.json({
                            retCode: '-1',
                            retMsg:  data.retMsg || '注册失败',
                            title: '注册失败'
                        });
                    }else{
                        res.render('register/index', {
                            title: '注册',
                            form:params
                        });
                    }
                }
            });
        }else{
            params.error = data.retMsg;
            params.nextPage = req.body.nextPage;
            params.trench = params.source;
            params.source = params.channel;  //url里的对应关系有问题
            params.clickId = clickId;
            params.inviteType = inviteType=='mult' ? 'mult' : '';

            if(source === 'h5'){
                res.render('register/inviteRegister', {
                    title: '注册百卓优采',
                    form:params
                });
            } else if (source === 'tx_h5'){
                res.json({
                    retCode: '-1',
                    retMsg:  data.retMsg || '注册失败',
                    title: '注册失败'
                });
            } else{
                res.render('register/index', {
                    title: '注册',
                    form:params
                });
            }
        }
    });

});

/* GET home page. */
router.post('/checkMobile', function(req, res, next) {
    backend.post(`/web/account/chex/${req.body.mobile}`,{},req,res,function(data){
        res.send(data.retCode!='1');
    });
});


router.get('/invite/success', function(req, res, next) {
    let session = Session.get(req,res);
    console.log('session.id:',session.id);
    let channel = req.query.channel;
    res.render('register/inviteRegisterSuccess', {
        title: '注册成功',
        appUploadUri: txH5Map[channel].appUploadUri,
    });
});

// douyin 注册成功页面
router.get('/douyin/invite/success', function(req, res, next) {
    let session = Session.get(req,res);
    console.log('session.id:',session.id);
    res.render('register/douyinInviteRegisterSuccess', {
        title: '注册成功'
    });
});

// vivo 注册成功页面
router.get('/vivo/invite/success', function(req, res, next) {
    let session = Session.get(req,res);
    console.log('session.id:',session.id);
    res.render('register/vivoInviteRegisterSuccess', {
        title: '注册成功'
    });
});

// 以下部分为合伙人注册模块代码
/**
 * 获取省份列表
 */
router.get('/area', function(req, res) {
    backend.get(server + '/partner/province', {
        type: 'province'
    }, req, res, function(data) {
        if (data && data.retCode == 0) {
            let result = {
                retCode: data.retCode
            };
            result.list = data.data.map(function(item) {
                let cityList = item.children.map(function(item) {
                    return {
                        value: item.parameterKey,
                        label: item.parameterValue
                    };
                });
                return {
                    value: item.parameterKey,
                    label: item.parameterValue,
                    children: cityList
                };
            });
            res.json(result);
        }
        else {
            res.json(data);
        }
    });
});

/* 合伙人web注册入口 */
router.get('/cooperator', function(req, res, next) {
    let mobile = req.query.mobile;
    if(mobile){
        mobile = mobile.replace(new RegExp(" ",'g'),"")
    }
    let form = {
        nextPage: encodeURIComponent(req.query.nextPage||'/'),
    };
    form.mobilePhone = mobile;
    backend.get(server+'/client_log/write',{serviceKey:'regist_page'},req,res,function(data){
        res.end();
    });
    res.render('cooperatorRegister/index', {
        title: '注册',
        form:form
    });
});

/* GET home page. */
router.post('/cooperator/checkMobile', function(req, res, next) {
    backend.post(`/partner/chex/${req.body.mobile}`,{},req,res,function(data){
        res.send(data.retCode!='1');
    });
});

router.post('/cooperator', function(req, res, next) {
    let session = CooperatorSession.get(req,res);
    let mobile = req.body.mobilePhone;
    if(mobile){
        mobile = mobile.replace(new RegExp(" ",'g'),"")
    }
    let params = {
        mobilePhone:mobile,
        code:req.body.code,
        password:req.body.logonPassword,
        contacter:req.body.companyContacts||'N/A',
        province: req.body.province,
        city: req.body.city,
        guid:session.id,
    };
    let nextPage = req.body.nextPage||'/';
    let url = '/partner/register ';
    backend.post(server + url,params,req,res,function(data){
        logger.error('注册返回',JSON.stringify(data));
        if(data && data.retCode=='0'){
            backend.post(server+'/partner/logon',{
                mobilePhone: params.mobilePhone,
                password:params.password,
            },req,res,function(data){
                //logger.error('注册登录返回',JSON.stringify(data));
                if(data && data.retCode=='0'){
                    CooperatorSession.logon(req, res, data.order);
                    res.redirect(decodeURIComponent(nextPage));
                }else{
                    params.error = data.retMsg;
                    res.render('cooperatorRegister/index', {
                        title: '注册',
                        form:params
                    });
                }
            });
        }else{
            params.error = data.retMsg;
            params.nextPage = req.body.nextPage;
            res.render('cooperatorRegister/index', {
                title: '注册',
                form:params
            });
        }
    });

});


module.exports = router;
