const express = require('express');
const router = express.Router();
const backend = require('../../../../../lib/backend');
const config = require('../../../../../config').getConfig();
const logger = require('../../../../../lib/logger').getLogger('default');

const formatTime = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return [year, month, day].map(formatNumber).join('-');
};

const formatNumber = n => {
    n = n.toString();
    return n[1] ? n : '0' + n
};

const diffTime = (first, second) => {
    first = first.getTime();
    second = second.getTime();
    return second <= first;
};

// 处理cookie信息
var backCookie = function(data) {
    let cookie = '', abizCookie =  '';
    let keys = Object.keys(data);

    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (key === 'abizCookie') {
            continue;
        }
        if (cookie) cookie += ";";
        cookie += key + '=' + data[key];
    }
    abizCookie = data['abizCookie'];
    return {cookie, abizCookie};
};

// router.post('/login', function(req, res) {
//     let params = {
//         username: 'jingongchakan03',
//         password: '123456a',
//         timeout: Date.parse(new Date())
//     };
//
//     params.headers = {
//         "Content-Type":'application/json',
//     };
//
//     backend.get(`${config.tulipBackendUrl}/analog/login`, params, req, res, function(data) {
//         console.log(typeof data.code);
//         if (data && data.code === 0) {
//             console.log(data);
//             let {cookie, abizCookie} = backCookie(data.data);
//             res.cookie('cookie',cookie);
//             res.cookie('userName',params.username);
//             res.cookie('abizCookie',abizCookie).json({
//                 retCode: '0',
//                 cookie,
//                 abizCookie
//             });
//         }
//     });
// });

router.post('/login', function(req, res) {
    let params = {
        userId: req.body.userId,
        token: req.body.token,
        client: 'app'
    };
    let userName = req.body.userName;

    if(userName && params.token && params.userId) {
        backend.post(`/web/account/ticket`, params, req, res, function(data) {
            logger.info('params', JSON.stringify(params));
            logger.info('url+/web/account/ticket:', JSON.stringify(data));
            if (data && data.retCode === '0') {
                let cookie = 'cid='+data.data+';sid='+data.data;
                res.cookie('userName',userName);
                res.cookie('userId', params.userId);
                res.cookie('token', params.token);
                res.cookie('identityInformation', 'kVhLvJs/hBjUJLtJN2GkJXvQEowS4C1b+PpAf8CNSQ7sXHdjUkF79yyNOgnXofx8GK3dLDOTG/TROuKcFi1Q+vgOASuBKlwkbXCbmYGYORv6iqSaEarycMZCysrfVzmEvWNAMjrO+jnbrKFf7OcKTzSpSANsLfgGNl8eX8YSx9c=');
                res.cookie('cookie',cookie).json({
                    retCode: '0',
                    cookie,
                });
            }
        });
    } else {
        res.json({
            retCode: '0'
        })
    }
});

//询价单列表数据
router.get('/list', function(req, res) {
    const query = req.query;
    const identityInformation = 'kVhLvJs/hBjUJLtJN2GkJXvQEowS4C1b+PpAf8CNSQ7sXHdjUkF79yyNOgnXofx8GK3dLDOTG/TROuKcFi1Q+vgOASuBKlwkbXCbmYGYORv6iqSaEarycMZCysrfVzmEvWNAMjrO+jnbrKFf7OcKTzSpSANsLfgGNl8eX8YSx9c=';

    let params = {
        word: query.word || '',
        catCode: '',
        pageNo: query.pageNumber?query.pageNumber:1,
        pageSize: query.pageSize || 50,
        purchaseOrder: query.purchaseOrder || '',  //默认2  报价截止日期 升序3 降序4
        confirmStatus: query.confirmStatus || '',  //默认0 全部  3 已核实
        applyQuotationFlag: '0',
        searchType: '1'
    };

    if(params.confirmStatus == 0){
        delete params.confirmStatus;
    }

    if(params.purchaseOrder == ''){
        delete params.purchaseOrder;
    }

    params.headers = {
        identityInformation
    };

    res.locals.tasks = {};
    let tasks = [
        {
            uri: `${config.tulipBackendUrl}/api/inquiry/list/before/login`,
            method: 'get',
            params: params,
            task: function (data) {
                res.locals.tasks.detail = data;
            }
        },
        {
            uri: `${config.tulipBackendUrl}/api/inquiry/list/count/before/login`,
            params: params,
            method: 'get',
            task: function (data) {
                res.locals.tasks.countData = data;
            }
        }
    ];

    backend.post(tasks, req, res, function() {
        let data = res.locals.tasks.detail;
        let countData = res.locals.tasks.countData;
        let total = 0;

        if(countData.code === 0) {
            total = countData.data;
        }
        if (data && data.code === 0) {
            let list = data.data;
            let i = 1;
            list && list.forEach(function (item, index) {
                item.key = index;
                item.serial = i++;
            });
            res.json({
                retCode:'0',
                list:list,
                pagination:{
                    pageNumber:params.pageNo*1,
                    pageSize:params.pageSize*1,
                    total: total*1
                }
            });
        }else{
            res.json({
                retCode:'1',
                retMsg: (data && data.message) || "网络异常，请稍后重试！"
            });
        }
    });
});

//推荐询价单列表数据&我的报价列表数据
router.get('/quotation/list', function(req, res) {
    const query = req.query;
    const cookie = req.cookies.cookie;
    const identityInformation = req.cookies.identityInformation;

    let params = {
        tag: query.tag || "1",  // 0 推荐询价 1 报价进行中 2 报价已截止
        pageNumber: query.pageNumber || 1,
        pageSize: query.pageSize || 50,
        orderByField: query.orderByField || 'quotationAddedTimeOrder',
        orderByType: query.orderByType || 'desc'
    };
    params.headers = {
        mpauth:cookie,
        identityInformation
    };

    backend.get(`${config.tulipBackendUrl}/api/quotations/quotation/list`, params, req, res, function(data) {
        logger.info('url: /api/quotations/quotation/list+', JSON.stringify(data));
        if (data && data.code === 0) {
            let {inquiryList:list, total} = data.data;
            let i = 1;
            list && list.forEach(function (item, index) {
                item.key = index;
                item.serial = i++;
                if(item.effectiveTime){
                    item.status = diffTime(new Date(item.effectiveTime), new Date()) ? '进行中' : '已截止';
                    item.effectiveTime = formatTime(new Date(item.effectiveTime));
                }
            });
            res.json({
                retCode:'0',
                list:list,
                pagination:{
                    pageNumber:params.pageNumber*1,
                    pageSize:params.pageSize*1,
                    total: total*1
                }
            });
        }else{
            res.json({
                retCode:'1',
                retMsg: (data && data.message) || "网络异常，请稍后重试！"
            });
        }
    });
});


//询价单详情页
router.get('/list/before/detail/:logonUserName/:inquiryId', function (req, res) {
    const identityInformation = 'kVhLvJs/hBjUJLtJN2GkJXvQEowS4C1b+PpAf8CNSQ7sXHdjUkF79yyNOgnXofx8GK3dLDOTG/TROuKcFi1Q+vgOASuBKlwkbXCbmYGYORv6iqSaEarycMZCysrfVzmEvWNAMjrO+jnbrKFf7OcKTzSpSANsLfgGNl8eX8YSx9c=';

    let params = {};
    params.headers = {
        identityInformation,
        mpauth: req.cookies.cookie,
    };

    backend.get(`${config.tulipBackendUrl}/api/inquiry/list/before/detail/${req.params.logonUserName}/${req.params.inquiryId}`, params, req, res, function (data) {
        if (data && data.code == 0) {
            res.json(data);
        } else {
            res.json({
                retCode: '1',
                retMsg: (data && data.message) || "网络异常，请稍后重试！"
            });
        }
    });
});

module.exports = router;
