const express = require('express');
const router = express.Router();
const Session = require('../../../lib/session');
const backend = require('../../../lib/backend');
const Constants = require('../../../lib/constants');

//////////////////
// 收入记录相关 begin
///////////////////
const incomeMap = {
    billNo: {
        label: "node.finance.billNo"
    },
    paymentDate: {
        label: "node.finance.paymentDate2",
        fieldName: 'paymentDate',
        width: Constants.TABLE_COL_WIDTH.DATE,
        visibleFlag: 1,
        type: 'datePicker'
    },
    amount: {
        label: "node.finance.amount"
    },
    customerName: {
        label: "node.finance.customerName"
    },
    typeName: {
        label: "node.finance.typeName",
        width: Constants.TABLE_COL_WIDTH.INCOME_TYPE,
        type: 'select'
    },
    accountName: {
        label: "node.finance.accountName",
        width: Constants.TABLE_COL_WIDTH.FUND_ACCOUNT,
        type: 'select'
    },
    // fkBillNo: {
    //     label: "上游订单"
    // },

    remarks: {
        label: "node.finance.remarks"
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
    currencyName:{
        label: 'node.sale.currencyName',
        width: Constants.TABLE_COL_WIDTH.NO,
    },
    currencyAmount:{
        label: 'node.sale.currencyAggregateAmount',
        width: Constants.TABLE_COL_WIDTH.NO,
    },
    currencyId: {
        label: "node.sale.currencyName",
        width: '200',
        type: 'currency'
    },
    ourContacterName: {
        label: "node.sale.ourContacterName1",
        width: '200',
        type: 'depEmployee'
    }
};

function dealIncomeFilterConfig(list,invisibleGroup) {
    let arr = (list && list.map(function (item) {
        let config = incomeMap[item.columnName];
        config.fieldName = item.columnName;
        config.visibleFlag = item.visibleFlag;
        config.originVisibleFlag = item.visibleFlag;
        config.recId = item.recId;
        if(invisibleGroup.indexOf(item.columnName) !== -1){
            config.displayFlag = true;
            config.visibleFlag = false;
        }
        return config
    })) || [];

    return arr//.concat(incomeMap['paymentDate']);
}

function dealIncomeTableConfig(list,invisibleGroup) {
    let newList = [];
    let initFlag = list.length==5;
    let billNoItem = {};
    list.forEach(function (item) {
        let obj = incomeMap[item.columnName];
        if (obj) {
            if(invisibleGroup.indexOf(item.columnName) !== -1){
                item.displayFlag = true;
                item.visibleFlag = false;
                item.cannotEdit = true;
            }
            let tempItem = {
                recId: item.recId,
                fieldName: item.columnName,
                label: obj.label,
                visibleFlag: item.visibleFlag,
                originVisibleFlag: item.visibleFlag,
                width: item.columnWidth||obj.width||Constants.TABLE_COL_WIDTH.DEFAULT,
                cannotEdit:item.cannotEdit||null
            };
            if(item.columnName === 'billNo'&&!initFlag){
                billNoItem = tempItem;
                return;
            }
            newList.push(tempItem);
            if (item.columnName === 'billNo'&&initFlag) {
                newList.push({
                    fieldName: 'paymentDate',
                    label: 'node.finance.paymentDate',
                    width: Constants.TABLE_COL_WIDTH.DATE,
                    visibleFlag: 1,
                    cannotEdit: true,
                });
                newList.push({
                    fieldName: 'amount',
                    label: 'node.finance.amount',
                    width: Constants.TABLE_COL_WIDTH.FUND_ACCOUNT,
                    visibleFlag: 1,
                    cannotEdit: true
                })
            }
        }
    });
    if(!initFlag){
        newList.unshift(billNoItem);
    }
    return newList;
}

//收入记录
router.get('/income/record', function (req, res) {
    const session = Session.get(req, res);
    const params = req.query;
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page || 1;
    let path;
    if (params.type === 'customer') {
        params.customerName = encodeURIComponent(params.recordFor);
        path = `/pc/v1/${session.userIdEnc}/customers/detail/salepayment`;
    } else if (params.type === 'saleOrder') {
        params.saleOrderBillNo = encodeURIComponent(params.recordFor);
        path = `/pc/v1/${session.userIdEnc}/saleorders/detail/salepayment`;
    }
    delete params.recordFor;

    backend.get(path, params, req, res, function (data) {
        if (data.retCode == '0') {
            let i = 1;
            data.data && data.data.forEach((item, index) => {
                item.key = item.id || index;
                item.serial = i++;
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
});

//收入列表
router.get('/income/list', function (req, res) {
    const params = req.query;
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page || 1;
    const remoteUrl = `/pc/v1/${Session.get(req, res).userIdEnc}/salepayments/list`;
    backend.post(remoteUrl, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            console.log(data);
            let list = data.data;
            let i = 1;
            list && list.forEach((item, index) => {
                item.key = item.id || index;
                item.serial = i++;
            });

            let invisibleGroup = []; //数组中的属性在页面中将隐藏
            data.approveModuleFlag != 1 && (invisibleGroup.push('approveStatus'),invisibleGroup.push('assignee'));

            let tableConfigList = dealIncomeTableConfig(data.listFields,invisibleGroup);
            let tableWidth = tableConfigList.reduce(function (width, item) {
                return width + (item.width || 200);
            }, 0);

            res.json({
                retCode: 0,
                list: list,
                filterConfigList: dealIncomeFilterConfig(data.searchFields,invisibleGroup),
                tableConfigList: tableConfigList,
                tableWidth: tableWidth,
                totalAmount: data.totalAmount,
                pageAmount: data.pageAmount,
                approveModuleFlag: data.approveModuleFlag || 0,
                pagination: {
                    total: data.count,
                    current: params.page * 1,
                    pageSize: params.perPage * 1
                }
            });
        } else {
            res.json({
                retCode: 1,
                retMsg: (data && data.retMsg) || "网络异常，请稍后重试！"
            });
        }
    });
});

/* 财务---收入 */
router.post('/income/insert', function (req, res, next) {
    let remoteUrl = `/pc/v1/${Session.get(req, res).userIdEnc}/salepayments`;
    let params = req.body.json;
    //处理最后的列表
    params.headers = {
        "Content-Type": 'application/json'
    };

    if(params.bindBillType == 1){
        remoteUrl = `/pc/v1/${Session.get(req, res).userIdEnc}/salepayments/merge`;
    }

    backend.post(remoteUrl, params, req, res, function (data) {
        res.json(data);
    });
});

router.put('/income/edit', function (req, res, next) {
    let remoteUrl = `/pc/v1/${Session.get(req, res).userIdEnc}/salepayments/${req.body.id}`;
    let params = req.body.json;

    params.headers = {
        "Content-Type": 'application/json'
    };

    backend.put(remoteUrl, params, req, res, function (data) {
        res.json(data);
    });
});

router.post('/income/delete', function (req, res, next) {
    const remoteUrl = `/pc/v1/${Session.get(req, res).userIdEnc}/salepayments`;

    const params = {
        vo1: req.body.ids
    };
    params.headers = {
        "Content-Type": 'application/json'
    };
    // const params = JSON.stringify(req.body.ids);
    // params.headers = {
    //     "Content-Type": 'application/json'
    // };
    backend.delete(remoteUrl, params, req, res, function (data) {
        res.json(data);
    });
});


//收入记录详情页
router.get('/income/detail/:id', function (req, res) {
    const remoteUrl = `/pc/v1/${Session.get(req, res).userIdEnc}/salepayments/${req.params.id}`;
    backend.get(remoteUrl, req, res, function (data) {
        if(data.retCode == '0'){
            let resData = data;
            resData.data = resData.data.map(item => {
                item.bindBillType = (!item.saleBillNo || item.bindBillType === 0) ? 0 : 1;
                return item;
            });
            resData.data[0].isCreator = resData.isCreator;
            resData.data[0].isAssignee = (resData.approveTask?true:false);
            resData.data[0].approveCancel = resData.approveCancel;
            // data.approveModuleFlag=1;
            // data.data[0].approveStatus=3;
            // data.data[0].isCreator=false;
            // data.data[0].isAssignee=true;
            res.json(resData);
        }
    });
});


//////////////////
// 收入记录相关 end
///////////////////


//////////////////
// 支出记录相关 begin
///////////////////
const paymentMap = {
    billNo: {
        label: "node.finance.billNo1"
    },
    paymentDate: {
        label: "node.finance.paymentDate1",
        fieldName: 'paymentDate',
        width: Constants.TABLE_COL_WIDTH.DATE,
        visibleFlag: 1,
        type: 'datePicker'
    },
    typeName: {
        label: "node.finance.typeName1",
        width: Constants.TABLE_COL_WIDTH.INCOME_TYPE,
        type: 'select'
    },
    accountName: {
        label: "node.finance.accountName",
        width: Constants.TABLE_COL_WIDTH.FUND_ACCOUNT,
        type: 'select'
    },
    // fkBillNo: {
    //     label: "上游订单"
    // },
    supplierName: {
        label: "node.finance.supplierName"
    },
    amount: {
        label: "node.finance.amount1"
    },
    remarks: {
        label: "node.finance.remarks"
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
        label: "node.sale.ourContacterName1",
        width: '200',
        type: 'depEmployee'
    }
};

function dealPaymentFilterConfig(list,invisibleGroup) {
    let arr = (list && list.map(function (item) {
        let config = paymentMap[item.columnName];
        config.fieldName = item.columnName;
        config.visibleFlag = item.visibleFlag;
        config.originVisibleFlag = item.visibleFlag;
        config.recId = item.recId;
        if(invisibleGroup.indexOf(item.columnName) !== -1){
            config.displayFlag = true;
            config.visibleFlag = false;
        }
        return config
    })) || [];

    return arr.concat(paymentMap['paymentDate']);
}

function dealPaymentMapTableConfig(list,invisibleGroup) {
    let newList = [];
    let initFlag = list.length==5;
    let noItem = {};
    list.forEach(function (item) {
        let obj = paymentMap[item.columnName];
        if (obj) {
            if(invisibleGroup.indexOf(item.columnName) !== -1){
                item.displayFlag = true;
                item.visibleFlag = false;
                item.cannotEdit = true;
            }
            let tempItem = {
                recId:item.recId,
                fieldName: item.columnName,
                label: obj.label,
                width: item.columnWidth||obj.width||Constants.TABLE_COL_WIDTH.DEFAULT,
                cannotEdit:item.cannotEdit||null,
                visibleFlag: item.visibleFlag,
                originVisibleFlag: item.visibleFlag
            };
            if(item.columnName === 'billNo'&&!initFlag){
                noItem = tempItem;
                return;
            }
            newList.push(tempItem);
            if (item.columnName === 'billNo'&&initFlag) {
                newList.push({
                    label: 'node.finance.paymentDate1',
                    fieldName: 'paymentDate',
                    width: Constants.TABLE_COL_WIDTH.DATE,
                    visibleFlag: 1,
                    cannotEdit: true,
                });
                newList.push({
                    fieldName: 'amount',
                    label: 'node.finance.amount1',
                    width: Constants.TABLE_COL_WIDTH.FUND_ACCOUNT,
                    visibleFlag: 1,
                    cannotEdit: true
                })
            }
        }
    });
    if(!initFlag){
        newList.unshift(noItem);
    }
    return newList;
}

//支出记录
router.get('/expend/record', function (req, res) {
    const session = Session.get(req, res);
    const params = req.query;
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page || 1;
    let path;
    if (params.type === 'supplier') {
        params.supplierName = encodeURIComponent(params.recordFor);
        path = `/pc/v1/${session.userIdEnc}/suppliers/detail/purchasepayment`;
    } else {
        params.purchaseOrderBillNo = encodeURIComponent(params.recordFor);
        path = `/pc/v1/${session.userIdEnc}/purchases/detail/purchasepayment`;
    }
    delete params.recordFor;

    backend.get(path, params, req, res, function (data) {
        if (data && data.retCode == '0') {
            let i = 1;
            data.data && data.data.forEach((item, index) => {
                item.key = item.id || index;
                item.serial = i++;
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
});

//支出列表
router.get('/expend/list', function (req, res) {
    const params = req.query;
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page || 1;
    const remoteUrl = `/pc/v1/${Session.get(req, res).userIdEnc}/payments/list`;
    backend.post(remoteUrl, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            console.log(data);
            let list = data.data;
            let i = 1;
            list && list.forEach(function (item) {
                item.key = item.id;
                item.serial = i++;
            });
            let invisibleGroup = []; //数组中的属性在页面中将隐藏
            data.approveModuleFlag != 1 && (invisibleGroup.push('approveStatus'),invisibleGroup.push('assignee'));
            let tableConfigList = dealPaymentMapTableConfig(data.listFields,invisibleGroup);
            let tableWidth = tableConfigList.reduce(function (width, item) {
                return width + (item.width || 200);
            }, 0);
            res.json({
                retCode: 0,
                list: list,
                filterConfigList: dealPaymentFilterConfig(data.searchFields,invisibleGroup),
                tableConfigList: tableConfigList,
                approveModuleFlag: data.approveModuleFlag || 0,
                tableWidth: tableWidth,
                totalAmount: data.totalAmount,
                pageAmount: data.pageAmount,
                pagination: {
                    total: data.count,
                    current: params.page * 1,
                    pageSize: params.perPage * 1
                }
            });
        } else {
            res.json({
                retCode: 1,
                retMsg: (data && data.retMsg) || "网络异常，请稍后重试！"
            });
        }
    });
});

/* 财务---收入记录 */
router.post('/expend/insert', function (req, res, next) {
    let remoteUrl;
    let params;
    if(req.body.json.bindBillType === 1){
        remoteUrl = `/pc/v1/${Session.get(req, res).userIdEnc}/payments/merge`;
        params = {
            jsonArray: JSON.stringify(req.body.json)
        }
    }else{
        remoteUrl = `/pc/v1/${Session.get(req, res).userIdEnc}/payments`;
        params = req.body.json;
        params.headers = {
            "Content-Type": 'application/json'
        };
    }

    backend.post(remoteUrl, params, req, res, function (data) {
        res.json(data);
    });
});

router.post('/expend/delete', function (req, res, next) {
    const remoteUrl = `/pc/v1/${Session.get(req, res).userIdEnc}/payments`;

    const params = {
        vo1: req.body.ids
    };
    params.headers = {
        "Content-Type": 'application/json'
    };
    // const params = JSON.stringify(req.body.ids);
    // params.headers = {
    //     "Content-Type": 'application/json'
    // };
    backend.delete(remoteUrl, params, req, res, function (data) {
        res.json(data);
    });
});


//支出记录详情页
router.get('/expend/detail/:id', function (req, res) {
    const remoteUrl = `/pc/v1/${Session.get(req, res).userIdEnc}/payments/${req.params.id}`;
    backend.get(remoteUrl, req, res, function (data) {
        if(data.retCode == '0'){
            let resData = data;
            resData.data = resData.data.map(item => {
                item.bindBillType = (!item.orderBillNo || item.bindBillType === 0) ? 0 : 1;
                return item;
            });
            resData.data[0].isCreator = resData.isCreator;
            resData.data[0].isAssignee = (resData.approveTask?true:false);
            resData.data[0].approveCancel = resData.approveCancel;
            res.json(resData);
        }
    });
});


// /* 财务---支出记录 */
// router.post('/expend/insert', function (req, res, next) {
//     const remoteUrl = `/pc/v1/${Session.get(req, res).userIdEnc}/payments`;
//     const params = req.body.json;
//     params.headers = {
//         "Content-Type": 'application/json'
//     };
//
//     backend.post(remoteUrl, params, req, res, function (data) {
//         res.json(data);
//     });
// });

router.put('/expend/edit', function (req, res, next) {
    const remoteUrl = `/pc/v1/${Session.get(req, res).userIdEnc}/payments/${req.body.id}`;
    const params = req.body.json;
    params.headers = {
        "Content-Type": 'application/json'
    };
    backend.put(remoteUrl, params, req, res, function (data) {
        res.json(data);
    });
});


//////////////////
// 销售开票记录相关 end
///////////////////


//////////////////
// 支出记录相关 begin
///////////////////
const saleInvoiceMap = {
    billNo: {
        label: "node.finance.billNo2"
    },
    invoiceDate: {
        label: "node.finance.invoiceDate",
        fieldName: 'invoiceDate',
        width: Constants.TABLE_COL_WIDTH.DATE,
        visibleFlag: 1,
        type: 'datePicker'
    },
    invoiceType:{
        label: "node.finance.invoiceType",
        fieldName: 'invoiceType',
        visibleFlag: true,
        type: 'invoiceType'
    },
    /*fkBillNo: {
        label: "上游订单"
    },*/
    customerName: {
        label: "node.finance.customerName1"
    },
    amount: {
        label: "node.finance.amount2",
        align: 'right'
    },
    invoiceCustomNo: {
        label: 'node.finance.invoiceCustomNo'
    },
    remarks: {
        label: "node.finance.remarks"
    },
    approveStatus: {  // 审批状态 0 未通过  1 通过  2 反驳  3 审批中
        label: "components.approve.approveStatus",
        width: '200',
        type: 'select',
        fieldName: 'approveStatus',
        visibleFlag: true,
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
        fieldName: 'assignee',
        visibleFlag: true,
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
        label: "node.sale.ourContacterName1",
        width: '200',
        fieldName: 'ourContacterName',
        visibleFlag: true,
        type: 'depEmployee'
    }
};

function dealSaleInvoiceFilterConfig(list) {
    return saleInvoiceMap['invoiceDate'];
}

function dealSaleInvoiceMapTableConfig(list,invisibleGroup) {
    let newList = [];
    let initFlag = list.length==7;
    let noItem = {};
    list.forEach(function (item) {
        let obj = saleInvoiceMap[item.columnName];
        if (obj) {
            if(invisibleGroup.indexOf(item.columnName) !== -1){
                item.displayFlag = true;
                item.visibleFlag = false;
                item.cannotEdit = true;
            }
            let tempItem = {
                recId:item.recId,
                fieldName: item.columnName,
                label: obj.label,
                width: item.columnWidth||obj.width||Constants.TABLE_COL_WIDTH.DEFAULT,
                cannotEdit:item.cannotEdit||null,
                visibleFlag: item.visibleFlag,
                originVisibleFlag: item.visibleFlag
            };
            if(item.columnName === 'billNo'&&!initFlag){
                noItem = tempItem;
                return;
            }
            newList.push(tempItem);
            if (item.columnName === 'billNo'&&initFlag) {
                newList.push({
                    label: 'node.finance.invoiceDate',
                    fieldName: 'invoiceDate',
                    width: Constants.TABLE_COL_WIDTH.DATE,
                    visibleFlag: 1,
                    cannotEdit: true,
                })
            }

        }
    });
    if(!initFlag){
        newList.unshift(noItem);
    }
    return newList;
}

//开票记录
router.get('/saleinvoice/record', function (req, res) {
    const session = Session.get(req, res);
    const params = req.query;
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page || 1;
    let path;
    if (params.type === 'customer') {
        params.customerName = encodeURIComponent(params.recordFor);
        path = `/pc/v1/${session.userIdEnc}/customers/detail/saleinvoice`;
    } else if (params.type === 'saleOrder') {
        params.saleOrderBillNo = encodeURIComponent(params.recordFor);
        path = `/pc/v1/${session.userIdEnc}/saleorders/detail/saleinvoice`;
    }
    delete params.recordFor;

    backend.get(path, params, req, res, function (data) {
        if (data.retCode == '0') {
            let i = 1;
            data.data && data.data.forEach((item, index) => {
                item.key = item.id || index;
                item.serial = i++;
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
});

router.get('/saleinvoices/list', function (req, res) {
    const params = req.query;
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page || 1;
    const remoteUrl = `/pc/v1/${Session.get(req, res).userIdEnc}/saleinvoices/list`;
    backend.post(remoteUrl, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            console.log(data);
            let list = data.data;
            let i = 1;
            list && list.forEach(function (item) {
                item.key = item.id;
                item.serial = i++;
            });
            let invisibleGroup = []; //数组中的属性在页面中将隐藏
            data.approveModuleFlag != 1 && (invisibleGroup.push('approveStatus'),invisibleGroup.push('assignee'));
            let tableConfigList = dealSaleInvoiceMapTableConfig(data.listFields,invisibleGroup);
            let tableWidth = tableConfigList.reduce(function (width, item) {
                return width + (item.width || 200);
            }, 0);

            res.json({
                retCode: 0,
                list: list,
                filterConfigList: data.approveModuleFlag == 1 ? [saleInvoiceMap['invoiceDate'],saleInvoiceMap['invoiceType'],saleInvoiceMap['ourContacterName'],saleInvoiceMap['assignee'],saleInvoiceMap['approveStatus']]:[saleInvoiceMap['invoiceDate'],saleInvoiceMap['invoiceType'],saleInvoiceMap['ourContacterName']],
                tableConfigList: tableConfigList,
                tableWidth: tableWidth,
                approveModuleFlag: data.approveModuleFlag || 0,
                totalAmount: data.totalAmount,
                pageAmount: data.pageAmount,
                pagination: {
                    total: data.count,
                    current: params.page * 1,
                    pageSize: params.perPage * 1
                }
            });
        } else {
            res.json({
                retCode: 1,
                retMsg: (data && data.retMsg) || "网络异常，请稍后重试！"
            });
        }
    });
});

/* 财务---收入记录 */
router.post('/saleinvoices/insert', function (req, res, next) {
    let remoteUrl;
    let params;
    if(req.body.json.bindBillType === 1){
        remoteUrl = `/pc/v1/${Session.get(req, res).userIdEnc}/saleinvoices/merge`;
        params = {
            jsonArray: JSON.stringify(req.body.json)
        }
    }else{
        remoteUrl = `/pc/v1/${Session.get(req, res).userIdEnc}/saleinvoices`;
        params = req.body.json;
        params.headers = {
            "Content-Type": 'application/json'
        };
    }

    backend.post(remoteUrl, params, req, res, function (data) {
        res.json(data);
    });
});

router.post('/saleinvoices/delete', function (req, res, next) {
    const remoteUrl = `/pc/v1/${Session.get(req, res).userIdEnc}/saleinvoices`;

    const params = {
        vo1: req.body.ids
    };
    params.headers = {
        "Content-Type": 'application/json'
    };
    // const params = JSON.stringify(req.body.ids);
    // params.headers = {
    //     "Content-Type": 'application/json'
    // };
    backend.delete(remoteUrl, params, req, res, function (data) {
        res.json(data);
    });
});


//收入记录详情页
router.get('/saleinvoices/detail/:id', function (req, res) {
    const remoteUrl = `/pc/v1/${Session.get(req, res).userIdEnc}/saleinvoices/${req.params.id}`;
    backend.get(remoteUrl, req, res, function (data) {
        if(data.retCode == '0'){
            let resData = data;
            resData.data = resData.data.map(item => {
                item.bindBillType = (!item.bindBillNo || item.bindBillType === 0) ? 0 : 1;
                return item;
            });
            resData.data[0].isCreator = resData.isCreator;
            resData.data[0].isAssignee = (resData.approveTask?true:false);
            resData.data[0].approveCancel = resData.approveCancel;
            res.json(resData);
        }
    });
});


/* 财务---支出记录 */
/*router.post('/saleinvoices/insert', function (req, res, next) {
    const remoteUrl = `/pc/v1/${Session.get(req, res).userIdEnc}/saleinvoices`;
    const params = req.body.json;
    params.headers = {
        "Content-Type": 'application/json'
    };

    backend.post(remoteUrl, params, req, res, function (data) {
        res.json(data);
    });
});*/

router.put('/saleinvoices/edit', function (req, res, next) {
    const remoteUrl = `/pc/v1/${Session.get(req, res).userIdEnc}/saleinvoices/${req.body.id}`;
    let params = req.body.json;
    // if(req.body.json.bindBillType === 1){
    //     params = {
    //         json: JSON.stringify(req.body.json)
    //     }
    // }else{
    //     params = req.body.json;
    // }
    params.headers = {
        "Content-Type": 'application/json'
    };
    backend.put(remoteUrl, params, req, res, function (data) {
        res.json(data);
    });
});


//////////////////
// 采购到票记录相关 end
///////////////////
const invoiceMap = {
    billNo: {
        label: "node.finance.billNo3"
    },
    invoiceDate: {
        label: "node.finance.invoiceDate1",
        fieldName: 'invoiceDate',
        width: Constants.TABLE_COL_WIDTH.DATE,
        visibleFlag: 1,
        type: 'datePicker'
    },
    invoiceType:{
        label: "node.finance.invoiceType",
        fieldName: 'invoiceType',
        visibleFlag: true,
        type: 'invoiceType'
    },
    /*fkBillNo: {
        label: "上游订单"
    },*/
    supplierName: {
        label: "node.finance.supplierName1"
    },
    amount: {
        label: "node.finance.amount3",
        align: 'right'
    },
    invoiceCustomNo: {
        label: 'node.finance.invoiceCustomNo'
    },
    remarks: {
        label: "node.finance.remarks"
    },
    approveStatus: {  // 审批状态 0 未通过  1 通过  2 反驳  3 审批中
        label: "components.approve.approveStatus",
        width: '200',
        fieldName: 'approveStatus',
        visibleFlag: true,
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
        visibleFlag: true,
        fieldName: 'assignee',
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
        label: "node.sale.ourContacterName1",
        width: '200',
        fieldName: 'ourContacterName',
        visibleFlag: true,
        type: 'depEmployee'
    }
};

function dealInvoiceFilterConfig(list) {
    return invoiceMap['invoiceDate'];
}

function dealInvoiceMapTableConfig(list,invisibleGroup) {
    let newList = [];
    let initFlag = list.length==7;
    let noItem = {};
    list.forEach(function (item) {
        let obj = invoiceMap[item.columnName];
        if (obj) {
            if(invisibleGroup.indexOf(item.columnName) !== -1){
                item.displayFlag = true;
                item.visibleFlag = false;
                item.cannotEdit = true;
            }
            let tempItem = {
                recId:item.recId,
                fieldName: item.columnName,
                label: obj.label,
                width: item.columnWidth||obj.width||Constants.TABLE_COL_WIDTH.DEFAULT,
                cannotEdit:item.cannotEdit||null,
                visibleFlag: item.visibleFlag,
                originVisibleFlag: item.visibleFlag
            };
            if (item.columnName === 'billNo'&&!initFlag) {
                noItem = tempItem;
                return;
            }
            newList.push(tempItem);
            if (item.columnName === 'billNo'&&initFlag) {
                newList.push({
                    label: 'node.finance.invoiceDate1',
                    fieldName: 'invoiceDate',
                    width: Constants.TABLE_COL_WIDTH.DATE,
                    visibleFlag: 1,
                    cannotEdit: true,
                })
            }
        }
    });
    if(!initFlag){
        newList.unshift(noItem);
    }
    return newList;
}

//到票记录
router.get('/invoice/record', function (req, res) {
    const session = Session.get(req, res);
    const params = req.query;
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page || 1;
    let path;
    if (params.type === 'supplier') {
        params.supplierName = encodeURIComponent(params.recordFor);
        path = `/pc/v1/${session.userIdEnc}/suppliers/detail/purchaseinvoice`;
    } else if (params.type === 'purchase') {
        params.purchaseOrderBillNo = encodeURIComponent(params.recordFor);
        path = `/pc/v1/${session.userIdEnc}/purchases/detail/purchaseinvoice`;
    }

    delete params.recordFor;

    backend.get(path, params, req, res, function (data) {
        if (data.retCode == '0') {
            let i = 1;
            data.data && data.data.forEach((item, index) => {
                item.key = item.id || index;
                item.serial = i++;
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
});

//支出列表
router.get('/invoices/list', function (req, res) {
    const params = req.query;
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page || 1;
    const remoteUrl = `/pc/v1/${Session.get(req, res).userIdEnc}/invoices/list`;
    backend.post(remoteUrl, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            console.log(data);
            let list = data.data;
            let i = 1;
            list && list.forEach(function (item) {
                item.key = item.id;
                item.serial = i++;
            });
            let invisibleGroup = []; //数组中的属性在页面中将隐藏
            data.approveModuleFlag != 1 && (invisibleGroup.push('approveStatus'),invisibleGroup.push('assignee'));
            let tableConfigList = dealInvoiceMapTableConfig(data.listFields,invisibleGroup);
            let tableWidth = tableConfigList.reduce(function (width, item) {
                return width + (item.width || 200);
            }, 0);
            res.json({
                retCode: 0,
                list: list,
                filterConfigList: data.approveModuleFlag == 1 ?[invoiceMap['invoiceDate'],invoiceMap['invoiceType'],invoiceMap['ourContacterName'],invoiceMap['assignee'],invoiceMap['approveStatus']]:[invoiceMap['invoiceDate'],invoiceMap['invoiceType'],invoiceMap['ourContacterName']],
                tableConfigList: tableConfigList,
                approveModuleFlag: data.approveModuleFlag || 0,
                tableWidth: tableWidth,
                totalAmount: data.totalAmount,
                pageAmount: data.pageAmount,
                pagination: {
                    total: data.count,
                    current: params.page * 1,
                    pageSize: params.perPage * 1
                }
            });
        } else {
            res.json({
                retCode: 1,
                retMsg: (data && data.retMsg) || "网络异常，请稍后重试！"
            });
        }
    });
});

/* 财务---收入记录 */
router.post('/invoices/insert', function (req, res, next) {
    let remoteUrl;
    let params;
    if(req.body.json.bindBillType === 1){
        remoteUrl = `/pc/v1/${Session.get(req, res).userIdEnc}/invoices/merge`;
        params = {
            jsonArray: JSON.stringify(req.body.json)
        }
    }else{
        remoteUrl = `/pc/v1/${Session.get(req, res).userIdEnc}/invoices`;
        params = req.body.json;
        params.headers = {
            "Content-Type": 'application/json'
        };
    }

    backend.post(remoteUrl, params, req, res, function (data) {
        res.json(data);
    });
});

router.post('/invoices/delete', function (req, res, next) {
    const remoteUrl = `/pc/v1/${Session.get(req, res).userIdEnc}/invoices`;

    const params = {
        vo1: req.body.ids
    };
    params.headers = {
        "Content-Type": 'application/json'
    };
    // const params = JSON.stringify(req.body.ids);
    // params.headers = {
    //     "Content-Type": 'application/json'
    // };
    backend.delete(remoteUrl, params, req, res, function (data) {
        res.json(data);
    });
});


//收入记录详情页
router.get('/invoices/detail/:id', function (req, res) {
    const remoteUrl = `/pc/v1/${Session.get(req, res).userIdEnc}/invoices/${req.params.id}`;
    backend.get(remoteUrl, req, res, function (data) {
        if(data.retCode == '0'){
            let resData = data;
            resData.data = resData.data.map(item => {
                item.bindBillType = (!item.bindBillNo || item.bindBillType === 0) ? 0 : 1;
                return item;
            });
            resData.data[0].isCreator = resData.isCreator;
            resData.data[0].isAssignee = (resData.approveTask?true:false);
            resData.data[0].approveCancel = resData.approveCancel;
            res.json(resData);
        }
    });
});


/* 财务---支出记录 */
/*router.post('/invoices/insert', function (req, res, next) {
    const remoteUrl = `/pc/v1/${Session.get(req, res).userIdEnc}/invoices`;
    const params = req.body.json;
    params.headers = {
        "Content-Type": 'application/json'
    };

    backend.post(remoteUrl, params, req, res, function (data) {
        res.json(data);
    });
});*/

router.put('/invoices/edit', function (req, res, next) {
    const remoteUrl = `/pc/v1/${Session.get(req, res).userIdEnc}/invoices/${req.body.id}`;
    let params = req.body.json;
    params.headers = {
        "Content-Type": 'application/json'
    };
    backend.put(remoteUrl, params, req, res, function (data) {
        res.json(data);
    });
});


/*
*查看操作日志接口
* params: string  userId
*         string  billNo
*/
router.get('/:type/approve/log/:billNo', function (req, res, next) {
    const session = Session.get(req, res);
    let billNo = req.params.billNo;
    let type = req.params.type;
    let params = {};
    params.headers = {
        "Content-Type": 'application/json'
    };
    let url = `/pc/v1/${session.userIdEnc}/${type}/log/${billNo}`;
    backend.get(url, params, req, res, function (data) {
        res.json(data);
    });
});


//////////////////
// 销售开票记录相关 end
///////////////////

module.exports = router;
