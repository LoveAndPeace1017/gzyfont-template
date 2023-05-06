const extend = require('extend');
const uuid = require('uuid');

const backend = require('../backend');
const crypto = require('./crypto');
const logger = require('../logger').getLogger();

const Session = function () {

};

extend(Session, {
    logon: function (req, res, logon) {
        const COOKIE_DOMAIN = req.headers.host;
        var opts = {domain:COOKIE_DOMAIN, httpOnly: false, sameSite: false};
        var current = Session.get(req, res);
        var session = {
            id: current.id,
            comContacts:logon.comContacts||'N/A',
            comEmail:logon.comEmail,
            comInfoFullStatus:logon.comInfoFullStatus,
            comName:logon.comName||'N/A',
            comStatus:logon.comStatus,
            loginUsername:logon.loginUsername,
            memberId:logon.memberId,
            mobilePhone:logon.mobilePhone,
            userId:logon.userId,
            userIdEnc:logon.mainUserFlag?logon.mainUserIdEnc:logon.subUserIdEnc?logon.subUserIdEnc:logon.userIdEnc,
            userUserName:logon.mainUserFlag?logon.mainUserName:logon.subUserName,
            mainUserFlag:logon.mainUserFlag,
            mainUserIdEnc:logon.mainUserIdEnc,
            mainUserName:logon.mainUserName,
            subUserIdEnc:logon.subUserIdEnc,
            subUserName:logon.subUserName,
            language: logon.language||"zhCN",
            gender: logon.gender == '0' ? '女士' : '先生',
            xtoken: logon.queryToken,
            fromMain:logon.fromMain||false,
            vipValid:logon.vipValid||false,
            mallFlag:logon.mallFlag||false, // 是否开通商城
            smallProgramFlag:logon.smallProgramFlag||false, // 是否开通小程序
            appId:logon.appId||'', // 小程序id
            appSecret:logon.appSecret||'', // 小程序秘钥
            csrfToken: crypto.encrypt(logon.userIdEnc),
            dzCompanyName: logon.dzCompanyName || ''
        };
        res.cookie('session', crypto.encrypt(JSON.stringify(session)), opts);
        res.cookie('uid', session.userIdEnc, opts);
        res.cookie('comName', session.comName, opts);
        res.cookie('csrfToken', session.csrfToken, opts);
        res.cookie('mainUserName', session.mainUserName, opts);
        res.cookie('language',session.language, opts);
        res.cookie('dzCompanyName',session.dzCompanyName, opts);   // 定制系统的公司名称
    },
    /**
     * 调用远程认证服务创建会话
     *
     * @param req
     * @param res
     * @param callback
     */
    create: function (req, res, callback) {
        var session = Session.get(req, res);
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
        var opts = {domain: COOKIE_DOMAIN, expires: new Date(1), httpOnly: false, sameSite: false};
        res.cookie('session', '', opts);
        res.cookie('sid', '', opts);

    },
    /**
     * 获取会话内容
     *
     * @param req
     */
    get: function (req, res) {
        const COOKIE_DOMAIN = req.headers.host;
        logger.info(req.hasOwnProperty('cookies'), req.cookies.session, 'Cookie, Session');
        var token = req.hasOwnProperty('cookies') ? req.cookies.session : null;
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
            var opts = {domain: COOKIE_DOMAIN, httpOnly: false, sameSite: false};
            var session = {
                id: uuid.v4()
            };

            // 创建未认证的会话
            res.cookie('session', crypto.encrypt(JSON.stringify(session)), opts);
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
            var opts = {domain: COOKIE_DOMAIN, httpOnly: false, sameSite: false};
            session = extend(session, hash);
            res.cookie('session', crypto.encrypt(JSON.stringify(session)), opts);
            res.cookie('sid', crypto.encrypt(JSON.stringify(session)), opts);
        }
        return session;
    },

});
module.exports = Session;

