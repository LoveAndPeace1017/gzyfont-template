const express = require('express');
const router = express.Router();
const backend = require('../../../lib/backend');
const Session = require('../../../lib/session');
const Constants = require('../../../lib/constants');
const DataFilter = require('../../../lib/utils/DataFilter');
const Decimal = require('../../../lib/utils/Decimal');


const map = {
    billNo: {
        label: "node.productControl.billNo",
        width: Constants.TABLE_COL_WIDTH.NO,
    },
    processList: {
        label: "node.productControl.process",
        width: Constants.TABLE_COL_WIDTH.PROCESS,
    },
    sheetName: {
        label: "node.productControl.sheetName",
        width: Constants.TABLE_COL_WIDTH.NO,
    },
    prodName: {
        label: "node.productControl.prodName",
        width: Constants.TABLE_COL_WIDTH.NO,
    },
    descItem: {
        label: "node.productControl.descItem",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
    },
    expectCount: {
        label: "node.productControl.expectCount",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
    },
    finishCount: {
        label: "node.productControl.finishCount",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
    },
    scrapCount: {
        label: "node.productControl.scrapCount",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
    },
    yieldRate: {
        label: "node.productControl.yieldRate",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
    },
    expectStartDate: {
        label: "node.productControl.expectStartDate",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
    },
    expectEndDate: {
        label: "node.productControl.expectEndDate",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
    },
    actualStartDate: {
        label: "node.productControl.actualStartDate",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
    },
    actualEndDate: {
        label: "node.productControl.actualEndDate",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
    },
    officerName: {
        label: "node.productControl.officerName",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
    },
    sheetStatus: {
        label: "node.productControl.sheetStatus",
        width: Constants.TABLE_COL_WIDTH.DEFAULT
    }
};

function dealTableConfig(list, customMap, invisibleGroup) {
    let newList = [];
    // 初始阶段数据库中没有不可配置字段
    let billNoFlag = true, processFlag = true;
    list.forEach(function (item) {
        if(item.columnName==='billNo'){
            billNoFlag = false;
        }
        if(item.columnName==='processList'){
            processFlag = false
        }
        if(invisibleGroup.indexOf(item.columnName) !== -1){
            item.visibleFlag = false;
            item.displayFlag = true;
        }
        let obj = map[item.columnName];
        obj = obj || customMap[item.columnName];
        if (obj) {
            newList.push({
                fieldName: item.columnName,
                label: obj.label,
                recId: item.recId,
                visibleFlag: item.visibleFlag,
                originVisibleFlag: item.visibleFlag,
                width: item.columnWidth||obj.width,
                cannotEdit:item.cannotEdit||null,
                displayFlag: item.displayFlag||null
            });
        }
    });
    if(processFlag){
        newList.splice(3, 0, {
            label: "node.productControl.process",
            fieldName: 'processList',
            visibleFlag: true,
            cannotEdit: true,
            width: Constants.TABLE_COL_WIDTH.PROCESS
        });
    }
    if(billNoFlag){
        newList.splice(0, 0, {
            label: "node.productControl.billNo",
            fieldName: 'billNo',
            visibleFlag: true,
            cannotEdit: true,
            width: Constants.TABLE_COL_WIDTH.NO,
        });
    }
    return newList;
}

let processGraphMap = {   // 工序状态：0下达，1开工，2完成，3关闭
    0: {contentBg: '#f0f0f0', contentColor: '#666', titleColor: '#222', status: '下达'},
    1: {contentBg: '#3087EC', contentColor: '#fff', titleColor: '#222', status: '开工'},
    2: {contentBg: '#41cb86', contentColor: '#fff', titleColor: '#222', status: '完成'},
    3: {contentBg: '#dcdcdc', contentColor: '#b7b7b7', titleColor: '#999', status: '关闭'}
};

function dealProcessList(processList) {
    return processList.map(item => {
        let {contentBg, contentColor, titleColor, status} = processGraphMap[item.processStatus];
        item.graph = {
            content:{
                text: item.completProgress + '%',
                style: {
                    background: contentBg,
                    color: contentColor
                }
            },
            title: {
                text: item.processName,
                style: {
                    color: titleColor
                }
            },
            hoverContent: [
                {label: '工序', value: item.processName},
                {label: '状态', value: status , tip: item.processCondition},
                {label: '良品/计划', value: `${item.finishCount || 0}/${item.expectCount || 0}`},
            ]
        };
        if(item.processStatus === 2) {
            item.graph.content.text = '✔';
        }
        return item;
    })
}

/* 工单列表. */
router.get('/list', function (req, res, next) {
    const params = req.query;
    params.perPage = params.perPage ? parseInt(params.perPage) : Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req, res);
    let chartFlag = params.chartFlag;
    let url = `/cgi/${session.userIdEnc}/worksheet/list`;
    backend.post(url, params, req, res, function (data) {
        console.log("productControl:", JSON.stringify(data));
        if (data && data.retCode == 0) {
            let customMap = DataFilter.dealCustomField(data.tags);
            let list = data.data;
            let i = 1;
            list.forEach(function (item) {
                item.key = item.billNo;
                item.serial = i++;
                [1,2,3,4,5].forEach((index)=>{
                    item['property_value'+index] = item.propertyValues ? item.propertyValues['property_value'+index] : '';
                });
                if(chartFlag && item.actualStartDate && !item.actualEndDate){
                    item.actualEndDate = new Date().getTime();
                }
                if(item.processList){
                    item.processList = dealProcessList(item.processList);
                }
            });
            let invisibleGroup = [];
            let tableConfigList = dealTableConfig(data.listFields, customMap, invisibleGroup);
            res.json({
                retCode: 0,
                list: list,
                tableConfigList: tableConfigList,
                pagination: {
                    total: data.count,
                    current: params.page,
                    pageSize: params.perPage
                }
            });
        } else {
            res.json({
                retCode: data.retCode || '1',
                retMsg: data.retMsg || "网络异常，请稍后重试！"
            });
        }
    });
});

/*删除工单*/
router.post('/delete', function (req, res) {
    const params = {
        array: req.body.ids
    };
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.delete(`/cgi/${session.userIdEnc}/worksheet`, params, req, res, function (data) {
        res.json(data);
    });
});

/* 进入新增工单后需要加载的一些信息*/
router.get('/pre/create', function (req, res, next) {
    const params = req.query;
    const session = Session.get(req, res);
    backend.get(`/cgi/${session.userIdEnc}/worksheet/pre/create`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            res.json(data);
        } else {
            res.json({
                retCode: '1',
                retMsg: "网络异常，请稍后重试！"
            });
        }
    });
});

/* 新增工单 */
router.post('/add', function (req, res, next) {
    const params = req.body;
    // const userId = 'nEoAUdKFbkYs';
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/cgi/${session.userIdEnc}/worksheet`, params, req, res, function (data) {
        res.json(data);
    });
});

//根据bomCode获取工序列表
router.post('/process/bomcode', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/cgi/${session.userIdEnc}/worksheet/process/prod/bomcode`, params, req, res, function (data) {
        res.json(data);
    });
});

/* 修改工单 */
router.post('/modify/:billNo', function (req, res, next) {
    const params = req.body;
    // const userId = 'nEoAUdKFbkYs';
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.put(`/cgi/${session.userIdEnc}/worksheet/${req.params.billNo}`, params, req, res, function (data) {
        res.json(data);
    });
});

//工单详情页
router.get('/detail/:id', function (req, res) {
    const session = Session.get(req, res);
    backend.get(`/cgi/${session.userIdEnc}/worksheet/${req.params.id}`, req, res, function (data) {
        if (data && data.retCode == 0) {
            data.listFields = data.listFields.map(function (item) {
                let label = processMap[item.columnName].label;
                if (label) {
                    return {
                        ...item,
                        label
                    };
                }
                return item
            });
            res.json(data);
        } else {
            res.json({
                retCode: '1',
                retMsg: data.retMsg || "网络异常，请稍后重试！"
            });
        }
    });
});


/**
 *   工单操作功能
 *   sheetStatus": 1,   //1上线，2完成，3关闭，0重启
 *  "billNo": "PGD-20210812-0002",
 *  "finishCount": 100,  //完成时必填
 *  "scrapCount": 12     //完成时必填
 */
router.post('/worksheet/operate', function (req, res, next) {
    const session = Session.get(req, res);
    let uri = `/cgi/${session.userIdEnc}/worksheet/operate`;
    let params = req.body;

    params.headers = {
        "Content-Type": 'application/json'
    };
    backend.put(uri, params, req, res, function (data) {
        res.json(data);
    });
});

/**
 *   工序操作功能
 *   "processStatus": 1,    //1开工，3关闭，0重启
 *   "billNo": "PGD-20210812-0002",
 *   "id": 2                //工序ID
 */
router.post('/worksheet/process/operate', function (req, res, next) {
    const session = Session.get(req, res);
    let uri = `/cgi/${session.userIdEnc}/worksheet/process/operate`;
    let params = req.body;

    params.headers = {
        "Content-Type": 'application/json'
    };
    backend.put(uri, params, req, res, function (data) {
        res.json(data);
    });
});

// 新建报工记录
router.post('/worksheet/report/add', function (req, res, next) {
    let params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    let uri = `/cgi/${session.userIdEnc}/worksheet/report?onlyReport=${params.onlyReport}`;
    if(params.onlyReport === 0) uri = `${uri}&finish=${params.finish}`;
    delete params.onlyReport;
    delete params.finish;
    backend.post(uri, params, req, res, function (data) {
        res.json(data);
    });
});

/*删除报工记录*/
router.post('/worksheet/report/delete', function (req, res) {
    const params = {
        array: req.body.array
    };
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.delete(`/cgi/${session.userIdEnc}/worksheet/report`, params, req, res, function (data) {
        res.json(data);
    });
});

// 报工记录列表
router.get('/worksheet/report/:billNo', function (req, res) {
    const params = req.query;
    params.perPage = params.perPage ? parseInt(params.perPage) : Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req,res);
    let billNo = req.params.billNo;
    backend.get(`/cgi/${session.userIdEnc}/worksheet/report/${billNo}`,params, req,res,function(data){
        if (data && data.retCode == 0) {
            res.json({
                retCode: 0,
                list: data.data,
                pagination: {
                    total: data.count,
                    current: params.page,
                    pageSize: params.perPage
                }
            });
        } else {
            res.json({
                retCode: data.retCode || '1',
                retMsg: data.retMsg || "网络异常，请稍后重试！"
            });
        }
    });
});

// 操作日志
router.get('/log/:billNo', function (req, res, next) {
    const session = Session.get(req, res);
    let billNo = req.params.billNo;
    backend.get(`/cgi/${session.userIdEnc}/worksheet/log/${billNo}`, {}, req, res, function (data) {
        res.json(data);
    });
});

// 工序列表 联想功能
router.get('/search/by/field', function (req, res) {
    const session = Session.get(req, res);
    const params = {
        ...req.query,
        key: encodeURIComponent(req.query.key)
    };
    backend.get(`/pc/v1/${session.userIdEnc}/workprocess/search/tips`, params, req, res, function (data) {
        res.json(data)
    });
});

// 工序
const processMap = {
    billNo: {
        label: "node.productControl.billNo",
        width: Constants.TABLE_COL_WIDTH.NO,
    },
    sheetName: {
        label: "node.productControl.sheetName",
        width: Constants.TABLE_COL_WIDTH.NO,
    },
    processCode: {
        label: "node.productControl.processCode",
        width: Constants.TABLE_COL_WIDTH.NO,
    },
    processName: {
        label: "node.productControl.processName",
        width: Constants.TABLE_COL_WIDTH.NO,
    },
    processStatus: {
        label: "node.productControl.processStatus",
        width: Constants.TABLE_COL_WIDTH.ACCEPT_STATUS
    },
    expectCount: {
        label: "node.productControl.expectCount",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        columnType: 'decimal-quantity'
    },
    reportCount: {
        label: "node.productControl.reportCount",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        columnType: 'decimal-quantity'
    },
    finishCount: {
        label: "node.productControl.finishCount",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        columnType: 'decimal-quantity'
    },
    scrapCount: {
        label: "node.productControl.scrapCount",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        columnType: 'decimal-quantity'
    },
    yieldRate: {
        label: "node.productControl.yieldRate",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
    },
    expectStartDate: {
        label: "node.productControl.expectStartDate",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
    },
    expectEndDate: {
        label: "node.productControl.expectEndDate",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
    },
    actualStartDate: {
        label: "node.productControl.actualStartDate",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
    },
    actualEndDate: {
        label: "node.productControl.actualEndDate",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
    },
    caName: {
        label: "node.productControl.caName",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
    },
    officerName: {
        label: "node.productControl.officerName",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
    },
    remarks:{
        label: "node.productControl.remarks",
        width: Constants.TABLE_COL_WIDTH.DEFAULT
    }
};

function dealProcessTableConfig(list, customMap, invisibleGroup) {
    let newList = [];
    // 初始阶段数据库中没有不可配置字段
    let initFlag = true;
    list.forEach(function (item) {
        if(item.columnName=='billNo'){
            initFlag = false;
        }
        if(invisibleGroup.indexOf(item.columnName) !== -1){
            item.visibleFlag = false;
            item.displayFlag = true;
        }
        let obj = processMap[item.columnName];
        obj = obj || customMap[item.columnName];
        if (obj) {
            newList.push({
                fieldName: item.columnName,
                label: obj.label,
                recId: item.recId,
                columnType: obj.columnType,
                visibleFlag: item.visibleFlag,
                originVisibleFlag: item.visibleFlag,
                width: item.columnWidth||obj.width,
                cannotEdit:item.cannotEdit||null,
                displayFlag: item.displayFlag||null
            });
        }
    });

    if(initFlag){
        const fixedColumns = [{
            fieldName: 'billNo',
            label: 'node.productControl.billNo',
            visibleFlag: 1,
            width: Constants.TABLE_COL_WIDTH.NO,
            cannotEdit: true
        },{
            fieldName: 'sheetName',
            label: "node.productControl.sheetName",
            visibleFlag: 1,
            width: Constants.TABLE_COL_WIDTH.NO,
            cannotEdit: true,
        }, {
            fieldName: 'processCode',
            label: "node.productControl.processCode",
            visibleFlag: 1,
            width: Constants.TABLE_COL_WIDTH.NO,
            cannotEdit: true,
        }, {
            fieldName: 'processName',
            label: "node.productControl.processName",
            visibleFlag: 1,
            width: Constants.TABLE_COL_WIDTH.NO,
            cannotEdit: true,
        }, {
            fieldName: 'processStatus',
            label: 'node.productControl.processStatus',
            visibleFlag: 1,
            cannotEdit: true,
            width: Constants.TABLE_COL_WIDTH.ACCEPT_STATUS
        }];
        newList = fixedColumns.concat(newList);
    }
    return newList;
}

/* 工序列表. */
router.get('/process/list', function (req, res, next) {
    const params = req.query;
    params.perPage = params.perPage ? parseInt(params.perPage) : Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req, res);

    let url = `/cgi/${session.userIdEnc}/worksheet/process/list`;
    backend.post(url, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum} = req.cookies;
            let list = data.data;
            let i = 1;
            list.forEach(function (item) {
                item.key = item.id;
                item.serial = i++;
                item.expectCount = Decimal.fixedDecimal(item.expectCount, quantityDecimalNum);
                item.finishCount = Decimal.fixedDecimal(item.finishCount, quantityDecimalNum);
                item.scrapCount = Decimal.fixedDecimal(item.scrapCount, quantityDecimalNum);
            });
            let invisibleGroup = [];
            let tableConfigList = dealProcessTableConfig(data.listFields, {}, invisibleGroup);
            res.json({
                retCode: 0,
                list: list,
                tableConfigList: tableConfigList,
                pagination: {
                    total: data.count,
                    current: params.page,
                    pageSize: params.perPage
                }
            });
        } else {
            res.json({
                retCode: data.retCode || '1',
                retMsg: data.retMsg || "网络异常，请稍后重试！"
            });
        }
    });
});

//Mrp运算模块
//根据销售订单获取列表数据
router.post('/getNextBom', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/cgi/${session.userIdEnc}/mrp/pre/create`, params, req, res, function (data) {
        res.json(data);
    });
});

//根据bom编号获取子级bom数据
router.post('/getBomChildren', function(req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.get(`/cgi/${session.userIdEnc}/mrp/bom`, params, req, res, function (data) {
        res.json(data);
    });
});

//新增Mrp信息
router.post('/addMrp', function(req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/cgi/${session.userIdEnc}/mrp`, params, req, res, function (data) {
        res.json(data);
    });
});

/* 进入新增Mrp信息需要加载的一些信息*/
router.get('/mrp/pre/create', function(req, res, next) {
    const params = req.query;
    const session = Session.get(req, res);
    params.headers = {
        "Content-Type": 'application/json'
    };
    backend.get(`/cgi/${session.userIdEnc}/mrp/pre/create`, params, req, res, function(data) {
        if (data && data.retCode == 0) {
            res.json(data);
        } else {
            res.json({
                retCode: '1',
                retMsg: "网络异常，请稍后重试！"
            });
        }
    });
});

/* Mrp运算列表. */
router.get('/mrp/list', function(req, res, next) {
    const params = {
        ...req.query
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page?params.page:1;
    const session = Session.get(req,res);
    backend.post(`/cgi/${session.userIdEnc}/mrp/list`,params,req,res,function(data){
        if(data && data.retCode==0){
            let list = data.data;
            let i = 1;
            list.forEach(function(item){
                item.serial = i++;
                item.key = item.billNo;
            });
            //没有可以配置的直接写死
            let tableConfigList = [{
                cannotEdit: true,
                fieldName: "addedTime",
                label: "node.supplier.addedTime",
                visibleFlag: 1,
                width: 170
            },{
                cannotEdit: true,
                fieldName: "billNo",
                label: "node.supplier.billNo",
                visibleFlag: 1,
                width: 170
            },{
                cannotEdit: true,
                fieldName: "prodList",
                label: "node.supplier.prodList",
                visibleFlag: 1,
                width: 170
            },{
                cannotEdit: true,
                fieldName: "mrpStatus",
                label: "node.supplier.mrpStatus",
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

//删除Mrp计算列表
router.post('/mrp/delete', function(req, res, next) {
    const params = {
        array:req.body.ids
    };
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.delete(`/cgi/${session.userIdEnc}/mrp`,params,req,res,function(data){
        res.json(data);
    });

});


//Mrp详情页
router.post('/mrp/detail', function(req, res, next) {
    const params =  req.body;
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    let billNo = params.billNo;
    let mrpType = params.mrpType;
    let url = '';
    if(mrpType === 'simulatedProduction'){
        url = `/cgi/${session.userIdEnc}/mrp/${billNo}`;
    }else if(mrpType === 'purchaseProposal'){
        url = `/cgi/${session.userIdEnc}/mrp/purchase/suggest/${billNo}`;
    }else if(mrpType === 'productionSuggest'){
        url = `/cgi/${session.userIdEnc}/mrp/produce/suggest/${billNo}`;
    }else if(mrpType === 'purchaseRecord'){
        url = `/cgi/${session.userIdEnc}/mrp/purchase/order/${billNo}`;
    }else if(mrpType === 'productionRecord'){
        url = `/cgi/${session.userIdEnc}/mrp/produce/order/${billNo}`;
    }
    backend.get(url,params,req,res,function(data){
        res.json(data);
    });
});

//质检提交
router.post('/quality', function (req, res, next) {
    const params = req.body;
    // const userId = 'nEoAUdKFbkYs';
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.put(`/cgi/${session.userIdEnc}/worksheet/report/quality?finish=${params.type}`, params, req, res, function (data) {
        res.json(data);
    });
});

// 发送短信提醒
router.post('/sms_notify', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post (`/pc/v1/${session.userIdEnc}/sms_notify/worksheet/${params.billNo}?spId=${params.id}`, params, req, res, function (data) {
        res.json(data);
    });
});



module.exports = router;
