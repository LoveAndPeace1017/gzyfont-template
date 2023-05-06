const extend = require('extend');
const uuid = require('uuid');

const backend = require('../backend');
const crypto = require('./crypto');
const logger = require('../logger').getLogger();
const Constants = require('../constants');

const CooperatorSession = function () {

};

extend(CooperatorSession, {
    logon: function (req, res, logon) {
        const COOKIE_DOMAIN = req.headers.host;
        var opts = {domain:COOKIE_DOMAIN, httpOnly: false, };
        var current = CooperatorSession.get(req, res);
        var session = {
            id: current.id,
            contacter:logon.contacter||'N/A',
            province:logon.province,
            city:logon.city,
            userIdEnc:logon.id,
            mobilePhone:logon.mobilePhone,
            addedLoginName: logon.addedLoginName,
            addedTime:logon.addedTime,
            csrfToken: crypto.encrypt(logon.id+'')
        };
        res.cookie('sessionCooperator', crypto.encrypt(JSON.stringify(session)), opts);
        res.cookie('contacter', session.contacter, opts);
        res.cookie('userIdEnc', session.userIdEnc, opts);
        res.cookie('csrfToken', session.csrfToken, opts);
    },
    /**
     * 调用远程认证服务创建会话
     *
     * @param req
     * @param res
     * @param callback
     */
    create: function (req, res, callback) {
        var session = CooperatorSession.get(req, res);
        var params = {
            openId: req.body.openId,
            logUserName: req.body.username,
            password: req.body.password,
            userIp: req.realIp,
            sessionId: session.id,
            openName: req.body.openName
        };

        var self = this;
        var type = arguments[arguments.length-1];
        if (type === 'bind') {
            //绑定
            params.type = 1;
        }

        backend.post('user.login', params, req, res, function (data) {
            var err = '';
            if (data) {
                if (data.code === 0) {
                    if (data.bindCode === 1) {
                        err = '账号已经被其他用户绑定';
                    }else if (data.bindCode === 3) {
                        err = '出现未知异常';
                    }
                    else {
                        self.logon(req, res, data.logResponse);
                    }
                }
                else {
                    err = data.message;
                    logger.info('Login failed, backend return message is: "' + data.message + '"');
                }
            }
            callback(err, data);
        });

    },
    /**
     * 销毁会话
     *
     * @param req
     * @param res
     */
    destroy: function (req, res) {
        const COOKIE_DOMAIN = req.headers.host;
        var opts = {domain: COOKIE_DOMAIN, expires: new Date(1), httpOnly: false};
        res.cookie('sessionCooperator', '', opts);
        res.cookie('sid', '', opts);
    },
    /**
     * 获取会话内容
     *
     * @param req
     */
    get: function (req, res) {
        const COOKIE_DOMAIN = req.headers.host;
        var token = req.hasOwnProperty('cookies') ? req.cookies.sessionCooperator : null;
        var ret = {};
        if (token) {
            try {
                ret = JSON.parse(crypto.decrypt(token));
            }
            catch (e) {
                this.destroy(req, res);
                logger.error('Invalid session token: ' + token + '\n' + e);
            }
        }
        else {
            var opts = {domain: COOKIE_DOMAIN, httpOnly: false};
            var session = {
                id: uuid.v4()
            };

            // 创建未认证的会话
            res.cookie('sessionCooperator', crypto.encrypt(JSON.stringify(session)), opts);
            res.cookie('sid', crypto.encrypt(session.id), opts);
            ret = session;
        }
        ret.userIdEnc = ret.userIdEnc;
        // ||"haoKyxVCUjJB";
        return ret;
    },
    set: function (req, res, hash) {
        var session = Session.get(req, res);
        if (session) {
            extend(session, hash);
        }
    },
    resave: function (req, res, hash) {
        const COOKIE_DOMAIN = req.headers.host;
        var session = Session.get(req, res);
        if (session) {
            var opts = {domain: COOKIE_DOMAIN, httpOnly: false};
            session = extend(session, hash);
            res.cookie('sessionCooperator', crypto.encrypt(JSON.stringify(session)), opts);
        }
        return session;
    },

});
module.exports = CooperatorSession;

