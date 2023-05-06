const express = require('express');
const router = express.Router();
const backend = require('../../../../../lib/backend');
const config = require('../../../../../config').getConfig();
const logger = require('../../../../../lib/logger').getLogger('default');

// 一键报价列表
router.get('/list', function (req, res) {
    const query = req.query;
    const token = req.cookies.token;
    const userId = req.cookies.userId;
    const identityInformation = 'kVhLvJs/hBjUJLtJN2GkJXvQEowS4C1b+PpAf8CNSQ7sXHdjUkF79yyNOgnXofx8GK3dLDOTG/TROuKcFi1Q+vgOASuBKlwkbXCbmYGYORv6iqSaEarycMZCysrfVzmEvWNAMjrO+jnbrKFf7OcKTzSpSANsLfgGNl8eX8YSx9c=';

    let params = {
        page: query.current?query.current:1,
        perPage: query.pageSize || 20,
    };
    params.headers = {
        identityInformation,
        'X-Token': token,
        'X-ClientType': 'ios'
    };

    backend.get(`/cgi/micproduct/${userId}/list`, params, req, res, function (data) {
        if (data && data.retCode === "0") {
            res.json(data);
        } else {
            res.json({
                retCode: '1',
                retMsg: "网络异常，请稍后重试！"
            });
        }
    });
});

router.post('/resubmit', function (req, res) {
    const userId = req.cookies.userId;
    const token = req.cookies.token;

    let params = {};
    params.headers = {
        'X-Token': token,
        'X-ClientType': 'ios'
    };

    backend.post(`/cgi/micproduct/${userId}/resubmit`, params, req, res, function (data) {
        if (data && data.retCode === "0") {
            res.json(data);
        }
    });
});


module.exports = router;
