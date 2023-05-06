const express = require('express');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const Constants = require('../../../../lib/constants');
const DataFilter = require('../../../../lib/utils/DataFilter');
const PropertyFilter = require('../../../../lib/utils/PropertyFilter');
const qs = require('querystring');

const inType = {
    0:'node.inventory.in.enterTypeOption1',
    1:'node.inventory.in.enterTypeOption2',
    2:'node.inventory.in.enterTypeOption3',
    3:'node.inventory.in.enterTypeOption4',
    4:'node.inventory.in.enterTypeOption5',
    5:'node.inventory.in.enterTypeOption6',
    6:'node.inventory.in.enterTypeOption7',
    7:'node.inventory.in.enterTypeOption8',
    8:'node.inventory.in.enterTypeOption9',
};

const contactNameKey = {
    0:'supplierContacterName',
    1:'otherEnterWarehouseContacterName',
    2:'usePerson',
    3:'customerContacterName',
    4:'usePerson',
    5:'otherEnterWarehouseContacterName',
    8:'supplierContacterName'
};
const useDepartmentKey = {
    0:'supplierName',
    1:'otherEnterWarehouseName',
    2:'useDepartment',
    3:'customerName',
    4:'useDepartment',
    5:'otherEnterWarehouseName',
    7:'otherEnterWarehouseName',
    8:'supplierName'
};

const contactPhoneKey = {
    0:'supplierMobile',
    1:'usePerson',
    2:'usePerson',
    3:'customerTelNo',
    4:'usePerson',
    5:'usePerson',
    8:'supplierMobile'
};


const map = {

    displayBillNo:{
        label:"node.inventory.in.displayBillNo",
    },
    enterDate:{
        label:"node.inventory.in.enterDate",
    },
    enterType:{
        label:"node.inventory.in.enterType",
    },
    otherEnterWarehouseName:{
        label:"node.inventory.in.otherEnterWarehouseName",
    },
    prodAbstract:{
        label:"node.inventory.in.prodAbstract"
    },
    taxAllAmount: {
        label: "node.inventory.in.taxAllAmount",
    },
    discountAmount: {
        label: "node.inventory.in.discountAmount",
    },
    aggregateAmount: {
        label: "node.inventory.in.aggregateAmount",
    },
    remarks:{
        label:"node.inventory.in.remarks"
    },
    warehouseName:{
        label:"node.inventory.in.warehouseName"
    },
    projectName:{
        label:"node.inventory.in.projectName",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        type: 'project'
    },
    customerContacterName:{
        label:"node.inventory.in.customerContacterName",
        width: Constants.TABLE_COL_WIDTH.PERSON
    },
    customerTelNo:{
        label:"node.inventory.in.customerTelNo",
        width: Constants.TABLE_COL_WIDTH.TEL
    },
    ourContacterName:{
        label:"node.inventory.in.ourContacterName",
        width: Constants.TABLE_COL_WIDTH.PERSON
    },
    purchaseBillNo: {
        label:"node.inventory.in.purchaseBillNo",
        width:'200',
        type:'input',
        placeholder:'采购订单号'
    },
    saleBillNo:{
        label:"node.inventory.out.saleBillNo",
        width:'200',
        type:'input',
        placeholder:'上游订单'
    },
    contacterName: {
        label:"node.inventory.in.customerContacterName",
        width: '200',
        type:'input',
        placeholder:'联系人'
    },
    property_value:{
        label:"node.inventory.in.property_value",
        width:'200',
        type:'custom'
    },
    approveStatus: {  // 审批状态 0 未通过  1 通过  2 反驳  3 审批中
        label: "components.approve.approveStatus",
        width: '200',
        type: 'select',
        options: [
            {label: "components.approve.approveStatus_0", value: "0"},
            {label: "components.approve.approveStatus_3", value: "3"},
            {label: "components.approve.approveStatus_2", value: "2"},
            {label: "components.approve.approveStatus_1", value: "1"}
        ]
    },
    assignee:{
        label: "node.purchase.assignee",
        width: '200',
        type: 'select',
        options: [
            {label: "node.purchase.assigneeOption", value: "1"}
        ]
    },
    approvePerson: {
        label: "components.approve.approvePerson",
        width: '200',
        type: 'select',
        options: [
            {label: "components.approve.approvePerson_0", value: "0"},
            {label: "components.approve.approvePerson_1", value: "1"}
        ]
    },
    ourContacterName: {
        label: "node.inventory.in.ourContacterName",
        type: 'depEmployee'
    }
};

function dealFilterConfig(list,warehouses,customMap,invisibleGroup){
    let arr = list && list.map(function(item) {
        let config = map[item.columnName];
        config.fieldName = item.columnName;
        config.visibleFlag = item.visibleFlag;
        config.originVisibleFlag = item.visibleFlag;
        config.recId = item.recId;
        config.displayFlag = false;
        if (config.fieldName === "property_value") {
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
            label:"node.inventory.in.enterType",
            fieldName:'enterType',
            visibleFlag:true,
            cannotEdit:true,
            type:'select',
            options:[
                {label:'node.inventory.in.enterTypeOption1',value:'0'},
                {label:'node.inventory.in.enterTypeOption2',value:'1'},
                {label:'node.inventory.in.enterTypeOption3',value:'2'},
                {label:'node.inventory.in.enterTypeOption4',value:'3'},
                {label:'node.inventory.in.enterTypeOption5',value:'4'},
                {label:'node.inventory.in.enterTypeOption6',value:'5'},
                {label:'node.inventory.in.enterTypeOption7',value:'6'},
                {label:'node.inventory.in.enterTypeOption8',value:'7'},
                {label:'node.inventory.in.enterTypeOption9',value:'8'}
            ],
        },{
            label:"node.inventory.in.warehouseName",
            fieldName:'warehouseName',
            visibleFlag:true,
            cannotEdit:true,
            type:'select',
            options:warehouseNames,
        },{
            label:"node.inventory.in.enterDate",
            fieldName:'enterDate',
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
                recId:item.recId,
                visibleFlag: item.visibleFlag,
                originVisibleFlag: item.visibleFlag,
                cannotEdit:item.cannotEdit||null,
                displayFlag: item.displayFlag||null
            });
        }
    });
    if(initFlag){
        let unEditColumns = [{
            fieldName:'displayBillNo',
            label:"node.inventory.in.displayBillNo",
            visibleFlag:1,
            cannotEdit:true,
            width: Constants.TABLE_COL_WIDTH.NO
        },{
            fieldName:'enterDate',
            label:'node.inventory.in.enterDate',
            visibleFlag:1,
            cannotEdit:true,
            width: Constants.TABLE_COL_WIDTH.DATE
        },{
            fieldName:'enterType',
            label:'node.inventory.in.enterType',
            visibleFlag:1,
            cannotEdit:true,
            width: Constants.TABLE_COL_WIDTH.BOUND_TYPE
        },{
            fieldName:'otherEnterWarehouseName',
            label:'node.inventory.in.otherEnterWarehouseName',
            visibleFlag:1,
            cannotEdit:true,
            width: Constants.TABLE_COL_WIDTH.TEL
        }];
        return unEditColumns.concat(newList);
    }

    return newList;
}


/* 获取入库单列表统计信息 */
router.get('/listStatistics', function(req, res, next) {
    backend.get(`/supplier/listStatistics`,{},req,res,function(data){
        res.json(data);
    });
});

/* 入库单列表. */
router.get('/list', function(req, res, next) {
    const params = req.query;
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page?params.page: 1;
    const session = Session.get(req,res);

    backend.post(`/pc/v1/${session.userIdEnc}/enterwares/list`,params,req,res,function(data){
        if(data && data.retCode==0){
            console.log(data);
            let customMap = DataFilter.dealCustomField(data.tags);
            let list = data.data;
            let i = 1;
            list.forEach(function(item){
                item.key = item.billNo;
                item.serial = i++;
                item.customerContacterName = item[contactNameKey[item.enterType]];
                item.otherEnterWarehouseName = item[useDepartmentKey[item.enterType]];
                item.customerTelNo = item[contactPhoneKey[item.enterType]];
                item.enterType = inType[item.enterType];
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


/*删除入库单*/
router.post('/delete', function(req, res, next) {
    const params = {
        vo1:req.body.ids
    };
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.delete(`/pc/v1/${session.userIdEnc}/enterwares?jsonArray=${JSON.stringify(req.body.ids)}`,params,req,res,function(data){
        res.json(data);
    });
});

/* 获取入库单详情 */
router.get('/detail/:code/:type', function(req, res, next) {
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/enterwares/${req.params.code}/`,{},req,res,function(data){
        if(data && data.retCode==0){
            console.log(data);
            let list = data.data;
            let flowState = data.flowState;
            let approveTask = data.approveTask;
            if(req.params.type === 'show'){
                list.customerContacterName = list[contactNameKey[list.enterType]];
                list.customerTelNo = list[contactPhoneKey[list.enterType]];
                list.enterTypeName = inType[list.enterType];
                list.isCreator = data.isCreator;
                list.isAssignee = (data.approveTask?true:false);
                list.approveCancel = data.approveCancel;
            }

            data.billProdDataTags=data.billProdDataTags.map(item=>{
                item.mappingName='item_'+item.mappingName;
                return item;
            });  // 各单据的自定义字段mappingName与listFields中的字段不不一致
            data.prodDataTags = PropertyFilter.initCustomTags(data.prodDataTags, 'prod_');

            const prodCustomMap = PropertyFilter.dealCustomField(data.prodDataTags);
            const billProdDataTags = DataFilter.dealCustomField(data.billProdDataTags);
            data.listFields = PropertyFilter.dealGoodsTableConfig(data.listFields, prodCustomMap, billProdDataTags);

            if(list && list.prodList){
                list.prodList = DataFilter.dealExtraCustomField(list.prodList);
                list.prodList = PropertyFilter.dealProdCustomField({list: list.prodList, prefix: 'prod_', propertyKey: 'prodPropertyValues'});
            }

            res.json({
                retCode:0,
                data: list,
                tags: data.tags,
                prodDataTags: data.prodDataTags,
                flowState: flowState && flowState,
                approveTask: approveTask && approveTask,
                listFields: data.listFields,
                approveFlag: data.approveFlag||0,
                approveModuleFlag: data.approveModuleFlag
            });
        }else{
            res.json({
                retCode:1,
                retMsg: data.retMsg
            });
        }
    });
});
/* 设置隐藏显示 */
router.post('/disable/:code', function(req, res, next) {
    let option = req.body.disableFlag?'enable':'disable';
    const session = Session.get(req,res);
    backend.post(`/pc/v1/${session.userIdEnc}/enterwares/${option}/${req.params.code}`,{},req,res,function(data){
        res.json(data);
    });
});


//根据单号获取物品概要的总类
router.get('/listEnter', function (req, res) {
    const session = Session.get(req, res);
    const params = {};
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.userId = session.userIdEnc;
    params.enterWarehouseCode = req.query.billNo;
    backend.get(`/pc/v1/${session.userIdEnc}/enterwares/listEnter`, params, req, res, function (data) {
        res.json(data)
    });
});

/* 新增入库单 */
router.post('/insert', function(req, res, next) {
    const params = req.body;
    //处理最后的产品列表
    params.headers = {
        "Content-Type":'application/json'
    };

    const session = Session.get(req,res);
    backend.post(`/pc/v1/${session.userIdEnc}/enterwares/`,params,req,res,function(data){
        res.json(data);
    });
});
/* 修改入库单 */
router.post('/modify', function(req, res, next) {
    const params = req.body;
    const session = Session.get(req,res);
    params.headers = {
        "Content-Type":'application/json'
    };
    backend.put(`/pc/v1/${session.userIdEnc}/enterwares/${req.body.billNo}/`,params,req,res,function(data){
        res.json(data);
    });
});

router.get('/isExistName/:name', function(req, res, next) {
    const params = {};
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/enterwares/isExistName/${req.params.name}?code=${req.query.code}`,params,req,res,function(data){
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
    backend.post(`/pc/v1/account/check/?${query}`,params,req,res,function(data){
        res.json(data);
    });
});

//分配仓库给子账号获取
router.get('/subAccounts/:id', function(req, res, next) {
    backend.get('/supplier/subAccounts/'+req.params.id,{},req,res,function(data){
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
    backend.post('/supplier/allocSubAccounts/'+req.params.id,params,req,res,function(data){
        res.json(data);
    });
});


/* 进入新增采购后需要加载的一些信息*/
router.get('/pre/create', function(req, res, next) {
    const params = req.query;
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/enterwares/pre/create`, params, req, res, function(data) {
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
    backend.get(`/supplier/tips/${req.params.key}`,{},req,res,function(data){
        res.json(data);
    });
});

//入库记录
router.get('/record/for/:recordFor', function(req, res) {
    const session = Session.get(req, res);
    let params = req.query;
    let path;
    if (params.type === 'prods') {
        path = `/pc/v1/${session.userIdEnc}/${req.query.type}/query/input/${req.params.recordFor}`;
        // backend.get(`/pc/v1/${session.userIdEnc}/${req.query.type}/query/buygoods/${req.params.prodNo}`, req.query, req, res, function (data) {
        //     res.json(data)
        // });
    } else if (params.type === 'supplier') {
        path = `/pc/v1/${session.userIdEnc}/suppliers/detail/wareenter`;
        params.supplierNo = req.params.recordFor;
    } else {
        path = `/pc/v1/${session.userIdEnc}/purchases/detail/wareenter`;
        params.purchaseOrderBillNo = req.params.recordFor;
    }

    backend.get(path, params, req, res, function (data) {
        if (data.retCode=='0') {
            let i = 1;
            data.data && data.data.forEach((item, index) => {
                item.key = item.recId || index ;
                item.serial = i++;
                item.enterType = inType[item.enterType];
            });

            // list.forEach(function(item){
            //     item.key = item.id;
            //     item.serial = i++;
            //     item.customerContacterName = item[contactNameKey[item.enterType]];
            //     item.otherEnterWarehouseName = item[useDepartmentKey[item.enterType]];
            //     item.customerTelNo = item[contactPhoneKey[item.enterType]];
            //     item.enterType = inType[item.enterType];
            // });

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

    // const session = Session.get(req, res);
    // backend.get(`/pc/v1/${session.userIdEnc}/${req.query.type}/query/input/${req.params.prodNo}`, req.query, req, res, function(data) {
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
    backend.post(`/pc/v1/${session.userIdEnc}/storage/approve/${req.body.billNo}`, params, req, res, function (data) {
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
    backend.post(`/pc/v1/${session.userIdEnc}/storage/approve/list`, params, req, res, function (data) {
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

    backend.post(`/pc/v1/${session.userIdEnc}/storage/approve/counter/${req.body.billNo}`, params, req, res, function (data) {
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
    backend.post(`/pc/v1/${session.userIdEnc}/storage/approve/counter/list`, params, req, res, function (data) {
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
    backend.get(`/pc/v1/${session.userIdEnc}/storage/approve/log/${billNo}`, params, req, res, function (data) {
        res.json(data);
    });
});


module.exports = router;
