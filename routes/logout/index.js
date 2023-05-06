const express = require('express');
const router = express.Router();
const backend = require('../../lib/backend');
const Session = require('../../lib/session');
const CooperatorSession = require('../../lib/session/cooperator');
const TraceSession = require('../../lib/session/trace');
const server = '';

/* GET home page. */
router.get('/', function(req, res, next) {
    let session = Session.get(req, res);
    if(session.userIdEnc){
        let logonUserName = session.userUserName;
        backend.post(server +`/web/account/logout?logonUserName=${logonUserName}`, req, res, function (data) {
            if(data.retCode == '0'){
                Session.destroy(req,res);
                res.redirect('https://cd.abiz.com/logout?pn=jxc&goto_url=https%3A%2F%2Ferp.abiz.com%2Flogin');
            }
        });
    }else{
        res.redirect('/login');
    }
});
/* 合伙人退出 */
router.get('/cooperator', function(req, res, next) {
    let cooperatorSession = CooperatorSession.get(req, res);
    if(cooperatorSession.userIdEnc){
        CooperatorSession.destroy(req,res);
    }
    res.redirect('/login/cooperator');
});

/* 订单追踪平台退出 */
router.get('/trace', function(req, res, next) {
    let traceSession = TraceSession.get(req, res);
    let userIdEnc = traceSession.userIdEnc;
    if(traceSession.userIdEnc){
        TraceSession.destroy(req,res);
    }
    backend.post(server +`/openTrace/${userIdEnc}/logout`, req, res);
    //清除cookie
    res.cookie('traceLoginUserId','');
    res.redirect(`/login/${userIdEnc}/trace`);
});



/* GET home page. */
router.get('/inner', function(req, res, next) {
    Session.destroy(req,res);
    res.redirect('/login/inner');
});

module.exports = router;
