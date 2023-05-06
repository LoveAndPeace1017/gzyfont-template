const express = require('express');
const router = express.Router();
const backend = require('../../../lib/backend');
const Session = require('../../../lib/session');
const Constants = require('../../../lib/constants');
const PropertyFilter = require('../../../lib/utils/PropertyFilter');


/* 进入新增生产单后需要加载的一些信息*/
router.get('/pre/create', function (req, res, next) {
    const params = req.query;
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/production-bom/pre/create`, params, req, res, function (data) {
        res.json(data);
    });
});

/* MultiBom列表. */
router.get('/list', function(req, res, next) {
    const params = {
        ...req.query
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page?params.page:1;
    if(params.key) params.key = encodeURI(params.key);
    if(params.bomVersion) params.bomVersion = encodeURI(params.bomVersion);
    if(params.rowMaterial) params.rowMaterial = encodeURIComponent(params.rowMaterial);
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/production-bom/list`,params,req,res,function(data){
        if(data && data.retCode==0){
            let list = data.data;
            let i = 1;
            list = list.map((item)=>{
                item.serial = i++;
                item.key = item.recId;
                let propertyValues = PropertyFilter.initCustomProperties(data.tags, item.propertyValues);
                let prodPropertyValues = PropertyFilter.addPrefixToCustomProperties(propertyValues, 'prod_');
                item = {...item, ...prodPropertyValues};
                return item
            });
            //没有可以配置的直接写死
            let tableConfigList = [{
                cannotEdit: true,
                fieldName: "bomCode",
                label: "node.multiBom.bomCode",
                visibleFlag: 1,
                width: 170
            },{
                cannotEdit: true,
                fieldName: "bomVersion",
                label: "node.multiBom.bomVersion",
                visibleFlag: 1,
                width: 170
            },{
                cannotEdit: true,
                fieldName: "prodCustomNo",
                label: "node.multiBom.prodCustomNo",
                visibleFlag: 1,
                width: 170
            },{
                cannotEdit: true,
                fieldName: "prodName",
                label: "node.multiBom.prodName",
                visibleFlag: 1,
                width: 170
            },{
                cannotEdit: true,
                fieldName: "descItem",
                label: "node.multiBom.descItem",
                visibleFlag: 1,
                width: 170
            },{
                cannotEdit: true,
                fieldName: "unit",
                label: "node.multiBom.unit",
                visibleFlag: 1,
                width: 170
            },{
                cannotEdit: true,
                fieldName: "brand",
                label: "node.multiBom.brand",
                visibleFlag: 1,
                width: 170
            },{
                cannotEdit: true,
                fieldName: "produceModel",
                label: "node.multiBom.produceModel",
                visibleFlag: 1,
                width: 170
            },{
                cannotEdit: true,
                fieldName: "defaultFlag",
                label: "node.multiBom.defaultFlag",
                visibleFlag: 1,
                width: 170
            },{
                cannotEdit: true,
                fieldName: "dayProductivity",
                label: "node.multiBom.dayProductivity",
                visibleFlag: 1,
                width: 170
            }];
            res.json({
                retCode:0,
                list:list,
                filterConfigList:[],
                tableConfigList:tableConfigList,
                // tableWidth:tableWidth,
                pagination:{
                    total:data.count,
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

//删除MultiBom列表
router.post('/delete', function(req, res, next) {
    const params = {
        array:req.body.ids
    };
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.delete(`/pc/v1/${session.userIdEnc}/production-bom`,params,req,res,function(data){
        res.json(data);
    });

});

/* 新增bom */
router.post('/add', function (req, res, next) {
    const params = req.body;
    // const userId = 'nEoAUdKFbkYs';
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/production-bom`, params, req, res, function (data) {
        res.json(data);
    });
});

/* 修改bom */
router.post('/modify/:billNo', function (req, res, next) {
    const params = req.body;
    // const userId = 'nEoAUdKFbkYs';
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.put(`/pc/v1/${session.userIdEnc}/production-bom/${req.params.billNo}`, params, req, res, function (data) {
        res.json(data);
    });
});

//bom详情页
router.get('/detail/:id', function (req, res) {
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/production-bom/${req.params.id}`, req, res, function (data) {
        if (data && data.retCode == 0) {
            res.json(data);
        } else {
            res.json({
                retCode: '1',
                retMsg: data.retMsg || "网络异常，请稍后重试！"
            });
        }
    });
});

//bom 详情页 通过 bomCode
router.get('/code/detail', function (req, res) {
    const session = Session.get(req, res);
    let params = {};
    let {bomCode} = req.query;
    if(bomCode) params.bomCode = encodeURI(bomCode);
    backend.get(`/pc/v1/${session.userIdEnc}/production-bom/detail`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            res.json(data);
        } else {
            res.json({
                retCode: '1',
                retMsg: data.retMsg || "网络异常，请稍后重试！"
            });
        }
    });
});

// 分配bom给子账号获取
router.get('/subAccounts/:id', function(req, res, next) {
    let session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/production-bom/${req.params.id}/subaccounts`,{},req,res,function(data){
        res.json(data);
    });
});
//分配bom给子账号提交
router.post('/allocSubAccounts/:id', function(req, res, next) {
    const params = {
        visableConfig: req.body.list,
        headers:{
            "Content-Type":'application/json'
        }
    };
    let session = Session.get(req,res);
    backend.put(`/pc/v1/${session.userIdEnc}/production-bom/${req.params.id}/subaccounts`,params,req,res,function(data){
        res.json(data);
    });
});

// 批量分配bom给子账号提交
router.post('/batch/allocSubAccounts/', function(req, res, next) {
    const params = {
        bomIds: req.body.selectIds,
        subUserIds: req.body.subUserIds,
        status: req.body.status,
        headers:{
            "Content-Type":'application/json'
        }
    };
    let session = Session.get(req,res);
    backend.put(`/pc/v1/${session.userIdEnc}/production-bom/batch/subaccounts`,params,req,res,function(data){
        res.json(data);
    });
});



module.exports = router;
