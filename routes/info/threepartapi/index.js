const express = require('express');
const router = express.Router();
const backend = require('../../../lib/backend');

/**
 * @author wangmei
 * 供第三方调用接口，如内贸站
 */

// 代理加盟 申请加入接口（内贸站H5 代理加盟申请页面）
router.get('/agentJoin/jsonp', function(req, res) {
    backend.post(`/agent/register`, req.query, req, res, function(data) {
        res.jsonp(data);
    });
});

module.exports = router;
