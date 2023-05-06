const express = require('express');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const Constants = require('../../../../lib/constants');
const PropertyFilter = require('../../../../lib/utils/PropertyFilter');
const logger = require('../../../../lib/logger').getLogger();

// const server = 'http://192.168.16.254:9045';
const server = '';

const checkStatusMap = {
    0:'node.inventory.stocktaking.type1',
    1:'node.inventory.stocktaking.type2'
};
const map = {
    checkNo:{
        label:"node.inventory.stocktaking.checkNo"
    },
    checkDate:{
        label:"node.inventory.stocktaking.checkDate",
        width: Constants.TABLE_COL_WIDTH.DATE
    },
    warehouseName:{
        label:"node.inventory.stocktaking.warehouseName",
        type:'select'
    },
    prodAbstract:{
        label:"node.inventory.stocktaking.prodAbstract"
    },
    checkStatus:{
        label:"node.inventory.stocktaking.checkStatus"
    },
    ourContacterName:{
        label:"node.inventory.stocktaking.ourContacterName",
        width: Constants.TABLE_COL_WIDTH.DATE
    },
    remarks:{
        label:"node.inventory.stocktaking.remarks",
    }
};

function dealFilterConfig(list,warehourseNames){
    let arr = list?list.map(function(item){
        let config = map[item.columnName];
        config.fieldName = item.columnName;
        config.visibleFlag = item.visibleFlag;
        config.originVisibleFlag = item.visibleFlag;
        config.recId = item.recId;
        if(config.fieldName==="warehouseName"){
            config.options = warehourseNames?warehourseNames.map(function(item){
                return {label:item.name,value:item.name};
            }):[];
        }
        return config
    }):[];
    arr.unshift({
        label:"node.inventory.stocktaking.checkDate",
        fieldName:'check',
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
        if(item.columnName=='checkNo'){
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
            fieldName:'checkNo',
            label:'node.inventory.stocktaking.checkNo',
            visibleFlag:1,
            cannotEdit:true,
            width: Constants.TABLE_COL_WIDTH.NO
        },{
            fieldName:'warehouseName',
            label:'node.inventory.stocktaking.warehouseName',
            visibleFlag:1,
            cannotEdit:true,
            width: Constants.TABLE_COL_WIDTH.DEFAULT
        },{
            fieldName:'checkStatus',
            label:"node.inventory.stocktaking.checkStatus",
            visibleFlag:1,
            cannotEdit:true,
            width: Constants.TABLE_COL_WIDTH.DEFAULT
        },{
            fieldName:'checkDate',
            label:'node.inventory.stocktaking.checkDate',
            visibleFlag:1,
            cannotEdit:true,
            width: Constants.TABLE_COL_WIDTH.DATE
        }];
        newList = unEditColumns.concat(newList);
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
            uri: `/pc/v1/${session.userIdEnc}/checks/list`,
            params: params,
            task: function (data) {
                res.locals.tasks.list = data;
            }
        },
    ];
    backend.post(tasks, req, res, function () {
        let data = res.locals.tasks.list;
        console.log(data);
        if(data && data.retCode==0){
            let list = data.data;
            let i = 1;
            list&&list.forEach(function(item){
                item.key = item.checkNo;
                item.serial = i++;
                item.checkStatus = checkStatusMap[item.checkStatus];
                item.ourContacterName = item.checkOperator;
            });
            let tableConfigList = dealTableConfig(data.listFields,[]);
            let tableWidth = tableConfigList.reduce(function(width,item){
                return width + (item.width?item.width:200)/1;
            },0);
            res.json({
                retCode:0,
                list:list,
                filterConfigList:dealFilterConfig(data.searchFields,data.warehouses),
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
router.get('/listCheck', function (req, res) {
    const session = Session.get(req, res);
    const params = {};
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.userId = session.userIdEnc;
    params.checkNo = req.query.billNo;
    backend.get(`/pc/v1/${session.userIdEnc}/checks/listCheck`, params, req, res, function (data) {
        res.json(data)
    });
});

/*删除盘点单*/
router.post('/delete', function(req, res) {
    let isCascaded = req.body.isCascaded;
    const params = {
        vo1:req.body.ids
    };
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.delete(`/pc/v1/${session.userIdEnc}/checks?isCascaded=${isCascaded}`,params,req,res,function(data){
        res.json(data);
    });
});

/* 获取盘点单详情 */
router.get('/detail/:checkNo', function(req, res) {
    const session = Session.get(req,res);
    let params = {}
    params.headers = {
        "Content-Type":'application/json'
    };
    backend.get(`/pc/v1/${session.userIdEnc}/checks/${req.params.checkNo}/`,params,req,res,function(data){
        if (data && data.retCode == 0) {
            data.prodDataTags = PropertyFilter.initCustomTags(data.prodDataTags, 'prod_');
            const prodCustomMap = PropertyFilter.dealCustomField(data.prodDataTags);
            data.listFields = DataFilter.dealGoodsTableConfig(data.listFields, prodCustomMap,{});
            if(data.data && data.data.prodList){
                data.data.prodList = PropertyFilter.dealProdCustomField({list: data.data.prodList, prefix: 'prod_', propertyKey: 'prodPropertyValues'});
            }
            res.json(data);
        }
    });
});

/* 新增盘点单 */
router.post('/add', function(req, res) {
    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.post(`/pc/v1/${session.userIdEnc}/checks`,params,req,res,function(data){
        res.json(data);
    });
});
/* 结束无id的盘点单 */
router.post('/finish/withoutId', function(req, res) {
    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.post(`/pc/v1/${session.userIdEnc}/checks/endCheck/withOutCheckNo`,params,req,res,function(data){
        res.json(data);
    });
});
/* 结束盘点 */
router.post('/finish/:code', function(req, res) {
    let params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.post(`/pc/v1/${session.userIdEnc}/checks/endCheck?checkNo=${req.params.code}`,params,req,res,function(data){
        res.json(data);
    });
});

/* 修改盘点单 */
router.post('/modify', function(req, res) {
    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.put(server+`/pc/v1/${session.userIdEnc}/checks/${params.checkNo}`,params,req,res,function(data){
        res.json(data);
    });
});

/* 新建修改前初始化信息 */
router.get('/pre/create', function(req, res) {
    logger.info(req+"1");
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/checks/pre/create`,{},req,res,function(data){
        if (data && data.retCode == 0) {
            data.prodDataTags = PropertyFilter.initCustomTags(data.prodDataTags, 'prod_');
            const prodCustomMap = PropertyFilter.dealCustomField(data.prodDataTags);
            data.listFields = DataFilter.dealGoodsTableConfig(data.listFields, prodCustomMap,{});
            res.json(data);
        }
    });
});

/* 获取复制后的物品列表信息 */
router.post('/prod', function(req, res) {
    const params = {
        headers: {
            "Content-Type":'application/json',
        },
        array: JSON.stringify(req.body.prodList)
    };
    const session = Session.get(req,res);
    backend.post(`/pc/v1/${session.userIdEnc}/prods/check/search/by/field?warehouseName=${encodeURIComponent(req.body.warehouseName)}`,params,req,res,function(data){
        let backData = data.data;
        data.data = req.body.prodList.map((item, index) => {
            item.systemNum = backData[index].currentQuantity;
            item.offsetQuantity = item.actualNum - item.systemNum;
            if(item.offsetQuantity === 0){
                item.result = '正常';
            } else if(item.offsetQuantity > 0) {
                item.result = '盘盈';
            } else {
                item.result = '盘亏';
            }
            return item
        });
        res.json(data);
    });
});


module.exports = router;
