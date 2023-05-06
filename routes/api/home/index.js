const express = require('express');
const router = express.Router();
const backend = require('../../../lib/backend');
const Session = require('../../../lib/session');


//销售订单动态
router.get('/saleRecord', function(req, res) {
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/home/saleRecord`, req.query, req, res, function(data) {
        res.json(data)
    });
});

//采购订单动态
router.get('/purchaseRecord', function(req, res) {
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/home/purchaseRecord`, req.query, req, res, function(data) {
        res.json(data)
    });
});

//订单动态置为已读
router.get('/record/read/:recId', function(req, res) {
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/home/record/read/${req.params.recId}`, req.query, req, res, function(data) {
        res.json(data)
    });
});


//邀请加好友
router.get('/findFriend/order', function(req, res) {
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/home/findFriend/order`, req.query, req, res, function(data) {
        res.json(data)
    });
});

//通知公告
router.get('/ads/2', function(req, res) {
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/home/ads/2`, req.query, req, res, function(data) {
        res.json(data)
    });
});

//销售收入统计
router.get('/sales/revenue/:timeType', function(req, res) {
    const timeType = req.params.timeType;
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/home/sale/revenue/` + timeType, req.query, req, res, function(data) {
        res.json(data)
    });
});
// 供外部应用调用
router.get('/sales/revenue/:timeType/jsonp', function(req, res) {
    const timeType = req.params.timeType;
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/home/sale/revenue/` + timeType, req.query, req, res, function(data) {
        res.jsonp(data)
    });
});

//采购支出统计
router.get('/purchases/pay/:timeType', function(req, res) {
    const timeType = req.params.timeType;
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/home/purchase/revenue/` + timeType, req.query, req, res, function(data) {
        res.json(data)
    });
});
//采购支出统计
router.get('/purchases/pay/:timeType/jsonp', function(req, res) {
    const timeType = req.params.timeType;
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/home/purchase/revenue/` + timeType, req.query, req, res, function(data) {
        res.jsonp(data)
    });
});

//物品数量
router.get('/prodCount', function(req, res) {
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/home/prodCount`, req.query, req, res, function(data) {
        res.json(data)
    });
});

//分销物品数量
router.get('/distribution/prodCount', function(req, res) {
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/home/distribution/prodCount`, req.query, req, res, function(data) {
        res.json(data)
    });
});

//获取待审批单据
const billMap = [
    {
        name: 'purchase_order',
        label: 'node.home.purchase_order',
        link: '/purchase/',
        approveStatus: "3",
        title: 'purchase'
    },
    {
        name: 'sale_order',
        label: 'node.home.sale_order',
        link: '/sale/',
        approveStatus: "3",
        title: 'sale'
    },
    {
        name: 'enter',
        label: 'node.home.enter',
        link: '/inventory/inbound/',
        approveStatus: "3",
        title: 'inbound'
    },
    {
        name: 'out',
        label: 'node.home.out',
        link: '/inventory/outbound/',
        approveStatus: "3",
        title: 'outbound'
    },
    //*********
    {
        name: 'purchase_invoice',
        label: 'node.home.purchaseInvoice',
        link: '/finance/invoice/',
        approveStatus: "3",
        title: 'invoice'
    },
    {
        name: 'purchase_payment',
        label: 'node.home.expend',
        link: '/finance/expend/',
        approveStatus: "3",
        title: 'expend'
    },
    {
        name: 'sale_payment',
        label: 'node.home.income',
        link: '/finance/income/',
        approveStatus: "3",
        title: 'income'
    },
    {
        name: 'sale_invoice',
        label: 'node.home.saleInvoice',
        link: '/finance/saleInvoice/',
        approveStatus: "3",
        title: 'saleInvoice'
    },
    {
        name: 'requisition',
        label: 'node.home.requisition',
        link: '/purchase/requisitionOrder/',
        approveStatus: "3",
        title: 'requisition'
    }
];
router.get('/approval', function(req, res) {
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/home/pending_approval_pc`, req.query, req, res, function(data) {
        if(data && data.retCode === '0'){
            console.log(billMap, 'billData');
            let billData = billMap.filter(item=>{
                item.count = data[item.name];
                return item.count !== undefined;
            });
            res.json({
                retCode: data.retCode,
                data: billData
            })
        }else{
            res.json(data)
        }
    });
});
//获得销售简报数据
router.get('/saleKit', function(req, res) {
    const session = Session.get(req,res);
    let params = {};
    params.headers = {
        "Content-Type":'application/json'
    };
    backend.get(`/pc/v1/${session.userIdEnc}/customers/customer/home`, Object.assign(params,req.query), req, res, function(data) {
        res.json(data)
    });
});

//获取客户vip的服务日期期限
router.get('/vipDate', function(req, res) {
    const session = Session.get(req,res);
    let params = {};
    params.headers = {
        "Content-Type":'application/json'
    };
    backend.get(`/cgi/vip/${session.userIdEnc}/basic`, params, req, res, function(data) {
        res.json(data)
    });
});


// 获取订单交付提醒列表数据
router.get('/tip/list', function(req, res) {
    const session = Session.get(req,res);
    const urlMap = {
        order: `/pc/v1/${session.userIdEnc}/home/remind`,  // 订单交付提醒
        workSheet: `/pc/v1/${session.userIdEnc}/home/remind/worksheet`,  // 工序提醒
        workProcess: `/pc/v1/${session.userIdEnc}/home/remind/workprocess`,  // 工序提醒
        backlog: `/pc/v1/${session.userIdEnc}/home/remind/todo`,  // 待办事项
        product: `/pc/v1/${session.userIdEnc}/home/remind/produce`, //生产交付

    };
    let type = req.query.type || 'order';
    let params = {};
    params.headers = {
        "Content-Type":'application/json'
    };
    backend.get(`${urlMap[type]}`, params, req, res, function(data) {
        res.json(data)
    });
});

// 忽略操作
router.post('/tip/ignore', function (req, res, next) {
    let params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req,res);
    const urlMap = {
        order: `/pc/v1/${session.userIdEnc}/home/remind/ignore`,  // 订单交付提醒
        workSheet: `/pc/v1/${session.userIdEnc}/home/remind/ignore/worksheet`,  // 工序提醒
        workProcess: `/pc/v1/${session.userIdEnc}/home/remind/ignore/workprocess`,  // 工序提醒
        backlog: `/pc/v1/${session.userIdEnc}/home/remind/ignore/todo`,  // 待办事项
        product: `/pc/v1/${session.userIdEnc}/home/remind/produce/ignore`, //生产交付
    };
    let type = params.type || 'order';
    delete params.type;
    backend.post(`${urlMap[type]}`, params, req, res, function (data) {
        res.json(data);
    });
});

module.exports = router;
