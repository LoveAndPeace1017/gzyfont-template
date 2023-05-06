const express = require('express');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const Constants = require('../../../../lib/constants');
const DataFilter = require('../../../../lib/utils/DataFilter');
const Decimal = require('../../../../lib/utils/Decimal');
const moment = require('moment');
const PropertyFilter = require('../../../../lib/utils/PropertyFilter');

const map = {
    prodCustomNo: {
        label: "node.report.mergeDelivery.prodNo"
    },
    prodName: {
        label: "node.report.mergeDelivery.prodName"
    },
    descItem: {
        label: "node.report.mergeDelivery.descItem"
    },
    brand: {
        label: "node.report.mergeDelivery.brand"
    },
    produceModel: {
        label: "node.report.mergeDelivery.produceModel"
    },
    unit: {
        label: "node.report.mergeDelivery.unit"
    },
    quantity: {
        label: "node.report.mergeDelivery.quantity",
        columnType: "decimal-quantity",
        totalFlag: true
    },
    totalQuantity: {
        label: "node.report.mergeDelivery.totalQuantity"
    },
    displayFkSaleOrderBillNo: {
        label: "node.report.mergeDelivery.fkSaleOrderBillNo"
    },
    saleCustomerOrderNo: {
        label: "node.report.mergeDelivery.fkCustomerNo"
    },
    projectName: {
        label: "node.report.mergeDelivery.projectName"
    },
    prodRemarks: {
        label: "node.report.mergeDelivery.prodRemarks"
    }
};

function dealTableConfig(list, customMap) {
    let newList = [];
    list && list.forEach(function (item) {
        let obj = map[item.columnName];
        obj = obj || (customMap && customMap[item.columnName]);
        if (obj) {
            if(item.columnName === 'customerName'){
                item.cannotEdit = true;
                item.visibleFlag = 1;
            }
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

function dealCustomField(tags, prodDataTags, billProdDataTags) {
    let obj = {};
    prodDataTags && prodDataTags.forEach(function (item) {
        if (item.propName !== "") {
            if (item.propName !== "" && item.mappingName) {
                obj[item.mappingName] = {
                    fieldName: item.mappingName,
                    label: item.propName,
                    value: item.mappingName,
                    visibleFlag: item.visibleFlag,
                    originVisibleFlag: item.visibleFlag
                };
            }
        }
    });

    billProdDataTags && billProdDataTags.forEach(function (item) {
        if (item.propName !== "") {
            const propertyIndex = item.mappingName && parseInt(item.mappingName.substr(item.mappingName.length - 1));
            if (item.propName !== "" && item.mappingName) {
                obj['item_property_value' + propertyIndex] = {
                    fieldName: 'item_property_value' + propertyIndex,
                    label: item.propName,
                    value: item.mappingName,
                    visibleFlag: item.visibleFlag,
                    width: '200',
                    originVisibleFlag: item.visibleFlag
                };
            }
        }
    });

    tags && tags.forEach(function (item) {
        if (item.propName !== "") {
            const propertyIndex = item.mappingName && parseInt(item.mappingName.substr(item.mappingName.length - 1));
            if (item.propName !== "" && item.mappingName) {
                obj['propertyValue' + propertyIndex] = {
                    fieldName: 'propertyValue' + propertyIndex,
                    label: item.propName,
                    value: item.mappingName,
                    visibleFlag: item.visibleFlag,
                    width: '200',
                    originVisibleFlag: item.visibleFlag
                };
            }
        }
    });

    return obj;
}


/* 合并送货单 */
router.post('/export', function (req, res, next) {
    const params = {
        vo1:req.body.billNo?req.body.billNo.split(','):''
    };
    delete params.page;
    delete params.perPage;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/report/ware/merge/delivery/bill`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum} = req.cookies;
            let comName = data.comName;
            data.prodDataTags = PropertyFilter.initCustomTags(data.prodDataTags,'prod_');
            let customMap = dealCustomField(data.tags,data.prodDataTags,data.billProdDataTags);
            let list = data.data;
            let i = 1;
            list =  list.map(function (item) {
                item.key = i;
                item.serial = i++;
                let propertyValues = item.propertyValues||{};
                [1,2,3,4,5].forEach((index)=>{
                    item['item_property_value'+index] = propertyValues['property_value'+index] && propertyValues['property_value'+index];
                });

                let prodPropertyValues = PropertyFilter.initCustomProperties(data.prodDataTags, item.prodPropertyValues,'prod_');
                item = {...item, ...prodPropertyValues};
                return item;
            });
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            let tableData = DataFilter.exportData(tableConfigList,list);
            let decimalMap = {quantityDecimalNum};
            tableData = DataFilter.dealFooterTotalFieldForExport(tableConfigList,data.totalMap,tableData, decimalMap);
            let getTopData = list && list[0] || {};
            //用户定制需求在导出数据加上特别字段
            //头部添加
            tableData.unshift(['购买单位：',getTopData.customerName]);
            tableData.unshift(['出库日期：',getTopData.outDate && new moment(getTopData.outDate).format('YYYY-MM-DD')]);
            tableData.unshift(['交货地址：',getTopData.outAddress]);
            tableData.unshift(['供货单位：',comName,'','','单据编号：']);
            tableData.unshift(['出货单']);
            //尾部添加
            tableData.push(['送货方式：','']);
            tableData.push(['送货人：','']);
            tableData.push(['经办人：','']);
            tableData.push(['收货单位：','（签章）','','','送货单位：','（签章）']);
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
/* 合并送货单 */
router.post('/detail', function (req, res, next) {
    const params = {
        vo1:req.body.billNo.split(',')
    };
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/report/ware/merge/delivery/bill`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum} = req.cookies;
            data.prodDataTags = PropertyFilter.initCustomTags(data.prodDataTags,'prod_');
            let customMap = dealCustomField(data.tags,data.prodDataTags,data.billProdDataTags);
            let list = data.data;
            let i = 1;
            list =  list.map(function (item) {
                item.key = i;
                item.serial = i++;
                let propertyValues = item.propertyValues||{};
                [1,2,3,4,5].forEach((index)=>{
                    item['item_property_value'+index] = propertyValues['property_value'+index] && propertyValues['property_value'+index];
                });
                let prodPropertyValues = PropertyFilter.initCustomProperties(data.prodDataTags, item.prodPropertyValues,'prod_');
                item = {...item, ...prodPropertyValues};
                return item;
            });
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            let decimalMap = {quantityDecimalNum};
            let tableData = DataFilter.dealFooterTotalFieldForList(tableConfigList,data.totalMap,list, decimalMap);
            let tableWidth = tableConfigList && tableConfigList.reduce(function (width, item) {
                return width + (item.width ? item.width : 200) / 1;
            }, 0);
            res.json({
                retCode: 0,
                list: tableData,
                comName: data.comName,
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
