var crypto = require('./crypto');
var extend = require('extend');
var logger = require('../logger').getLogger();
var uuid = require('uuid');

var COOKIE_DOMAIN = '.made-in-china.com';

var Session = function () {

};

extend(Session, {
    /**
     * 获取会话内容
     *
     * @param req
     */
    get: function (req, res) {
        var token = req.hasOwnProperty('cookies') ? req.cookies.session : null;
        var ret = {};
        if (token) {
            try {
                ret = JSON.parse(crypto.decrypt(token));

                ret.token = {
                    sid: req.cookies.sid,
                    cid: req.cookies.cid
                };
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
            res.cookie('session', crypto.encrypt(JSON.stringify(session)), opts);
            res.cookie('sid', crypto.encrypt(JSON.stringify(session)), opts);
            ret = session;
        }

        return ret;
    }

});
module.exports = Session;

