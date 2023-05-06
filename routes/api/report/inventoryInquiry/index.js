const express = require('express');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const Constants = require('../../../../lib/constants');
const DataFilter = require('../../../../lib/utils/DataFilter');
const Decimal = require('../../../../lib/utils/Decimal');
const PropertyFilter = require('../../../../lib/utils/PropertyFilter');
const logger = require('../../../../lib/logger').getLogger('default');


const map = {
    firstCatName: {
        label: "node.report.inventoryInquiry.firstCatName"
    },
    secondCatName: {
        label: "node.report.inventoryInquiry.secondCatName"
    },
    thirdCatName: {
        label: "node.report.inventoryInquiry.thirdCatName"
    },
    displayCode: {
        label: "node.report.inventoryInquiry.displayCode"
    },
    name: {
        label: "node.report.inventoryInquiry.name"
    },
    description: {
        label: "node.report.inventoryInquiry.description"
    },
    unit: {
        label: "node.report.inventoryInquiry.unit",
        width: Constants.TABLE_COL_WIDTH.UNIT
    },
    brand: {
        label: "node.report.inventoryInquiry.brand"
    },
    produceModel: {
        label: 'node.report.inventoryInquiry.produceModel'
    },
    maxQuantity:{
        label:"node.report.inventoryInquiry.maxQuantity",
        columnType: 'decimal-quantity'
    },
    minQuantity:{
        label:"node.report.inventoryInquiry.minQuantity",
        columnType: 'decimal-quantity'
    },
    currentQuantityTotal: {
        label: 'node.report.inventoryInquiry.currentQuantityTotal',
        columnType: 'decimal-quantity'
    },
    usableSaleQuantity: {
        label: 'node.report.inventoryInquiry.usableSaleQuantity',
        columnType: 'decimal-quantity'
    },
    onPassageQuantity: {
        label: 'node.report.inventoryInquiry.onPassageQuantity',
        columnType: 'decimal-quantity'
    },
    availableQuantity: {
        label: 'node.report.inventoryInquiry.availableQuantity',
        columnType: 'decimal-quantity'
    },
    saleOccupancyQuantity: {
        label: 'node.report.inventoryInquiry.saleOccupancyQuantity',
        columnType: 'decimal-quantity'
    },
    onProduceQuantity: {
        label: 'node.report.inventoryInquiry.onProduceQuantity',
        columnType: 'decimal-quantity'
    },
    orderPrice: {
        label: 'node.report.inventoryInquiry.orderPrice'
    },
    salePrice: {
        label: 'node.report.inventoryInquiry.salePrice'
    },
    produceOccupancyQuantity: {
        label: 'node.report.inventoryInquiry.produceOccupancyQuantity',
        columnType: 'decimal-quantity'
    }
};

function dealTableConfig(list, customMap, warehouseMap) {
    let newList = [];
    //物品类目
    /*const cateColumns = [{
        fieldName: 'firstCatName',
        label: '一级目录',
        visibleFlag: 1,
        displayFlag: true,
        cannotEdit: true
    },{
        fieldName: 'secondCatName',
        label: '二级目录',
        visibleFlag: 1,
        displayFlag: true,
        cannotEdit: true,
    }, {
        fieldName: 'thirdCatName',
        label: '三级目录',
        visibleFlag: 1,
        displayFlag: true,
        cannotEdit: true,
    }];
    newList = newList.concat(cateColumns);*/

    list && list.forEach(function (item) {
        let obj = map[item.columnName];
        obj = obj || (customMap && customMap[item.columnName]);
        if (obj) {
            newList.push({
                fieldName: item.columnName,
                label: obj.label,
                columnType: obj.columnType,
                width: item.columnWidth||obj.width||Constants.TABLE_COL_WIDTH.DEFAULT,
                cannotEdit: item.cannotEdit||null,
                recId: item.recId,
                visibleFlag: item.visibleFlag,
                displayFlag: item.columnName ==='name' || item.columnName==='unit' || item.columnName === 'currentQuantityTotal',
                originVisibleFlag: item.visibleFlag
            });
        }
    });

    //各地仓库
    const warehouses = Object.keys(warehouseMap);
    warehouses.length>0 && warehouses.forEach(key=>{
        const obj = warehouseMap[key];
        newList.push({
            fieldName: key,
            label: obj.label,
            columnType: 'decimal-quantity',
            width: obj.width||Constants.TABLE_COL_WIDTH.DEFAULT,
            cannotEdit: true,
            displayFlag: true,
            visibleFlag: 1
        })
    });

    return newList;
}

function dealCustomField(tags) {
    let obj = {};
    tags && tags.forEach(function (item) {
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
    return obj;
}

function dealList(list, tags, quantityDecimalNum, priceDecimalNum){
    let i = 1;
    list = list.map(function(item, index){
        item.key = index;
        item.serial = i++;
        //各地方库的list转换成和其它字段平级
        if(item.dpwList){
            item.dpwList.forEach((warehouse)=>{
                item['warehouse-' + warehouse.warehouseId] = Decimal.fixedDecimal(warehouse.currentQuantity, quantityDecimalNum);
            })
        }
        item.maxQuantity = Decimal.fixedDecimal(item.maxQuantity, quantityDecimalNum);
        item.minQuantity = Decimal.fixedDecimal(item.minQuantity, quantityDecimalNum);
        item.currentQuantityTotal = Decimal.fixedDecimal(item.currentQuantityTotal, quantityDecimalNum);
        item.usableSaleQuantity = Decimal.fixedDecimal(item.usableSaleQuantity, quantityDecimalNum);
        item.onPassageQuantity = Decimal.fixedDecimal(item.onPassageQuantity, quantityDecimalNum);
        item.availableQuantity = Decimal.fixedDecimal(item.availableQuantity, quantityDecimalNum);
        item.produceOccupancyQuantity = Decimal.fixedDecimal(item.produceOccupancyQuantity, quantityDecimalNum);
        item.orderPrice = Decimal.fixedDecimal(item.orderPrice, priceDecimalNum);
        item.salePrice = Decimal.fixedDecimal(item.salePrice, priceDecimalNum);

        let prodPropertyValues = PropertyFilter.initCustomProperties(tags, item.prodPropertyValues,'prod_');
        item = {...item, ...prodPropertyValues};
        return item
    });
    return list;
}

function dealWarehouse(warehouseList){
    const warehouseMap = {};
    warehouseList && warehouseList.length>0 && warehouseList.forEach((warehouse)=>{
        warehouseMap['warehouse-' + warehouse.warehouseId] = {
            label: warehouse.warehouseName +"-库存数量"
        }
    });

    return warehouseMap
}

/* 出入库. */
router.post('/export', function (req, res, next) {
    const params = req.body;
    delete params.page;
    delete params.perPage;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);

    backend.post(`/pc/v1/${session.userIdEnc}/report/ware/wareHouse/inventory/detail`, params, req, res, function (data) {
        logger.error('得到数据开始：',new Date());
        if (data && data.retCode == 0) {
            let {quantityDecimalNum, priceDecimalNum} = req.cookies;
            data.dataTags = PropertyFilter.initCustomTags(data.dataTags,'prod_');
            let customMap = dealCustomField(data.dataTags);
            let list = data.data;
            list = dealList(list, data.dataTags, quantityDecimalNum, priceDecimalNum);
            const warehouseMap = dealWarehouse(data.warehouseList);
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap, warehouseMap);
            let tableData = DataFilter.exportData(tableConfigList,list);
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

/* 出入库. */
router.post('/detail', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page ? parseInt(params.page) : 1;
    const session = Session.get(req, res);

    backend.post(`/pc/v1/${session.userIdEnc}/report/ware/wareHouse/inventory/detail`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum, priceDecimalNum} = req.cookies;
            data.dataTags = PropertyFilter.initCustomTags(data.dataTags,'prod_');
            let customMap = dealCustomField(data.dataTags);
            let list = data.data;
            list = dealList(list, data.dataTags, quantityDecimalNum, priceDecimalNum);
            const warehouseMap = dealWarehouse(data.warehouseList);
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap, warehouseMap);
            let tableWidth = tableConfigList && tableConfigList.reduce(function (width, item) {
                return width + (item.width ? item.width : 200) / 1;
            }, 0);
            res.json({
                retCode: 0,
                list: list,
                tableConfigList: tableConfigList,
                tableWidth: tableWidth,
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

