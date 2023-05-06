const express = require('express');
const router = express.Router();
const Constants = require('../../lib/constants');
const txH5Map = Constants.txH5Map;

function transformParams(req){
    let form = {
        userIdEnc: req.query.userIdEnc,
        comName:req.query.comName,
        inviteType:req.query.inviteType,
        source: req.query.s,
        trench: req.query.t,
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


/* h5注册 */
router.get('/', function(req, res, next) {
    let form = transformParams(req);
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
        });
    } else {
        res.render('register/inviteRegister', {
            title: '百卓云进销存/云ERP-简捷好用',
            form:form
        });
    }
});

module.exports = router;
