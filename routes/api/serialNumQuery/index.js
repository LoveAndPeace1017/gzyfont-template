const express = require('express');
const router = express.Router();
const backend = require('../../../lib/backend');
const Session = require('../../../lib/session');
const Constants = require('../../../lib/constants');
const server = '';

const map = {
    displayCode:{
        label:"node.serialNumQuery.productCode"
    },
    productCode:{
        label:"node.serialNumQuery.productCode"
    },
    productName: {
        label:"node.serialNumQuery.productName"
    },
    serialNumber: {
        label:"node.serialNumQuery.serialNumber"
    },
    instoreStatus:{
        label:"node.serialNumQuery.instoreStatus"
    },
    warehouseName:{
        label:"node.serialNumQuery.warehouseName",
    },
    ope:{
        label:"node.serialNumQuery.ope",
    },
};

const listFields = [
    {columnName: 'displayCode', visibleFlag: 1},
    {columnName: 'productName', visibleFlag: 1},
    {columnName: 'serialNumber', visibleFlag: 1},
    {columnName: 'instoreStatus', visibleFlag: 1},
    {columnName: 'warehouseName', visibleFlag: 1},
    {columnName: 'ope', visibleFlag: 1}
];

const searchFields = [
    {columnName: 'serialNumber', visibleFlag: 1},
    {columnName: 'productCode', visibleFlag: 1},
    {columnName: 'instoreStatus', visibleFlag: 1},
    {columnName: 'warehouseName', visibleFlag: 1},
];

function dealFilterConfig(list){
    let arr = list&&list.map(function(item){
        let config = map[item.columnName];
        config.fieldName = item.columnName;
        config.visibleFlag = item.visibleFlag;
        config.originVisibleFlag = item.visibleFlag;
        config.recId = item.recId;
        return config;
    });
    return arr;
}

function dealTableConfig(list){
    let newList = list&&list.map(function(item){
        let config = map[item.columnName];
        config.fieldName = item.columnName;
        config.visibleFlag = item.visibleFlag;
        config.originVisibleFlag = item.visibleFlag;
        config.recId = item.recId;
        config.width = item.columnWidth ||Constants.TABLE_COL_WIDTH.DEFAULT;
        return config;
    });
    return newList;
}


/* 序列号列表. */
router.post('/list', function(req, res) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page?params.page:1;
    const session = Session.get(req,res);
    let url = `/pc/v1/${session.userIdEnc}/prods/serialnumber/list`;
    backend.post(url, params, req, res, function (data) {
        if(data && data.retCode==0){
            let list = data.data;
            let i = 1;
            list&&list.forEach(function(item){
                item.key = item.id;
                item.serial = i++;
            });
            let tableConfigList = dealTableConfig(listFields);
            let filterConfigList = dealFilterConfig(searchFields);
            res.json({
                retCode:0,
                list:list,
                filterConfigList:filterConfigList,
                tableConfigList:tableConfigList,
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

module.exports = router;
