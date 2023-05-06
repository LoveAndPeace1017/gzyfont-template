const express = require('express');
const router = express.Router();
const backend = require('../../../lib/backend');
const Auth = require('../../../lib/utils/Auth');
const Session = require('../../../lib/session');
const logger = require('../../../lib/logger').getLogger('default');
// const server = 'http://192.168.16.254:2017';
// const server = 'http://192.168.16.254:3009';
const server = '';


/**
 * 获取省份列表
 */
router.get('/area', function(req, res) {
    backend.get(server + '/params/province', {
        type: 'province'
    }, req, res, function(data) {
        if (data && data.retCode == 0) {
            let result = {
                retCode: data.retCode
            };
            result.list = data.data.map(function(item) {
                let cityList = item.children.map(function(item) {
                    return {
                        value: item.parameterKey,
                        label: item.parameterValue
                    };
                });
                return {
                    value: item.parameterKey,
                    label: item.parameterValue,
                    children: cityList
                };
            });
            res.json(result);
        }
        else {
            res.json(data);
        }
    });
});
/**更新列表配置字段*/
router.post('/field/edit', function(req, res) {
    const params = {
        vo1: req.body.voList
    };
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(server + `/pc/v1/${session.userIdEnc}/moduleField/edit`, params, req, res, function(data) {
        res.json(data);
    });
});
/**重置列表配置字段*/
router.post('/field/default', function(req, res) {
    let type = req.body.type;
    let array;
    if(typeof type === 'object'){ // 如果为数组
        array = type;
    } else {
        array = req.body.configType ? [type + '_' + req.body.configType] : [type + '_list', type + '_search_list'];
    }
    let params = {
        array
    };
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(server + `/pc/v1/${session.userIdEnc}/moduleField/default`, params, req, res, function(data) {
        res.json(data);
    });
});

/**加为好友*/
router.post('/addFriend', function(req, res) {
    const params = {};
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(server + `/pc/friend/${session.userIdEnc}/${req.body.type}/${req.body.id}`, params, req, res, function(data) {
        res.json(data);
    });
});

//关键词搜索联想
router.get('/search/tips', function(req, res) {
    const {s_path, ...queryParam} = req.query;
    const params = {
        ...queryParam,
        key: encodeURIComponent(req.query.key)
    };
    const session = Session.get(req, res);
    const s_path_prefix = req.query.s_path_prefix ? req.query.s_path_prefix : '/pc/v1/';
    const path = `${s_path_prefix}${session.userIdEnc}${req.query.s_path}`;
    backend.get(path, params, req, res, function(data) {
        res.json(data)
    });
});

//好友消息列表
router.get('/friend/message', function(req, res) {
    const session = Session.get(req, res);
    backend.get(`/pc/friend/${session.userIdEnc}/message`, req.query, req, res, function(data) {
        res.json(data)
        /*const jsonData = [1,2,3,4,5,6,7,8,9,10,11,12].map((item, index)=>{
            return {
                "bindTime": 1555573518000,
                "binderName": "晓蕾测试1001"+index,
                "binderType": "customer",
                "binderUserId": 9056904,
                "recId": index
            }
        });
        res.json({
            "retCode": "0",
            "data": jsonData,
            "total":10
        })*/
    });
});
//进入页面初始化数据
router.get('/inintInfor', function(req, res) {
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/commonParam/init`,req, res, function(data) {
        res.json(data);
    });
});

router.get('/comInfo', function(req, res, next) {
    let session = Session.get(req, res);
    const params = {};
    params.headers = {
        "Content-Type": 'application/json'
    };

    function getCompanyMess(){
        return new Promise((resolve, reject)=>{
            backend.post(`/pc/confirm/${session.userIdEnc}/companyMess`, params, req, res, function(data) {
                if(data && data.retCode === '0'){
                    const session= Session.resave(req, res, {comName: data.comName,comContacts: data.companyContacts});
                    resolve(session);
                }else{
                    reject();
                }
            })
        });
    }

    async function setComInfo(){
        //如果没有公司信息或者联系人则去获取
        if(session.mainUserFlag && (!session.comName || session.comName === 'N/A' || !session.comContacts || session.comContacts === 'N/A')){
            session = await getCompanyMess();
        }
        let rst = {
            comName: session.comName,
            comContacts: session.comContacts,
            mobilePhone: session.mobilePhone,
            comEmail: session.comEmail,
            gender: session.gender,
            vipValid: session.vipValid,
            fromMain: session.fromMain,
            mainUserFlag: session.mainUserFlag,
            mainUserIdEnc: session.mainUserIdEnc,
            mainUserName: session.mainUserName,
            subUserIdEnc: session.subUserIdEnc,
            subUserName: session.subUserName,
            mallFlag:session.mallFlag||false, // 是否开通商城
            smallProgramFlag:session.smallProgramFlag||false, // 是否开通小程序
            appId:session.appId||'', // 小程序id
            appSecret:session.appSecret||'', // 小程序秘钥
        };
        if (typeof session.mainUserFlag != "undefined" && !session.mainUserFlag) {
            backend.get(`/pc/v1/${session.userIdEnc}/sub-accounts/authorities/${session.userIdEnc}`, params, req, res, function(data) {
                data.authMap = Auth.dealAuthority(data.data.authoritys);
                // 仓库在权限表里无法查看
                data.authMap.warehouse = {
                    add: 0,
                    delete: 0,
                    modify: 0,
                    show: 1,
                    copy: 0,
                    dataRange: 0,
                    name: '仓库',
                    key: 'warehouse'
                };
                // 判断该子账号是否分配了全部的仓库
                if(data.VipWareHouseValid === 'true'){
                    data.authMap.warehouse.dataRange = 2;
                }
                res.json({
                    ...data,
                    ...rst
                });
            });
        }
        else {
            res.json(rst);
        }
    }

    setComInfo();

});

/**获取二维码 用于APP扫码登录*/
router.get('/getAppQrcode', function(req, res, next) {
    const session = Session.get(req, res);
    backend.post(server + '/qr_code/getcode', {
        logonUserName: session.loginUsername,
        token: session.xtoken,
    }, req, res, function(data) {
        res.json(data)
    });
});

/**提交反馈建议*/
router.post('/feedback', function(req, res, next) {
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/advice`, req.body, req, res, function(data) {
        res.json(data)
    });
});

/**
 * 完善公司信息
 */
router.post('/completeComInfo', function(req, res, next) {
    const session = Session.get(req,res);
    backend.post(server + `/pc/confirm/${session.userIdEnc}/company`, {
        companyName:req.body.companyName,
        companyContacts:req.body.companyContacts,
    }, req, res, function(data) {
        res.json(data)
    });
});


/**
 * 记录弹层出现
 */
router.post('/popup', function(req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req,res);
    params.mainAccount = session.mainUserName;
    backend.post(`/popup/`,params, req, res, function(data) {
        res.json(data)
    });
});

//显示是否出现引导
router.post('/showIndexleader', function(req, res) {
    let params = req.body;
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/home/popopBanner`, params,req, res, function(data) {
        res.json(data)
    });
});

//显示出现弹层，及更新弹层点击状态
router.get('/isPopShow', function(req, res) {
    let params = req.query;
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/home/popup`, params,req, res, function(data) {
        res.json(data)
    });
});

//获取vip在线商城状态
router.get('/onlineMall', function(req, res) {
    let params = req.query;
    const session = Session.get(req, res);
    backend.get(`/cgi/vip/${session.userIdEnc}/online_mall`, params,req, res, function(data) {
        res.json(data)
    });
});




//OSS系统VIP服务用户（增值包）添加一条开通记录,并且开通增值服务
router.post('/asyncOpenVipAndSendRequestToOss', function(req, res, next) {
    const { source } = req.body;
    const params = {
        headers:{
            "Content-Type":'application/json'
        }
    };
    let session = Session.get(req,res);
    const mapUrl = {
        'warehouse': `/pc/v1/${session.userIdEnc}/wares/confirm`,  // 多仓库
        'fitting': `/pc/v1/${session.userIdEnc}/prod-combinations/confirm`, // 配件组合
        'print':  `/pc/v1/${session.userIdEnc}/value_added`, // 自定义打印模版
        'serial': `/pc/v1/${session.userIdEnc}/enterwares/confirm`,  // 序列号
        'discount': `/pc/v1/${session.userIdEnc}/purchases/confirm`,  // 整单优惠
        'multiLanguage': `/pc/v1/${session.userIdEnc}/multilanguage/confirm`,  // 整单优惠
        'multiApprove': `/pc/v1/${session.userIdEnc}/multi-Level-approve/confirm`, // 多级审批
        'batchShelfLeft': `/cgi/vip/${session.userIdEnc}/batchno`,  // 批次保质期
        'subContract': `/cgi/vip/${session.userIdEnc}/subcontract`,  // 委外加工
        'productManage': `/cgi/vip/${session.userIdEnc}/prodmanage`, //生产管理
        'mobileWork': `/cgi/vip/${session.userIdEnc}/mobilework`, //移动报工
        'currency': `/cgi/vip/${session.userIdEnc}/currency`, //多币种
        'orderTrack': `/cgi/vip/${session.userIdEnc}/ordertrack`, //订单追踪平台
        'smsNotify': `/pc/v1/${session.userIdEnc}/sms_notify/smsnotify`, //短信提醒
        'logisticsQuery': `/cgi/vip/${session.userIdEnc}/logistics`,
    };
    let uri = mapUrl[source] || 'warehouse'; // 默认多仓库
    backend.post(uri,params,req,res,function(data){
        res.json(data);
    });
});


const mapLimieType = {
    inbound : 'EnterWarehouse',
    outbound : 'OutWarehouse',
    goods: 'Product',
    stocktaking: 'Inventory'
};

//校验当前模块的数据是否到达上限
router.get('/checkModuleHasArriveUpperLimit', function(req, res, next) {
    let key = req.query.module;
    let type = mapLimieType[key];
    const session = Session.get(req, res);
    backend.get(`/pc/v1/${session.userIdEnc}/entrance/checklimit/${type}`,req, res, function(data) {
         res.json(data)
    });
});


//校验当前提交物品是否达到仓库上限
router.post('/checkWareArriveUpperLimit', function(req, res, next) {
    let params = req.body;
    params.source = params.source || 'purchase';
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req, res);
    const mapUrl = {
        'purchase': `/pc/v1/${session.userIdEnc}/purchases/quantity`,
        'sale': `/pc/v1/${session.userIdEnc}/saleorders/quantity`,
        'inbound':  `/pc/v1/${session.userIdEnc}/enterwares/quantity`,
        'outbound': `/pc/v1/${session.userIdEnc}/outwares/check/negative`,
    };
    let uri = mapUrl[params.source]; // 默认采购
    backend.post(uri,params,req, res, function(data) {
        res.json(data)
    });
});

//获取当前类型连续新建状态
router.post('/get/continueCreate', function(req, res) {
    const session = Session.get(req,res);
    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };
    backend.get(`/pc/v1/${session.userIdEnc}/infoSettings/continueCreate`, params , req, res, function(data) {
        res.json(data);
    });
});

//设置当前类型连续新建状态
router.post('/set/continueCreate', function(req, res) {
    const session = Session.get(req,res);
    const params = req.body;
    backend.post(`/pc/v1/${session.userIdEnc}/infoSettings/continueCreate`, params , req, res, function(data) {
        res.json(data);
    });
});

// 代办事项列表
router.get('/backlog/list', function(req, res, next) {
    const params = req.query;
    const session = Session.get(req, res);
    const mapUrl = {
        'purchase': `/pc/v1/${session.userIdEnc}/purchases/todo/${params.billNo}`,
        'sale': `/pc/v1/${session.userIdEnc}/saleorders/todo/${params.billNo}`,
    };
    let uri = mapUrl[params.source] || 'purchase'; // 默认采购

    backend.get(uri, req, res, function(data) {
        res.json(data)
    });
});


// 代办事项新增
router.post('/backlog/add', function(req, res, next) {
    let params = req.body;
    params.source = params.source || 'purchase';
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req, res);
    const mapUrl = {
        'purchase': `/pc/v1/${session.userIdEnc}/purchases/todo/remind`,
        'sale': `/pc/v1/${session.userIdEnc}/saleorders/todo/remind`,
    };
    let uri = mapUrl[params.source]; // 默认采购

    backend.post(uri,params,req, res, function(data) {
        res.json(data)
    });
});

// 代办事项删除
router.post('/backlog/delete', function (req, res) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    const mapUrl = {
        'purchase': `/pc/v1/${session.userIdEnc}/purchases/todo/delete/${params.recId}`,
        'sale': `/pc/v1/${session.userIdEnc}/saleorders/todo/delete/${params.recId}`,
    };
    let uri = mapUrl[params.source]; // 默认采购

    backend.delete(uri, params, req, res, function (data) {
        res.json(data);
    });
});

// 获取当前账号部门员工
router.get('/account/relation', function(req, res) {
    const session = Session.get(req, res);
    backend.get(`/pc/v1/account/relation/${session.userIdEnc}`, req.query, req, res, function(data) {
        res.json(data)
    });
});

//更新打印状态
router.get('/printStatus', function(req, res) {
    const session = Session.get(req, res);
    backend.post(`/pc/v1/${session.userIdEnc}/printtemplate/bill/state/print`, req.query, req, res, function(data) {
        res.json(data)
    });
});

/**已完成操作*/
router.post('/state/finish', function(req, res) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    const mapUrl = {
        purchase: `/pc/v1/${session.userIdEnc}/purchases/detail/set/${params.billNo}`,
        sale: `/pc/v1/${session.userIdEnc}/saleorders/detail/set/${params.billNo}`
    };
    let uri = mapUrl[params.source];

    backend.post(uri, params, req, res, function(data) {
        res.json(data);
    });
});

/**状态撤回操作*/
router.post('/state/revert', function(req, res) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    const mapUrl = {
        purchase: `/pc/v1/${session.userIdEnc}/purchases/detail/cancel/${params.billNo}`,
        sale: `/pc/v1/${session.userIdEnc}/saleorders/detail/cancel/${params.billNo} `
    };
    let uri = mapUrl[params.source];

    backend.post(uri, params, req, res, function(data) {
        res.json(data);
    });
});


// 获取发送短信提醒操作日志
router.get('/sms_notify', function (req, res, next) {
    const params = req.query;
    const session = Session.get(req, res);
    backend.get (`/pc/v1/${session.userIdEnc}/sms_notify/${params.source}/${params.billNo}`, params, req, res, function (data) {
        res.json(data);
    });
});

// 发送短信提醒
router.post('/sms_notify', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/x-www-form-urlencoded'
    };
    const session = Session.get(req, res);
    backend.post (`/pc/v1/${session.userIdEnc}/sms_notify/${params.source}/${params.billNo}`, params, req, res, function (data) {
        res.json(data);
    });
});

module.exports = router;
