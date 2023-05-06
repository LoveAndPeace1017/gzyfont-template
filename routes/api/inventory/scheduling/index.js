const express = require('express');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const Constants = require('../../../../lib/constants');

const map = {
    displayBillNo:{
        label:"node.inventory.scheduling.displayBillNo"
    },
    allocDate:{
        label:"node.inventory.scheduling.allocDate",
        width: Constants.TABLE_COL_WIDTH.DATE
    },
    warehouseNameIn:{
        label:"node.inventory.scheduling.warehouseNameIn",
        type:'select'
    },
    warehouseNameOut:{
        label:"node.inventory.scheduling.warehouseNameOut",
        type:'select'
    },
    prodAbstract:{
        label:"node.inventory.scheduling.prodAbstract"
    },
    remarks:{
        label:"node.inventory.scheduling.remarks"
    },
    ourContacterName:{
        label:"node.inventory.scheduling.ourContacterName",
        width: Constants.TABLE_COL_WIDTH.PERSON
    }

};

function dealFilterConfig(list,warehourseNames,level,customMap){
    let arr = list?list.map(function(item){
        let config = map[item.columnName];
        config.fieldName = item.columnName;
        config.visibleFlag = item.visibleFlag;
        config.originVisibleFlag = item.visibleFlag;
        config.recId = item.recId;
        if(config.fieldName==="warehouseNameIn" || config.fieldName==="warehouseNameOut"){
            config.options = warehourseNames?warehourseNames.map(function(item){
                return {label:item.name,value:item.name};
            }):[];
        }
        return config
    }):[];
    arr.unshift({
        label:"node.inventory.scheduling.allocDate",
        fieldName:'alloc',
        visibleFlag:true,
        cannotEdit:true,
        type:'datePicker'
    });
    return arr
}
function dealTableConfig(list,customMap){
    let newList = [];
    let initFlag = true;
    list.forEach(function(item){
        if(item.columnName=='displayBillNo'){
            initFlag = false;
        }
        let obj = map[item.columnName];
        obj = obj||customMap[item.columnName];
        if(obj){
            newList.push({
                fieldName:item.columnName,
                label:obj.label,
                width: item.columnWidth||obj.width||Constants.TABLE_COL_WIDTH.DEFAULT,
                cannotEdit:item.cannotEdit||null,
                recId:item.recId,
                visibleFlag: item.visibleFlag,
                originVisibleFlag: item.visibleFlag
            });
        }
    });
    if(initFlag){
        let unEditColumns = [{
            fieldName:'displayBillNo',
            label:'node.inventory.scheduling.displayBillNo',
            visibleFlag:1,
            cannotEdit:true,
            width: Constants.TABLE_COL_WIDTH.NO
        },{
            fieldName:'allocDate',
            label:'node.inventory.scheduling.allocDate',
            visibleFlag:1,
            cannotEdit:true,
            width: Constants.TABLE_COL_WIDTH.DATE
        },{
            fieldName:'warehouseNameIn',
            label:'node.inventory.scheduling.warehouseNameIn',
            visibleFlag:1,
            cannotEdit:true,
            width: Constants.TABLE_COL_WIDTH.DEFAULT
        }, {
            fieldName:'warehouseNameOut',
            label:'node.inventory.scheduling.warehouseNameOut',
            visibleFlag:1,
            cannotEdit:true,
            width: Constants.TABLE_COL_WIDTH.DEFAULT
        }];
        return unEditColumns.concat(newList);
    }

    return newList;
}


/* 客户列表. */
router.get('/list', function(req, res) {
    const params = req.query;
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page?params.page:1;
    const session = Session.get(req,res);
    res.locals.tasks = {};
    let tasks = [
        {
            uri: `/pc/v1/${session.userIdEnc}/allocwares/list`,
            params: params,
            task: function (data) {
                res.locals.tasks.list = data;
            }
        },
        // {
        //     uri: server+`/pc/v1/${session.userIdEnc}/allocwares/pre`,
        //     params: {},
        //     method:'get',
        //     task: function (data) {
        //         res.locals.tasks.pre = data;
        //     }
        // }
    ];
    backend.post(tasks, req, res, function () {
        let data = res.locals.tasks.list;
        console.log(data);
        if(data && data.retCode==0){
            let list = data.data;
            let i = 1;
            list&&list.forEach(function(item){
                item.key = item.billNo;
                item.serial = i++;
            });
            let tableConfigList = dealTableConfig(data.listFields,[]);
            let tableWidth = tableConfigList.reduce(function(width,item){
                return width + (item.width?item.width:200)/1;
            },0);
            res.json({
                retCode:0,
                list:list,
                filterConfigList:dealFilterConfig(data.searchFields,data.warehouses,[],[]),
                tableConfigList:tableConfigList,
                tableWidth:tableWidth,
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

//根据单号获取物品概要的总类
router.get('/listAllot', function (req, res) {
    const session = Session.get(req, res);
    const params = {};
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.userId = session.userIdEnc;
    params.allocWarehouseCode = req.query.billNo;
    backend.get(`/pc/v1/${session.userIdEnc}/allocwares/listAllot`, params, req, res, function (data) {
        res.json(data)
    });
});

/*删除调拨单*/
router.post('/delete', function(req, res) {
    let isCascaded = req.body.isCascaded;
    const params = {
        vo1:req.body.ids
    };
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.delete(`/pc/v1/${session.userIdEnc}/allocwares?isCascaded=${isCascaded}`,params,req,res,function(data){
        res.json(data);
    });
});
router.get('/isExistName/:name', function(req, res) {
    const params = {};
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.get(server+`/pc/v1/${session.userIdEnc}/schedulings/isExistName/${encodeURIComponent(req.params.name)}?schedulingNo=${req.query.schedulingNo}`,params,req,res,function(data){
        res.json(data);
    });
});



/* 获取客户详情 */
router.get('/detail/:schedulingNo', function(req, res) {
    const session = Session.get(req,res);
    let params = {};
    params.headers = {
        "Content-Type":'application/json'
    };
    backend.get(`/pc/v1/${session.userIdEnc}/allocwares/${req.params.schedulingNo}/`,params,req,res,function(data){
        res.json(data);
    });
});

/* 新增调拨单 */
router.post('/add', function(req, res) {
    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.post(`/pc/v1/${session.userIdEnc}/allocwares`,params,req,res,function(data){
        res.json(data);
    });
});

/* 新建修改前初始化信息 */
router.get('/pre/create', function(req, res) {
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/allocwares/pre/create`,{},req,res,function(data){
        res.json(data);
    });
});


/* 关键字搜索自动联想 */
router.get('/tips/:key', function(req, res) {
    backend.get(server+`/scheduling/tips/${req.params.key}`,{},req,res,function(data){
        res.json(data);
    });
});

/* 关键字搜索自动联想 */
router.get('/search/by/name', function(req, res) {
    const params = {
        ...req.query,
        key: encodeURIComponent(req.query.key)
    };
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/schedulings/search/by/name`,params,req,res,function(data){
        res.json(data);
    });
});



module.exports = router;
