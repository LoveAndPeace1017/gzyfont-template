const express = require('express');
const router = express.Router();
const backend = require('../../../lib/backend');
const Session = require('../../../lib/session');
const Constants = require('../../../lib/constants');
const DataFilter = require('../../../lib/utils/DataFilter');
const Decimals = require('../../../lib/utils/Decimal');
const PropertyFilter = require('../../../lib/utils/PropertyFilter');
const Decimal = require('decimal.js');
const server = '';

const map = {
    state: {
        label: "node.purchase.state",
        width: Constants.TABLE_COL_WIDTH.ACCEPT_STATUS
    },
    interchangeState: {
        label: "node.purchase.interchangeState",
        width: Constants.TABLE_COL_WIDTH.ACCEPT_STATUS
    },
    paymentState: {
        label: "node.purchase.paymentState",
        width: Constants.TABLE_COL_WIDTH.ACCEPT_STATUS
    },
    invoiceState: {
        label: "node.purchase.invoiceState",
        width: Constants.TABLE_COL_WIDTH.ACCEPT_STATUS
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
    approvePerson: {
        label: "components.approve.approvePerson",
        width: '200',
        type: 'select',
        options: [
            {label: "components.approve.approvePerson_0", value: "0"},
            {label: "components.approve.approvePerson_1", value: "1"}
        ]
    },
    deliveryDeadlineDate: {
        label: 'node.purchase.deliveryDeadlineDate',
        width: Constants.TABLE_COL_WIDTH.DATE
    },
    prodAbstract: {
        label: "node.purchase.prodAbstract",
        width: Constants.TABLE_COL_WIDTH.NO,
    },
    taxAllAmount: {
        label: "node.purchase.taxAllAmount",
        width: Constants.TABLE_COL_WIDTH.FUND_ACCOUNT,
    },
    discountAmount: {
        label: "node.purchase.discountAmount",
        width: Constants.TABLE_COL_WIDTH.FUND_ACCOUNT,
    },
    aggregateAmount: {
        label: "node.purchase.aggregateAmount",
        width: Constants.TABLE_COL_WIDTH.FUND_ACCOUNT,
    },
    payAmount: {
        label: "node.purchase.payAmount",
        width: Constants.TABLE_COL_WIDTH.FUND_ACCOUNT,
    },
    invoiceAmount: {
        label: "node.purchase.invoiceAmount",
        width: Constants.TABLE_COL_WIDTH.FUND_ACCOUNT,
    },
    projectName: {
        label: "node.purchase.projectName",
        width: Constants.TABLE_COL_WIDTH.DEFAULT
    },
    deliveryAddress: {
        label: "node.purchase.deliveryAddress",
        width: Constants.TABLE_COL_WIDTH.ADDRESS,
    },
    settlement: {
        label: "node.purchase.settlement",
        width: Constants.TABLE_COL_WIDTH.CUSTOMER_LEVEL,
    },
    contractTerms: {
        label: "node.purchase.contractTerms",
        width: Constants.TABLE_COL_WIDTH.PERSON
    },
    supplierContacterName: {
        label: "node.purchase.supplierContacterName",
        width: Constants.TABLE_COL_WIDTH.PERSON
    },
    supplierMobile: {
        label: "node.purchase.supplierMobile",
    },
    displayBillNo:{
        label: 'node.purchase.displayBillNo',
        width: Constants.TABLE_COL_WIDTH.NO,
    },
    supplierName:{
        label: 'node.purchase.supplierName',
        width: Constants.TABLE_COL_WIDTH.TEL,
    },
    purchaseOrderDate:{
        label: 'node.purchase.purchaseOrderDate',
        width: Constants.TABLE_COL_WIDTH.DATE,
    },
    unitConverter:{
        label: 'node.purchase.unitConverter',
        width: Constants.TABLE_COL_WIDTH.NO,
    },
    quantity:{
        label: 'node.purchase.quantity',
        width: Constants.TABLE_COL_WIDTH.NO,
    },
};

const filterMap = {
    interchangeStatus: {
        label: "node.purchase.interchangeStatus",
        width: '200',
        type: 'select',
        options: [
            {label: "node.purchase.interchangeStatusOption1", value: "1"},
            {label: "node.purchase.interchangeStatusOption2", value: "2"},
            {label: "node.purchase.interchangeStatusOption3", value: "3"},
        ]
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
    deliveryState: {
        label: "node.purchase.deliveryState",
        width: '200',
        type: 'select',
        options: [
            {label: "node.purchase.deliveryStateOption1", value: "0"},
            {label: "node.purchase.deliveryStateOption2", value: "1"}
        ]
    },
    payState: {
        label: "node.purchase.payState",
        width: '200',
        type: 'select',
        options: [
            {label: "node.purchase.payStateOption1", value: "0"},
            {label: "node.purchase.payStateOption2", value: "1"},
        ],
    },
    invoiceState: {
        label: "node.purchase.invoiceStateTitle",
        width: '200',
        type: 'select',
        options: [
            {label: "node.purchase.invoiceStateOption1", value: "0"},
            {label: "node.purchase.invoiceStateOption2", value: "1"},
        ],
    },
    attachmentState: {
        label: "components.approve.attachmentState",
        width: '200',
        type: 'select',
        options: [
            {label: "components.approve.attachmentStatus_1", value: "1"},
            {label: "components.approve.attachmentStatus_2", value: "2"},
        ]
    },
    deliveryDeadlineDate: {
        label: "node.purchase.deliveryDeadlineDate",
        width: '200',
        type: 'datePicker'
    },
    property_value: {
        label: "node.purchase.property_value",
        width: '200',
        type: 'custom'
    },
    ourContacterName: {
        label:"node.report.purchase.ourContacterName",
        width: '200',
        type:'input',
        placeholder:'采购方联系人'
    },
    projectName: {
        label: "node.sale.projectName",
        width: Constants.TABLE_COL_WIDTH.DEFAULT,
        type: 'project'
    }
};

function dealFilterConfig(list, wareList, customMap, invisibleGroup) {
    let arr = list && list.map(function (item) {
        let config = filterMap[item.columnName];
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
    arr.splice(4, 0, {
        label: "node.purchase.purchaseOrderDate",
        fieldName: 'purchaseOrderDate',
        visibleFlag: true,
        cannotEdit: true,
        type: 'datePicker'
    });
    return arr;
}

function dealTableConfig(list, customMap, invisibleGroup) {

    let newList = [];
    // 初始阶段数据库中没有不可配置字段
    let initFlag = true;
    list.forEach(function (item) {
        if(item.columnName=='displayBillNo'){
            initFlag = false;
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
    if(initFlag){
        const supplierColumns = [{
            fieldName: 'displayBillNo',
            label: 'node.purchase.displayBillNo',
            width: Constants.TABLE_COL_WIDTH.NO,
            visibleFlag: 1,
            cannotEdit: true
        },{
            fieldName: 'supplierName',
            label: 'node.purchase.supplierName',
            width: Constants.TABLE_COL_WIDTH.TEL,
            visibleFlag: 1,
            cannotEdit: true
        }, {
            fieldName: 'purchaseOrderDate',
            label: 'node.purchase.purchaseOrderDate',
            visibleFlag: 1,
            cannotEdit: true,
            width: Constants.TABLE_COL_WIDTH.DATE
        }];
        newList = supplierColumns.concat(newList);
    }
    return newList;
}

/* 采购列表. */
router.get('/list', function (req, res, next) {
    const params = req.query;
    params.perPage = params.perPage ? parseInt(params.perPage) : Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req, res);
    // const userId = 'nEoAUdKFbkYs';
    let url = `/pc/v1/${session.userIdEnc}/purchases/list`;
    if(params.source=='mall'){
        url = `/pc/v1/${session.userIdEnc}/online/order/listPurchaseOrder`;
    }
    backend.post(server+url, params, req, res, function (data) {
        console.log("purchase:", JSON.stringify(data));
        if (data && data.retCode == 0) {
            let customMap = DataFilter.dealCustomField(data.tags);
            let list = data.data;
            let i = 1;
            list.forEach(function (item) {
                item.key = item.billNo;
                item.serial = i++;
                item.actualEnterAmount = item.enterAmount - item.returnAmount;
                [1,2,3,4,5].forEach((index)=>{
                    item['property_value'+index] = item['propertyValue'+index];
                })
            });
            if(params.source === 'mall'){ //来源于在线销售前端手动关闭审批权
                data.approveFlag = 0;
                data.approveModuleFlag = 0;
            }

            let invisibleGroup = []; //数组中的属性在页面中将隐藏
            data.approveModuleFlag != 1 && (invisibleGroup.push('approveStatus'),invisibleGroup.push('assignee')); // approveModuleFlag 主账号审批是否开启并非权限

            let tableConfigList = dealTableConfig(data.listFields, customMap, invisibleGroup);
            res.json({
                retCode: 0,
                list: list,
                approveFlag: data.approveFlag||0, //是否有审批权
                approveModuleFlag: data.approveModuleFlag,
                filterConfigList: dealFilterConfig(data.searchFields, data.warehouseList, customMap, invisibleGroup),
                tableConfigList: tableConfigList,
                totalAmount: data.totalAmount,
                pageAmount: data.pageAmount,
                pagination: {
                    total: data.count,
                    current: params.page,
                    pageSize: params.perPage
                }
            });
        } else {
            res.json({
                retCode: 1,
                retMsg: "网络异常，请稍后重试！"
            });
        }

    });
});

/*判断能否删除采购*/
router.post('/beforeDelete', function (req, res) {
    const params = {
        vo1: req.body.ids
    };
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    // const userId = 'nEoAUdKFbkYs';
    backend.post(`/pc/v1/${session.userIdEnc}/purchases/popop/window`, params, req, res, function (data) {
        res.json(data);
    });
});

/*删除采购*/
router.post('/delete', function (req, res) {
    const params = {
        vo1: req.body.ids
    };
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    // const userId = 'nEoAUdKFbkYs';
    backend.delete(`/pc/v1/${session.userIdEnc}/purchases?isCascaded=0`, params, req, res, function (data) {
        res.json(data);
    });
});

/* 设置隐藏显示 */
router.post('/status/:opeType/:code', function (req, res, next) {
    const params = {};
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    // const userId = 'nEoAUdKFbkYs';
    backend.post(`/pc/v1/${session.userIdEnc}/purchases/${req.params.opeType}/${req.params.code}`, {}, req, res, function (data) {
        res.json(data);
    });
});

//根据采购code获取采购仓库数量
router.get('/:code/inventories', function (req, res) {
    const session = Session.get(req, res);
    // const userId = 'nEoAUdKFbkYs';
    backend.get(`/pc/v1/${session.userIdEnc}/purchases/${req.params.code}/inventories`, req, res, function (data) {
        res.json(data)
    });
});

//根据单号获取物品概要的总类
router.get('/listProd', function (req, res) {
    const session = Session.get(req, res);
    const params = {};
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.userId = session.userIdEnc;
    params.orderCodeV2 = req.query.billNo;
    backend.get(`/pc/v1/${session.userIdEnc}/purchases/listProd`, params, req, res, function (data) {
        res.json(data)
    });
});


/* 进入新增采购后需要加载的一些信息*/
router.get('/pre/create', function (req, res, next) {
    const params = req.query;
    const session = Session.get(req, res);
    // const userId = 'nEoAUdKFbkYs';
    backend.get(`/pc/v1/${session.userIdEnc}/purchases/pre/create`, params, req, res, function (data) {
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

/* 新增采购 */
router.post('/add', function (req, res, next) {
    const params = req.body;
    // const userId = 'nEoAUdKFbkYs';
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/purchases`, params, req, res, function (data) {
        res.json(data);
    });
});
/* 修改采购 */
router.post('/modify/:billNo', function (req, res, next) {
    const params = req.body;
    // const userId = 'nEoAUdKFbkYs';
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.put(server + `/pc/v1/${session.userIdEnc}/purchases/${req.params.billNo}`, params, req, res, function (data) {
        res.json(data);
    });
});


//采购详情页
router.get('/detail/:id', function (req, res) {
    const session = Session.get(req, res);
    backend.get(server+`/pc/v1/${session.userIdEnc}/purchases/${req.params.id}`, req, res, function (data) {
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

            data.approveFlag =  data.approveFlag||0;
            data.approveModuleFlag = data.approveModuleFlag||0; // approveModuleFlag 主账号审批是否开启并非权限
            data.data.isCreator = data.isCreator;
            data.data.isAssignee = (data.approveTask?true:false);
            data.data.approveCancel = data.approveCancel;
            res.json(data);
        } else {
            res.json({
                retCode: '1',
                retMsg: "网络异常，请稍后重试！"
            });
        }
    });
});

//扫码录单（根据采购条码获取采购信息）
router.get('/scan/:barCode', function (req, res) {
    // backend.get(`/prod/detail/${req.params.id}`, req, res, function(data) {
    //     res.json(data)
    // });
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/purchases/detail/by/barcode?barcode=${req.params.barCode}`, req, res, function (data) {
        res.json(data)
    });
    // res.json({
    //     data:{
    //         "addedTime": 1552706857000,
    //         "amount": 6,
    //         "id": 10,
    //         "isDeleted": 0,
    //         "prodCustomNo": "WP00001",
    //         "prodName": "AA",
    //         "productCode": "WP000001",
    //         "quantity": 2,
    //         "recId": 363198532,
    //         "receiverQuantity": 0,
    //         "saleBillNo": "XS-20190316-0006",
    //         "unit": "箱",
    //         "unitPrice": 3,
    //         "updatedTime": 1552888098000,
    //         "remarks":"我是备注啦啦",
    //         "itemSpec":"规格",
    //         "barCode": "231232132132132131"
    //     },
    //     recCode:0
    // })
});

//采购联想（根据采购编号或者名称所搜）
router.get('/search/by/field', function (req, res) {
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/purchases/search/by/field`, req.query, req, res, function (data) {
        res.json(data)
    });
});

/*取消分销*/
router.post('/cancelDistribute', function (req, res) {
    const params = {};
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.delete(`/pc/v1/${session.userIdEnc}/purchases?jsonArray=${JSON.stringify(req.body.ids)}`, params, req, res, function (data) {
        res.json(data);
    });
});
/*设置分销采购*/
router.post('/setDistribute', function (req, res) {
    const params = {};
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.delete(`/pc/v1/${session.userIdEnc}/purchases?jsonArray=${JSON.stringify(req.body.ids)}`, params, req, res, function (data) {
        res.json(data);
    });
});

/*取消采购订单*/
router.post('/cancel/:code', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/purchases/cancel/${req.params.code}`, params, req, res, function (data) {
        res.json(data);
    });
});

/*发送采购订单*/
router.post('/send2supplier/:code', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/purchases/send2supplier/${req.params.code}`, params, req, res, function (data) {
        res.json(data);
    });
});

/*发送邮件给供应商*/
router.post('/sendEmail/:code', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/purchases/email/${req.params.code}`, params, req, res, function (data) {
        res.json(data);
    });
});

//关键词搜索联想
router.get('/search/tips', function (req, res) {
    const params = {
        ...req.query,
        key: encodeURIComponent(req.query.key)
    };
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/purchases/search/tips`, params, req, res, function (data) {
        res.json(data)
    });
});

/*一键转为我的物品*/
router.post('/convertToLocalProd', function (req, res, next) {
    const session = Session.get(req, res);
    const params = {
        array: req.body.ids
    };
    params.headers = {
        "Content-Type": 'application/json'
    };
    backend.post(`/pc/v1/${session.userIdEnc}/purchases/convertToLocalProd`, params, req, res, function (data) {
        res.json(data);
    });
});

//采购记录
router.get('/record/for/:recordFor', function (req, res) {
    const session = Session.get(req, res);
    let params = req.query;
    let path;
    if (params.type == 'prods') {
        path = `/pc/v1/${session.userIdEnc}/${req.query.type}/query/buygoods/${req.params.recordFor}`;
        // backend.get(`/pc/v1/${session.userIdEnc}/${req.query.type}/query/buygoods/${req.params.prodNo}`, req.query, req, res, function (data) {
        //     res.json(data)
        // });
    } else {
        path = `/pc/v1/${session.userIdEnc}/suppliers/detail/purchaseorder`;
        params.supplierNo = req.params.recordFor;
    }

    backend.get(path, params, req, res, function (data) {
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

/*采购批量入库获取初始信息*/
router.post('/enters/batch/pre/create', function (req, res, next) {
    const session = Session.get(req, res);
    const params = {
        jsonArray: JSON.stringify(req.body.ids)
    };

    backend.post(`/pc/v1/${session.userIdEnc}/purchases/enters/batch/pre/create`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            data.data.forEach(item => {
                item.orderBillNo = item.order.billNo;
                item.prodList.forEach((item, index) => {
                    item.serial = index + 1;
                    item.key = index;
                    let quantity = new Decimal(item.quantity);
                    item.pendingEnter = Math.max(0, quantity.minus(item.quantityDelivered));
                    item.enterQuantity = item.pendingEnter !== 0 ? item.pendingEnter : '';
                    delete item.recId;
                })
            });

            res.json(data);
        } else {
            res.json(data);
        }
    });
});

/*采购批量入库*/
router.post('/enters/batch', function (req, res, next) {
    const session = Session.get(req, res);
    const params = {
        warehouseName: req.body.warehouseName,
        jsonArray: JSON.stringify(req.body.dataList)
    };

    backend.post(`/pc/v1/${session.userIdEnc}/purchases/enters/batch`, params, req, res, function (data) {
        res.json(data)
    });
});

/*获取采购批量付款初始信息*/
router.post('/payments/batch/pre/create', function (req, res, next) {
    const session = Session.get(req, res);
    const params = {
        jsonArray: JSON.stringify(req.body.ids)
    };

    backend.post(`/pc/v1/${session.userIdEnc}/purchases/payments/batch/pre/create`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            data.data.forEach((item, index) => {
                item.key = index;
                item.amount = item.waitPay !== 0 ? item.waitPay : '';
                item.serial = index + 1;
                item.aggregateAmount = Decimals.fixedDecimal(item.aggregateAmount, 2);
                item.payedAmount = new Decimal(item.aggregateAmount).minus(item.waitPay || 0).toString();
            });

            res.json(data);
        } else {
            res.json(data);
        }
    });
});

/*采购批量付款*/
router.post('/payments/batch', function (req, res, next) {
    const session = Session.get(req, res);
    const params = {
        jsonArray: JSON.stringify(req.body.dataList)
    };

    let url = `/pc/v1/${session.userIdEnc}/purchases/payments/batch`;
    if (req.body.dataList.paymentDate) {
        url = `/pc/v1/${session.userIdEnc}/payments/merge`;
    }

    backend.post(url, params, req, res, function (data) {
        res.json(data)
    });
});


/*获取采购批量到票初始信息*/
router.post('/invoices/batch/pre/create', function (req, res, next) {
    const session = Session.get(req, res);
    const params = {
        jsonArray: JSON.stringify(req.body.ids)
    };

    backend.post(`/pc/v1/${session.userIdEnc}/purchases/invoices/batch/pre/create`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            data.data.forEach((item, index) => {
                item.key = index;
                item.serial = index + 1;
                item.aggregateAmount = Decimals.fixedDecimal(item.aggregateAmount, 2);
                item.receivedInvoiceAmount = new Decimal(item.aggregateAmount).minus(item.waitInvoiceAmount || 0).toString();
                item.amount = item.waitInvoiceAmount !== 0 ? item.waitInvoiceAmount : '';

            });

            res.json(data);
        } else {
            res.json(data);
        }
    });
});

/*采购批量到票*/
router.post('/invoices/batch', function (req, res, next) {
    const session = Session.get(req, res);
    const params = {
        jsonArray: JSON.stringify(req.body.dataList)
    };

    let url = `/pc/v1/${session.userIdEnc}/purchases/invoices/batch`;
    if (req.body.dataList.invoiceDate) {
        url = `/pc/v1/${session.userIdEnc}/invoices/merge`;
    }

    backend.post(url, params, req, res, function (data) {
        res.json(data)
    });
});

/*获取物流信息 */
router.post('/get/expressInfor', function (req, res, next) {
    const params = {};
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.billNo = req.body.billNo;
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/online/order/logisticsInformation`, params, req, res, function (data) {
        res.json(data);
    });
});

/*
*审批通过(单条) 后端无法合并
* params: string  userId
*         string  billNo
*         string updatedTime
*/
router.post('/approve/single', function (req, res, next) {
    const session = Session.get(req, res);
    let { billNo, updatedTime } = req.body;
    const params = {
        userId: session.userIdEnc,
        billNo,
        updatedTime
    };
    backend.post(`/pc/v1/${session.userIdEnc}/purchases/approve/${billNo}`, params, req, res, function (data) {
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
        jsonArray: JSON.stringify(req.body.dataList)
    };
    backend.post(`/pc/v1/${session.userIdEnc}/purchases/approve/list`, params, req, res, function (data) {
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
    let { billNo, updatedTime } = req.body;
    const params = {
        userId: session.userIdEnc,
        billNo,
        updatedTime
    };
    backend.post(`/pc/v1/${session.userIdEnc}/purchases/approve/counter/${billNo}`, params, req, res, function (data) {
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
        jsonArray: JSON.stringify(req.body.dataList)
    };
    backend.post(`/pc/v1/${session.userIdEnc}/purchases/approve/counter/list`, params, req, res, function (data) {
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
    backend.get(`/pc/v1/${session.userIdEnc}/purchases/approve/log/${billNo}`, params, req, res, function (data) {
        res.json(data);
    });
});


//根据物品编号获取物品信息
router.post('/getDataByProdNo', function(req, res) {
    const params = {array: req.body};
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/prods/list4Bill`, params, req, res, function (data) {
        res.json(data);
    });
});

module.exports = router;
