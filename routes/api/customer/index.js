const express = require('express');
const router = express.Router();
const backend = require('../../../lib/backend');
const Session = require('../../../lib/session');
const Constants = require('../../../lib/constants');
const DataFilter = require('../../../lib/utils/DataFilter');
const moment = require('moment');
const qs = require('querystring');
// const server = 'http://192.168.16.254:9037';
const server = '';

const map = {
    customerName:{
        label:"node.customer.customerName"
    },
    address:{
        label:"node.customer.address"
    },
    contacterName:{
        label:"node.customer.contacterName",
        width: Constants.TABLE_COL_WIDTH.PERSON
    },
    telNo:{
        label:"node.customer.telNo",
        width: Constants.TABLE_COL_WIDTH.TEL
    },
    email:{
        label:"node.customer.email",
        width: Constants.TABLE_COL_WIDTH.EMAIL
    },
    addedTime:{
        label:"node.customer.addedTime",
        width: Constants.TABLE_COL_WIDTH.DATE
    },
    contactRecord:{
        label:"node.customer.contactRecord",
        width: Constants.TABLE_COL_WIDTH.CONTACT_RECORD
    },
    salerCount:{
        label:"node.customer.salerCount",
        width: Constants.TABLE_COL_WIDTH.PERSON
    },
    remarks:{
        label:"node.customer.remarks"
    },
    bindAbizLoginName:{
        label:"node.customer.bindAbizLoginName",
        width: Constants.TABLE_COL_WIDTH.BIND_ACCOUNT
    },
    salerName:{
        label:"node.customer.salerName",
        width:'200',
        type:'select'
    },
    deptEmployeeName:{
        label:"node.customer.deptEmployeeName",
        width:'200',
        type:'select'
    },
    displayCode: {
        label:"node.supplier.displayCode",
        width: 200
    },
    level:{
        label:"node.customer.level",
        width: '120',
        type:'select'
    },
    followStatus:{
        label:"node.customer.followStatus",
        type:'select',
        options:[
            {label:'node.customer.followStatusOption1',value:'初访'},
            {label:'node.customer.followStatusOption2',value:'意向'},
            {label:'node.customer.followStatusOption3',value:'报价'},
            {label:'node.customer.followStatusOption4',value:'成交'},
            {label:'node.customer.followStatusOption5',value:'搁置'},
        ]
    },
    disableFlag:{
        label:"node.customer.disableFlag",
        width:'200',
        type:'select',
        options:[
            {label:'node.customer.disableFlagOption1',value:'0'},
            {label:'node.customer.disableFlagOption2',value:'1'}
        ],
    },
    contactTime:{
        label:"node.customer.contactTime",
        width:'200',
        type:'datePicker'
    },
    nextContactTime:{
        label:"node.customer.nextContactTime",
        width:'200',
        type:'datePicker'
    },
    groupId:{
        label:"node.supplier.groupName1",
        width:'200',
        type:'group',
        typeField: 'custom'
    },
    groupName:{
        label:"node.customer.groupName",
        width:'200',
    },
    contacterTitle :{
        label:"node.supplier.contacterTitle",
        width: 200
    },
    property_value:{
        label:"node.customer.property_value",
        width:'200',
        type:'custom'
    },
};
// 客户申请状态映射
let statusMap = {
    '0':'未处理',
    '1':'已确认',
    '2':'黑名单',
};
// 客户来源映射
let originMap = {
    '1':'小程序注册',
    '2':'小程序登录',
    '3':'邀请新注册',
    '4':'邀请注册绑定',
};

function dealFilterConfig(list,salerNames,levels,customMap,employeeList){
    let arr = list&&list.map(function(item){
        let config = map[item.columnName];
        config.fieldName = item.columnName;
        config.visibleFlag = item.visibleFlag;
        config.originVisibleFlag = item.visibleFlag;
        config.recId = item.recId;
        if(config.fieldName==="salerName"){
            config.options = salerNames?salerNames.map(function(item){
                return {label:item.loginName,value:item.loginName};
            }):[];
        }//deptEmployeeName
        if(config.fieldName==="deptEmployeeName"){
            config.options = employeeList?employeeList.map(function(item){
                return {label:item.department+'-'+item.employeeName,value:item.department+'-'+item.employeeName};
            }):[];
        }
        if(config.fieldName==="level"){
            config.options = levels?levels.map(function(item){
                return {label:item.name,value:item.id};
            }):[];
        }
        if(config.fieldName==="property_value"){
            config.options = Object.values(customMap);
        }
        return config
    });
    /*arr.unshift({
        label:"node.customer.twoWayBindFlag",
        fieldName:'twoWayBindFlag',
        visibleFlag:true,
        cannotEdit:true,
        type:'select',
        options:[
            {label:'node.customer.twoWayBindFlagOption1',value:'1'},
            {label:'node.customer.twoWayBindFlagOption0',value:'0'}
        ],
    });*/
    return arr
}
function dealTableConfig(list,customMap){
    let newList = [];
    let initFlag = true;
    list.forEach(function(item){
        if(item.columnName=='customerName'){
            initFlag = false;
        }
        let obj = map[item.columnName];
        obj = obj||customMap[item.columnName];
        if(obj){
            newList.push({
                fieldName:item.columnName,
                label:obj.label,
                recId:item.recId,
                visibleFlag: item.visibleFlag,
                originVisibleFlag: item.visibleFlag,
                width: item.columnWidth||obj.width||Constants.TABLE_COL_WIDTH.DEFAULT,
                cannotEdit:item.cannotEdit||null,
            });
        }
    });
    if(initFlag){
        let unEditColumns = [{
            fieldName:'displayCode',
            label:'node.supplier.displayCode',
            visibleFlag:1,
            cannotEdit:true,
            width: 200
        },{
            fieldName:'customerName',
            label:'node.customer.customerName',
            visibleFlag:1,
            cannotEdit:true,
            width: Constants.TABLE_COL_WIDTH.TEL
        },{
            fieldName:'contacterName',
            label:'node.customer.contacterName',
            visibleFlag:1,
            cannotEdit:true,
            width: Constants.TABLE_COL_WIDTH.PERSON
        }];
        return unEditColumns.concat(newList);
    }
    return newList;
}

/* 获取客户列表统计信息 */
router.get('/listStatistics', function(req, res) {
    backend.get(server+`/customer/listStatistics`,{},req,res,function(data){
        res.json(data);
    });
});

/* 客户列表. */
router.get('/list', function(req, res) {
    const params = {
        ...req.query
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page?params.page:1;
    if(params.deptEmployeeName){
        params.departmentName = params.deptEmployeeName.split('-')[0]
        params.employeeName = params.deptEmployeeName.split('-')[1]
    }
    const session = Session.get(req,res);
    res.locals.tasks = {};
    let url = `/pc/v1/${session.userIdEnc}/customers/list`;
    let tasks = [
        {
            uri: server + url,
            params: params,
            task: function (data) {
                res.locals.tasks.list = data;
            }
        },
        {
            uri: server+`/pc/v1/${session.userIdEnc}/customers/pre`,
            params: {},
            method:'get',
            task: function (data) {
                res.locals.tasks.pre = data;
            }
        },
        {
            uri: server+`/pc/v1/${session.userIdEnc}/employees`,
            params: {},
            method:'get',
            task: function (data) {
                res.locals.tasks.employee = data;
            }
        },
    ];
    backend.post(tasks, req, res, function () {
        let data = res.locals.tasks.list;
        let levels = [];
        let pre = res.locals.tasks.pre;
        let employeeList = res.locals.tasks.employee;
        if(pre && pre.retCode==="0"){
            levels = pre.data.levels;
        }
        if(data && data.retCode==0){
            console.log(data);
            let customMap = DataFilter.dealCustomField(data.tags);
            let list = data.data;
            let i = 1;
            list&&list.forEach(function(item){
                item.key = item.customerNo;
                item.serial = i++;
                item.bindAbizLoginName = item.customerLoginName;
                item.contactRecord = item.contactRecordCount;
                item.address = item.firstAddressStr;
                item.level = item.levelName;
                item.salerName = item.visableSubAccountCount;
                [1,2,3,4,5].forEach((index)=>{
                    item['property_value'+index] = item['propValue'+index];
                })
            });
            let tableConfigList = dealTableConfig(data.listFields,customMap);
            /*let tableWidth = tableConfigList.reduce(function(width,item){
                return width + (item.width?item.width:200)/1;
            },0);*/
            res.json({
                retCode:0,
                list:list,
                filterConfigList:dealFilterConfig(data.searchFields,data.subAccounts,levels,customMap,employeeList.data),
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


/* 客户申请列表. */
router.get('/apply/list', function(req, res) {
    const params = {
        ...req.query.init?defaultValues:{},
        ...req.query
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page?params.page:1;
    const session = Session.get(req,res);
    backend.post(server + `/pc/v1/${session.userIdEnc}/mall/customers/apply`, params,req, res, function (data) {
        if(data && data.retCode==0){
            let list = data.data;
            let i = 1;
            list&&list.forEach(function(item){
                item.key = item.recId;
                item.serial = i++;
                item.bindAbizLoginName = item.customerLoginName;
                item.statusText = statusMap[item.status+''];
                item.originTypeText = originMap[item.originType+''];
            });
            res.json({
                retCode:0,
                list:list,
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
router.post('/delete', function(req, res) {
    const params = {
        vo1:req.body.ids
    };
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.delete(server+`/pc/v1/${session.userIdEnc}/customers`,params,req,res,function(data){
        res.json(data);
    });
});
router.get('/isExistName/:name', function(req, res) {
    const params = {};
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.get(server+`/pc/v1/${session.userIdEnc}/customers/isExistName/${encodeURIComponent(req.params.name)}?customerNo=${req.query.customerNo}`,params,req,res,function(data){
        res.json(data);
    });
});
//客户价格表
router.get('/cusprice', function(req, res) {
    let params = req.query;
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.get(server+`/pc/v1/${session.userIdEnc}/prods/query/cusprice/${req.query.recordFor}`,params,req,res,function(data){
        if (data.retCode == '0') {
            let i = 1;
            data.data && data.data.forEach((item, index) => {
                item.key = item.recId || index;
                item.serial = i++;
            });
            res.json({
                data: data.data,
                pagination: {
                    total: data.count,
                    current: params.page * 1,
                    pageSize: params.perPage * 1
                },
                retCode: '0'
            });
        } else {
            res.json({
                retCode: 1,
                retMsg: (data && data.retMsg) || "网络异常，请稍后重试！"
            });
        }
    });
});

router.get('/isExistBindAccount/:name', function(req, res) {
    const params = {
        targetLoginName:req.params.name,
        checkType:'bindCustomer',
        excludeCode:req.query.customerNo
    };
    let query = qs.stringify(params);
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.post(server+`/pc/v1/account/check/?${query}`,params,req,res,function(data){
        res.json(data);
    });
});


/* 获取客户详情 */
router.get('/detail/:customerNo', function(req, res) {
    const session = Session.get(req,res);
    let params = {};
    params.headers = {
        "Content-Type":'application/json'
    };
    backend.get(`/pc/v1/${session.userIdEnc}/customers/${req.params.customerNo}/`,params,req,res,function(data){
        console.log(data, '***');
        res.json(data);
    });
});

/* 获取客户详情带出联系人和电话 */
router.get('/relevancy/:customerNo', function(req, res) {
    const session = Session.get(req,res);
    let params = {};
    params.headers = {
        "Content-Type":'application/json'
    };
    backend.get(`/pc/v1/${session.userIdEnc}/customers/relevancy/${req.params.customerNo}/`,params,req,res,function(data){
        res.json(data);
    });
});

/* 设置隐藏显示 */
router.post('/disable', function(req, res) {
    let option = req.body.disableFlag?'enable':'disable';
    const session = Session.get(req,res);
    let params = {
        ids: req.body.ids
    };
    params.headers = {
        "Content-Type":'application/json'
    };
    backend.post(server+`/pc/v1/${session.userIdEnc}/customers/${option}`,params,req,res,function(data){
        res.json(data);
    });
});
/* 新增客户 */
router.post('/insert', function(req, res) {
    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    let url = `/pc/v1/${session.userIdEnc}/customers`;
    if(params.source=='mall'){
        url = `/pc/v1/${session.userIdEnc}/mall/customers`;
    }
    backend.post(server + url,params,req,res,function(data){
        res.json(data);
    });
});

/* 商城创建客户 */
router.post('/mall/creat', function(req, res) {
    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.post(server+`/pc/v1/${session.userIdEnc}/mall/customers/binding/notExist`,params,req,res,function(data){
        res.json(data);
    });
});
/* 商城绑定客户 */
router.post('/mall/bind', function(req, res) {
    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.post(server+`/pc/v1/${session.userIdEnc}/mall/customers/binding/exist`,params,req,res,function(data){
        res.json(data);
    });
});

/* 商城黑名单 */
router.post('/mall/addToBlacklist', function(req, res) {
    const params = req.body;
    const session = Session.get(req,res);
    let url = `/pc/v1/${session.userIdEnc}/mall/customers/binding/blackList`;
    if(params.type=='sale'){
        /* 根据销售单号加入商城黑名单 */
        url = `/pc/v1/${session.userIdEnc}/mall/customers/blackList`;
    }
    params.headers = {
        "Content-Type":'application/json'
    };
    backend.post(server+url,params,req,res,function(data){
        res.json(data);
    });
});

/* 查询未绑定客户 */
router.post('/unbind/list', function(req, res) {
    const params = {};
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.get(server+`/pc/v1/${session.userIdEnc}/mall/customers/binding/preCustomers`,params,req,res,function(data){
        res.json(data);
    });
});

/* 修改客户 */
router.post('/modify', function(req, res) {
    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.put(server+`/pc/v1/${session.userIdEnc}/customers/${req.body.customerNo}/`,params,req,res,function(data){
        res.json(data);
    });
});
/* 新建修改前初始化信息 */
router.get('/pre', function(req, res) {
    const session = Session.get(req,res);
    backend.get(server+`/pc/v1/${session.userIdEnc}/customers/pre`,{},req,res,function(data){
        res.json(data);
    });
});

//分配客户给子账号获取
router.get('/subAccounts/:id', function(req, res, next) {
    let session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/customers/${req.params.id}/subaccounts`,{},req,res,function(data){
        res.json(data);
    });
});
//分配客户给子账号提交
router.post('/allocSubAccounts/:id', function(req, res, next) {
    const params = {
        visableConfig: req.body.list,
        headers:{
            "Content-Type":'application/json'
        }
    };
    let session = Session.get(req,res);
    backend.put(`/pc/v1/${session.userIdEnc}/customers/${req.params.id}/subaccounts`,params,req,res,function(data){
        res.json(data);
    });
});

// 批量分配客户给子账号提交
router.post('/batch/allocSubAccounts/', function(req, res, next) {
    const params = {
        customerIds: req.body.selectIds,
        subUserIds: req.body.subUserIds,
        status: req.body.status,
        headers:{
            "Content-Type":'application/json'
        }
    };
    let session = Session.get(req,res);
    backend.put(`/pc/v1/${session.userIdEnc}/customers/batch/subaccounts`,params,req,res,function(data){
        res.json(data);
    });
});


/* 新增客户联系记录 */
router.post('/contactRecord/insert', function(req, res) {
    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.post(server+`/pc/v1/${session.userIdEnc}/customers/contact/record?customerNo=${req.body.customerNo}`,params,req,res,function(data){
        res.json(data);
    });
});
/* 修改客户联系记录 */
router.post('/contactRecord/modify', function(req, res) {
    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.put(server+`/pc/v1/${session.userIdEnc}/customers/contact/record/${req.body.id}`,params,req,res,function(data){
        res.json(data);
    });
});
/* 删除客户联系记录 */
router.delete('/contactRecord/delete/:id', function(req, res) {
    const params = {
        headers: {
            "Content-Type":'application/json'
        }
    };
    const session = Session.get(req,res);
    backend.delete(server+`/pc/v1/${session.userIdEnc}/customers/contact/record/${req.params.id}`,params,req,res,function(data){
        res.json(data);
    });
});
/* 查看客户联系记录 */
router.get('/contactRecord/detail/:id', function(req, res) {
    const params = {
        headers: {
            "Content-Type":'application/json'
        }
    };
    const session = Session.get(req,res);
    backend.get(server+`/pc/v1/${session.userIdEnc}/customers/contact/record/${req.params.id}`,params,req,res,function(data){
        res.json(data);
    });
});

/* 客户联系记录列表 */
router.get('/contactRecord/list', function(req, res) {
    const params = req.query;
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.get(server+`/pc/v1/${session.userIdEnc}/customers/contact/record`,params,req,res,function(data){
        if(data && data.retCode==0){
            let list = data.data;
            let i = 1;
            list.forEach(function(item){
                item.key = i++;
                item.serial = item.key;
            });
            res.json({
                retCode:0,
                list:list,
            });
        }else{
            res.json({
                retCode:1,
                retMsg:"网络异常，请稍后重试！"
            });
        }
    });
});


/* 客户联系记录列表 */
router.post('/export/contactRecord/list', function(req, res) {
    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.get(server+`/pc/v1/${session.userIdEnc}/customers/contact/record`,params,req,res,function(data){
        if(data && data.retCode==0){
            let list = data.data;
            let tableData = [['序号', '联系日期', '下次联系日期', '联系内容', '添加人', '添加日期']];
            for(let i=0;i<list.length;i++){
                let {contactTime, nextContactTime, content, addedLoginName, addedTime} = list[i];
                contactTime = contactTime && new moment(contactTime).format('YYYY-MM-DD');
                nextContactTime = nextContactTime && new moment(nextContactTime).format('YYYY-MM-DD');
                addedTime = addedTime && new moment(addedTime).format('YYYY-MM-DD');
                tableData.push([i+1, contactTime, nextContactTime, content, addedLoginName, addedTime]);
            }
            res.json({
                retCode:0,
                tableData: tableData
            });
        }else{
            res.json({
                retCode:1,
                retMsg:"网络异常，请稍后重试！"
            });
        }
    });
});



/* 关键字搜索自动联想 */
router.get('/tips/:key', function(req, res) {
    backend.get(server+`/customers/tips/${req.params.key}`,{},req,res,function(data){
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
    backend.get(`/pc/v1/${session.userIdEnc}/customers/search/by/name`,params,req,res,function(data){
        res.json(data);
    });
});

/*设置分销客户*/
router.post('/setDistribute/', function(req, res) {
    const params = {
        vo1:req.body.ids
    };
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);

    backend.post(`/pc/v1/${session.userIdEnc}/customers/batchDistribute?optionFlag=${req.body.optionFlag}`,params,req,res,function(data){
        res.json(data);
    });
});

// 根据名字查找客户
router.get('/searchOneByName', function(req, res) {
    const params = {
        headers:{
            "Content-Type":'application/json'
        }
    };
    const session = Session.get(req,res);

    backend.get(`/pc/v1/${session.userIdEnc}/mall/customers/search/local?name=${encodeURIComponent(req.query.name)}`,params,req,res,function(data){
        res.json(data);
    });
});

//修改客服的跟进状态
router.get('/changeFollowStatus', function(req, res) {
    const params = {
        headers:{
            "Content-Type":'application/json'
        }
    };
    const query = req.query;
    const session = Session.get(req,res);
    params.followStatus = query.followStatus ;
    backend.post(`/pc/v1/${session.userIdEnc}/customers/${query.customerNo}`,params,req,res,function(data){
        res.json(data);
    });
});


// 获取开通订单追踪详情
router.get('/orderTrack', function(req, res, next) {
    const query = req.query;
    let session = Session.get(req,res);
    backend.get(`/cgi/${session.userIdEnc}/trace/${query.customerNo}`,{},req,res,function(data){
        res.json(data);
    });
});

// 获取开通订单追踪
router.post('/orderTrack', function(req, res, next) {
    let params = req.body;
    params.header = {
        "Content-Type":'application/json'
    };
    let session = Session.get(req,res);
    backend.post(`/cgi/${session.userIdEnc}/trace/update`,params,req,res,function(data){
        res.json(data);
    });
});


module.exports = router;
