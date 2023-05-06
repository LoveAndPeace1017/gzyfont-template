/**
 * @author guozhaodong
 * 判断链接是否通过csrfToken校验
 */

const Session = require('../session/index');
const CooperatorSession = require('../session/cooperator');
const Constants = require('../constants');
const MatchTools = require('../utils/matchTools');

module.exports = {
    filter: function (req, res, next) {
        const exclude = MatchTools.matchSome(req.url, Constants.EXCLUDES_PATH);
        const host =  req.headers.host;
        const jumpFilter = (host.indexOf('hehuo.abiz.com')!==-1) || (host.indexOf('order.abiz.com')!==-1);
        const session =  Session.get(req, res);
        const xCsrfToken = req.header('x-csrf-token') || req.body['x-csrf-token'] || req.query['x-csrf-token'];

        if(!exclude && req.method !== 'GET' && !(xCsrfToken && decodeURIComponent(xCsrfToken) === session.csrfToken) && !(jumpFilter)){
            res.send({
                retCode: '-1',
                retMsg: '非法操作！'
            });
        }else{
            next();
        }

    }
};