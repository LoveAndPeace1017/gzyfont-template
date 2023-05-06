const express = require('express');
const router = express.Router();
const backend = require('../../lib/backend');
const config = require('../../config').getConfig();
const logger = require('../../lib/logger').getLogger('default');
const sign = require('./sign.js');

/**
 *   获取微信凭证
 *  @params
 *  access_token  公众号的全局唯一接口调用凭据
 */
router.get('/getSignature', function(req, res) {
    const {wxServiceUrl, wxAppId, wxAppSecret} = config;
    let clientUrl = req.query.url;
    let url = `${wxServiceUrl}/cgi-bin/token`;
    let params = {
        appid: wxAppId,
        secret: wxAppSecret,
        grant_type: 'client_credential'
    };
    backend.get(url, params, req, res, function(data) {
        if(data.access_token){
            let params1 = {
                type: 'jsapi',
                access_token: data.access_token,
            };
            let uri = `${wxServiceUrl}/cgi-bin/ticket/getticket`;
            backend.get(uri, params1, req, res, function(data) {
                if(data.errcode===0 && data.errmsg==='ok'){
                    let result = sign(data.ticket, clientUrl);
                    result.appId = wxAppId;
                    res.json({
                        retCode: 0,
                        data: result
                    });
                } else{
                    res.json({
                        retCode: 0,
                        data: data.errmsg
                    });
                }
            });
        } else {
            res.json({
                retCode: 0,
                data: data.errmsg
            });
        }
    });
});

module.exports = router;



/*
 *something like this
*{
    *  jsapi_ticket: 'jsapi_ticket',
    *  nonceStr: '82zklqj7ycoywrk',
    *  timestamp: '1415171822',
    *  url: 'http://example.com',
    *  signature: '1316ed92e0827786cfda3ae355f33760c4f70c1f'
    *}
*/
// router.get('/getJsapi', function(req, res) {
//     const {wxServiceUrl} = config;
//     let url = `${wxServiceUrl}/cgi-bin/ticket/getticket`;
//     let params = {
//         type: 'jsapi',
//         access_token: ACCESS_TOKEN,
//     };
//     backend.get(url, params, req, res, function(data) {
//         // sign('jsapi_ticket', 'http://example.com')
//         res.json(data);
//     });
// });


// 获取 access_token
// https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
// console.log(sign('jsapi_ticket', 'http://example.com'));


//     JAVA, Node, Python 部分代码只实现了签名算法，
// 需要开发者传入 jsapi_ticket 和 url ，其中 jsapi_ticket
// 需要通过 http://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=ACCESS_TOKEN 接口获取，
//     url 为调用页面的完整 url 。
//
// PHP 部分代码包括了获取 access_token 和 jsapi_ticket 的操作，只需传入 appid 和 appsecret 即可，但要注意如果已有其他业务需要使用 access_token 的话，应修改获取 access_token 部分代码从全局缓存中获取，防止重复获取 access_token ，超过调用频率。
//
// 注意事项：
// 1. jsapi_ticket 的有效期为 7200 秒，开发者必须全局缓存 jsapi_ticket ，防止超过调用频率。