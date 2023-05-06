const express = require('express');
const router = express.Router();
const Constants = require('../../lib/constants');
const erpAds = Constants.erpAds;

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
        nextPage: encodeURIComponent(req.query.nextPage||'/'),
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


router.get('/', function(req, res) {
    let form = transformParams(req);
    let registerUri = 'https://erp.abiz.com/register';
    if(form.source) registerUri = `${registerUri}?source=${form.source}`;
    res.render('ads/erpAds_045',{
        title: '生产管理系统_工单管理_百卓轻云ERP软件_无需部署即买即用_全业务流程数字化管理与协同',
        keywords: '生产管理软件，生产工序管理、ERP软件，MES系统，wms，进销存软件，采购管理软件，仓库管理软件，销售管理软件，crm软件，生产看板，工单管理软件',
        description: '百卓轻云ERP专注工贸企业数字化管理与协同，打造进销存+生产管理一体化的ERP管理软件，生产进度看板、委外加工、BOM等功能助力企业优化生产管理模式，提升生产效益。',
        registerUri
    });
});

module.exports = router;
