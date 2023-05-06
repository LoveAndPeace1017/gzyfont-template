const extend = require('extend');

const Session = require('../session/index');
const PIDFactory = require('../utils/PIDFactory');

const conf = require('../../config').getConfig();

module.exports = {
    filter: function (req, res, next) {
        if (!res.locals) {
            res.locals = {};
        }
        // 获取真实IP
        req.realIp = (function () {
            var forwarded = req.header('x-forwarded-for');
            var ip = '';

            if (forwarded) {
                ip = forwarded.split(',')[0];
            }
            else {
                ip = req.connection.remoteAddress;
            }
            return ip;
        })();

        PIDFactory.createPID(req,res);

        res.put = function (attributes) {
            extend(res.locals, attributes);
        };

        res.put({
            query: req.query,
            app: {
                staticPath: conf.devMode ? conf.cdn : '',
                domainUrl: conf.domainUrl,
                version: conf.version,
                copyright: {
                    year: new Date().getFullYear()
                },
                devMode: conf.devMode
            },
            session: Session.get(req, res)
        });
       next();
    }
};