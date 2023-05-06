const express = require('express');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const Constants = require('../../../../lib/constants');
const DataFilter = require('../../../../lib/utils/DataFilter');
const PropertyFilter = require('../../../../lib/utils/PropertyFilter');
const qs = require('querystring');
const server = '';
const outType = {
    0:'node.inventory.out.outTypeOption1',
    1:'node.inventory.out.outTypeOption2',
    2:'node.inventory.out.outTypeOption3',
    3:'node.inventory.out.outTypeOption4',
    4:'node.inventory.out.outTypeOption6',
    5:'node.inventory.out.outTypeOption5',
    6:'node.inventory.out.outTypeOption7',
    7:'node.inventory.out.outTypeOption8',
};
const contactNameKey = {
    0:'usePerson',
    1:'usePerson',
    2:'customerContacterName',
    3:'supplierContacterName',
    4:'usePerson',
    5:'usePerson',
};
const useDepartmentKey = {
    0:'useDepartment',
    1:'useDepartment',
    2:'customerName',
    3:'supplierName',
    4:'useDepartment',
    5:'useDepartment',
    7:'useDepartment',
};

const map = {
    outType:{
        label:'node.inventory.out.outType',
    },
    displayBillNo:{
        label:"node.inventory.out.displayBillNo"
    },
    outDate:{
        label:"node.inventory.out.outDate"
    },
    useDepartment:{
        label:"node.inventory.out.useDepartment"
    },
    usePerson:{
        label:"node.inventory.out.usePerson"
    },
    warehouseName:{
        label:"node.inventory.out.warehouseName"
    },
    prodAbstract:{
        label:"node.inventory.out.prodAbstract"
    },
    taxAllAmount: {
        label: "node.inventory.out.taxAllAmount",
    },
    discountAmount: {
        label: "node.inventory.out.discountAmount",
    },
    aggregateAmount: {
        label: "node.inventory.out.aggregateAmount",
    },
    remarks:{
        label:"node.inventory.out.remarks"
    },
    projectName:{
        label:"node.inventory.out.projectName",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        type: 'project'
    },

    customerTelNo:{
        label:"node.inventory.out.customerTelNo",
        width: Constants.TABLE_COL_WIDTH.TEL
    },
    ourContacterName:{
        label:"node.inventory.out.ourContacterName",
        width: Constants.TABLE_COL_WIDTH.PERSON,
        type: 'depEmployee'
    },

    bindAbizLoginName:{
        label:"node.inventory.out.bindAbizLoginName",
        width: Constants.TABLE_COL_WIDTH.BIND_ACCOUNT
    },
    bindStates:{
        label:"node.inventory.out.bindStates",
        width:'200',
        type:'select',
        options:[
            {label:"node.inventory.out.bindStatesOption1",value:"0"},
            {label:"node.inventory.out.bindStatesOption2",value:"1"},
            {label:"node.inventory.out.bindStatesOption3",value:"2"},
        ]
    },
    contacterName:{
        label:"node.inventory.out.contacterName",
        width:'200',
        type:'input',
        placeholder:'领用人/联系人'
    },
    saleBillNo:{
        label:"node.inventory.out.saleBillNo",
        width:'200',
        type:'input',
        placeholder:'上游订单'
    },
    purchaseBillNo: {
        label:"node.inventory.in.purchaseBillNo",
        width:'200',
        type:'input',
        placeholder:'采购订单号'
    },
    customerOrderNo:{
        label:"node.inventory.out.customerOrderNo",
        width:'300',
        type:'input',
        placeholder:'客户订单号'
    },
    property_value:{
        label:"node.inventory.out.property_value",
        width:'200',
        type:'custom'
    },
    assignee:{
        label: "node.purchase.assignee",
        width: '200',
        type: 'select',
        options: [
            {label: "node.purchase.assigneeOption", value: "1"}
        ]
    },
    approveStatus:{
        label:"node.inventory.out.approveStatus",
        type: 'select',
        options: [
            {label: "components.approve.approveStatus_0", value: "0"},
            {label: "components.approve.approveStatus_3", value: "3"},
            {label: "components.approve.approveStatus_2", value: "2"},
            {label: "components.approve.approveStatus_1", value: "1"}
        ]
    },
    ourName: {
        label:"node.inventory.out.ourName",
        width:'200',
        type:'input',
        placeholder:'销售方'
    }
};
function dealFilterConfig(list,warehouses,customMap,invisibleGroup){
    let arr = list&&list.map(function(item){
        let config = map[item.columnName];
        config.fieldName = item.columnName;
        config.visibleFlag = item.visibleFlag;
        config.originVisibleFlag = item.visibleFlag;
        config.recId = item.recId;
        config.displayFlag = false;
        if(config.fieldName==="property_value"){
            config.options = Object.values(customMap);
        }
        if(invisibleGroup.indexOf(item.columnName) !== -1){
            config.displayFlag = true;
            config.visibleFlag = false;
        }

        return config
    });
    const warehouseNames = warehouses.map((item)=>{
       return {
           label:item.name,
           value:item.name,
       };
    });
    arr = arr||[];
    arr.unshift({
        label:"node.inventory.out.outType",
        fieldName:'outType',
        visibleFlag:true,
        cannotEdit:true,
        type:'select',
        options:[
            {label:'node.inventory.out.outTypeOption1',value:'0'},
            {label:'node.inventory.out.outTypeOption2',value:'1'},
            {label:'node.inventory.out.outTypeOption3',value:'2'},
            {label:'node.inventory.out.outTypeOption4',value:'3'},
            {label:'node.inventory.out.outTypeOption5',value:'5'},
            {label:'node.inventory.out.outTypeOption6',value:'4'},
            {label:'node.inventory.out.outTypeOption7',value:'6'},
            {label:'node.inventory.out.outTypeOption8',value:'7'},
        ],
    },{
        label:"node.inventory.out.warehouseName",
        fieldName:'warehouseName',
        visibleFlag:true,
        cannotEdit:true,
        type:'select',
        options:warehouseNames,
    },{
        label:"node.inventory.out.outDate",
        fieldName:'out',
        visibleFlag:true,
        cannotEdit:true,
        type:'datePicker'
    }
    );
    return arr
}
function dealTableConfig(list,customMap,invisibleGroup){
    let newList = [];
    let initFlag = true;
    list.forEach(function(item){
        if(item.columnName=='displayBillNo'){
            initFlag = false;
        }
        if(invisibleGroup.indexOf(item.columnName) !== -1){
            item.displayFlag = true;
            item.visibleFlag = false;
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
                originVisibleFlag: item.visibleFlag,
                displayFlag: item.displayFlag||null
            });
        }
    });
    if(initFlag){
        let unEditColumns = [{
            fieldName:'displayBillNo',
            label:"node.inventory.out.displayBillNo",
            visibleFlag:1,
            cannotEdit:true,
            width: Constants.TABLE_COL_WIDTH.NO
        },{
            fieldName:'outDate',
            label:"node.inventory.out.outDate",
            visibleFlag:1,
            cannotEdit:true,
            width: Constants.TABLE_COL_WIDTH.DATE
        },{
            fieldName:'outType',
            label:'node.inventory.out.outType',
            visibleFlag:1,
            cannotEdit:true,
            width: Constants.TABLE_COL_WIDTH.BOUND_TYPE
        },{
            fieldName:'useDepartment',
            label:'node.inventory.out.useDepartment',
            visibleFlag:1,
            cannotEdit:true,
            width: Constants.TABLE_COL_WIDTH.TEL
        }];
        return unEditColumns.concat(newList);
    }

    return newList;
}

/* 出库单列表. */
router.get('/list', function(req, res, next) {
    const params = req.query;
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page?params.page:1;
    const session = Session.get(req,res);
    backend.post(server+`/pc/v1/${session.userIdEnc}/outwares/list`,params,req,res,function(data){
        if(data && data.retCode==0){
            console.log(data);
            let customMap = DataFilter.dealCustomField(data.tags);
            let list = data.data;
            let i = 1;
            list.forEach(function(item){
                item.key = item.billNo;
                item.serial = i++;
                item.contacterName = item[contactNameKey[item.outType]];
                item.useDepartment = item[useDepartmentKey[item.outType]];
                item.outType = outType[item.outType];
                [1,2,3,4,5].forEach((index)=>{
                    item['property_value'+index] = item['propertyValue'+index];
                });
            });

            let invisibleGroup = []; //数组中的属性在页面中将隐藏
            data.approveModuleFlag != 1 && (invisibleGroup.push('approveStatus'),invisibleGroup.push('assignee'));

            let tableConfigList = dealTableConfig(data.listFields,customMap,invisibleGroup);
            let tableWidth = tableConfigList.reduce(function(width,item){
                return width + (item.width?item.width:200)/1;
            },0);
            res.json({
                retCode:0,
                list:list,
                approveFlag:data.approveFlag,
                approveModuleFlag: data.approveModuleFlag,
                filterConfigList:dealFilterConfig(data.searchFields,data.warehouses,customMap,invisibleGroup),
                tableConfigList:tableConfigList,
                tableWidth:tableWidth,
                totalAmount: data.totalAmount,
                pageAmount: data.pageAmount,
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
router.get('/listOut', function (req, res) {
    const session = Session.get(req, res);
    const params = {};
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.userId = session.userIdEnc;
    params.outWarehouseCode = req.query.billNo;
    backend.get(`/pc/v1/${session.userIdEnc}/outwares/listOut`, params, req, res, function (data) {
        res.json(data)
    });
});


/*删除出库单*/
router.post('/delete', function(req, res, next) {
    const params = {
        vo1:req.body.ids
    };
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.delete(server+`/pc/v1/${session.userIdEnc}/outwares`,params,req,res,function(data){
        res.json(data);
    });
});

/* 获取出库单详情 */
router.get('/detail/:code', function(req, res, next) {
    const session = Session.get(req,res);
    backend.get(server+`/pc/v1/${session.userIdEnc}/outwares/${req.params.code}/`,{},req,res,function(data){
        if(data.retCode==="0"){
            data.data.customerOrderNo = data.data.saleCustomerOrderNo; //后端详情页返回的客户订单号与新增时的不一致
            data.data.prodList.forEach((prod)=>{
               prod.productCode = prod.prodNo;
            });
            data.data.isCreator = data.isCreator;
            data.data.isAssignee = (data.approveTask?true:false);
            data.data.approveCancel = data.approveCancel;
        }
        if (data && data.retCode == 0) {
            data.billProdDataTags=data.billProdDataTags.map(item=>{
                item.mappingName='item_'+item.mappingName;
                return item;
            });  // 各单据的自定义字段mappingName与listFields中的字段不不一致
            data.prodDataTags = PropertyFilter.initCustomTags(data.prodDataTags, 'prod_');

            const prodCustomMap = PropertyFilter.dealCustomField(data.prodDataTags);
            const billProdDataTags = DataFilter.dealCustomField(data.billProdDataTags);
            data.listFields = PropertyFilter.dealGoodsTableConfig(data.listFields, prodCustomMap, billProdDataTags);
            if(data.data && data.data.prodList){
                data.data.prodList = DataFilter.dealExtraCustomField(data.data.prodList);
                data.data.prodList = PropertyFilter.dealProdCustomField({list: data.data.prodList, prefix: 'prod_', propertyKey: 'prodPropertyValues'});
            }
            res.json(data);
        } else {
            res.json({
                retCode: '1',
                retMsg: data.retMsg
            });
        }
    });
});
/* 设置隐藏显示 */
router.post('/disable/:code', function(req, res, next) {
    let option = req.body.disableFlag?'enable':'disable';
    const session = Session.get(req,res);
    backend.post(server+`/pc/v1/${session.userIdEnc}/outwares/${option}/${req.params.code}`,{},req,res,function(data){
        res.json(data);
    });
});
/* 新增出库单 */
router.post('/insert', function(req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };

    const session = Session.get(req,res);
    backend.post(server+`/pc/v1/${session.userIdEnc}/outwares/`,params,req,res,function(data){
        res.json(data);
    });
});

/* 修改出库单 */
router.post('/modify', function(req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.put(server+`/pc/v1/${session.userIdEnc}/outwares/${req.body.billNo}/`,params,req,res,function(data){
        res.json(data);
    });
});

router.get('/isExistName/:name', function(req, res, next) {
    const params = {};
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.get(server+`/pc/v1/${session.userIdEnc}/outwares/isExistName/${req.params.name}?code=${req.query.code}`,params,req,res,function(data){
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

//分配仓库给子账号获取
router.get('/subAccounts/:id', function(req, res, next) {
    backend.get(server+'/supplier/subAccounts/'+req.params.id,{},req,res,function(data){
        res.json(data);
    });
});
//分配仓库给子账号提交
router.post('/allocSubAccounts/:id', function(req, res, next) {
    const params = {
        list: req.body.list,
        headers:{
            "Content-Type":'application/json'
        }
    };
    backend.post(server+'/supplier/allocSubAccounts/'+req.params.id,params,req,res,function(data){
        res.json(data);
    });
});


/* 进入新增采购后需要加载的一些信息*/
router.get('/pre/create', function(req, res, next) {
    const params = req.query;
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/outwares/pre/create`, params, req, res, function(data) {
        if (data && data.retCode == 0) {
            data.billProdDataTags=data.billProdDataTags.map(item=>{
                item.mappingName='item_'+item.mappingName;
                return item;
            });  // 各单据的自定义字段mappingName与listFields中的字段不不一致
            data.prodDataTags = PropertyFilter.initCustomTags(data.prodDataTags, 'prod_');

            const prodCustomMap = PropertyFilter.dealCustomField(data.prodDataTags);
            const billProdDataTags = DataFilter.dealCustomField(data.billProdDataTags);
            data.listFields = PropertyFilter.dealGoodsTableConfig(data.listFields, prodCustomMap, billProdDataTags);

            res.json(data);
        } else {
            res.json({
                retCode: '1',
                retMsg: "网络异常，请稍后重试！"
            });
        }
    });
});
/* 关键字搜索自动联想 */
router.get('/tips/:key', function(req, res, next) {
    backend.get(server+`/supplier/tips/${req.params.key}`,{},req,res,function(data){
        res.json(data);
    });
});

//出库记录
router.get('/record/for/:recordFor', function(req, res) {
    const session = Session.get(req, res);
    let params = req.query;
    let path;
    if (params.type === 'prods') {
        path = `/pc/v1/${session.userIdEnc}/${req.query.type}/query/output/${req.params.recordFor}`;
        // backend.get(`/pc/v1/${session.userIdEnc}/${req.query.type}/query/buygoods/${req.params.prodNo}`, req.query, req, res, function (data) {
        //     res.json(data)
        // });
    } else if (params.type === 'customer') {
        path = `/pc/v1/${session.userIdEnc}/customers/detail/wareout`;
        params.customerNo = req.params.recordFor;
    } else if (params.type === 'saleOrder') {
        path = `/pc/v1/${session.userIdEnc}/saleorders/detail/wareout`;
        params.saleOrderBillNo = req.params.recordFor;
    }

    backend.get(path, params, req, res, function (data) {
        if (data.retCode=='0') {
            let i = 1;
            data.data && data.data.forEach((item, index) => {
                item.key = item.recId || index ;
                item.serial = i++;
                item.outType = outType[item.outType];
            });
            res.json({
                ...data,
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
    //
    //
    // const session = Session.get(req, res);
    // backend.get(`/pc/v1/${session.userIdEnc}/${req.query.type}/query/output/${req.params.prodNo}`, req.query, req, res, function(data) {
    //     res.json(data)
    // });
});

/*
*审批通过(单条) 后端无法合并
* params: string  userId
*         string  billNo
*         string updatedTime
*/
router.post('/approve/single', function (req, res, next) {
    const session = Session.get(req, res);
    const params = {
        userId: session.userIdEnc,
        billNo: req.body.billNo,
        updatedTime: req.body.updatedTime,
    };
    backend.post(`/pc/v1/${session.userIdEnc}/outwares/approve/${req.body.billNo}`, params, req, res, function (data) {
        res.json(data);
    });
});


/*
*审批通过(多条)
* params: string  userId
*         string  jsonArray
*/
router.post('/approve/list', function (req, res, next) {
    const session = Session.get(req, res);
    const params = {
        userId: session.userIdEnc,
        jsonArray: JSON.stringify(req.body.billNoArray)
    };
    backend.post(`/pc/v1/${session.userIdEnc}/outwares/batchApprove`, params, req, res, function (data) {
        res.json(data);
    });
});


/*
*反审批通过(单条) 后端无法合并
* params: string  userId
*         string  billNo
*/

router.post('/approve/counter/single', function (req, res, next) {
    const session = Session.get(req, res);
    const params = {
        userId: session.userIdEnc,
        billNo: req.body.billNo
    };

    backend.post(`/pc/v1/${session.userIdEnc}/outwares/counter/approve/${req.body.billNo}`, params, req, res, function (data) {
        res.json(data);
    });
});

/*
*反审批通过(多条)
* params: string  userId
*         string  jsonArray
*/
router.post('/approve/counter/list', function (req, res, next) {
    const session = Session.get(req, res);
    const params = {
        userId: session.userIdEnc,
        jsonArray: JSON.stringify(req.body.billNoArray)
    };
    backend.post(`/pc/v1/${session.userIdEnc}/outwares/counter/batchApprove`, params, req, res, function (data) {
        res.json(data);
    });
});

/*
*查看操作日志接口
* params: string  userId
*         string  billNo
*/
router.get('/approve/log/:billNo', function (req, res, next) {
    const session = Session.get(req, res);
    let billNo = req.params.billNo;
    const params = {
        userId: session.userIdEnc,
        billNo
    };
    backend.get(`/pc/v1/${session.userIdEnc}/outwares/log/${billNo}`, params, req, res, function (data) {
        res.json(data);
    });
});



module.exports = router;
