const express = require('express');
const router = express.Router();
const backend = require('../../../lib/backend');
const Session = require('../../../lib/session');
const Constants = require('../../../lib/constants');
// const server = 'http://192.168.16.254:9047';
const server = '';

/* GET home page. */
router.get('/list', function(req, res, next) {
    let session = Session.get(req,res);
    const data = req.query;
    let params = {};
    let uri = `/pc/v1/${session.userIdEnc}/prod-combinations`;
    if(data.key){
        params.key = encodeURIComponent(data.key);
    }
    if(data.rowMaterial){
        params.rowMaterial = encodeURIComponent(data.rowMaterial);
    }
    params.customerNo = data.customerNo;
    params.isSellOutBound = data.isSellOutBound; //该字段用来是否取得价格为销售价还是采购价，true 如出库的销售出库
    params.perPage = data.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = data.page || 1;
    //    nEoAUdKFbkYs ${session.userIdEnc}
    backend.get(uri,params,req,res,function(data){
        console.log(data);
        if(data && data.retCode==='0'){
            let list = data.list;
            let i = 1;
            list.forEach(function(item){
                item.key = item.prodNo+item.bomCode||item.bomCode;
                item.serial = i++;
                item.customerNo = params.customerNo ? params.customerNo : '';
                item.isSellOutBound = params.isSellOutBound;
            });
            res.json({
                retCode:0,
                list:list,
                vipInfo:data.vipInfo,
                pagination:{
                    total:data.total,
                    current:params.page*1,
                    pageSize:params.perPage*1
                }
            });
        }else{
            res.json({
                retCode:1,
                retMsg:"网络异常，请稍后重试！"
            });
        }

    });
});

/* 新增配件组合 */
router.post('/insert', function(req, res) {
    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.post(server+`/pc/v1/${session.userIdEnc}/prod-combinations`,params,req,res,function(data){
        res.json(data);
    });
});
/* 修改配件组合 */
router.put('/modify', function(req, res) {
    const params = req.body;
    let prodId = req.body.mainProdNo || req.body.prodNo;
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.put(server+`/pc/v1/${session.userIdEnc}/prod-combinations/${prodId}/`,params,req,res,function(data){
        res.json(data);
    });
});


/*删除配件组合*/
router.delete('/delete/:prodNo', function(req, res) {
    const params = {};
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.delete(server+`/pc/v1/${session.userIdEnc}/prod-combinations/${req.params.prodNo}`,{},req,res,function(data){
        res.json(data);
    });
});
/*查看配件组合*/
router.get('/detail/:prodNo', function(req, res) {
    const params = {};
    if(req.query.customerNo){
        params.customerNo = req.query.customerNo;
    }
    //只有弹出销售弹层时值为true
    if(req.query.isSellOutBound){
        params.isSellOutBound = req.query.isSellOutBound;
    }

    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.get(server+`/pc/v1/${session.userIdEnc}/prod-combinations/${req.params.prodNo}`,params,req,res,function(data){
        res.json(data);
    });
});

//缺料查询  该接口和配件组合查询类似，后端逻辑分不开，暂时拆分
router.post('/lackMaterial/list', function(req, res) {
    const session = Session.get(req,res);

    const params = {
        array: [],
        headers: {"Content-Type":'application/json'}
    };

    let warehouseName = req.body.warehouseName || '全部仓库';

    if(req.body.prodList){
        params.array = req.body.prodList.map(function (item) {
            return {
                prodNo: item.prodNo,
                mainCount: item.num
            };
        })
    }

    backend.post(server+`/pc/v1/${session.userIdEnc}/prod-combinations/searchComponent?warehouseName=${encodeURIComponent(warehouseName)}`,params, req,res,function(data){
        if(data && data.retCode==='0'){
            let list = data.data;
            let i = 1;
            list.forEach(function(item){
                item.key = item.prodNo;
                item.serial = i++;
                item.currentQuantity = item.currentQuantity || 0;
                item.componentQuantity = item.currentQuantity >  item.needQuantity ? 0 : Math.abs(item.currentQuantity - item.needQuantity);
            });
            res.json({
                retCode:0,
                list:list
            });
        }else{
            res.json({
                retCode:1,
                retMsg:"网络异常，请稍后重试！"
            });
        }
    });
});

//配件组合查询
router.post('/prodCombinations/list', function (req, res) {
    const session = Session.get(req,res);

    const params = {
        array: req.body.prodList || [],
        headers: {"Content-Type":'application/json'}
    };

    let customerNo,isSellOutBound;
    let prodList = req.body.prodList;

    if(prodList){
        customerNo = prodList[0].customerNo || '';
        isSellOutBound = prodList[0].isSellOutBound || false;
        params.array = prodList.map(function (item) {
            return {
                prodNo: item.prodNo,
                mainCount: item.num,
                bomCode: item.bomCode,
            };
        })
    }

    backend.post(server+`/pc/v1/${session.userIdEnc}/prod-combinations/multiple?customerNo=${customerNo}&isSellOutBound=${isSellOutBound}`,params, req,res,function(data){
        res.json(data);
    });
});

// 判断是否属于成品
router.post('/prodCombinations/pre', function (req, res) {
    const session = Session.get(req,res);

    const params = {
        array: req.body.prodList || [],
        headers: {"Content-Type":'application/json'}
    };

    backend.post(server+`/pc/v1/${session.userIdEnc}/prod-combinations/pre/searchComponent`,params, req,res,function(data){
        if(data && data.retCode == 0){
            let backData = data.data.map(item => {
                item.num = item.mainCount;
                item.key = item.prodNo;
                delete item.mainCount;
                return item;
            });
            res.json(backData);
        } else if (data.retCode == 2019) {  // 增值包到期
            res.json([]);
        }
    });
});

router.get('/download', function(req, res) {
    const session = Session.get(req, res);
    let url = server+`/pc/v1/${session.userIdEnc}${req.query.url}`;

    // let ids = req.body.ids?req.body.ids.split(','):[];
    let params = {
        method:'get'
    };
    backend.download(url,params,req,res).pipe(res);
});

module.exports = router;
