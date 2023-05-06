const express = require('express');
const router = express.Router();
const backend = require('../../lib/backend');
const conf = require('../../config').getConfig();

const COMPANY_MAP = {
    yuanzheng: {
        banner: 'dz_banner_01.png',
        logo: 'dz_logo_01.png',
    }
};

/**
 * cd 登录 - 用户正式环境
 */
router.get('/:companyName/login', function(req, res, next) {
    if(req.headers.referer&&req.headers.referer.indexOf('/register')!==-1){
        backend.get(server+'/client_log/write',{serviceKey:'regist_login'},req,res,function(data){
            res.end();
        });
    }

    let companyName = req.params.companyName;
    let companyInfo = COMPANY_MAP[companyName] || {};
    let domainUrl = conf.domainUrl;

    res.render('login/dz_logon', {
        title: '登录',
        form:{
            baseNextPage:req.query.from?req.query.from.indexOf('://')==-1?'//'+domainUrl+req.query.from:req.query.from:"",
        },
        source: req.query.source,
        companyName,
        ...companyInfo
    });
});


/**
 * 普通登录 - 开发环境下必须用此方式登录
 */
router.get('/:companyName/login/inner', function(req, res, next) {
    if(req.headers.referer&&req.headers.referer.indexOf('/register')!==-1){
        backend.get(server+'/client_log/write',{serviceKey:'regist_login'},req,res,function(data){
            res.end();
        });
    }

    let companyName = req.params.companyName;
    let companyInfo = COMPANY_MAP[companyName] || {};

    let domainUrl = conf.domainUrl;
    res.render('login/dz_index', {
        title: '登录',
        form:{
            baseNextPage:req.query.from?req.query.from.indexOf('://')==-1?'//'+domainUrl+req.query.from:req.query.from:"",
        },
        source: req.query.source,
        companyName,
        ...companyInfo
    });
});


module.exports = router;