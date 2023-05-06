const express = require('express');
const router = express.Router();
const backend = require('../../../lib/backend');
const Session = require('../../../lib/session');
const Constants = require('../../../lib/constants');
const DataFilter = require('../../../lib/utils/DataFilter');
const qs = require('querystring');
// const server = 'http://192.168.16.254:9037';
const server = '';

const map = {
    name:{
        label:"node.supplier.name",
        width: 170
    },
    supplierName:{
        label:"node.supplier.supplierName",
        width:130
    },
    contacterName:{
        label:"node.supplier.contacterName",
        width: Constants.TABLE_COL_WIDTH.PERSON
    },
    mobile:{
        label:"node.supplier.mobile",
        width:130
    },
    email:{
        label:"node.supplier.email",
        width: 200
    },
    contacterTitle :{
        label:"node.supplier.contacterTitle",
        width: 200
    },
    displayCode: {
        label:"node.supplier.displayCode",
        width: 200
    },
    subAccountsCount:{
        label:"node.supplier.subAccountsCount",
        width: Constants.TABLE_COL_WIDTH.PERSON
    },
    remarks:{
        label:"node.supplier.remarks",
        width:180
    },
    bindAbizLoginName:{
        label:"node.supplier.bindAbizLoginName",
        width: 130
    },
    bindStates:{
        label:"node.supplier.bindStates",
        width:'200',
        type:'select',
        options:[
            {label:"node.supplier.bindStatesOption1",value:"0"},
            {label:"node.supplier.bindStatesOption2",value:"1"},
            {label:"node.supplier.bindStatesOption3",value:"2"},
        ]
    },
    disableFlag:{
        label:"node.supplier.disableFlag",
        width:'200',
        type:'select',
        options:[
            {label:'node.supplier.disableFlagOption1',value:'0'},
            {label:'node.supplier.disableFlagOption2',value:'1'}
        ],
    },
    groupId:{
        label:"node.supplier.groupName",
        width:'200',
        type:'group',
        typeField: 'supply'
    },
    groupName:{
        label:"node.supplier.groupName",
        width:'200',
    },
    property_value:{
        label:"node.supplier.property_value",
        width:'200',
        type:'custom'
    },
};

function dealFilterConfig(list,salerNames,customMap){
    let arr = list&&list.map(function(item){
        let config = map[item.columnName];
        config.fieldName = item.columnName;
        config.visibleFlag = item.visibleFlag;
        config.originVisibleFlag = item.visibleFlag;
        config.recId = item.recId;
        if(config.fieldName==="salerName"||config.fieldName==="levelName"){
            config.options = salerNames?salerNames.map(function(item){
                return {label:item,value:item};
            }):[];
        }
        if(config.fieldName==="property_value"){
            config.options = Object.values(customMap);
        }
        return config
    });
    /*arr.unshift({
        label:"node.supplier.twoWayBindFlag",
        fieldName:'twoWayBindFlag',
        visibleFlag:true,
        cannotEdit:true,
        type:'select',
        options:[
            {label:'node.supplier.twoWayBindFlagOption1',value:'1'},
            {label:'node.supplier.twoWayBindFlagOption2',value:'0'}
        ],
    });*/
    return arr
}
function dealTableConfig(list,customMap){
    let newList = [];
    let initFlag = true;
    list.forEach(function(item){
        if(item.columnName=='name'){
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
            fieldName:'displayCode',
            label:'node.supplier.displayCode',
            visibleFlag:1,
            cannotEdit:true,
            width: Constants.TABLE_COL_WIDTH.NO
        },{
            fieldName:'name',
            label:"node.supplier.name",
            visibleFlag:1,
            cannotEdit:true,
            width: 170
        },{
            fieldName:'contacterName',
            label:'node.supplier.contacterName',
            visibleFlag:1,
            cannotEdit:true,
            width: 130
        }];
        return unEditColumns.concat(newList);
    }

    return newList;
}


/* 获取客户列表统计信息 */
router.get('/listStatistics', function(req, res, next) {
    backend.get(server+`/supplier/listStatistics`,{},req,res,function(data){
        res.json(data);
    });
});

/* 客户列表. */
router.get('/list', function(req, res, next) {
    const params = {
        ...req.query
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page?params.page:1;
    const session = Session.get(req,res);
    backend.post(server+`/pc/v1/${session.userIdEnc}/suppliers/list`,params,req,res,function(data){
        if(data && data.retCode==0){
            console.log(data);
            let customMap = DataFilter.dealCustomField(data.tags);
            let list = data.data;
            let i = 1;
            list.forEach(function(item){
                item.key = item.code;
                item.serial = i++;
                item.bindAbizLoginName = item.supplierLoginName;
                item.subAccountsCount = item.visableSubAccountCount;
                [1,2,3,4,5].forEach((index)=>{
                    item['property_value'+index] = item['propertyValue'+index];
                })
            });
            let tableConfigList = dealTableConfig(data.listFields,customMap);
            /*let tableWidth = tableConfigList.reduce(function(width,item){
                return width + (item.width?item.width:200)/1;
            },0);*/
            res.json({
                retCode:0,
                list:list,
                filterConfigList:dealFilterConfig(data.searchFields,data.salerNames,customMap),
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
/*删除客户*/
router.post('/delete', function(req, res, next) {
    // const params = {
    //     array:req.body.ids
    // };
    const params = {
        vo1:req.body.ids
    };
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.delete(server+`/pc/v1/${session.userIdEnc}/suppliers`,params,req,res,function(data){
        res.json(data);
    });
});

/* 获取客户详情 */
router.get('/detail/:code', function(req, res, next) {
    const session = Session.get(req,res);
    backend.get(server+`/pc/v1/${session.userIdEnc}/suppliers/${req.params.code}/`,{},req,res,function(data){
        res.json(data);
    });
});

/* 获取客户详情带出电话联系人 */
router.get('/relevancy/:code', function(req, res, next) {
    const session = Session.get(req,res);
    backend.get(server+`/pc/v1/${session.userIdEnc}/suppliers/relevancy/${req.params.code}/`,{},req,res,function(data){
        res.json(data);
    });
});

/* 获取客户详情通过名称 */
router.get('/detailByName/:name', function(req, res, next) {
    const session = Session.get(req,res);
    let params = {
       name: encodeURIComponent(req.params.name)
    };
    backend.get(server+`/pc/v1/${session.userIdEnc}/suppliers/detail/by/name`,params,req,res,function(data){
        res.json(data);
    });
});

/* 设置隐藏显示 */
router.post('/disable', function(req, res, next) {
    let option = req.body.disableFlag?'enable':'disable';
    const session = Session.get(req,res);
    let params = {
        ids: req.body.ids
    };
    params.headers = {
        "Content-Type":'application/json'
    };
    backend.post(server+`/pc/v1/${session.userIdEnc}/suppliers/${option}`,params,req,res,function(data){
        res.json(data);
    });
});
/* 新增客户 */
router.post('/insert', function(req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.post(server+`/pc/v1/${session.userIdEnc}/suppliers`,params,req,res,function(data){
        res.json(data);
    });
});
/* 修改客户 */
router.post('/modify', function(req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.put(server+`/pc/v1/${session.userIdEnc}/suppliers/${req.body.code}/`,params,req,res,function(data){
        res.json(data);
    });
});

router.get('/isExistName/:name', function(req, res, next) {
    const params = {};
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.get(server+`/pc/v1/${session.userIdEnc}/suppliers/isExistName/${encodeURIComponent(req.params.name)}?code=${req.query.code}`,params,req,res,function(data){
        res.json(data);
    });
});

router.get('/isExistBindAccount/:name', function(req, res) {
    const params = {
        targetLoginName:req.params.name,
        checkType:'bindSupplier',
        excludeCode:req.query.code
    };
    let query = qs.stringify(params);
    params.headers = {
        "Content-Type":'application/json'
    };
    backend.post(server+`/pc/v1/account/check/?${query}`,params,req,res,function(data){
        res.json(data);
    });
});

//分配供应商给子账号获取
router.get('/subAccounts/:id', function(req, res, next) {
    let session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/suppliers/${req.params.id}/subaccounts`,{},req,res,function(data){
        res.json(data);
    });
});
//分配供应商给子账号提交
router.post('/allocSubAccounts/:id', function(req, res, next) {
    const params = {
        visableConfig: req.body.list,
        headers:{
            "Content-Type":'application/json'
        }
    };
    let session = Session.get(req,res);
    backend.put(`/pc/v1/${session.userIdEnc}/suppliers/${req.params.id}/subaccounts`,params,req,res,function(data){
        res.json(data);
    });
});

// 批量分配供应商给子账号提交
router.post('/batch/allocSubAccounts/', function(req, res, next) {
    const params = {
        supplierIds: req.body.selectIds,
        subUserIds: req.body.subUserIds,
        status: req.body.status,
        headers:{
            "Content-Type":'application/json'
        }
    };
    let session = Session.get(req,res);
    backend.put(`/pc/v1/${session.userIdEnc}/suppliers/batch/subaccounts`,params,req,res,function(data){
        res.json(data);
    });
});

/* 新建修改前初始化信息 */
router.get('/pre', function(req, res, next) {
    let session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/suppliers/pre`,{},req,res,function(data){
        res.json(data);
    });
});
/* 关键字搜索自动联想 */
router.get('/tips/:key', function(req, res, next) {
    backend.get(server+`/suppliers/tips/${req.params.key}`,{},req,res,function(data){
        res.json(data);
    });
});

/* 关键字搜索自动联想 */
router.get('/search/by/name', function(req, res) {
    const params = {
        ...req.query
    };

    if(req.query.key){
        params.key = encodeURIComponent(req.query.key)
    }
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/suppliers/search/by/name`,params,req,res,function(data){
        res.json(data);
    });
});

//提交推荐供应商信息
router.post('/recommend', function(req, res, next) {
    let params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };
    let session = Session.get(req,res);
    backend.post(`/pc/v1/${session.userIdEnc}/suppliers/recm_sms`,params,req,res,function(data){
        res.json(data);
    });
});

module.exports = router;
