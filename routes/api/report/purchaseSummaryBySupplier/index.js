const express = require('express');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const Constants = require('../../../../lib/constants');
const DataFilter = require('../../../../lib/utils/DataFilter');

const map = {
    purchaseOrderDate: {
        label: "node.report.purchaseSummaryBySupplier.purchaseOrderDate",
        width: Constants.TABLE_COL_WIDTH.DATE
    },
    supplierName: {
        label: "node.report.purchaseSummaryBySupplier.supplierName"
    },
    supplierContacterName: {
        label: "node.report.purchaseSummaryBySupplier.supplierContacterName"
    },
    supplierMobile: {
        label: "node.report.purchaseSummaryBySupplier.supplierMobile"
    },
    email: {
        label: "node.report.purchaseSummaryBySupplier.email"
    },
    legalRepresentative: {
        label: "node.report.purchaseSummaryBySupplier.legalRepresentative"
    },
    registeredAddress: {
        label: "node.report.purchaseSummaryBySupplier.registeredAddress"
    },
    licenseNo: {
        label: "node.report.purchaseSummaryBySupplier.licenseNo"
    },
    supplierCount: {
        label: "node.report.purchaseSummaryBySupplier.supplierCount",
        totalFlag: true
    },
    amount: {
        label: "node.report.purchaseSummaryBySupplier.amount",
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
                totalFlag: true
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
                obj['supplierPropertyValue' + propertyIndex] = {
                    fieldName: 'supplierPropertyValue' + propertyIndex,
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

/* 采购汇总表(按供应商). */
router.post('/export', function (req, res, next) {
    const params = req.body;
    delete params.page;
    delete params.perPage;
    params.headers = {
        "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/report/purchase/summary/by/supplier`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let customMap = dealCustomField(data.tags, data.tags);
            let list = data.data;
            let i = 1;
            list.forEach(function (item) {
                item.key = i;
                item.serial = i++;
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
/* 采购汇总表(按供应商). */
router.post('/detail', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req, res);

    backend.post(`/pc/v1/${session.userIdEnc}/report/purchase/summary/by/supplier`, params, req, res, function (data) {
        console.log(JSON.stringify(data));
        if (data && data.retCode == 0) {
            let customMap = dealCustomField(data.tags, data.tags);
            let list = data.data;
            let i = 1;
            list.forEach(function (item) {
                item.key = i;
                item.serial = i++;
            });
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            let tableData = DataFilter.dealFooterTotalFieldForList(tableConfigList,data.totalMap,list);

            let tableWidth = tableConfigList && tableConfigList.reduce(function (width, item) {
                return width + (item.width ? item.width : 200) / 1;
            }, 0);
            res.json({
                retCode: 0,
                list: tableData,
                filterConfigList: [],
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
