const express = require('express');
const router = express.Router();
const backend = require('../../../lib/backend');
const Session = require('../../../lib/session');
const Constants = require('../../../lib/constants');
const config = require('../../../config').getConfig();

const fieldList = [
    {
        fieldName: 'addedTime',
        label: "node.inquiry.addedTime",
        width: Constants.TABLE_COL_WIDTH.DATE
    },
    {
        fieldName: 'infoTitle',
        label: "node.inquiry.infoTitle"
    },
    {
        fieldName: 'effectiveTime',
        label: "node.inquiry.effectiveTime",
        width: Constants.TABLE_COL_WIDTH.DATE
    },
    {
        fieldName: 'quotationNum',
        label: "node.inquiry.quotationNum",
        width: Constants.TABLE_COL_WIDTH.FROM_ABIZ_QUOTATION
    },
    {
        fieldName: 'deliveryAddressName',
        label: "node.inquiry.deliveryAddressName"
    },
    {
        fieldName: 'userName',
        label: "node.inquiry.userName",
        width: Constants.TABLE_COL_WIDTH.PERSON
    }
];

/* 询价列表. */
router.get('/list', function (req, res, next) {
    const params = req.query;
    //params.page = params.page ? params.page : 1;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/inquiries/proxy/list`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            data = data.data || data;
            console.log(data);
            let list = data.list;
            let i = 1;
            list.forEach(function (item) {
                item.key = item.inquiryId;
                item.serial = i++;
            });
            res.json({
                retCode: 0,
                list: list,
                filterConfigList: [],
                tableConfigList: fieldList,
            });
        } else {
            res.json({
                retCode: 1,
                retMsg: data.retMsg || "网络异常，请稍后重试！"
            });
        }

    });
});
/* 报价列表. */
router.post('/quoteList', function (req, res, next) {
    const params = req.body;
    //params.page = params.page ? params.page : 1;
    // params.headers = {
    //     "Content-Type": 'application/json'
    // };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/quotations/proxy/list`, params, req, res, function (data) {
        if (data/* && data.retCode == 0*/) {
            data = data.data || data;
            console.log(data);
            let list = data.list;
            let i = 1;
            list.forEach(function (item) {
                item.key = item.quotationId;
                item.serial = i++;
            });
            res.json({
                retCode: 0,
                list: list
                // filterConfigList: [],
                // tableConfigList: [],
            });
        } else {
            res.json({
                retCode: 1,
                retMsg: data.retMsg || "网络异常，请稍后重试！"
            });
        }

    });
});

/**
 *  对比报价单
 */
router.post('/compare', function (req, res, next) {
    const params = {
        vo1: req.body.ids
    };
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/quotations/proxy/compare/${req.body.inquiryId}`, params, req, res, function (data) {
        console.log('compare:', data);
        res.json(data);
    });
});


router.get('/detail/:code', function (req, res, next) {
    const session = Session.get(req, res);

    res.locals.tasks = {};
    let tasks = [
        {
            uri: config.cnMobileBackendUrl + `/catalog/loadAll`,
            method: 'get',
            params: {},
            task: function (data) {
                res.locals.tasks.pre = data;
            }
        },
        {
            uri: `/pc/v1/${session.userIdEnc}/inquiries/proxy/${req.params.code}/`,
            params: {},
            method: 'get',
            task: function (data) {
                res.locals.tasks.detail = data;
            }
        }
    ];

    backend.post(tasks, req, res, function () {
        let data = res.locals.tasks.detail;
        let cateList = [];
        let pre = res.locals.tasks.pre;
        if (pre && pre.code == 0) {
            cateList = pre.children;
        }

        function findCateName(cateCode, cateList, prevPath) {
            for (let catItem of cateList) {
                if (cateCode == catItem.catCode) {
                    return prevPath ? (prevPath + '>' + catItem.catNameCn) : catItem.catNameCn
                } else if (catItem.children) {
                    const ret = findCateName(cateCode, catItem.children, prevPath ? (prevPath + '>' + catItem.catNameCn) : catItem.catNameCn);
                    if (ret) {
                        return ret;
                    }
                }
            }
            return undefined;
        }

        if (data && data.retCode == 0) {
            console.log(data);
            data = data.data
            // console.log(data);
            let list = data.products;
            let i = 1;
            list.forEach(function (item) {
                item.key = item.prodId;
                item.serial = i++;
                item.cateName = cateList && findCateName(item.catCode, cateList, "");
            });

            res.json(data);
        } else {
            res.json({
                retCode: 1,
                retMsg: "网络异常，请稍后重试！"
            });
        }
    });
});

/*删除*/
router.post('/delete', function (req, res, next) {
    const params = {
        vo1: req.body.ids
    };
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.delete(`/pc/v1/${session.userIdEnc}/inquiries/proxy`, params, req, res, function (data) {
        res.json(data);
    });
});

router.post('/insert', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/inquiries/proxy`, params, req, res, function (data) {
        res.json(data);
    });
});

/* 进入新增后需要加载的一些信息*/
router.get('/pre/create', function (req, res, next) {
    const params = req.query;
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/inquiries/pre/create`, params, req, res, function (data) {
        res.json(data);
    });
});

/* 根据物品名称获取百卓匹配目录*/
/*router.get('/catalog/demands', function(req, res, next) {
    const params = {
        ...req.query,
        keyword: encodeURIComponent(req.query.keyword)
    };
    backend.get(`http://www.abiz.com/catalog/demands/miccn.json`, params, req, res, function(data) {
        res.json(data);
    });
});*/


module.exports = router;
