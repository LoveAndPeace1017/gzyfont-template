const express = require('express');
const router = express.Router();
const backend = require('../../lib/backend');
const Session = require('../../lib/session');
var crypto = require('crypto');


function md5Crypto(num){
    let hash = crypto.createHash('md5');
    hash.update(num);
    //得到字符串，如果是等号去掉
    const md5Password = hash.digest('hex');
    console.log(md5Password, 'md5Password');
    return md5Password;
}

/* 抖音h5页面 */
router.get('/ad', function(req, res, next) {
    res.render('dls/dls_1', {
        title:'百卓优采云进销存招募全国代理商-上市公司旗下产品，投入少，回报高，总部全程支持',
        keywords:'代理商，合伙人，百卓优采，进销存，焦点科技，管家婆，金蝶，用友，saas',
        description:'百卓优采云进销存是是中小微企业都需要的企业管理工具，市场需求大，商业模型成熟；现向全国招募代理商，投入少，快速回报，上市公司服务保障，加入我们，开启事业蓝图！',
        is_dls: true
    });
});

//抖音h5提交页面
router.post('/', function(req, res) {
    backend.post(`/agent/promotion `, req.body, req, res, function(data) {
        let mobile = req.body.mobilePhone;
        if(data.retCode == "0"){
            res.render('dls/dls-success', {
                title:'百卓优采云进销存招募全国代理商-上市公司旗下产品，投入少，回报高，总部全程支持',
                keywords:'代理商，合伙人，百卓优采，进销存，焦点科技，管家婆，金蝶，用友，saas',
                description:'百卓优采云进销存是是中小微企业都需要的企业管理工具，市场需求大，商业模型成熟；现向全国招募代理商，投入少，快速回报，上市公司服务保障，加入我们，开启事业蓝图！',
                is_dls: true,
                soleId:  md5Crypto(mobile),
            });
        }else{
            res.render('dls/dls_1', {
                title:'百卓优采云进销存招募全国代理商-上市公司旗下产品，投入少，回报高，总部全程支持',
                keywords:'代理商，合伙人，百卓优采，进销存，焦点科技，管家婆，金蝶，用友，saas',
                description:'百卓优采云进销存是是中小微企业都需要的企业管理工具，市场需求大，商业模型成熟；现向全国招募代理商，投入少，快速回报，上市公司服务保障，加入我们，开启事业蓝图！',
                error: data.retMsg
            });
        }
    });
});

module.exports = router;
