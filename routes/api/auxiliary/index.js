const express = require('express');
const router = express.Router();
const backend = require('../../../lib/backend');
const Session = require('../../../lib/session');
const Constants = require('../../../lib/constants');
const qs = require('querystring');
var crypto = require('crypto');

function md5Crypto(num){
    let hash = crypto.createHash('md5');
    hash.update(num);
    //得到字符串，如果是等号去掉
    const md5Password = hash.digest('hex');
    console.log(md5Password, 'md5Password');
    return md5Password;
}

//部门员工列表
router.get('/dept/list', function(req, res, next) {
    const params = {};
    params.orderByType = req.query.orderByType;
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/departs`, params, req, res, function(data) {
        res.json(data)
    });
});

//部门员工列表(级联数据)
router.get('/dept/list/employee', function(req, res, next) {
    const params = {};
    params.orderByType = req.query.orderByType;
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/departs/list/employee`, params, req, res, function(data) {
        if(req.query.visibleFlag){
            data.data = data.data.map(item =>{
                item.employeeList = item.employeeList.filter(employee => employee.visibleflag === 0);
                return item
            })
        }
        res.json(data)
    });
});

//新增、编辑、修改部门
router.post('/dept/oprate/:type', function(req, res) {
    const type = req.params.type;

    const params = {};
    params.headers = {
        "Content-Type":'application/json'
    };
    params.paramName = req.body.name;

    const session = Session.get(req,res);
    let uri = `/pc/v1/${session.userIdEnc}/departs/`;
    uri = (type === 'edit' || type === 'del') ? (uri + req.body.id) : uri;
    type === 'edit' &&  backend.put(uri, params, req, res, function(data) {
        res.json(data);
    });
    type === 'add' && backend.post(uri, params, req, res, function(data) {
        res.json(data);
    });
    type === 'del' && backend.delete(uri, params, req, res, function(data) {
        res.json(data);
    })
});


//员工列表
router.get('/emp/list', function(req, res) {
    const params = {};
    params.orderByType = req.query.orderByType;
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/employees`, params, req, res, function(data) {
        if(req.query.visibleFlag){
            data.data = data.data.filter(item => item.visibleflag === 0);
        }
        res.json(data)
    });
});

//新增、编辑、修改人员
router.post('/emp/oprate/:type', function(req, res) {
    const type = req.params.type;

    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };

    const session = Session.get(req,res);
    let uri = `/pc/v1/${session.userIdEnc}/employees/`;
    uri = (type === 'edit' || type === 'del') ? (uri + req.body.id) : uri;
    type === 'edit' &&  backend.put(uri, params, req, res, function(data) {
        res.json(data);
    });
    type === 'add' && backend.post(uri, params, req, res, function(data) {
        res.json(data);
    });
    type === 'del' && backend.delete(uri, params, req, res, function(data) {
        res.json(data);
    })
});

//项目隐藏和显示操作
router.post('/employee/visible', function(req, res) {
    const session = Session.get(req,res);
    let uri = `/pc/v1/${session.userIdEnc}/employees/visible/${req.body.id}?visibleFlag=${req.body.visibleFlag}`;
    let params = {
        headers:{
            "Content-Type":'application/json'
        }
    };
    backend.put(uri, params, req, res, function(data) {
        res.json(data)
    });
});

//校验名称(部门 、员工 、物品单位、收支管理)
router.get('/:layerName/:type/checkName', function(req, res) {
    const type = req.params.type;
    const layerName = req.params.layerName;
    const params = {
        name: encodeURIComponent(req.query.name)
    };
    let url = `/${layerName}/${type}/checkName`;
    if(layerName === 'incomeexpense'){
        const propName = encodeURIComponent(req.query.name);
        params == {};
        url = `/${layerName}/${type}/check/${propName}`;
    }
    if(type === 'category'){

    }
    backend.get(url, params, req, res, function(data) {
        res.json(data)
    });
});

// 项目管理列表
router.get('/project/list', function(req, res) {
    const params = {};
    params.orderByType = req.query.orderByType;
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/projects`, params, req, res, function(data) {
        if(req.query.visibleFlag){
            data.data = data.data.filter(item => item.visibleflag === 0);
        }
        res.json(data);
    });
});

//新增、编辑、删除项目
router.post('/project/oprate/:type', function(req, res) {
    const type = req.params.type;
    const session = Session.get(req,res);
    const params = req.body;
    let query = qs.stringify(params);

    params.userId = session.userIdEnc;
    params.headers = {
        "Content-Type":'application/json'
    };

    let uri = `/pc/v1/${session.userIdEnc}/projects`;

    uri = type !== 'add' ? (uri + `/${req.body.id}/?${query}`) : (uri + `/?${query}`);

    type === 'edit' &&  backend.put(uri, params, req, res, function(data) {
        res.json(data);
    });
    type === 'add' && backend.post(uri, params, req, res, function(data) {
        res.json(data);
    });
    type === 'del' && backend.delete(uri, params, req, res, function(data) {
        res.json(data);
    })
});

//项目隐藏和显示操作
router.post('/project/visible', function(req, res) {
    const session = Session.get(req,res);
    let uri = `/pc/v1/${session.userIdEnc}/projects/visible/${req.body.id}?visibleFlag=${req.body.visibleFlag}`;
    let params = {
        headers:{
            "Content-Type":'application/json'
        }
    };
    backend.put(uri, params, req, res, function(data) {
        res.json(data)
    });
});

// 单据编号列表
router.get('/serial/list', function(req, res) {
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/billcoderules`, {}, req, res, function(data) {
        res.json(data)
    });
});

// 其他单据编号列表
router.get('/serial/other/list', function(req, res) {
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/billcoderules/other/number`, {}, req, res, function(data) {
        res.json(data)
    });
});

//报存单据编号
router.post('/serial/add', function(req, res) {
    const session = Session.get(req,res);
    if(req.body.type){
        let moduleArray = [{module:'Bom',prefix: req.body.prefix['Bom']}];
        let uri = `/pc/v1/${session.userIdEnc}/billcoderules/other/editnum?jsonArray=`+JSON.stringify(moduleArray);
        backend.put(uri, {}, req, res, function(data) {
            res.json(data)
        });
    }else{
        let moduleArray = [{module:'OutWarehouse'},{module:'EnterWarehouse'},{module:'PurchaseOrder'},{module:'SaleOrder'},{module: 'Requisition'}];
        let jsonArray = moduleArray.map(item=>{
            item.prefix = req.body.prefix[item.module];
            item.midfix = req.body.date[item.module].length>6?'yyyyMMdd':'yyyyMM';
            return item;
        })
        let uri = `/pc/v1/${session.userIdEnc}/billcoderules?jsonArray=`+JSON.stringify(jsonArray);
        backend.put(uri, {}, req, res, function(data) {
            res.json(data)
        });
    }

});

//物品分类列表
router.get('/category/list', function(req, res) {
    const session = Session.get(req,res);
    // const userId = 'nEoAUdKFbkYs';
    backend.get(`/pc/v1/${session.userIdEnc}/prods/category/list`, req.query, req, res, function(data) {
        res.json(data)
    });
});

//新增物品类目
router.post('/category/:operType', function(req, res) {
    const operType = req.params.operType;
    const session = Session.get(req,res);
    let url = `/pc/v1/${session.userIdEnc}/prodcats`;
    switch (operType){
        case 'add':
            req.body.name = encodeURIComponent(req.body.name);
            url+='?json='+JSON.stringify(req.body);
            backend.post(url,{}, req, res, function(data) {
                res.json(data)
            });
            break;
        case 'edit':
            req.body.name = encodeURIComponent(req.body.name);
            url+=`/${req.body.code}?json=`+JSON.stringify(req.body);
            backend.put(url,{}, req, res, function(data) {
                res.json(data)
            });
            break;
        case 'del':
            url+=`/${req.body.code}`;
            backend.delete(url,{}, req, res, function(data) {
                res.json(data)
            });
    }
});

//修改物品类目
// router.post('/category/edit', function(req, res) {
//     let uri = `/prod/category/edit`;
//     backend.post(uri, req.body, req, res, function(data) {
//         res.json(data)
//     });
// });
//
// //删除人员
// router.post('/category/del', function(req, res) {
//     let uri = `/prod/category/del`;
//     backend.post(uri, req.body, req, res, function(data) {
//         res.json(data)
//     });
// });

// 自定义字段列表
router.get('/customField/list', function(req, res) {
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/datatags`, {
        moduleName:req.query.type
    }, req, res, function(data) {
        res.json(data)
    });
});

//编辑、删除自定义字段
router.post('/customField/oprate/:operType', function(req, res) {
    const session = Session.get(req,res);
    const operType = req.params.operType;
    let url = `/pc/v1/${session.userIdEnc}/datatags/${req.body.id}`;
    if(operType !== 'edit'){
        backend.delete(url, {}, req, res, function(data) {
            res.json(data)
        });
    }else{
        url += '?propName='+encodeURIComponent(req.body.propName);
        backend.put(url, {}, req, res, function(data) {
            res.json(data)
        });
    }

});

//新自定义字段列表
router.get('/newCustomField/list', function(req, res) {
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/datatags`, {
        moduleName:req.query.type
    }, req, res, function(data) {
        if(data.retCode === "0" && data.data){
            data.data.forEach((item,index)=>{
                item.index = index;
                item.key = index+1;
            });
        }
        res.json(data)
    });
});

//新增，编辑，删除新自定义字段
router.post('/newCustomField/oprate/:operType', function(req, res) {
    const session = Session.get(req,res);
    const operType = req.params.operType;
    let url = `/pc/v2/${session.userIdEnc}/datatags/${req.body.id}`;
    switch (operType){
        case 'add':
            const params = req.body;
            let moduleName = req.body.moduleName;
            params.headers = {
                "Content-Type":'application/json'
            };
            backend.post(`/pc/v2/${session.userIdEnc}/datatags?moduleName=${moduleName}`, params, req, res, function(data) {
                res.json(data);
            });
            break;
        case 'edit':
            const params1 = req.body;
            params1.headers = {
                "Content-Type":'application/json'
            };
            backend.put(url, params1, req, res, function(data) {
                res.json(data)
            });
            break;
        case 'del':
            backend.delete(url, {}, req, res, function(data) {
                res.json(data)
            });
    }

});



// 客户级别列表
router.get('/customerLv/list', function(req, res) {
    const params = {};
    params.headers = {
        "Content-Type":'application/json'
    };
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/customerLevel/list`, req.query, req, res, function(data) {
        res.json(data)
    });
});

//新增、编辑、删除客户级别
router.post('/customerLv/oprate/:type', function(req, res) {
    const type = req.params.type;
    const session = Session.get(req,res);
    const params = req.body;
    let query = qs.stringify(params);

    params.userId = session.userIdEnc;
    params.headers = {
        "Content-Type":'application/json'
    };
    let uri = `/pc/v1/${session.userIdEnc}/customerLevel`;

    uri = type === 'edit' ? (uri + `/${req.body.recId}/?${query}`) : (uri + `/?${query}`);

    type === 'edit' &&  backend.put(uri, params, req, res, function(data) {
        res.json(data);
    });
    type === 'add' && backend.post(uri, params, req, res, function(data) {
        res.json(data);
    });
    type === 'del' && backend.delete(uri, params, req, res, function(data) {
        res.json(data);
    })
});

//物品单位列表
router.get('/unit/list', function(req, res) {
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/units`,{}, req, res, function(data) {
        res.json(data)
    });
});

//新增、编辑、删除物品单位
router.post('/goodsUnit/oprate/:type', function(req, res) {
    const session = Session.get(req,res);
    const type = req.params.type;
    let url = `/pc/v1/${session.userIdEnc}/units`;
    switch (type){
       case 'add':
           req.body.paramName = encodeURIComponent(req.body.paramName);
           url+='?json='+JSON.stringify(req.body);
           backend.post(url,{}, req, res, function(data) {
               res.json(data)
           });
           break;
        case 'edit':
            req.body.paramName = encodeURIComponent(req.body.paramName);
            url+=`/${req.body.id}?json=`+JSON.stringify(req.body);
            backend.put(url,{}, req, res, function(data) {
                res.json(data)
            });
            break;
        case 'del':
            url+=`/${req.body.id}`;
            backend.delete(url,{}, req, res, function(data) {
                res.json(data)
            });
   }

});

//收支管理列表
router.get('/:propType/list', function(req, res) {
    const session = Session.get(req,res);
    let url = `/pc/v1/${session.userIdEnc}/incomeExpense/${req.params.propType}/list`;
    backend.get(url, {}, req, res, function(data) {
        res.json(data)
    });
});

//结算方式数据列表
router.get('/orderType/lists', function(req, res) {
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/pay`, {
        moduleName:req.query.type
    }, req, res, function(data) {
        res.json(data);
    });
});
//收货地址数据列表
router.get('/address/lists', function(req, res) {
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/addresses`, {
        moduleName:req.query.type
    }, req, res, function(data) {
        res.json(data);
        console.log(data);
    });
    //res.json([{id:1,paramName:'123',isCommon:1},{id:2,paramName:'134',isCommon:0}]);
});
// 收货地址更改常用项
router.get('/address/editCommon', function(req, res) {
    const session = Session.get(req,res);
    const operType = req.params.operType;
    let url = `/pc/v1/${session.userIdEnc}/addresses/${req.query.id}/main`;
    backend.put(url, {}, req, res, function(data) {
        res.json(data)
    });
});
//收货地址增删改
router.post('/address/:operType', function(req, res) {
    const session = Session.get(req,res);
    const operType = req.params.operType;
    let url = `/pc/v1/${session.userIdEnc}/addresses/`;
    switch (operType){
        case 'add':
            var json = {
                receiverProvinceCode : req.body.cityCode[0],
                receiverCityCode : req.body.cityCode[1],
                receiverProvinceText:req.body.provinceText,
                receiverCityText:req.body.cityText,
                receiverAddress : req.body.paramName,
                headers:{
                    "Content-Type":'application/json'
                }
            };
            backend.post(url, json, req, res, function(data) {
                res.json(data);
            });
            break;
        case 'edit':
            var json = {
                receiverProvinceCode : req.body.cityCode[0],
                receiverCityCode : req.body.cityCode[1],
                receiverProvinceText:req.body.provinceText,
                receiverCityText:req.body.cityText,
                receiverAddress : req.body.paramName,
                headers:{
                    "Content-Type":'application/json'
                }
            };
            url+=`${req.body.id}`;
            backend.put(url, json, req, res, function(data) {
                res.json(data)
            });
            break;
        case 'delete':
            url+=`${req.body.id}`
            backend.delete(url, {}, req, res, function(data) {
                res.json(data)
            });
    }
});
//快递方式数据列表
router.get('/express/lists', function(req, res) {
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/logistic`, {
        moduleName:req.query.type
    }, req, res, function(data) {
        res.json(data);
    });
});
//发票类型数据列表
router.get('/bill/lists', function(req, res) {
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/invoice`, {
        moduleName:req.query.type
    }, req, res, function(data) {
        res.json(data);
    });
});
//税收数据列表
router.get('/rate/lists', function(req, res) {
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/taxRate`, {
        moduleName:req.query.type
    }, req, res, function(data) {
        res.json(data);
    });
});
// 税收更改常用项
router.get('/rate/editCommon', function(req, res) {
    const session = Session.get(req,res);
    const operType = req.params.operType;
    let url = `/pc/v1/${session.userIdEnc}/taxRate/common/${req.query.id}`;
    console.log(url);
    backend.put(url, {}, req, res, function(data) {
        res.json(data)
    });
});

//审批数据列表
const billMap = {
    'PurchaseOrder': 'node.auxiliary.PurchaseOrder',
    'SaleOrder': 'node.auxiliary.SaleOrder',
    'EnterWarehouse': 'node.auxiliary.EnterWarehouse',
    'OutWarehouse': 'node.auxiliary.OutWarehouse',
    'Payment': 'node.auxiliary.Payment',
    'SalePayment': 'node.auxiliary.SalePayment',
    'Invoice': 'node.auxiliary.Invoice',
    'SaleInvoice': 'node.auxiliary.SaleInvoice',
    'Requisition': 'node.auxiliary.Requisition'
};
router.get('/approve/lists', function(req, res) {
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/infoSettings/list/approve`, {} , req, res, function(data) {
        if(data && data.retCode === '0'){
            const billData = data.data && data.data.map(item=>{
                item.billName = billMap[item.configValue];
                return item;
            });
            res.json({
                retCode: data.retCode,
                data: billData
            })
        }else{
            res.json(data)
        }
    });
});

//检查业务单据是否已全部审核
router.post('/check/approve', function(req, res) {
    const session = Session.get(req,res);
    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };
    backend.post(`/pc/v1/${session.userIdEnc}/infoSettings/check/approve`, params , req, res, function(data) {
        res.json(data);
    });
});

//设置审批开/关（关闭某类单据审批功能需要审批通过所有单据）
router.post('/set/approve', function(req, res) {
    const session = Session.get(req,res);
    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };
    backend.post(`/pc/v1/${session.userIdEnc}/infoSettings/set/approve${req.body.type?req.body.type:''}`, params , req, res, function(data) {
        res.json(data);
    });
});

//审批提交撤回权限
router.post('/set/withdraw', function(req, res) {
    const session = Session.get(req,res);
    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };
    backend.post(`/pc/v1/${session.userIdEnc}/infoSettings/withdraw`, params , req, res, function(data) {
        res.json(data);
    });
});

//获取撤回权限详情
router.post('/set/withdraw/detail', function(req, res) {
    const session = Session.get(req,res);
    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };
    backend.get(`/pc/v1/${session.userIdEnc}/infoSettings/withdraw/list`, params , req, res, function(data) {
        res.json(data);
    });
});


// 收支管理 增删改
router.post('/oprate/:operType', function(req, res) {
    const session = Session.get(req,res);
    const operType = req.params.operType;
    let url = `/pc/v1/${session.userIdEnc}/incomeExpense/${operType}`;
    switch (operType){
        case 'add':
            let params = {
                propName:req.body.propName,
                propType : req.body.propType,
            }
            backend.post(url, params, req, res, function(data) {
                    res.json(data)
                });
            break;
        case 'edit':
            url+=`/${req.body.id}?propName=`+encodeURIComponent(req.body.propName);
            backend.put(url, {}, req, res, function(data) {
                res.json(data)
            });
            break;
        case 'delete':
            url+=`/${req.body.id}`
            backend.delete(url, {}, req, res, function(data) {
                res.json(data)
            });
    }
});

// 结算方式增删改
router.post('/orderType/:operType', function(req, res) {
    const session = Session.get(req,res);
    const operType = req.params.operType;
    let url = `/pc/v1/${session.userIdEnc}/pay/`;
    switch (operType){
        case 'add':
            req.body.paramName = encodeURIComponent(req.body.paramName);
            url+=`?json=`+JSON.stringify(req.body);
            backend.post(url, {}, req, res, function(data) {
                res.json(data)
            });
            break;
        case 'edit':
            req.body.paramName = encodeURIComponent(req.body.paramName);
            url+=`${req.body.id}?json=`+JSON.stringify(req.body);
            backend.put(url, {}, req, res, function(data) {
                res.json(data)
            });
            break;
        case 'delete':
            url+=`${req.body.id}`
            backend.delete(url, {}, req, res, function(data) {
                res.json(data)
            });
    }
});
// 物流公司名称增删改
router.post('/express/:operType', function(req, res) {
    const session = Session.get(req,res);
    const operType = req.params.operType;
    let url = `/pc/v1/${session.userIdEnc}/logistic/`;
    switch (operType){
        case 'add':
            req.body.paramName = encodeURIComponent(req.body.paramName);
            url+=`?json=`+JSON.stringify(req.body);
            backend.post(url, {}, req, res, function(data) {
                res.json(data)
            });
            break;
        case 'edit':
            req.body.paramName = encodeURIComponent(req.body.paramName);
            url+=`${req.body.id}?json=`+JSON.stringify(req.body);
            backend.put(url, {}, req, res, function(data) {
                res.json(data)
            });
            break;
        case 'delete':
            url+=`${req.body.id}`
            backend.delete(url, {}, req, res, function(data) {
                res.json(data)
            });
    }
});
//发票类型增删改
router.post('/bill/:operType', function(req, res) {
    const session = Session.get(req,res);
    const operType = req.params.operType;
    let url = `/pc/v1/${session.userIdEnc}/invoice/`;
    switch (operType){
        case 'add':
            req.body.paramName = encodeURIComponent(req.body.paramName);
            url+=`?json=`+JSON.stringify(req.body);
            backend.post(url, {}, req, res, function(data) {
                res.json(data)
            });
            break;
        case 'edit':
            req.body.paramName = encodeURIComponent(req.body.paramName);
            url+=`${req.body.id}?json=`+JSON.stringify(req.body);
            backend.put(url, {}, req, res, function(data) {
                res.json(data)
            });
            break;
        case 'delete':
            url+=`${req.body.id}`
            backend.delete(url, {}, req, res, function(data) {
                res.json(data)
            });
    }
});
//税率增删改
router.post('/rate/:operType', function(req, res) {
    const session = Session.get(req,res);
    const operType = req.params.operType;
    let url = `/pc/v1/${session.userIdEnc}/taxRate/`;
    switch (operType){
        case 'add':
            req.body.paramName = encodeURIComponent(req.body.paramName);
            url+=`?json=`+JSON.stringify(req.body);
            backend.post(url, {}, req, res, function(data) {
                res.json(data)
            });
            break;
        case 'edit':
            req.body.paramName = encodeURIComponent(req.body.paramName);
            url+=`${req.body.id}?json=`+JSON.stringify(req.body);
            backend.put(url, {}, req, res, function(data) {
                res.json(data)
            });
            break;
        case 'delete':
            url+=`${req.body.id}`
            backend.delete(url, {}, req, res, function(data) {
                res.json(data)
            });
    }
});
//重复校验
router.get('/checkName/', function(req, res) {
    const params = {};
    params.headers = {
        "Content-Type":'application/json'
    };

    if(req.query.layerName === 'customerLevel'){
        req.query.recId && (params.recId = req.query.recId);
    }else {
        req.query.recId && (params.id = req.query.recId);
    }

    const session = Session.get(req,res);
    let name =  encodeURIComponent(req.query.name);
    let extParam = req.query.extParam ? '/'+ encodeURIComponent(req.query.extParam)  : '';
    params.name = name;
    let uri = `/pc/v1/${session.userIdEnc}/${req.query.layerName}/isExistName${extParam}`;
    backend.get(uri,params,req,res,function(data){
        res.json(data);
    });
});


// 库存限制列表
router.get('/wareLimit/lists', function(req, res) {
    const session = Session.get(req,res);
    let url = `/pc/v1/${session.userIdEnc}/inventory`;
    const params = {};
    params.headers = {
        "Content-Type":'application/json'
    };
    backend.get(url, params, req, res, function(data) {
        res.json(data)
    });
});

// 库存限制修改操作
router.post('/wareLimit', function(req, res) {
    const session = Session.get(req,res);
    let url = `/pc/v1/${session.userIdEnc}/inventory`;
    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };
    backend.put(url, params, req, res, function(data) {
        res.json(data)
    });
});

// 库存限制列表
router.get('/priceLimit/lists', function(req, res) {
    const session = Session.get(req,res);
    let url = `/pc/v1/${session.userIdEnc}/infoSettings/customerPrice/list`;
    backend.post(url, {}, req, res, function(data) {
        res.json(data)
    });
});
//价格规则开关
router.post('/priceLimit', function(req, res) {
    const session = Session.get(req,res);
    let url = `/pc/v1/${session.userIdEnc}/infoSettings/customerPrice/update`;
    url+=`/?json=`+JSON.stringify(req.body);
    backend.put(url, {}, req, res, function(data) {
        res.json(data)
    });
});
//数据精度列表
router.get('/accuracy/lists', function(req, res) {
    const session = Session.get(req,res);
    let url = `/pc/v1/${session.userIdEnc}/infoSettings/accuracy/list`;
    backend.post(url, {}, req, res, function(data) {
        if(data.recId){
            let {priceDecimalNum=3, quantityDecimalNum=3} = data;
            res.cookie('priceDecimalNum', priceDecimalNum);
            res.cookie('quantityDecimalNum', quantityDecimalNum);
            res.json(data)
        }
    });
});

//修改数据精度
router.post('/accuracy', function(req, res) {
    const session = Session.get(req,res);
    let url = `/pc/v1/${session.userIdEnc}/infoSettings/accuracy/update`;
    url+=`/?json=`+JSON.stringify(req.body);
    backend.put(url, {}, req, res, function(data) {
        res.json(data)
    });
});


//新增、编辑、删除工作中心
router.post('/workcenter/:type', function(req, res) {
    const type = req.params.type;
    const session = Session.get(req,res);
    const params =  req.body;
    let uri = `/pc/v1/${session.userIdEnc}/workcenter`;
    if(type === 'add'||type === 'edit'){
        let pwceList = [];
        let employeeId = params.employeeId||[];
        for(let i=0;i<employeeId.length;i++){
            pwceList.push({employeeId:employeeId[i]})
        }
        params.pwceList = pwceList;
        params.headers = {
            "Content-Type":'application/json'
        };
    }else if(type === 'delete'){
        uri = `/pc/v1/${session.userIdEnc}/workcenter/${params.id}`;
    }

    type === 'edit' &&  backend.put(uri, params, req, res, function(data) {
        res.json(data);
    });
    type === 'add' && backend.post(uri, params, req, res, function(data) {
        res.json(data);
    });
    type === 'delete' && backend.delete(uri, params, req, res, function(data) {
        res.json(data);
    })
});

//工作中心列表
router.get('/workcenter/lists', function(req, res) {
    const session = Session.get(req,res);
    backend.post(`/pc/v1/${session.userIdEnc}/workcenter/list`,req, res, function(data) {
        res.json(data);
    });
});

// 工作中心详情
router.get('/workcenter/detail/:caCode', function (req, res) {
    const session = Session.get(req,res);
    let caCode = req.params.caCode;
    backend.get(`/pc/v1/${session.userIdEnc}/workcenter/detail`,{caCode}, req,res,function(data){
        res.json(data);
    });
});

//新增、编辑、删除工序
router.post('/workprocess/:type', function(req, res) {
    const type = req.params.type;
    const session = Session.get(req,res);
    const params =  req.body;
    let uri = `/pc/v1/${session.userIdEnc}/workprocess`;
    if(type === 'add'||type === 'edit'){
        let pwceList = [];
        let employeeId = params.employeeId||[];
        for(let i=0;i<employeeId.length;i++){
            pwceList.push({employeeId:employeeId[i]})
        }
        params.pwceList = pwceList;
        params.headers = {
            "Content-Type":'application/json'
        };
    }else if(type === 'delete'){
        uri = `/pc/v1/${session.userIdEnc}/workprocess/${params.id}`;
    }

    type === 'edit' &&  backend.put(uri, params, req, res, function(data) {
        res.json(data);
    });
    type === 'add' && backend.post(uri, params, req, res, function(data) {
        res.json(data);
    });
    type === 'delete' && backend.delete(uri, params, req, res, function(data) {
        res.json(data);
    })
});


//工序列表
router.get('/workprocess/lists', function(req, res) {
    const session = Session.get(req,res);
    backend.post(`/pc/v1/${session.userIdEnc}/workprocess/list`,req, res, function(data) {
        res.json(data);
    });
});

//工作时间列表
router.get('/workcenter/timeList', function(req, res) {
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/workcenter/time`,req, res, function(data) {
        res.json(data);
    });
});

//更新工作时间
router.get('/workcenter/time', function(req, res) {
    const session = Session.get(req,res);
    const params =  req.query;
    params.headers = {
        "Content-Type":'application/json'
    };
    backend.put(`/pc/v1/${session.userIdEnc}/workcenter/time`, params, req, res, function(data) {
        res.json(data);
    });
});

//工作中心进度图
router.post('/work/chart', function (req, res, next) {
    const params = req.body;
    params.headers = {
        "Content-Type": 'application/json'
    };
    const session = Session.get(req, res);
    backend.post(`/cgi/${session.userIdEnc}/worksheet/workcenter/chart`, params, req, res, function (data) {
        //当存在工序实际结束时间为空，则图表中，实际进度条结束时间按照当前系统时间显示
        let workOrderList = data.data;
        if(workOrderList && workOrderList.length>0){
            for(let i=0;i<workOrderList.length;i++){
                if(workOrderList[i].pwspList && workOrderList[i].pwspList.length>0){
                    let pwspList = workOrderList[i].pwspList;
                    for(let j=0;j<pwspList.length;j++){
                        if(pwspList[j].actualStartDate && !pwspList[j].actualEndDate){
                            pwspList[j].actualEndDate = new Date().getTime();
                        }
                    }
                }
            }
        }
        data.data = workOrderList;
        res.json(data);
    });
});

//新增、编辑、删除报工账号
router.post('/accountReport/oprate/:type', function(req, res) {
    const type = req.params.type;
    const session = Session.get(req,res);
    const params =  req.body;
    let uri = `/pc/v1/${session.userIdEnc}/bunsiness`;
    if(type === 'add'||type === 'edit'){
        params.headers = {
            "Content-Type":'application/json'
        };
    }else if(type === 'delete'){
        uri = `/pc/v1/${session.userIdEnc}/bunsiness/${params.id}`;
    }
    if(params && params.password){
        params.password = md5Crypto(params.password);
    }
    if(params && params.confirmPassword){
        params.confirmPassword = md5Crypto(params.password);
    }
    type === 'edit' &&  backend.put(uri, params, req, res, function(data) {
        res.json(data);
    });
    type === 'add' && backend.post(uri, params, req, res, function(data) {
        res.json(data);
    });
    type === 'delete' && backend.delete(uri, params, req, res, function(data) {
        res.json(data);
    });
});

//报工账号列表
router.post('/accountreport/list', function(req, res) {
    const params = {
        ...req.body.params
    };
    params.perPage = params.perPage || Constants.PAGINATION_PER_PAGE;
    params.page = params.page?params.page:1;
    const session = Session.get(req,res);
    backend.post(`/pc/v1/${session.userIdEnc}/bunsiness/list`, params, req, res, function(data) {
        res.json({
            retCode:0,
            data: data.data,
            pagination:{
                total:data.count,
                current:params.page*1,
                pageSize:params.perPage*1
            }
        });
    });
});

// 菜单配置列表
router.get('/menu/lists', function(req, res) {
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/infoSettings/module`, {} , req, res, function(data) {
        // 当返回数据为空时，未进行初始化，则取菜单配置默认值
        if(data.retCode === '0' && data.data.length === 0){
            data.data = Constants.defaultMenuConfigList;
        }
        res.json(data);
    });
});

//获取物流信息
router.get('/logistic/info', function(req, res) {
    const session = Session.get(req,res);
    backend.get(`/pc/v1/${session.userIdEnc}/logistic/default_option`, {} , req, res, function(data) {
        res.json(data);
    });
});
//获取可用查询物流次数
router.get('/logistic/num', function(req, res) {
    const session = Session.get(req,res);
    backend.get(`/cgi/${session.userIdEnc}/wuliu/usable`, {} , req, res, function(data) {
        res.json(data);
    });
});
//获取物流详细数据
router.post('/logistic/detail', function(req, res) {
    let params = req.body;
     params.headers = {
            "Content-Type":'application/json'
     };
    const session = Session.get(req,res);
    backend.post(`/cgi/${session.userIdEnc}/wuliu/detail`, params , req, res, function(data) {
        res.json(data);
    });
});

// 保存菜单配置
router.post('/menu/lists', function(req, res) {
    let json = req.body.json;
    const session = Session.get(req,res);
    let params = {
        headers:{
            "Content-Type":'application/json'
        },
        array: json
    };
    backend.post(`/pc/v1/${session.userIdEnc}/infoSettings/set/module/visual`, params, req, res, function(data) {
        res.json(data);
    });
});


//多币种列表
router.get('/multiCurrency/lists', function(req, res) {
    const session = Session.get(req,res);
    backend.get(`/cgi/${session.userIdEnc}/currency/list`,{}, req, res, function(data) {
        res.json(data)
    });
});

//新增、编辑、删除多币种
router.post('/multiCurrency/oprate/:type', function(req, res) {
    const session = Session.get(req,res);
    const type = req.params.type;
    let url = `/cgi/${session.userIdEnc}/currency`;
    let params = req.body;
    switch (type){
        case 'add':
            params.headers = {
                "Content-Type": 'application/json'
            };
            backend.post(url,params, req, res, function(data) {
                res.json(data)
            });
            break;
        case 'edit':
            params.headers = {
                "Content-Type": 'application/json'
            };
            url = url+`/${params.id}`;
            backend.put(url,params, req, res, function(data) {
                res.json(data)
            });
            break;
        case 'del':
            url+=`/${req.body.id}`;
            backend.delete(url,{}, req, res, function(data) {
                res.json(data)
            });
    }

});

//收入记录详情页
router.get('/multiCurrency/detail/:currencyId', function (req, res) {
    const remoteUrl = `/cgi/{userId}/currency/detail/${req.params.currencyId}`;
    backend.get(remoteUrl, req, res, function (data) {
        res.json(data);
    });
});


//设备列表
router.get('/device/lists', function(req, res) {
    const session = Session.get(req,res);
    backend.post(`/pc/v1/${session.userIdEnc}/equipment/list`,req, res, function(data) {
        res.json(data);
    });
});


//新增、编辑、删除设备
router.post('/device/:type', function(req, res) {
    const type = req.params.type;
    const session = Session.get(req,res);
    const params =  req.body;
    let uri = `/pc/v1/${session.userIdEnc}/equipment`;
    if(type === 'add'||type === 'edit'){
        params.headers = {
            "Content-Type":'application/json'
        };
    }else if(type === 'delete'||type === 'set'){
        uri = `/pc/v1/${session.userIdEnc}/equipment/${params.id}`;
    }

    type === 'edit' &&  backend.put(uri, params, req, res, function(data) {
        res.json(data);
    });
    type === 'add' && backend.post(uri, params, req, res, function(data) {
        res.json(data);
    });
    type === 'delete' && backend.delete(uri, params, req, res, function(data) {
        res.json(data);
    })
    type === 'set' && backend.post(uri, params, req, res, function(data) {
        res.json(data);
    })
});


//客户列表
router.get('/custom/lists', function(req, res) {
    const params = {};
    const session = Session.get(req,res);
    backend.get(`/cgi/${session.userIdEnc}/group/customer/list`, params, req, res, function(data) {
        res.json(data)
    });
});

//客户列表
router.get('/supply/lists', function(req, res) {
    const params = {};
    const session = Session.get(req,res);
    backend.get(`/cgi/${session.userIdEnc}/group/supplier/list`, params, req, res, function(data) {
        res.json(data)
    });
});

//新增、编辑、修改客户
router.post('/custom/oprate/:type', function(req, res) {
    const type = req.params.type;
    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };

    const session = Session.get(req,res);
    let uri = `/cgi/${session.userIdEnc}/group/customer`;
    uri = (type === 'edit' || type === 'delete') ? (uri + '/' + req.body.id) : uri;
    type === 'edit' &&  backend.put(uri, params, req, res, function(data) {
        res.json(data);
    });
    type === 'add' && backend.post(uri, params, req, res, function(data) {
        res.json(data);
    });
    type === 'delete' && backend.delete(uri, params, req, res, function(data) {
        res.json(data);
    })
});

//新增、编辑、修改供应商
router.post('/supply/oprate/:type', function(req, res) {
    const type = req.params.type;
    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };

    const session = Session.get(req,res);
    let uri = `/cgi/${session.userIdEnc}/group/supplier`;
    uri = (type === 'edit' || type === 'delete') ? (uri + '/' + req.body.id) : uri;
    type === 'edit' &&  backend.put(uri, params, req, res, function(data) {
        res.json(data);
    });
    type === 'add' && backend.post(uri, params, req, res, function(data) {
        res.json(data);
    });
    type === 'delete' && backend.delete(uri, params, req, res, function(data) {
        res.json(data);
    })
});


//通知列表
router.get('/notification/lists', function(req, res) {
    const params = {};
    const session = Session.get(req,res);
    backend.get(`/cgi/${session.userIdEnc}/notify_config/list`, params, req, res, function(data) {
        res.json(data)
    });
});

//新增、编辑、修改通知设置
router.post('/notification/oprate/:type', function(req, res) {
    const type = req.params.type;
    const params = req.body;
    params.headers = {
        "Content-Type":'application/json'
    };

    const session = Session.get(req,res);
    let uri = `/cgi/${session.userIdEnc}/notify_config`;
    uri = (type === 'edit' || type === 'delete') ? (uri + '/' + req.body.id) : uri;
    type === 'edit' &&  backend.put(uri, params, req, res, function(data) {
        res.json(data);
    });
    type === 'add' && backend.post(uri, params, req, res, function(data) {
        res.json(data);
    });
    type === 'delete' && backend.delete(uri, params, req, res, function(data) {
        res.json(data);
    })
});


module.exports = router;
