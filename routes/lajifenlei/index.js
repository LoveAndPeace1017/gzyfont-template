const express = require('express');
const router = express.Router();
// const backend = require('../../lib/backend');
// const Session = require('../../lib/session');

/* web注册入口 */
router.get('/', function(req, res, next) {
    res.render('lajifenlei/index',{
        title: '南京市垃圾分类权威查询-垃圾分类变废为宝',
        isJwexin: true
    });
});

module.exports = router;