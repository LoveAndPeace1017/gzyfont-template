const express = require('express');
const router = express.Router();
const multer  = require('multer');
const fs = require('fs');
const camelCase = require('lodash/camelCase');
const backend = require('../../../lib/backend');
const Session = require('../../../lib/session');
const Constants = require('../../../lib/constants');
const config = require('../../../config').getConfig();
const DataFilter = require('../../../lib/utils/DataFilter');
const PropertyFilter = require('../../../lib/utils/PropertyFilter');
const xssFilter = require('../../../lib/utils/xssFilter');


let storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"uploads/");
    },
    filename:function(req,file,cb) {
        let name = file.originalname;
        let arr = name.split('.');
        let extName = arr[arr.length-1];
        let fileName = arr.slice(0, -1).join('.');
        let curName = fileName+new Date().getTime()+'.'+(extName?extName:"xls");
        cb(null,curName);
    }
});

let upload = multer({storage:storage, limits:{fieldSize:'3MB'}}).fields([
    { name: 'photo', maxCount: 5 },
    { name: 'upload', maxCount: 5 },
    { name: 'myFile', maxCount: 5 }
]);

const map = {
    displayCode:{
        label:"node.goods.displayCode",
    },
    name:{
        label:"node.goods.name",
    },
    imageUrl:{
        label:"node.goods.imageUrl",
    },
    description:{
        label:"node.goods.description",
    },
    unit:{
        label:"node.goods.unit",
        width: Constants.TABLE_COL_WIDTH.UNIT
    },
    currentQuantity:{
        label:"node.goods.currentQuantity"
    },
    orderPrice:{
        label:"node.goods.orderPrice"
    },
    salePrice:{
        label:"node.goods.salePrice"
    },
    maxQuantity:{
        label:"node.goods.maxQuantity"
    },
    minQuantity:{
        label:"node.goods.minQuantity"
    },
    proBarCode:{
        label:"node.goods.proBarCode",
        width: Constants.TABLE_COL_WIDTH.PROD_BAR
    },
    brand: {
        label:"node.goods.brand",
        type: "input",
        width: Constants.TABLE_COL_WIDTH.PERSON
    },
    produceModel: {
        label:"node.goods.produceModel"
    },
    remarks:{
        label:"node.goods.remarks"
    },
    expirationFlag: {
        label: "node.goods.expirationFlag",
        width:200,
        type:'select',
        options:[
            {label:"否",value:'0'},
            {label:"是",value:'1'}
        ]
    },
    expirationDay: {
        label: "node.goods.expirationDay"
    },
    alarmDay: {
        label: "node.goods.alarmDay"
    },
    addedTime: {
        label: "node.goods.addedTime",
        width:'200',
        type:'datePicker'
    },
    wareState:{
        label:"node.goods.wareState",
        width:200,
        type:'select',
        // notNormalOption:true,
        options:[
            {label:"node.goods.wareStateOption1",value:"normal"},
            {label:"node.goods.wareStateOption2",value:"neg"},
            {label:"node.goods.wareStateOption3",value:"upper"},
            {label:"node.goods.wareStateOption4",value:"lower"}
        ]
    },
    wareName:{
        label:"node.goods.wareName",
        width:200,
        type:'select'
    },
    combinationState:{
        label:"node.goods.combinationState",
        width:200,
        type:'select',
        options:[
            {label:"node.goods.combinationStateOption1",value:"main"},
            {label:"node.goods.combinationStateOption2",value:"sub"},
            {label:"node.goods.combinationStateOption3",value:"none"}
        ],
    },
    wareQuantityLower:{
        label:"node.goods.wareQuantityLower",
        width:200,
        type:'interval'
    },
    wareQuantityUpper:{
        label:"node.goods.wareQuantityUpper",
        width:200,
        type:'interval'
    },
    wareQuantity:{
        label:"node.goods.wareQuantity",
        width:200,
        type:'interval'
    },
    property_value:{
        label:"node.goods.property_value",
        width:200,
        type:'custom'
    },
    disableFlag:{
        label:"node.goods.disableFlag",
        width:200,
        type:'select',
        options:[
            {label:'node.goods.disableFlagOption0',value:'0'},
            {label:'node.goods.disableFlagOption1',value:'1'}
        ],
    },
    specFlag:{
        label:"node.goods.specFlag",
        width:200,
        type:'select',
        options:[
            {label:'node.goods.specFlagOption0',value:'0'},
            {label:'node.goods.specFlagOption1',value:'1'}
        ]
    },
    addedUserId: {
        label:"node.goods.addedName",
        width:200,
        type:'select',
    },
    addedName: {
        label:"node.goods.addedName"
    }
};

function dealFilterConfig(list,wareList){
    let arr = [];
    list&& list.forEach(function(item){
        let config = map[item.columnName];
        if(config){
            config.fieldName = item.columnName;
            config.visibleFlag = item.visibleFlag;
            config.originVisibleFlag = item.visibleFlag;
            config.recId = item.recId;
            if(config.fieldName==="wareName"){
                config.options = wareList?wareList.map(function(item){
                    return {label:item,value:item};
                }):[];
            }
            if(config.fieldName==="wareQuantityLower" || config.fieldName==="wareQuantityUpper"){
                config.fieldName = "wareQuantity";
                config.firstFieldName= 'wareQuantityLower';
                config.secondFieldName= 'wareQuantityUpper';
            }
            arr.push(config);
        }
    });
    return unique(arr);
}

function unique(arr){
    // 遍历arr，把元素分别放入tmp数组(不存在才放)
    const tmp = [];
    const tempArr = [];
    for(var i in arr){
        if(!tempArr.includes(arr[i]['fieldName'])){
            tempArr.push(arr[i]['fieldName']);
            tmp.push(arr[i])
        }
    }
    return tmp;
}
function dealTableConfig(list,customMap){

    let preList=[],
        newList = [];
    let initFlag = true;
    list.forEach(function(item){
        if(item.columnName=='displayCode'){
            initFlag = false;
        }
        let obj = map[item.columnName];
        if(!obj){
            obj = customMap[item.columnName];
            // item.columnName = camelCase(item.columnName);
        }
        if(obj){
            if(item.columnName === 'imageUrl'&&initFlag){
                preList.push({
                    fieldName:item.columnName,
                    label:'node.goods.imageUrl',
                    fixed: obj.fixed,
                    recId:item.recId,
                    visibleFlag: item.visibleFlag,
                    originVisibleFlag: item.visibleFlag,
                    cannotEdit:true,
                    width: Constants.TABLE_COL_WIDTH.PROD_PIC,
                    align: "center"
                })
            }else{
                newList.push({
                    fieldName:item.columnName,
                    label:obj.label,
                    width: item.columnWidth||obj.width||Constants.TABLE_COL_WIDTH.DEFAULT,
                    recId:item.recId,
                    visibleFlag: item.visibleFlag,
                    originVisibleFlag: item.visibleFlag,
                    align: obj.align,
                    cannotEdit:item.cannotEdit||null
                });
            }

        }
    });
    if(initFlag){
        let unEditColumns = [{
            fieldName:'displayCode',
            label:'node.goods.displayCode',
            width: Constants.TABLE_COL_WIDTH.NO,
            visibleFlag:1,
            cannotEdit:true
        },{
            fieldName:'name',
            label:'node.goods.name',
            width: Constants.TABLE_COL_WIDTH.TEL,
            visibleFlag:1,
            cannotEdit:true
        }];
        return preList.concat(unEditColumns,newList);
    }

    return newList;
}

/* 物品列表. */
router.get('/list', function(req, res, next) {
    const params = {
        ...req.query
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page?parseInt(params.page):1;
    const session = Session.get(req,res);
    const billType = params.billType? params.billType: 'list';
    let url = `/pc/v1/${session.userIdEnc}/prods/${billType}`;
    if(params.source==='mall'){
        url = `/pc/v1/${session.userIdEnc}/mall/prods/list`;
    }
    if (params.source==='finishProduct') {
        url = `/pc/v1/${session.userIdEnc}/prods/listMain`;
    }
    backend.post(url, params,req,res,function(data){
        console.log("goods:",data);
        if(data && data.retCode==0){
            let customMap = DataFilter.dealCustomField(data.tags);
            let list = data.data;
            list = list.map((item, index) => {
                item.level = 1;
                item.key = item.code;
                item.serial = index+1;
                item.prodNo = item.code;
                item.prodCustomNo = item.displayCode;
                item.prodName = item.name;
                item.descItem = item.description;
                if(item.imageUrl && item.imageUrl.indexOf('image.cn.made-in-china.com') === -1){
                    item.imageUrl = `/api/file/img/download?url=${item.imageUrl}`;
                }
                let propertyValues = PropertyFilter.initCustomProperties(data.tags, item.propertyValues);   // 给物品列表用的
                let prodPropertyValues = PropertyFilter.addPrefixToCustomProperties(propertyValues, 'prod_'); // 给物品弹层用的  坑爹啊，同一个接口，只能这么写
                item = {...item, ...propertyValues,...prodPropertyValues};
                return item;
            });


            let tableConfigList;
            if(data.listFields){
                tableConfigList = dealTableConfig(data.listFields,customMap);
            }


            let filterConfigList = dealFilterConfig(data.searchFields, data.warehouseList);
            if(data.searchFields){
                filterConfigList = PropertyFilter.searchFilter(data.tags,data.searchFields,filterConfigList);
            }
            if(params.source === 'mall'){
                filterConfigList.unshift({
                    label:"node.goods.distributionFlag",
                    fieldName:'distributionFlag',
                    visibleFlag:true,
                    cannotEdit:true,
                    type:'select',
                    options:[
                        {label:"node.goods.distributionFlagOption1",value:"1"},
                        {label:"node.goods.distributionFlagOption2",value:"0"},
                    ]
                });
            }
            res.json({
                retCode:0,
                list:list,
                tags: data.tags,
                filterConfigList:filterConfigList,
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
/*删除物品*/
router.post('/delete', function(req, res) {
    const params = {
        vo1: req.body.ids
    };
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.delete(`/pc/v1/${session.userIdEnc}/prods`,params,req,res,function(data){
        res.json(data);
    });
});

// 绑定物品
router.post('/bind/:code', function(req, res) {
    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.post(`/pc/v1/${session.userIdEnc}/prods/${req.params.code}/bind`,params,req,res,function(data){
        res.json(data);
    });
});
// 更换绑定物品
router.post('/unbind/:code', function(req, res) {
    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };
    // delete params.prodNo;
    const session = Session.get(req,res);
    backend.post(`/pc/v1/${session.userIdEnc}/prods/${req.params.code}/unbind`,params,req,res,function(data){
        res.json(data);
    });
});

/* 设置隐藏显示 */
router.post('/status/:opeType', function(req, res, next) {
    let params = {
        ids: req.body.ids
    };
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    // const userId = 'nEoAUdKFbkYs';
    backend.post(`/pc/v1/${session.userIdEnc}/prods/${req.params.opeType}`,params,req,res,function(data){
        res.json(data);
    });
});

//根据物品code获取物品仓库数量
router.get('/:code/inventories', function(req, res) {
    const session = Session.get(req,res);
    // const userId = 'nEoAUdKFbkYs';
    backend.get(`/pc/v1/${session.userIdEnc}/prods/${req.params.code}/inventories`, req, res, function(data) {
        res.json(data)
    });
});

/* 进入新增物品后需要加载的一些信息*/
router.get('/pre/create', function(req, res, next) {
    const params = req.query;
    const session = Session.get(req,res);
    // const userId = 'nEoAUdKFbkYs';
    backend.get(`/pc/v1/${session.userIdEnc}/prods/pre/create`,params,req,res,function(data){
        data.tags = PropertyFilter.initCustomTags(data.tags);
        res.json(data);
    });
});

/* 上传图片 */
router.post('/temp_photos', function(req, res, next) {
    const type = req.query.type;
    upload(req, res, function () {
        console.log(req.file, req.files, '***');
        let file = (req.files.photo&&req.files.photo[0]) || (req.files.upload&&req.files.upload[0]) || (req.files.myFile && req.files.myFile[0]);
        let data = fs.createReadStream(file.path);
        const params = req.body;
        // const userId = 'nEoAUdKFbkYs';
        params.headers = {
            "Content-Type" : "multipart/form-data"
        };
        params.photo = data;
        if(type === 'editor'|| type === 'templateEditor'){
            params.rich = 1;
        }
        const session = Session.get(req,res);
        backend.post(`/pc/v1/${session.userIdEnc}/prods/temp_photos`,params,req,res,function(data){
            let url = data && data.data && data.data.url;
            if(url && !(type || type === 'editor')){
                url = `/api/file/img/download?url=${url}`;
                data.data.url = url;
            }
            if(type === 'editor'){
                if(data.retCode == '2001'){
                    res.json({error:{message: '每张图片的大小不超过2M'}})
                }
                res.json({...data, "uploaded":1,"url":url});
            }else if(type === 'templateEditor'){
                if(data.retCode == '2001'){
                    res.json({
                        "errno": 1,
                        "message": '图片的大小不超过2M'
                    })
                }else{
                    res.json({
                        "errno": 0,
                        "data": [data.data.url]
                    });
                }

            }else{
                res.json(data);
            }
            fs.unlink(file.path,function(err){
                console.log("upload err:"+err)
            });
        });
    });
});

/* 新增物品 */
router.post('/add', function(req, res, next) {
    const params = req.body;
    // const userId = 'nEoAUdKFbkYs';
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    let url = `/pc/v1/${session.userIdEnc}/prods`;
    if(req.body.source==='mall'){
        url = `/pc/v1/${session.userIdEnc}/mall/prods`;
    }
    backend.post(url,params,req,res,function(data){
        res.json(data);
    });
});

/* 新增多规格物品 */
router.post('/multi/add', function(req, res, next) {
    const params = req.body;
    // const userId = 'nEoAUdKFbkYs';
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    let url = `/pc/v1/${session.userIdEnc}/prods/multispecification`;
    backend.post(url,params,req,res,function(data){
        res.json(data);
    });
});

/* 新增物品报价记录 */
router.post('/quotation/add', function(req, res, next) {

    const params = {
        headers: {
            "Content-Type":'application/json',
        },
        array: JSON.stringify(req.body.ProductQuotationV2)
    };

    const session = Session.get(req,res);
    let url = `/pc/v1/${session.userIdEnc}/prods/quotation`;
    backend.post(url,params,req,res,function(data){
        res.json(data);
    });
});


/* 详情页新增多规格物品 */
router.post('/multi/modify/:code', function(req, res, next) {
    const params = req.body;
    // const userId = 'nEoAUdKFbkYs';
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    let url = `/pc/v1/${session.userIdEnc}/prods/multispecification/${req.params.code}`;
    backend.post(url,params,req,res,function(data){
        res.json(data);
    });
});



/* 修改物品 */
router.post('/modify/:code', function(req, res, next) {
    const params = req.body;
    // const userId = 'nEoAUdKFbkYs';
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    let url = `/pc/v1/${session.userIdEnc}/prods/${req.params.code}`;
    if(req.body.source==='mall'){
        url = `/pc/v1/${session.userIdEnc}/mall/prods/${req.params.code}`;
    }
    backend.put(url, params, req, res,function(data){
        res.json(data);
    });
});



/* 修改报价记录 */
router.post('/quotation/modify/:code', function(req, res, next) {
    const params = req.body;
    // const userId = 'nEoAUdKFbkYs';
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    let url = `/pc/v1/${session.userIdEnc}/prods/quotation/${req.params.code}`;

    backend.put(url, params, req, res,function(data){
        res.json(data);
    });
});



//物品详情页
router.get('/detail/:id', function(req, res) {
    const session = Session.get(req,res);

    res.locals.tasks = {};
    let tasks = [
        {
            uri: config.cnMobileBackendUrl + `/catalog/loadAll`,
            method: 'get',
            params: {},
            task: function (data) {
                res.locals.tasks.pre = data;
            }
        },
        {
            uri: `/pc/v1/${session.userIdEnc}/prods/${req.params.id}`,
            params: {},
            method: 'get',
            task: function (data) {
                res.locals.tasks.detail = data;
            }
        }
    ];

    backend.post(tasks, req, res, function () {
        let data = res.locals.tasks.detail;
        let cateList = [];
        let pre = res.locals.tasks.pre;
        if (pre && pre.code == 0) {
            cateList = pre.children;
        }

        function findCateName(cateCode, cateList, prevPath) {
            for (let catItem of cateList) {
                if (cateCode == catItem.catCode) {
                    return prevPath ? (prevPath + '>' + catItem.catNameCn) : catItem.catNameCn
                } else if (catItem.children) {
                    const ret = findCateName(cateCode, catItem.children, prevPath ? (prevPath + '>' + catItem.catNameCn) : catItem.catNameCn);
                    if (ret) {
                        return ret;
                    }
                }
            }
            return undefined;
        }

        if (data && data.retCode == 0) {
            let images = data && data.data.images;
            if(images){
                images = images.map(image=>{
                    if(image.thumbnailUri && image.thumbnailUri.indexOf('image.cn.made-in-china.com') === -1){
                        // image.thumbnailUri = image.thumbnailUri + '?userId='+ session.userIdEnc + '&token=' + session.xtoken;
                        image.thumbnailUri = `/api/file/img/download?url=${image.thumbnailUri}`
                    }
                    if(image.uri && image.uri.indexOf('image.cn.made-in-china.com') === -1){
                        // image.uri = image.uri + '?userId='+ session.userIdEnc + '&token=' + session.xtoken;
                        image.uri = `/api/file/img/download?url=${image.uri}`
                    }
                    return image;
                });
                data.data.images = images;
            }
            if(data.dataProductSyncBo){
                data.dataProductSyncBo.cateName = cateList && findCateName(data.dataProductSyncBo.catCode, cateList, "");
                data.dataProductSyncBo.prodDesc = xssFilter(data.dataProductSyncBo.prodDesc);
            }

            res.json(data);
        } else {
            res.json({
                retCode: 1,
                retMsg: "网络异常，请稍后重试！"
            });
        }
    });
});

//扫码录单（根据物品条码获取物品信息）
router.get('/scan/:barCode', function(req, res) {
    // backend.get(`/prod/detail/${req.params.id}`, req, res, function(data) {
    //     res.json(data)
    // });
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/prods/detail/by/barcode?barcode=${req.params.barCode}`, req, res, function(data) {
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

//关键词搜索联想
router.get('/search/tips', function(req, res) {
    const params = {
        ...req.query,
        key: encodeURIComponent(req.query.key)
    };
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/prods/search/tips`, params, req, res, function(data) {
        res.json(data)
    });
});

//物品联想（根据物品编号或者名称所搜）
router.get('/search/by/field', function(req, res) {
    const params = {
        ...req.query,
        key: encodeURIComponent(req.query.key)
    };
    if(req.query.wareName){
        params.warehouseName = encodeURIComponent(params.wareName);
        delete params.wareName;
    }
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/prods/search/by/field`, params, req, res, function(data) {
        data.data = data.data.map(item => {
            let propertyValues = PropertyFilter.initCustomProperties(data.tags, item.propertyValues);   // 给物品列表用的
            let prodPropertyValues = PropertyFilter.addPrefixToCustomProperties(propertyValues, 'prod_'); // 给物品弹层用的  坑爹啊，同一个接口，只能这么写
            item = {...item,...prodPropertyValues};
            return item;
        });
        res.json(data)
    });
});


/*设置分销物品*/
router.post('/setDistribute/', function(req, res) {
    const params = {
        vo1:req.body.ids
    };
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);

    backend.post(`/pc/v1/${session.userIdEnc}/prods/batchDistribute?optionFlag=${req.body.optionFlag}`,params,req,res,function(data){
        res.json(data);
    });
});

//内贸站物品类目
router.get('/catalog/loadAll', function(req, res) {
    backend.get(config.cnMobileBackendUrl + `/catalog/loadAll`, req.query, req, res, function(data) {
        res.json(data)
    });
});

//内贸站物品分组
router.get('/prod/micGroups', function(req, res) {
    const session = Session.get(req,res);
    backend.get(`/cgi/sync/${session.userIdEnc}/prod/micGroups`, req.query, req, res, function(data) {
        res.json(data)
        /*res.json({
            data: [{
                "groupIdEnc": "sadsa88899",
                "groupName": "led"
            },{
                "groupIdEnc": "sadsa8889339",
                "groupName": "大大方方付付"
            }]
        })*/
    });
});

//内贸站物品列表
router.get('/prod/list', function(req, res) {
    const params = req.query;
    if(req.query.key){
        params.key=encodeURIComponent(req.query.key)
    }

    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page || 1;
    const session = Session.get(req,res);
    backend.get(`/cgi/sync/${session.userIdEnc}/prod/list`, params, req, res, function(data) {
        if(data && data.retCode === '0'){
            const list = data.data.total > 0 ? data.data.list.map(function(item, index){
                item.key = item.prodIdEnc;
                item.serial = index + 1;
                /*if(item.picUrls){
                    item.picUrls = item.picUrls.map(picUrl=>{
                        return `/api/file/img/download?url=${picUrl}`
                    });
                }*/
                return item;
            }):[];

            res.json({
                retCode:0,
                list:list,
                pagination:{
                    total:data.data.total,
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


//手动导入内贸站物品
router.post('/prod/manual', function(req, res) {
    const params = {
        array: req.body.prodIds
    };
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.post(`/cgi/sync/${session.userIdEnc}/prod/manual`, params, req, res, function(data) {
        res.json(data)
    });
});

//自动导入内贸站物品
router.post('/prod/auto', function(req, res) {
    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.post(`/cgi/sync/${session.userIdEnc}/prod/auto`, params, req, res, function(data) {
        res.json(data)
    });
});

// 设置物品价格
router.post('/addPrice', function(req, res) {
    const params = {
        array: req.body.list
    };
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.put(`/pc/v1/${session.userIdEnc}/mall/prods/salePrice/batch`, params, req, res, function(data) {
        res.json(data)
    });
});

//查看物品名称是否重复
router.get('/check/name', function(req, res) {
    const session = Session.get(req,res);
    const params = {
        vo1: req.query.name
    };
    params.headers = {
        "Content-Type":'application/json'
    };
    backend.post(`/pc/v1/${session.userIdEnc}/prods/check/name`,params, req, res, function(data) {
        res.json(data)
    });
});

//分配物品给子账号获取
router.get('/subAccounts/:id', function(req, res, next) {
    let session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/prods/${req.params.id}/subaccounts`,{},req,res,function(data){
        res.json(data);
    });
});
//分配物品给子账号提交
router.post('/allocSubAccounts/:id', function(req, res, next) {
    const params = {
        visableConfig: req.body.list,
        headers:{
            "Content-Type":'application/json'
        }
    };
    let session = Session.get(req,res);
    backend.put(`/pc/v1/${session.userIdEnc}/prods/${req.params.id}/subaccounts`,params,req,res,function(data){
        res.json(data);
    });
});

// 批量分配物品给子账号提交
router.post('/batch/allocSubAccounts/', function(req, res, next) {
    const params = {
        prodIds: req.body.selectIds,
        subUserIds: req.body.subUserIds,
        status: req.body.status,
        headers:{
            "Content-Type":'application/json'
        }
    };
    let session = Session.get(req,res);
    backend.put(`/pc/v1/${session.userIdEnc}/prods/batch/subaccounts`,params,req,res,function(data){
        res.json(data);
    });
});


// 获取当前物品的多规格的单位
router.get('/units/:productCode', function(req, res, next) {
    let session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/prods/units/${req.params.productCode}`,{},req,res,function(data){
        res.json(data);
    });
});


/* 物品列表. */
router.get('/supplier/quotation/record', function(req, res, next) {
    const params = {
        ...req.query
    };
    params.productCode = params.recordFor;
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page?parseInt(params.page):1;
    delete params.recordFor;
    const session = Session.get(req,res);
    backend.post(`/pc/v1/${session.userIdEnc}/prods/quotation/list`, params,req,res,function(data){
        console.log("goods:",data);
        if(data && data.retCode==="0"){
            res.json({
                retCode: "0",
                data: data.data,
                pagination:{
                    total: data.count,
                    current: params.page*1,
                    pageSize: params.perPage*1
                }
            });
        }
    });
});

/*删除物品*/
router.post('/supplier/quotation/delete', function(req, res) {
    const params = {
        vo1: req.body.ids
    };
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.delete(`/pc/v1/${session.userIdEnc}/prods/quotation/delete`,params,req,res,function(data){
        res.json(data);
    });
});

module.exports = router;
