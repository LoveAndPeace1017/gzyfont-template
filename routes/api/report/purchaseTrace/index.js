const express = require('express');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const Constants = require('../../../../lib/constants');
const DataFilter = require('../../../../lib/utils/DataFilter');

const map = {
    purchaseOrderDate: {
        label: "node.report.purchaseTrace.purchaseOrderDate",
        width: Constants.TABLE_COL_WIDTH.DATE
    },
    displayBillNo: {
        label: "node.report.purchaseTrace.displayBillNo"
    },
    supplierName: {
        label: "node.report.purchaseTrace.supplierName"
    },
    state: {
        label: "node.report.purchaseTrace.state",
        width: 200,
        type:'select',
        options:[
            {label:"node.report.purchaseTrace.stateOption1",value:"0"},
            {label:"node.report.purchaseTrace.stateOption2",value:"1"}
        ]
    },
    enterAmount: {
        label: "node.report.purchaseTrace.enterAmount",
        columnType: 'money',
        totalFlag: true

    },
    unenterAmount: {
        label: "node.report.purchaseTrace.unenterAmount",
        columnType: 'money',
        totalFlag: true
    },
    payState: {
        label: "node.report.purchaseTrace.payState",
        width: 200,
        type:'select',
        options:[
            {label:"node.report.purchaseTrace.payStateOption1",value:"0"},
            {label:"node.report.purchaseTrace.payStateOption2",value:"1"}
        ]
    },
    payAmount: {
        label: "node.report.purchaseTrace.payAmount",
        columnType: 'money',
        totalFlag: true
    },
    unpayAmount: {
        label: "node.report.purchaseTrace.unpayAmount",
        columnType: 'money',
        totalFlag: true
    },
    invoiceState: {
        label: "node.report.purchaseTrace.invoiceState",
        width: 200,
        type:'select',
        options:[
            {label:"node.report.purchaseTrace.invoiceStateOption1",value:"0"},
            {label:"node.report.purchaseTrace.invoiceStateOption2",value:"1"}
        ]
    },
    invoiceAmount: {
        label: "node.report.purchaseTrace.invoiceAmount",
        columnType: 'money',
        totalFlag: true
    },
    returnAmount: {
        label: "node.report.purchaseTrace.returnAmount",
        columnType: 'money',
        totalFlag: true
    },
    enterDate:{
        label: "node.report.purchaseTrace.enterDate",
        type: 'datePicker',
        width: 200,
    },
    invoiceDate:{
        label: "node.report.purchaseTrace.invoiceDate",
        type: 'datePicker',
        width: 200,
    },
    payDate:{
        label: "node.report.purchaseTrace.payDate",
        type: 'datePicker',
        width: 200,
    },
    uninvoiceAmount: {
        label: "node.report.purchaseTrace.uninvoiceAmount",
        columnType: 'money',
        totalFlag: true
    },
    projectName: {
        label: 'node.report.purchaseTrace.projectName'
    },
    taxAllAmount: {
        label: "node.report.purchaseTrace.taxAllAmount",
        columnType: 'money',
        totalFlag: true
    },
    discountAmount: {
        label: "node.report.purchaseTrace.discountAmount",
        columnType: 'money',
        totalFlag: true
    },
    aggregateAmount: {
        label: "node.report.purchaseTrace.aggregateAmount",
        columnType: 'money',
        totalFlag: true
    }
};

function dealTableConfig(list, customMap) {
    let newList = [];
    list && list.forEach(function (item) {
        let obj = map[item.columnName];
        obj = obj || (customMap && customMap[item.columnName]);
        if (obj) {
            newList.push({
                fieldName: item.columnName,
                label: obj.label,
                columnType: obj.columnType,
                width: item.columnWidth||obj.width||Constants.TABLE_COL_WIDTH.DEFAULT,
                cannotEdit:item.cannotEdit||null,
                recId: item.recId,
                visibleFlag: item.visibleFlag,
                originVisibleFlag: item.visibleFlag,
                totalFlag: obj.totalFlag
            });
        } else {
            newList.push({
                fieldName: item.columnName,
                label: undefined,
                width: 0,
                recId: item.recId,
                visibleFlag: item.visibleFlag,
                originVisibleFlag: item.visibleFlag
            });
        }
    });
    return newList;
}

function dealFilterConfig(list,customMap){
    let arr = list&&list.map(function(item){
        let config = map[item.columnName];
        config.fieldName = item.columnName;
        config.visibleFlag = item.visibleFlag;
        config.originVisibleFlag = item.visibleFlag;
        config.recId = item.recId;
        if(config.defaultValue !== undefined){
            defaultValues[config.fieldName] = config.defaultValue;
        }
        return config
    });

    return arr
}

function dealCustomField(prodTags, supplierTags) {
    let obj = {};
    prodTags && prodTags.forEach(function (item) {
        if (item.propName !== "") {
            const propertyIndex = item.mappingName && parseInt(item.mappingName.substr(item.mappingName.length - 1));
            if (item.propName !== "" && item.mappingName) {
                obj['prodPropertyValue' + propertyIndex] = {
                    columnName: 'prodPropertyValue' + propertyIndex,
                    label: item.propName,
                    value: item.mappingName,
                    visibleFlag: item.visibleFlag,
                    originVisibleFlag: item.visibleFlag
                };
            }

        }
    });

    supplierTags && supplierTags.forEach(function (item) {
        if (item.propName !== "") {
            const propertyIndex = item.mappingName && parseInt(item.mappingName.substr(item.mappingName.length - 1));
            if (item.propName !== "" && item.mappingName) {
                obj['SupplierPropValue' + propertyIndex] = {
                    fieldName: 'SupplierPropValue' + propertyIndex,
                    label: item.propName,
                    value: item.mappingName,
                    visibleFlag: item.visibleFlag,
                    originVisibleFlag: item.visibleFlag
                };
            }
        }
    });

    return obj;
}

/* 销售跟踪表. */
router.post('/export', function (req, res, next) {
    const params = req.body;
    delete params.page;
    delete params.perPage;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/report/purchase/detail/tracing`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let customMap = dealCustomField(data.tags, data.supplierTags);
            let list = data.data;
            let i = 1;
            const stateGroup = ['state', 'payState', 'invoiceState'];
            list.forEach(function (item) {
                item.key = i;
                item.serial = i++;
                item.unpayAmount = item.aggregateAmount > item.payAmount ? item.aggregateAmount -  item.payAmount  : 0;
                item.uninvoiceAmount = item.aggregateAmount > item.invoiceAmount ? item.aggregateAmount -  item.invoiceAmount  : 0;
                stateGroup.forEach(stateItem => {
                    item[stateItem] = item[stateItem] === 0 ? '未完成' : '已完成';
                })
            });
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            let tableData = DataFilter.exportData(tableConfigList,list);
            tableData = DataFilter.dealFooterTotalFieldForExport(tableConfigList,data.totalMap,tableData);
            res.json({
                retCode: 0,
                tableData: tableData,
            });
        } else {
            res.json({
                retCode: 1,
                retMsg:  (data && data.retMsg) || "网络异常，请稍后重试！"
            });
        }

    });
});
/* 销售跟踪表. */
router.post('/detail', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req, res);

    backend.post(`/pc/v1/${session.userIdEnc}/report/purchase/detail/tracing`, params, req, res, function (data) {
        console.log(JSON.stringify(data));
        if (data && data.retCode == 0) {
            let customMap = dealCustomField(data.tags, data.supplierTags);
            let list = data.data;
            let i = 1;
            const stateGroup = ['state', 'payState', 'invoiceState'];
            list.forEach(function (item) {
                item.key = i;
                item.serial = i++;
                item.unpayAmount = item.aggregateAmount > item.payAmount ? item.aggregateAmount -  item.payAmount  : 0;
                item.uninvoiceAmount = item.aggregateAmount > item.invoiceAmount ? item.aggregateAmount -  item.invoiceAmount  : 0;
                stateGroup.forEach(stateItem => {
                    item[stateItem] = item[stateItem] === 0 ? '未完成' : '已完成';
                })
            });
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            let tableData = DataFilter.dealFooterTotalFieldForList(tableConfigList,data.totalMap,list);

            let tableWidth = tableConfigList && tableConfigList.reduce(function (width, item) {
                return width + (item.width ? item.width : 200) / 1;
            }, 0);
            res.json({
                retCode: 0,
                list: tableData,
                filterConfigList: dealFilterConfig(),
                tableConfigList: tableConfigList,
                tableWidth: tableWidth,
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
                retMsg:  (data && data.retMsg) || "网络异常，请稍后重试！"
            });
        }

    });
});

module.exports = router;
