const express = require('express');
const router = express.Router();
const backend = require('../../../../lib/backend');
const Session = require('../../../../lib/session');
const Constants = require('../../../../lib/constants');
const DataFilter = require('../../../../lib/utils/DataFilter');
const Decimal = require('../../../../lib/utils/Decimal');
const PropertyFilter = require('../../../../lib/utils/PropertyFilter');

const tableProperty = {
    warehouseName: {0: 'enterWarehouseName', 1: 'outWarehouseName'},
    billNo: {0: 'enterDisplayBillNo', 1: 'outDisplayBillNo'},
    productCode: {0: 'enterProdCustomNo', 1: 'outProdCustomNo'},
    prodName: {0: 'enterProdName', 1: 'outProdName'},
    descItem: {0: 'enterProdDescItem', 1: 'outProdDescItem'},
    unit: {0: 'enterProdUnit', 1: 'outProdUnit'},
    recUnit: {0: 'enterProdRecUnit', 1: 'outProdRecUnit'},
    proBarCode: {0: 'enterProdproBarCode', 1: 'outProdproBarCode'},
    remarks: {0: 'enterOrderRemarks', 1: 'outOrderRemarks'},
    projectName: {0: 'enterProjName', 1: 'outProjName'}
};

const map = {
    billDate: {
        label: "node.report.inventory.billDate",
        width: Constants.TABLE_COL_WIDTH.DATE
    },
    businessType: {
        label: 'node.report.inventory.businessType'
    },
    billNo: {
        label: "node.report.inventory.billNo"
    },
    firstCatName: {
        label: "node.report.inventory.firstCatName"
    },
    secondCatName: {
        label: "node.report.inventory.secondCatName"
    },
    thirdCatName: {
        label: "node.report.inventory.thirdCatName"
    },
    productCode: {
        label: "node.report.inventory.productCode"
    },
    prodName: {
        label: "node.report.inventory.prodName"
    },
    descItem: {
        label: "node.report.inventory.descItem"
    },
    agentName: {
        label: "node.report.inventory.ourName"
    },
    batchNo: {
        label: "node.report.inventory.batchNo"
    },
    unit: {
        label: "node.report.inventory.unit",
        width: Constants.TABLE_COL_WIDTH.UNIT
    },
    recUnit:{
        label: "node.report.inventory.recUnit",
        width: 60
    },
    brand: {
        label: "node.report.inventory.brand"
    },
    produceModel: {
        label: 'node.report.inventory.produceModel'
    },
    enterName: {
        label: "node.report.inventory.enterName"
    },
    enterQuantity: {
        label: 'node.report.inventory.enterQuantity',
        columnType: 'decimal-quantity',
        totalFlag: true,
        totalKey: 'enterProdQuantityTotal'
    },
    enterProdRecQuantity: {
        label: 'node.report.inventory.enterProdRecQuantity',
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    enterProdUntaxedPrice: {
        label: 'node.report.inventory.enterProdUntaxedPrice',
        columnType: 'decimal-money'
    },
    enterUnitPrice: {
        label: 'node.report.inventory.enterUnitPrice',
        columnType: 'decimal-money'
    },
    enterProdTaxRate: {
        label: 'node.report.inventory.enterProdTaxRate'
    },
    enterProdTax: {
        label: 'node.report.inventory.enterProdTax',
        totalFlag: true
    },
    enterProdUntaxedAmount: {
        label: 'node.report.inventory.enterProdUntaxedAmount',
        totalFlag: true
    },
    enterAmount: {
        label: 'node.report.inventory.enterAmount',
        totalFlag: true,
        totalKey: 'enterProdAmountTotal'
    },
    enterProdRemarks: {
        label: 'node.report.inventory.enterProdRemarks'
    },
    outName: {
        label: 'node.report.inventory.outName'
    },
    outQuantity: {
        label: 'node.report.inventory.outQuantity',
        columnType: 'decimal-quantity',
        totalFlag: true,
        totalKey: 'outProdQuantityTotal'
    },
    outProdRecQuantity:{
        label: 'node.report.inventory.outProdRecQuantity',
        columnType: 'decimal-quantity',
        totalFlag: true
    },
    outProdUntaxedPrice: {
        label: 'node.report.inventory.outProdUntaxedPrice',
        columnType: 'decimal-money'
    },
    outUnitPrice: {
        label: 'node.report.inventory.outUnitPrice',
        columnType: 'decimal-money'
    },
    outProdTaxRate: {
        label: 'node.report.inventory.outProdTaxRate'
    },
    outProdTax: {
        label: 'node.report.inventory.outProdTax',
        totalFlag: true
    },
    enterContactName: {
        label: 'node.report.inventory.enterContactName'
    },
    outContactName: {
        label: 'node.report.inventory.outContactName'
    },
    customerOrderNo:{
        label: 'node.report.inventory.customerOrderNo'
    },
    expirationDate:{
        label: 'node.report.inventory.expirationDate'
    },
    productionDate:{
        label: 'node.report.inventory.productionDate'
    },
    outProdUntaxedAmount: {
        label: 'node.report.inventory.outProdUntaxedAmount',
        totalFlag: true
    },
    outAmount: {
        label: "node.report.inventory.outAmount",
        totalFlag: true,
        totalKey: 'outProdAmountTotal'
    },
    outProdRemarks: {
        label: 'node.report.inventory.outProdRemarks'
    },
    projectName: {
        label: 'node.report.inventory.projectName'
    },
    proBarCode: {
        label: "node.report.inventory.proBarCode",
        width: Constants.TABLE_COL_WIDTH.PROD_BAR
    },
    remarks: {
        label: "node.report.inventory.remarks"
    },
    logistics: {
        label: "node.report.inventory.logistics"
    },
    waybillNo: {
        label: "node.report.inventory.waybillNo"
    },
    warehouseName: {
        label: 'node.report.inventory.warehouseName'
    },
};

function dealFilterConfig() {
    // let arr = list && list.map(function (item) {
    //     let config = filterMap[item.columnName];
    //     config.fieldName = item.columnName;
    //     config.visibleFlag = item.visibleFlag;
    //     config.originVisibleFlag = item.visibleFlag;
    //     config.recId = item.recId;
    //     if (config.fieldName === "property_value") {
    //         config.options = Object.values(customMap);
    //     }
    //     return config
    // });
    // arr.splice(4, 0, {
    //     label: "采购日期",
    //     fieldName: 'purchaseOrderDate',
    //     visibleFlag: true,
    //     cannotEdit: true,
    //     type: 'datePicker'
    // });
    return [{
        label: "node.report.inventory.purchaseOrderDate",
        fieldName: 'purchaseOrderDate',
        visibleFlag: true,
        cannotEdit: true,
        type: 'datePicker'
    },{
        label: "node.report.inventory.catCode",
        fieldName: 'catCode',
        visibleFlag: true,
        cannotEdit: true,
        type: 'category'
    },{
        label: "node.report.inventory.prodNo",
        fieldName: 'prodNo',
        visibleFlag: true,
        cannotEdit: true,
        type: 'product'
    },{
        label: "node.report.inventory.supplierName",
        fieldName: 'supplierName',
        visibleFlag: true,
        cannotEdit: true,
        type: 'supplier'
    },{
        label: "node.report.inventory.projName",
        fieldName: 'projName',
        visibleFlag: true,
        cannotEdit: true,
        type: 'project'
    }];
}

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
                totalFlag: obj.totalFlag,
                totalKey: obj.totalKey
            });
        }
    });
    return newList;
}

function dealCustomField(tags, orderTags, enterTags, outTags, enterProdDataTags, outProdDataTags) {
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

    orderTags && orderTags.forEach(function (item) {
        if (item.propName !== "") {
            const propertyIndex = item.mappingName && parseInt(item.mappingName.substr(item.mappingName.length - 1));
            if (item.propName !== "" && item.mappingName) {
                obj['orderPropertyValue' + propertyIndex] = {
                    fieldName: 'orderPropertyValue' + propertyIndex,
                    label: item.propName,
                    value: item.mappingName,
                    visibleFlag: item.visibleFlag,
                    originVisibleFlag: item.visibleFlag
                };
            }
        }
    });

    enterTags && enterTags.forEach(function (item) {
        if (item.propName !== "") {
            const propertyIndex = item.mappingName && parseInt(item.mappingName.substr(item.mappingName.length - 1));
            if (item.propName !== "" && item.mappingName) {
                obj['enterPropertyValue' + propertyIndex] = {
                    fieldName: 'enterPropertyValue' + propertyIndex,
                    label: item.propName,
                    value: item.mappingName,
                    visibleFlag: item.visibleFlag,
                    originVisibleFlag: item.visibleFlag
                };
            }
        }
    });

    outTags && outTags.forEach(function (item) {
        if (item.propName !== "") {
            const propertyIndex = item.mappingName && parseInt(item.mappingName.substr(item.mappingName.length - 1));
            if (item.propName !== "" && item.mappingName) {
                obj['outPropertyValue' + propertyIndex] = {
                    fieldName: 'outPropertyValue' + propertyIndex,
                    label: item.propName,
                    value: item.mappingName,
                    visibleFlag: item.visibleFlag,
                    originVisibleFlag: item.visibleFlag
                };
            }
        }
    });

    enterProdDataTags && enterProdDataTags.forEach(function (item) {
        if (item.propName !== "") {
            const propertyIndex = item.mappingName && parseInt(item.mappingName.substr(item.mappingName.length - 1));
            if (item.propName !== "" && item.mappingName) {
                obj['inStorageProdPropertyValue' + propertyIndex] = {
                    fieldName: 'inStorageProdPropertyValue' + propertyIndex,
                    label: item.propName,
                    value: item.mappingName,
                    visibleFlag: item.visibleFlag,
                    originVisibleFlag: item.visibleFlag
                };
            }
        }
    });

    outProdDataTags && outProdDataTags.forEach(function (item) {
        if (item.propName !== "") {
            const propertyIndex = item.mappingName && parseInt(item.mappingName.substr(item.mappingName.length - 1));
            if (item.propName !== "" && item.mappingName) {
                obj['outStorageProdPropertyValue' + propertyIndex] = {
                    fieldName: 'outStorageProdPropertyValue' + propertyIndex,
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


function dealList(list, businessTypeInfo,tags,quantityDecimalNum, priceDecimalNum){
    let i = 1;
    let propetyAry = ['property_value1','property_value2','property_value3','property_value4','property_value5'];
    let propetyAryFormate1 = ['inStorageProdPropertyValue1','inStorageProdPropertyValue2','inStorageProdPropertyValue3','inStorageProdPropertyValue4','inStorageProdPropertyValue5'];
    let propetyAryFormate2 = ['outStorageProdPropertyValue1','outStorageProdPropertyValue2','outStorageProdPropertyValue3','outStorageProdPropertyValue4','outStorageProdPropertyValue5'];
    list = list.map(function(item, index){
        item.key = index;
        item.serial = i++;

        let searchType = item.businessType === 'enter' ? 0 : 1;
        item.billDate = item.searchDate;
        item.businessType = businessTypeInfo[item.businessType][item.searchType];
        item.billNo = item[tableProperty.billNo[searchType]];
        item.productCode = item[tableProperty.productCode[searchType]];
        item.prodName = item[tableProperty.prodName[searchType]];
        item.descItem = item[tableProperty.descItem[searchType]];
        item.unit = item[tableProperty.unit[searchType]];
        item.recUnit = item[tableProperty.recUnit[searchType]];
        item.proBarCode = item[tableProperty.proBarCode[searchType]];
        item.warehouseName = item[tableProperty.warehouseName[searchType]];

        if(item.enterType == 0){
            item.enterName = item.enterSupplierName;
        }else if(item.enterType == 1 || item.enterType == 5){
            item.enterName = item.enterOtherName;
        }else if(item.enterType == 3){
            item.enterName = item.enterCustomerName;
        }else if(item.enterType == 6){
            item.enterName = item.enterSupplierName;
        }

        if(item.outType == 2){
            item.outName = item.outCustomerName;
        }else if(item.outType == 3){
            item.outName = item.outSupplierName;
        }else if(item.outType == 4 || item.outType == 0){
            item.outName = item.outUserDepartment;
        }else if(item.outType == 6){
            item.outName = item.outSupplierName;
        }

        item.enterProdRecQuantity = Decimal.fixedDecimal(item.enterProdRecQuantity, quantityDecimalNum);
        item.enterQuantity = Decimal.fixedDecimal(item.enterProdQuantity, quantityDecimalNum);
        item.enterProdUntaxedPrice = Decimal.fixedDecimal(item.enterProdUntaxedPrice, priceDecimalNum);
        item.enterUnitPrice = Decimal.fixedDecimal(item.enterProdUnitPrice, priceDecimalNum);
        item.outProdRecQuantity = Decimal.fixedDecimal(item.outProdRecQuantity, quantityDecimalNum);
        item.outQuantity = Decimal.fixedDecimal(item.outProdQuantity, quantityDecimalNum);
        item.outUnitPrice = Decimal.fixedDecimal(item.outProdUnitPrice, priceDecimalNum);
        item.outProdUntaxedPrice = Decimal.fixedDecimal(item.outProdUntaxedPrice, priceDecimalNum);


        item.enterAmount = item.enterProdAmount;
        item.outAmount = item.outProdAmount;
        item.remarks = item[tableProperty.remarks[searchType]];

        let amounts = [1, 2, 3, 4 ,5];
        amounts.forEach((amount) => {
            if(searchType === 0) {
                item['enterProdPropertyValue' + amount] && (item['prodPropertyValue' + amount] = item['enterProdPropertyValue' + amount]);
            }
            if(searchType === 1) {
                item['outProdPropertyValue' + amount] && (item['prodPropertyValue' + amount] = item['outProdPropertyValue' + amount]);
            }
        });
        if(item.inStorageProdPropertyValue){
            let orderProdPropertyValues = item.inStorageProdPropertyValue;
            for(let j=0;j<propetyAry.length;j++){
                if(orderProdPropertyValues[propetyAry[j]]){
                    item[propetyAryFormate1[j]] = orderProdPropertyValues[propetyAry[j]];
                }
            }

        }
        if(item.outStorageProdPropertyValue){
            let orderProdPropertyValues = item.outStorageProdPropertyValue;
            for(let j=0;j<propetyAry.length;j++){
                if(orderProdPropertyValues[propetyAry[j]]){
                    item[propetyAryFormate2[j]] = orderProdPropertyValues[propetyAry[j]];
                }
            }
        }
        item.projectName = item[tableProperty.projectName[searchType]];

        let prodPropertyValues = PropertyFilter.initCustomProperties(tags, item.prodPropertyValues,'prod_');
        item = {...item, ...prodPropertyValues};
        return item;
    });
    return list;
}

/* 出入库. */
router.post('/export', function (req, res, next) {
    const params = req.body;
    delete params.page;
    delete params.perPage;
    params.headers = {
        "Content-Type": 'application/json'
    };
    if(params.type){
        let typeArray = params.type.split(',');
        params.businessType = typeArray[0];
        params.type = typeArray[1]
    }
    const session = Session.get(req, res);

    backend.post(`/pc/v1/${session.userIdEnc}/report/ware/detail/by/prod`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum, priceDecimalNum} = req.cookies;
            data.tags = PropertyFilter.initCustomTags(data.tags,'prod_');
            let customMap = dealCustomField(data.tags, data.OrderTags, data.enterTags, data.outTags,  data.enterProdDataTags, data.outProdDataTags);
            let list = data.data;
            list = dealList(list, data.businessTypeInfo, data.tags, quantityDecimalNum, priceDecimalNum);
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            let tableData = DataFilter.exportData(tableConfigList,list);
            let decimalMap = {quantityDecimalNum, priceDecimalNum};
            tableData = DataFilter.dealFooterTotalFieldForExport(tableConfigList,data.totalMap,tableData, decimalMap);
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
    if(params.type){
        let typeArray = params.type.split(',');
        params.businessType = typeArray[0];
        params.type = typeArray[1]
    }
    const session = Session.get(req, res);

    backend.post(`/pc/v1/${session.userIdEnc}/report/ware/detail/by/prod`, params, req, res, function (data) {
        if (data && data.retCode == 0) {
            let {quantityDecimalNum, priceDecimalNum} = req.cookies;
            data.tags = PropertyFilter.initCustomTags(data.tags,'prod_');
            let customMap = dealCustomField(data.tags, data.OrderTags, data.enterTags, data.outTags, data.enterProdDataTags, data.outProdDataTags);
            let list = data.data;
            list = dealList(list, data.businessTypeInfo, data.tags, quantityDecimalNum, priceDecimalNum);
            let tableConfigList =  dealTableConfig(data.listFields || [], customMap);
            let decimalMap = {quantityDecimalNum, priceDecimalNum};
            let tableData = DataFilter.dealFooterTotalFieldForList(tableConfigList,data.totalMap,list, decimalMap);
            let tableWidth = tableConfigList && tableConfigList.reduce(function (width, item) {
                return width + (item.width ? item.width : 200) / 1;
            }, 0);
            res.json({
                retCode: 0,
                list: tableData,
                filterConfigList: dealFilterConfig(),
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

// 获取出入库单 业务类型
router.get('/ware/business/type', function (req, res) {
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/report/ware/business/type`, {}, req, res, function (data) {
        res.json(data)
    });
});

module.exports = router;

