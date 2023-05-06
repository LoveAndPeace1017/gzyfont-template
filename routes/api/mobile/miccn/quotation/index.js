const express = require('express');
const router = express.Router();
const multer  = require('multer');
const fs = require('fs');
const backend = require('../../../../../lib/backend');
const config = require('../../../../../config').getConfig();
const logger = require('../../../../../lib/logger').getLogger('default');

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

let upload = multer({storage:storage}).fields([
    { name: 'file', maxCount: 1 }
]);

//初始化新增报价单数据
router.get('/init', function(req, res) {
    const query = req.query;
    const inquiryId = query.inquiryId;
    const cookie = req.cookies.cookie;
    const identityInformation = req.cookies.identityInformation;

    const params = {};
    params.headers = {
        "Content-Type":'application/json',
        mpauth:cookie,
        identityInformation
    };

    backend.get(`${config.tulipBackendUrl}/api/quotations/${inquiryId}/init`, params, req, res, function(data) {
        if (data && data.code === 0) {
            let backData = data.data;
            if(backData.quotation.quotationProds){
                backData.quotation.quotationProds = backData.quotation.quotationProds.map(item => {
                    return {
                        demandProdId: item.demandProdId,
                        prodName: item.prodName,
                        inquiryProdItemSpec: item.inquiryProdItemSpec,
                        purchaseQuantity: item.purchaseQuantity,
                        unitPriceNew: item.unitPriceNew || '',
                        effectiveTime: item.effectiveTime || '',
                        shipDate: item.shipDate || '',
                        purchaseUnitText: item.purchaseUnitText,
                        unitPriceText: '元'
                    }
                })
            }
            res.json({
                retCode: '0',
                data: backData
            });
        } else {
            res.json({
                retCode: '1',
                retMsg: (data && data.message) || "网络异常，请稍后重试！"
            });
        }
    });
});


router.post('/add/:inquiryId', function(req, res) {
    const cookie = req.cookies.cookie;
    const identityInformation = req.cookies.identityInformation;
    const inquiryId = req.params.inquiryId;
    let  params = req.body;
    params.ossQuotationFlag = '4';
    params.headers = {
        "Content-Type":'application/json',
        mpauth:cookie,
        identityInformation
    };

    backend.post(`${config.tulipBackendUrl}/api/quotations/${inquiryId}/add`, params, req, res, function(data) {
        // code: 0
        // data: "lmaQRUAExnKu"
        if (data && data.code === 0) {
            res.json(data.data);
        } else {
            res.json({
                retCode: '1',
                retMsg: (data && data.message) || "网络异常，请稍后重试！"
            });
        }
    })
});

/* app嵌H5页面调abiz上传接口，因为上传插件和web不一样，方便区分，所以新增接口*/
router.post('/app_temp_attachs', function(req, res, next) {
    upload(req, res, function () {
        let file = req.files.file[0];
        let data = fs.createReadStream(file.path);
        const params = req.body;
        params.headers = {
            "Content-Type" : "multipart/form-data"
        };
        params.file = data;
        backend.post(config.abizBackendUrl+ '/temp_attachs/abiz.json',params,req,res,function(data){
            res.json(data);
            fs.unlink(file.path,function(err){
                console.log("upload err:"+err)
            });
        });
    });
});


//报价单详情页
router.get('/inquiry/quotation/:quotationId', function (req, res) {
    const params ={
        headers: {
            mpauth: req.cookies.cookie,
            identityInformation: req.cookies.identityInformation
        }
    };
    backend.get(`${config.tulipBackendUrl}/api/quotations/inquiry/quotation/${req.params.quotationId}`, params, req, res, function (data) {
        if (data && data.code == 0) {
            res.json(data);
        } else {
            res.json({
                retCode: '1',
                retMsg: (data && data.message) || "网络异常，请稍后重试！"
            });
        }
    });
});


module.exports = router;
