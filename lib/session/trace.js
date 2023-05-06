const extend = require('extend');
const uuid = require('uuid');

const backend = require('../backend');
const crypto = require('./crypto');
const logger = require('../logger').getLogger();
const Constants = require('../constants');

const TraceSession = function () {

};

extend(TraceSession, {
    logon: function (req, res, logon) {
        const COOKIE_DOMAIN = req.headers.host;
        var opts = {domain:COOKIE_DOMAIN, httpOnly: false, };
        var current = TraceSession.get(req, res);
        var session = {
            id: current.id,
            companyName:logon.companyName||'N/A',
            userIdEnc:logon.id,
            xtoken: logon.token,
            csrfToken: crypto.encrypt(logon.id+'')
        };
        res.cookie('sessionTrace', crypto.encrypt(JSON.stringify(session)), opts);
        res.cookie('companyName', session.companyName, opts);
        res.cookie('userIdEnc', session.userIdEnc, opts);
        res.cookie('csrfToken', session.csrfToken, opts);
        res.cookie('traceLoginUserId', session.userIdEnc, opts);
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
        res.cookie('sessionTrace', '', opts);
        res.cookie('sid', '', opts);
    },
    /**
     * 获取会话内容
     *
     * @param req
     */
    get: function (req, res) {
        const COOKIE_DOMAIN = req.headers.host;
        var token = req.hasOwnProperty('cookies') ? req.cookies.sessionTrace : null;
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
            res.cookie('sessionTrace', crypto.encrypt(JSON.stringify(session)), opts);
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
            res.cookie('sessionTrace', crypto.encrypt(JSON.stringify(session)), opts);
        }
        return session;
    },

});
module.exports = TraceSession;

