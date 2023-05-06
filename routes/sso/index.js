const express = require('express');
const router = express.Router();
const backend = require('../../lib/backend');
const Session = require('../../lib/session');
const logger = require('../../lib/logger').getLogger('default');
// const server = 'http://192.168.16.254:2017';
const server = '';

//处理特别字符串

function htmlEscape(text) {
    return text.replace(/['"<>={}()`]/g, function (match, pos, originalText) {
        switch (match) {
            case "'":
                return "&acute;";
            case "{":
                return "&lt;";
            case "}":
                return "&gt;";
            case "(":
                return "&lt;";
            case ")":
                return "&gt;";
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case "=":
                return "&#x3D";
            case "\"":
                return "&quot;";
        }
    })
}

/**
 *  广播登录接收接口
 */
router.get('/callback/logon', function(req, res) {
    backend.get(server+`/web/sso/callback/logon`, req.query, req, res, function(data){
        if(data && data.retCode==0){
            Session.logon(req, res, data);
        }
        res.send(data);
    });
});

/**
 * 登录回调
 */
router.get('/msgres', function(req, res) {
    let {retMsg,callback,retCode,gotoUrl,nv,crossDomain} = req.query;
    //let reg = new RegExp('[alert|prompt|confirm]*\\(', 'i');
    let params = {
        callback:htmlEscape(callback),
        retCode:retCode,
        gotoUrl:gotoUrl,
        nv:nv||0,
        crossDomain:crossDomain=='1',
        success:retCode=='200'
    };
    if(retMsg){
        params.errorMsgs = retMsg.split('|');
    }
    res.render('vo/sso_callback',{
        form:params
    });

});

module.exports = router;
