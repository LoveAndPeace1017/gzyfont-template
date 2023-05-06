const express = require('express');
const router = express.Router();
const backend = require('../../../lib/backend');
const Session = require('../../../lib/session');
const Constants = require('../../../lib/constants');
const PropertyFilter = require('../../../lib/utils/PropertyFilter');

//inbound1st 采购入库
//inbound2st 销售退货
//inbound3st 其他入库
//inbound4st 盘点入库
//inbound5st 调拨入库



/* 新建模板*/
router.post('/add', function (req, res, next) {
    const params = req.body.params;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/printtemplate`, params, req, res, function (data) {
        res.json(data);
    });
});

/* 模板列表 */
router.post('/list', function (req, res, next) {
    let params = req.body.params;
    const session = Session.get(req, res);
    /*if(params && params.key){
        params.key = encodeURIComponent(params.key);
    }*/
    params = params||{}
    backend.post(`/pc/v1/${session.userIdEnc}/printtemplate/list`,params,req, res, function (data) {
        if(data.retCode == '0'){
            let i = 1;
            data.data.forEach(function(item){
                item.serial = i++;
                item.key = item.recId;
            })
            res.json(data);
        }else{
            res.json([]);
        }

    });
});

/* 删除模板 */
router.post('/delete', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.delete(`/pc/v1/${session.userIdEnc}/printtemplate`,params, req, res, function (data) {
        res.json(data);
    });
});

/* 设置默认模板 */
router.post('/setDefault', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/printtemplate/default/${params.id}`,params, req, res, function (data) {
        res.json(data);
    });
});

/* 修改模板 */
router.post('/editor', function (req, res, next) {
    const params = req.body.values;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.put(`/pc/v1/${session.userIdEnc}/printtemplate/${req.body.id}`,params, req, res, function (data) {
        res.json(data);
    });
});

/* 模板详情数据 */
router.post('/detail', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    let id = params.id;
    //如果id是含有特殊字符，走node本地数据源
    if(id.indexOf("recommend") !== -1){
         res.json(Constants.RECOMMEND_TEMPLATE_JSON[id]);
    }else{
        backend.get(`/pc/v1/${session.userIdEnc}/printtemplate/${params.id}`,params, req, res, function (data) {
            res.json(data);
        });
    }

});

/* 获取模板和页面详细数据 */
router.post('/getData', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    let url = `/pc/v1/${session.userIdEnc}/printtemplate/select/print/`;
    url = url + `${params.recId}?billNo=${params.billNo}&&billType=${params.billType}`;
    backend.post(url, req, res, function (data) {
        data = dealPrintDate(data,params.billType);
        res.json(data);
    });
});

/*直接打印*/
router.post('/directPrint', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    let url = `/pc/v1/${session.userIdEnc}/printtemplate/default/print`;
    url = url + `?billNo=${params.billNo}&&billType=${params.billType}`;
    backend.post(url, req, res, function (data) {
        //如果没有模板信息，则直接返回模板状态
        data = dealPrintDate(data,params.billType);
        res.json(data);
    });
});

function dealPrintDate(data,billType){
    if(data.status || data.status === undefined){
        if(billType === 'ProduceOrder'){
            data.data = data.pmsProduceOrder;
            data.data.pmsProduceOrderMaterialList = data.pmsProduceOrderMaterialList;
            data.data.pmsProduceOrderProductList = data.pmsProduceOrderProductList;
            let prodDataTags = PropertyFilter.initCustomTags(data.prodDataTags,'prod_');
            //生产成品
            if(data.pmsProduceOrderProductList && data.pmsProduceOrderProductList.length>0){
                let planeQuantity = 0;//成品计划总数量
                let produceQuantity = 0;//成品生产总数量
                let inQuantity = 0;//成品入库总数量

                data.data.pmsProduceOrderProductList = data.pmsProduceOrderProductList.map((item)=>{
                    planeQuantity = planeQuantity + (item.quantity)/1;
                    produceQuantity = produceQuantity + (item.finishCount)/1;
                    inQuantity = inQuantity + (item.enterCount)/1;
                    let prodPropertyValues = PropertyFilter.initCustomProperties(prodDataTags, item.prodPropertyValues,'prod_');
                    item = {...item, ...prodPropertyValues};
                    return item;
                });

                data.data.planeQuantity = planeQuantity;
                data.data.produceQuantity = produceQuantity;
                data.data.inQuantity = inQuantity;
            }
            //消耗原料
            if(data.pmsProduceOrderMaterialList && data.pmsProduceOrderMaterialList.length>0){
                let materialPlaneQuantity = 0;//原料计划总数量
                let materialTotalQuantity = 0;//原料累计总领用数量

                data.data.pmsProduceOrderMaterialList = data.pmsProduceOrderMaterialList.map((item)=>{
                    materialPlaneQuantity = materialPlaneQuantity + (item.quantity)/1;
                    materialTotalQuantity = materialTotalQuantity + (item.totalReceiveCount)/1;
                    let prodPropertyValues = PropertyFilter.initCustomProperties(prodDataTags, item.prodPropertyValues,'prod_');
                    item = {...item, ...prodPropertyValues};
                    return item;
                });

                data.data.materialPlaneQuantity = materialPlaneQuantity;
                data.data.materialTotalQuantity = materialTotalQuantity;
            }

            //处理自定义字段
            if(data.pmsProduceOrderPropList){
                let propertyValues = data.pmsProduceOrderPropList;
                propertyValues.forEach(item => {
                    data.data[item.propName] = item.propValue;
                });

            }
            //如果委外生产单， 生产部门和生产人设置为空
            if(data.data.produceType === 1){
                data.data.departmentName = '-';
                data.data.employeeName = '-';
            }
        }else if(billType === 'Subcontract'){
            //处理入库出库状态
            data.data.inState = data.inState?'已完成入库':'未完成入库';
            data.data.outState = data.outState?'已完成出库':'未完成出库';
            //处理6个特定字段
            //成品总数量
            let productQuantity = 0;
            //成品总成本
            let productAmount = 0;
            //加工费
            let productProcessCost = 0;
            //成品总金额
            let productAllocatedAmount = 0;
            //物品自定义字段
            let prodDataTags = PropertyFilter.initCustomTags(data.prodDataTags,'prod_');
            let enterProdList = data.data.enterProdList;
            if(enterProdList && enterProdList.length>0){
                data.data.enterProdList = enterProdList.map((item)=>{
                    productQuantity = productQuantity  +  item.quantity;
                    productAmount = productAmount + item.amount*1;
                    productProcessCost = productProcessCost + (item.allocatedAmount-item.amount);
                    productAllocatedAmount = productAllocatedAmount + item.allocatedAmount*1;

                    let prodPropertyValues = PropertyFilter.initCustomProperties(prodDataTags, item.prodPropertyValues,'prod_');
                    item = {...item, ...prodPropertyValues};
                    return item;
                })
            }

            //原料总数量
            let materialQuantity = 0;
            //原料总成本
            let materialAmount = 0;
            let outProdList = data.data.outProdList;
            if(outProdList && outProdList.length>0){
                data.data.outProdList = outProdList.map((item)=>{
                    materialQuantity = materialQuantity  +  item.quantity;
                    materialAmount = materialAmount + item.amount*1;

                    let prodPropertyValues = PropertyFilter.initCustomProperties(prodDataTags, item.prodPropertyValues,'prod_');
                    item = {...item, ...prodPropertyValues};
                    return item;
                })
            }
            data.data.productQuantity = productQuantity;
            data.data.productAmount = productAmount;
            data.data.productProcessCost = productProcessCost;
            data.data.productAllocatedAmount = productAllocatedAmount;
            data.data.materialQuantity = materialQuantity;
            data.data.materialAmount = materialAmount;
        }else if(billType === 'RequisitionOrder' && data.requisitionPropList && data.requisitionPropList.length>0){
            let propertyValues = data.requisitionPropList;
            propertyValues.forEach(item => {
                data.data[item.propName] = item.propValue;
            });
            let purchaseStatusMap = {
                "0": "未采购",
                "1": "部分采购",
                "2": "已采购",
            };
            data.data.purchaseStatus && (data.data.purchaseStatus = purchaseStatusMap[data.data.purchaseStatus]);
        }else if(billType === 'SaleOrder'){
            let propertyValues = data.data.propertyValues;
            let tags = PropertyFilter.initCustomTags(data.tags);
            let billProdDataTags = PropertyFilter.initCustomTags(data.billProdDataTags);
            let prodDataTags = PropertyFilter.initCustomTags(data.prodDataTags,'prod_');
            propertyValues = PropertyFilter.initCustomProperties(tags, propertyValues);
            data.data = {...data.data, ...propertyValues};
            //处理销售订单的物品信息
            let prodList = data.data.prodList;
            data.data.prodList = prodList.map((item)=>{
                item.propertyValues = PropertyFilter.initCustomProperties(billProdDataTags, item.propertyValues);
                let prodPropertyValues = PropertyFilter.initCustomProperties(prodDataTags, item.prodPropertyValues,'prod_');
                item = {...item, ...prodPropertyValues};
                return item;
            });
        }else if(billType === 'QuotationOrder'){
            let propertyValues = data.data.propertyValues;
            let tags = PropertyFilter.initCustomTags(data.tags);
            propertyValues = PropertyFilter.initCustomProperties(tags, propertyValues);
            data.data = {...data.data, ...propertyValues};
            let prodList = data.data.prodList;
            let prodDataTags = PropertyFilter.initCustomTags(data.prodDataTags,'prod_');
            data.data.prodList = prodList.map((item)=>{
                let prodPropertyValues = PropertyFilter.initCustomProperties(prodDataTags, item.prodPropertyValues,'prod_');
                item = {...item, ...prodPropertyValues};
                return item;
            });
        }else if(billType === 'ProduceWork'){
            let processTitleMap = {
                0: '下达',
                1: '开工',
                2: '完成',
                3: '关闭'
            };
            let processList = data.data.processList || [];
            processList.forEach((item)=>{
                if(item.processStatus || item.processStatus === 0){
                    let processStatusName = processTitleMap[item.processStatus];
                    item.processStatus = processStatusName;
                }
            })
            data.data.prodList = processList;
        }else{
            //处理其他单据的物品自定义字段
            let prodDataTags = PropertyFilter.initCustomTags(data.prodDataTags,'prod_');
            let prodList = data.data.prodList;
            data.data.prodList = prodList.map((item)=>{
                let prodPropertyValues = PropertyFilter.initCustomProperties(prodDataTags, item.prodPropertyValues,'prod_');
                item = {...item, ...prodPropertyValues};
                return item;
            });
        }

    }
    return data;
}


module.exports = router;
