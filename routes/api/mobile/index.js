const express = require('express');
const router = express.Router();
const backend = require('../../../lib/backend');
const Constants = require('../../../lib/constants');
router.get('/info', function(req, res) {
    const params = req.query;
    const mobileInfo = {
        userId: params.userid,
        clientType: params.clienttype,
        token:  params.token
    };
    //测试的接口数据
    /*const mobileInfo = {
        userId: 'oIyoUxpgznwq',
        clientType: 'ios',
        token:  '27f45c0b-ad34-47b6-ae52-61e5eb9006a9'
    };*/
    res.cookie('mobileUserId',mobileInfo.userId);
    res.cookie('mobileInfo', mobileInfo).json({
        retCode: '0',
        mobileInfo
    });
});

//在线订货列表供应商分组
router.get('/cartList/group', function(req, res) {
    const params = req.query;

    const mobileInfo = req.cookies.mobileInfo;
    params.headers = {
        "Content-Type":'application/json',
        'X-ClientType': mobileInfo.clientType,
        'X-Token': mobileInfo.token
    };

    let uri = `/cgi/purchaseonline/${mobileInfo.userId}/list/group`;

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

    const mobileInfo = req.cookies.mobileInfo;
    params.headers = {
        "Content-Type":'application/json',
        'X-ClientType': mobileInfo.clientType,
        'X-Token': mobileInfo.token
    };


    let uri = `/cgi/purchaseonline/${mobileInfo.userId}/list/`;

    backend.get(uri, params, req, res, function(data) {
        if (data && data.retCode === '0') {
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
    const mobileInfo = req.cookies.mobileInfo;
    params.headers = {
        "Content-Type":'application/json',
        'X-ClientType': mobileInfo.clientType,
        'X-Token': mobileInfo.token
    };

    let uri = `/cgi/purchaseonline/${mobileInfo.userId}/mycart/total`;

    backend.get(uri, params, req, res, function (data) {
        res.json(data);
    })
});

//在线订货详情页
router.get('/cartDetail/page', function(req, res) {
    let reqData = req.query;
    const params = {};
    const mobileInfo = req.cookies.mobileInfo;
    params.headers = {
        "Content-Type":'application/json',
        'X-ClientType': mobileInfo.clientType,
        'X-Token': mobileInfo.token
    };

    if(reqData){
        let uri = `/cgi/purchaseonline/${mobileInfo.userId}/prod/${reqData.supplierUserIdEnc}/${reqData.supplierProductCode}`;
        backend.get(uri, params, req, res, function(data) {
            res.json(data);
        });
    }
});

//购物车列表页面
router.get('/cart', function(req, res) {
    const params = {};
    const mobileInfo = req.cookies.mobileInfo;
    params.headers = {
        "Content-Type":'application/json',
        'X-ClientType': mobileInfo.clientType,
        'X-Token': mobileInfo.token
    };

    backend.get(`/cgi/purchaseonline/${mobileInfo.userId}/mycart`, params, req, res, function(data) {
        let goodsStatus = data.data;
        goodsStatus = goodsStatus && goodsStatus.map(statuses=>{
            return statuses.length===0?statuses: statuses.map(supplier=>{
                supplier.items =  supplier.items && supplier.items.length===0 ? supplier.items: supplier.items.map(item=>{
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
    const type = req.params.type;
    const params ={array: req.body} ;
    const mobileInfo = req.cookies.mobileInfo;
    params.headers = {
        "Content-Type":'application/json',
        'X-ClientType': mobileInfo.clientType,
        'X-Token': mobileInfo.token
    };

    let uri = `/cgi/purchaseonline/${mobileInfo.userId}/mycart/`;

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
    const params ={} ;
    const mobileInfo = req.cookies.mobileInfo;
    params.headers = {
        "Content-Type":'application/json',
        'X-ClientType': mobileInfo.clientType,
        'X-Token': mobileInfo.token
    };
    let uri = `/cgi/purchaseonline/${mobileInfo.userId}/mycart/cleard`;
    backend.delete(uri, params, req, res, function (data) {
        res.json(data);
    })
});

// 购物车确定页面获取初始化数据
router.post('/cartOrder/list', function (req, res) {
    const params ={array: req.body.prodList} ;
    const mobileInfo = req.cookies.mobileInfo;
    params.headers = {
        "Content-Type":'application/json',
        'X-ClientType': mobileInfo.clientType,
        'X-Token': mobileInfo.token
    };
    if(req.body.immediateFlag){
        params.immediateFlag = true;
    }
    let uri = `/cgi/purchaseonline/${mobileInfo.userId}/mycart/preorder`;
    backend.post(uri, params, req, res, function (data) {
        if(data.retCode === '0'){
            data.data.orders = data.data.orders.map(function (item) {
                // item.prodList = item.prodList.map(function (prod) {
                //     prod.thumbnailUri = `/api/file/img/download?url=${prod.thumbnailUri}`;
                //     return prod;
                // });
                return item;
            });
        }
        res.json(data);
    })
});

// 购物车确认操作
router.post('/cartOrder/submit', function (req, res) {
    const params ={array: req.body} ;
    const mobileInfo = req.cookies.mobileInfo;
    params.headers = {
        "Content-Type":'application/json',
        'X-ClientType': mobileInfo.clientType,
        'X-Token': mobileInfo.token
    };
    let cart = !!params.array.cart;
    let uri = `/cgi/purchaseonline/${mobileInfo.userId}/order?cart=${cart}`;
    backend.post(uri, params, req, res, function (data) {
        data.mobileInfo =  mobileInfo;
        res.json(data);
    })
});


//关键词搜索联想
router.get('/search/tips', function(req, res) {
    const params = {
        ...req.query,
        key: req.query.key
    };
    const mobileInfo = req.cookies.mobileInfo;
    params.headers = {
        "Content-Type":'application/json',
        'X-ClientType': mobileInfo.clientType,
        'X-Token': mobileInfo.token
    };
    let uri = `/cgi/purchaseonline/${mobileInfo.userId}/search/tips`;
    backend.get(uri, params, req, res, function(data) {
        res.json(data)
    });
});


//在线订货首页列表
router.get('/newOrderList/list', function (req, res) {
    const mobileInfo = req.cookies.mobileInfo;
    const params = {};
    params.headers = {
        "Content-Type":'application/json',
        'X-ClientType': mobileInfo.clientType,
        'X-Token': mobileInfo.token
    };
    let url = `/pc/v1/${mobileInfo.userId}/online/order/list`;
    backend.get(url,params,req, res, function (data) {
        /*if(data.data && data.data.length>0){
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
        }*/
        res.json(data);
    })
});

//在线订货公司产品列表
router.post('/newOrderList/companyList', function (req, res) {
    const mobileInfo = req.cookies.mobileInfo;
    const id = req.body.id;
    const params = {};
    params.mallUserId = id;
    params.key = encodeURIComponent(req.body.key)=='undefined'? '':encodeURIComponent(req.body.key);
    params.timeFlag = '0'; // 按添加时间降序
    params.priceFlag = '';
    params.headers = {
        "Content-Type":'application/json',
        'X-ClientType': mobileInfo.clientType,
        'X-Token': mobileInfo.token
    };
    let url = `/pc/v1/${mobileInfo.userId}/online/order/listAll`;

    backend.get(url, params, req, res, function (data) {
        /*if(data.data && data.data.length>0) {
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
        }*/
        res.json(data);
    })
});

//在线订货公司介绍页
router.get('/newOrderList/companyInformation', function (req, res) {
    const id = req.query.id;
    const mobileInfo = req.cookies.mobileInfo;
    const params = {};
    params.headers = {
        "Content-Type":'application/json',
        'X-ClientType': mobileInfo.clientType,
        'X-Token': mobileInfo.token
    };
    params.mallUserId = id;
    let url = `/pc/v1/${mobileInfo.userId}/online/order/company/introduction`;
    backend.get(url,params,req, res, function (data) {
        res.json(data);
    })
});

module.exports = router;
