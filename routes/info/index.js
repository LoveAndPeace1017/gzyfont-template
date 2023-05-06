const express = require('express');
const router = express.Router();
const Session = require('../../lib/session');
const textMap = {
    '0':{
        title:'供应商',
        text:'客户'
    },
    '1':{
        title:'客户',
        text:'供应商'
    },
};
/* invite page */
router.get('/inviteSpecial', function(req, res, next) {
    const type = req.query.type;
    const comName = req.query.comName;
    const url = `https://erp.abiz.com/register/invite?userIdEnc=${req.query.userIdEnc}&comName=${encodeURIComponent(comName)}&type=${type}`;

    res.render('info/invite', {
        title: '注册百卓优采',
        url:url,
        type:type,
        identity:textMap[type],
        comName:decodeURIComponent(comName)
    });
});

module.exports = router;
