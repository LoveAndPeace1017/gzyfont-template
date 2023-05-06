const express = require('express');
const router = express.Router();
const backend = require('../../../lib/backend');
const Session = require('../../../lib/session');
const Constants = require('../../../lib/constants');

//在线订货列表供应商分组
router.get('/cartList/group', function(req, res) {
    const params = req.query;
    const session = Session.get(req,res);

    params.headers = {
        "Content-Type":'application/json'
    };

    let uri = `/cgi/purchaseonline/${session.userIdEnc}/list/group`;

    backend.get(uri, params, req, res, function(data) {
        if (data && data.retCode === '0') {
            let allItem =  {
                groupCode: '',
                groupCount: 0,
                groupName: '全部商品'
            };
            data.data.forEach(function (item) {
                allItem.groupCount +=  item.groupCount
            });
            data.data.unshift(allItem);
            res.json({
                retCode:'0',
                data: data.data,
                totalCount:  allItem.groupCount
            });
        }else{
            res.json({
                retCode:'1',
                retMsg:"网络异常，请稍后重试！"
            });
        }

    });
});

//在线订货列表页面
router.get('/cartList/list', function(req, res) {
    const params = req.query;
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page?params.page:1;

    const session = Session.get(req,res);


    params.headers = {
        "Content-Type":'application/json'
    };

    let uri = `/cgi/purchaseonline/${session.userIdEnc}/list/`;

    backend.get(uri, params, req, res, function(data) {
        if (data && data.retCode === '0') {
            let list = data.data;
            let i = 1;
            list && list.forEach(function (item, index) {
                item.key = index;
                item.serial = i++;
                if(item.thumbnailUri && item.thumbnailUri.indexOf('image.cn.made-in-china.com') === -1){
                    // item.thumbnailUri = item.thumbnailUri + '?userId='+ session.userIdEnc + '&token=' + session.xtoken;
                    item.thumbnailUri = `/api/file/img/download?url=${item.thumbnailUri}`
                }
            });
            res.json({
                retCode:'0',
                list:list,
                pagination:{
                    current:params.page*1,
                    pageSize:params.perPage*1
                }
            });
        }else{
            res.json({
                retCode:'1',
                retMsg:"网络异常，请稍后重试！"
            });
        }
    });
});

// 查看购物车数量
router.get('/cart/total', function(req, res) {
    const params = {};
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    let uri = `/cgi/purchaseonline/${session.userIdEnc}/mycart/total`;

    backend.get(uri, params, req, res, function (data) {
        res.json(data);
    })
});

//在线订货详情页
router.get('/cartDetail/page', function(req, res) {
    let reqData = req.query;
    const params = {};
    params.headers = {
        "Content-Type":'application/json'
    };

    const session = Session.get(req,res);

    if(reqData){
        let uri = `/cgi/purchaseonline/${session.userIdEnc}/prod/${reqData.supplierUserIdEnc}/${reqData.supplierProductCode}`;
        backend.get(uri, params, req, res, function(data) {
            let images = data && data.data.images;
            images = images.map(image=>{
                if(image.thumbnailUri && image.thumbnailUri.indexOf('image.cn.made-in-china.com') === -1){
                    // image.thumbnailUri = image.thumbnailUri + '?userId='+ session.userIdEnc + '&token=' + session.xtoken;
                    image.thumbnailUri = `/api/file/img/download?url=${image.thumbnailUri}`
                }
                if(image.uri && image.uri.indexOf('image.cn.made-in-china.com') === -1){
                    // image.uri = image.uri + '?userId='+ session.userIdEnc + '&token=' + session.xtoken;
                    image.uri = `/api/file/img/download?url=${image.uri}`
                }
                return image;
            });
            data.data.images = images;
            res.json(data);
        });
    }
});

//购物车列表页面
router.get('/cart', function(req, res) {
    const params = {};
    const session = Session.get(req,res);

    params.headers = {
        "Content-Type":'application/json'
    };

    backend.get(`/cgi/purchaseonline/${session.userIdEnc}/mycart`, params, req, res, function(data) {
        let goodsStatus = data.data;
        goodsStatus = goodsStatus && goodsStatus.map(statuses=>{
            return statuses.length===0?statuses: statuses.map(supplier=>{
                supplier.items =  supplier.items && supplier.items.length===0 ? supplier.items: supplier.items.map(item=>{
                    if(item.thumbnailUri && item.thumbnailUri.indexOf('image.cn.made-in-china.com') === -1){
                        // item.thumbnailUri = item.thumbnailUri + '?userId='+ session.userIdEnc + '&token=' + session.xtoken;
                        item.thumbnailUri = `/api/file/img/download?url=${item.thumbnailUri}`
                    }
                    return item;
                });
                return supplier
            })
        });
        data.data = goodsStatus;
        res.json(data)
    });
});

//删除购物车商品操作
router.post('/cart/oprate/:type', function(req, res) {
    const session = Session.get(req,res);
    const type = req.params.type;
    const params ={array: req.body} ;
    params.headers = {
        "Content-Type":'application/json'
    };

    let uri = `/cgi/purchaseonline/${session.userIdEnc}/mycart/`;

    type === 'del' && backend.delete(uri, params, req, res, function(data) {
        res.json(data);
    });
    type === 'edit' && backend.put(uri, params, req, res, function(data) {
        res.json(data);
    });
    type === 'add' && backend.post(uri, params, req, res, function(data) {
        res.json(data);
    })
});

//清空失效商品
router.post('/cart/clear', function (req, res) {
    const session = Session.get(req,res);
    const params ={} ;
    params.headers = {
        "Content-Type":'application/json'
    };
    let uri = `/cgi/purchaseonline/${session.userIdEnc}/mycart/cleard`;
    backend.delete(uri, params, req, res, function (data) {
        res.json(data);
    })
});

// 购物车确定页面获取初始化数据
router.post('/cartOrder/list', function (req, res) {
    const session = Session.get(req,res);
    const params ={array: req.body} ;
    params.headers = {
        "Content-Type":'application/json'
    };
    let uri = `/cgi/purchaseonline/${session.userIdEnc}/mycart/preorder`;
    backend.post(uri, params, req, res, function (data) {
        if(data.retCode === '0'){
            data.data.orders = data.data.orders.map(function (item) {
                item.prodList = item.prodList.map(function (prod) {
                    if (prod.thumbnailUri && prod.thumbnailUri.indexOf('image.cn.made-in-china.com') === -1){
                        prod.thumbnailUri = `/api/file/img/download?url=${prod.thumbnailUri}`;
                    }
                    return prod;
                });
                return item;
            });
        }
        res.json(data);
    })
});

// 购物车确认操作
router.post('/cartOrder/submit', function (req, res) {
    const session = Session.get(req,res);
    const params ={array: req.body} ;
    params.headers = {
        "Content-Type":'application/json'
    };
    let cart = !!params.array.cart;
    let uri = `/cgi/purchaseonline/${session.userIdEnc}/order?cart=${cart}`;
    backend.post(uri, params, req, res, function (data) {
        res.json(data);
    })
});

//关键词搜索联想
router.get('/search/tips', function(req, res) {
    const params = {
        ...req.query,
        key: encodeURIComponent(req.query.key)
    };
    const session = Session.get(req,res);
    let uri = `/cgi/purchaseonline/${session.userIdEnc}/search/tips`;
    backend.get(uri, params, req, res, function(data) {
        res.json(data)
    });
});

//订货商城列表
router.post('/onlineOrderHome/list', function (req, res) {
    const session = Session.get(req,res);
    const params ={};
    params.headers = {
        "Content-Type":'application/json'
    };
    let url = `/pc/v1/${session.userIdEnc}/online/order/list`;
    backend.get(url,req, res, function (data) {
        if(data.data && data.data.length>0){
            for(let i=0;i<data.data.length;i++){
                if(data.data[i].dataList && data.data[i].dataList.length>0){
                    for(let j=0;j<data.data[i].dataList.length;j++){
                        let images = data.data[i].dataList[j] && data.data[i].dataList[j].images;
                        if(images){
                            images = images.map(image=>{
                                if(image.thumbnailUri && image.thumbnailUri.indexOf('image.cn.made-in-china.com') === -1){
                                    // image.thumbnailUri = image.thumbnailUri + '?userId='+ session.userIdEnc + '&token=' + session.xtoken;
                                    image.thumbnailUri = `/api/file/img/download?url=${image.thumbnailUri}`
                                }
                                if(image.uri && image.uri.indexOf('image.cn.made-in-china.com') === -1){
                                    // image.uri = image.uri + '?userId='+ session.userIdEnc + '&token=' + session.xtoken;
                                    image.uri = `/api/file/img/download?url=${image.uri}`
                                }
                                return image;
                            });
                            data.data[i].dataList[j].images = images;
                        }
                    }
                }
            }
        }
        res.json(data);
    })
});
//订货商城首页
router.post('/onlineOrderHome/index', function (req, res) {
    const session = Session.get(req,res);
    const id = req.body.id;
    const params ={
        mallUserId: id?id:session.mainUserIdEnc
    };
    params.headers = {
        "Content-Type":'application/json'
    };
    let url = `/pc/v1/${session.userIdEnc}/online/order/listHome`;
    console.log(url);
    backend.get(url,params,req,res,function (data) {
        if(data.data && data.data.length>0) {
            for (let i = 0; i < data.data.length; i++) {
                let images = data.data[i]&& data.data[i].images;
                if(images){
                    images = images.map(image=>{
                        if(image.thumbnailUri && image.thumbnailUri.indexOf('image.cn.made-in-china.com') === -1){
                            // image.thumbnailUri = image.thumbnailUri + '?userId='+ session.userIdEnc + '&token=' + session.xtoken;
                            image.thumbnailUri = `/api/file/img/download?url=${image.thumbnailUri}`
                        }
                        if(image.uri && image.uri.indexOf('image.cn.made-in-china.com') === -1){
                            // image.uri = image.uri + '?userId='+ session.userIdEnc + '&token=' + session.xtoken;
                            image.uri = `/api/file/img/download?url=${image.uri}`
                        }
                        return image;
                    });
                    data.data[i].images = images;
                }
            }
        }
        res.json(data);
    })
});
//订货商城所有商品
router.post('/onlineOrderHome/prodAll', function (req, res) {
    const session = Session.get(req,res);
    const id = req.body.id;
    //处理排序方式
    let timeFlag = (req.body.orderByTime==-1)?'':req.body.orderByTime;
    let priceFlag = (req.body.orderByPrice==-1)?'':req.body.orderByPrice;
    const params ={
        mallUserId: id?id:session.mainUserIdEnc,
        timeFlag:timeFlag,
        priceFlag:priceFlag,
        key:encodeURIComponent(req.body.key)
    };
    params.headers = {
        "Content-Type":'application/json'
    };
    let url = `/pc/v1/${session.userIdEnc}/online/order/listAll`;
    backend.get(url, params, req, res, function (data) {
        if(data.data && data.data.length>0) {
            for (let i = 0; i < data.data.length; i++) {
                let images = data.data[i]&& data.data[i].images;
                if(images){
                    images = images.map(image=>{
                        if(image.thumbnailUri && image.thumbnailUri.indexOf('image.cn.made-in-china.com') === -1){
                            // image.thumbnailUri = image.thumbnailUri + '?userId='+ session.userIdEnc + '&token=' + session.xtoken;
                            image.thumbnailUri = `/api/file/img/download?url=${image.thumbnailUri}`
                        }
                        if(image.uri && image.uri.indexOf('image.cn.made-in-china.com') === -1){
                            // image.uri = image.uri + '?userId='+ session.userIdEnc + '&token=' + session.xtoken;
                            image.uri = `/api/file/img/download?url=${image.uri}`
                        }
                        return image;
                    });
                    data.data[i].images = images;
                }
            }
        }
        res.json(data);
    })
});
//订货商城公司介绍
router.post('/onlineOrderHome/companyIntroduce', function (req, res) {
    const session = Session.get(req,res);
    const id = req.body.id;
    const params ={
        mallUserId: id?id:session.mainUserIdEnc
    };
    params.headers = {
        "Content-Type":'application/json'
    };
    let url = `/pc/v1/${session.userIdEnc}/online/order/company/introduction`;
    backend.get(url,params,req, res, function (data) {
        res.json(data);
    })
});

module.exports = router;
