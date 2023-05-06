/**
 * @author qiumingsheng
 * 判断链接是否需要登录
 */

const Session = require('../session/index');
const CooperatorSession = require('../session/cooperator');
const TraceSession = require('../session/trace');
const Constants = require('../constants');
const MatchTools = require('../utils/matchTools');
const conf = require('../../config').getConfig();
const logger = require('../logger').getLogger();

const loginUrlReg = /^\/(login|register)/;

module.exports = {
    filter: function (req, res, next) {
        const exclude = MatchTools.matchSome(req.url, Constants.EXCLUDES_PATH);
        const session = Session.get(req, res);
        //合伙人Session
        const cooperatorSession = CooperatorSession.get(req,res);
        const cooperatorIsLogin = cooperatorSession && cooperatorSession.userIdEnc;
        //订单追踪平台Session
        const traceSession = TraceSession.get(req,res);
        const traceIsLogin = traceSession && traceSession.userIdEnc;
        const ajax = req.body.ajax;
        const isLogin = session && session.userIdEnc;
        const host =  req.headers.host;


        if(host.indexOf('hehuo.abiz.com')!==-1){
            if(cooperatorIsLogin && loginUrlReg.test(req.url)){
                res.redirect('/');
            }else{
                if (!exclude && !cooperatorIsLogin) {
                    if (ajax) {
                        const json = {
                            timeOutUrl: '/login/cooperator/?from='+encodeURIComponent(req.body.pathName)
                        };
                        res.send(JSON.stringify(json));
                    } else {
                        let fromPos = req.url.indexOf('?');
                        if(fromPos === -1){
                            res.redirect('/login/cooperator/?from=' + encodeURIComponent(req.url));
                        } else {
                            res.redirect('/login/cooperator/?from=' + encodeURIComponent(req.url.slice(0, fromPos)) + '&'+ req.url.slice(fromPos + 1));
                        }
                    }
                }else {
                    next();
                }
            }
        }else if(host.indexOf('order.abiz.com')!==-1){
            if(traceIsLogin && loginUrlReg.test(req.url)){
                res.redirect('/');
            }else{
                if (!exclude && !traceIsLogin) {
                    res.redirect('https://erp.abiz.com');
                }else {
                    next();
                }
            }
        }else if(host.indexOf(conf.domainUrl)!==-1 || host.indexOf('jxc.abiz.com')!==-1 || host.indexOf('erp.abiz.com')!==-1){
            if(isLogin && loginUrlReg.test(req.url)&&req.url.indexOf('changeAccount')===-1&&req.url.indexOf('login/qrcode')===-1&&req.url.indexOf('login/app_qrcode')===-1){
                res.redirect('/home');
            }else{
                if (!exclude && !isLogin) {
                    if (ajax) {
                        const json = {
                            timeOutUrl: '/login/?from='+encodeURIComponent(req.body.pathName)
                        };
                        res.send(JSON.stringify(json));
                    } else {
                        let fromPos = req.url.indexOf('?');
                        if(fromPos === -1){
                            res.redirect('/login/?from=' + encodeURIComponent(req.url));
                        } else {
                            res.redirect('/login/?from=' + encodeURIComponent(req.url.slice(0, fromPos)) + '&'+ req.url.slice(fromPos + 1));
                        }
                    }
                }else {
                    logger.info('isLogin:'+isLogin+'url:'+req.url+'realIp:'+req.realIp);
                    next();
                }
            }
        }

    }
};