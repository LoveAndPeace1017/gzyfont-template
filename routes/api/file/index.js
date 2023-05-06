const express = require('express');
const router = express.Router();
const multer  = require('multer');
const fs = require('fs');
const backend = require('../../../lib/backend');
const Session = require('../../../lib/session');
const config = require('../../../config').getConfig();
// const server = 'http://192.168.16.254:9037';
const server = '';

let storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"uploads/");
    },
    filename:function(req,file,cb) {
        let name = file.originalname;
        let arr = name.split('.');
        let extName = arr[arr.length-1];
        let fileName = arr.slice(0, -1).join('.');
        let curName = fileName+'.'+(extName?extName:"xls");
        cb(null,curName);
    }
});

let upload = multer({storage:storage}).fields([
    { name: 'file', maxCount: 1 }
]);


/**
 * 导出文件-文件模板
 */
router.get('/multi/download', function(req, res) {
    const session = Session.get(req, res);
    let url = server+`/pc/v1/${session.userIdEnc}/prods${req.query.url}`;
    if(req.query.filename){
        let attachment = `attachment; filename=${encodeURIComponent(req.query.filename)}`;
        res.header('Content-Disposition', attachment);
    }
    let params = JSON.parse(req.query.params);
    url = url + `?specificateName1=${encodeURIComponent(params.specificateName1)}&specificateName2=${encodeURIComponent(params.specificateName2)}&specificateName3=${encodeURIComponent(params.specificateName3)}`;
    backend.download(url,{downloadFileName: req.query.downloadFileName},req,res).pipe(res);
});

router.get('/download', function(req, res) {
    const session = Session.get(req, res);
    let url = server+`/pc/v1/${session.userIdEnc}${req.query.url}`;
    if(req.query.url.indexOf('outsource') !== -1 || req.query.url.indexOf('worksheet') !== -1){
        url = server+`/cgi/${session.userIdEnc}${req.query.url}`;
    }
    if(req.query.saleAndProductReportInfo){
        let info = req.query.saleAndProductReportInfo;
        let infoStr = info.replace(',','&');
        url = url + '?' + infoStr;
    }
    if(req.query.filename){
        let attachment = `attachment; filename=${encodeURIComponent(req.query.filename)}`;
        res.header('Content-Disposition', attachment);
    }

    backend.download(url,{downloadFileName: req.query.downloadFileName},req,res).pipe(res);
});


/**
 * 导出文件-文件内容
 */
router.post('/download', function(req, res) {
    const session = Session.get(req, res);
    let url = server+`/pc/v1/${session.userIdEnc}${req.query.url}`;

    let ids = req.body.ids?req.body.ids.split(','):[];
    let params = {
        vo1:ids,
        method:'post'
    };
    if(req.body.wareName){
        url = `${url}?wareName=${encodeURIComponent(req.body.wareName)}`;
    }
    backend.download(url,params,req,res).pipe(res);
});

//白名单
const allowIp = '192.168.16.254:8845';
const allowDomain = 'appserver.abiz.com';
const allowType = /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/;
router.get('/img/download', function(req, res) {
    const session = Session.get(req, res);
    const urlArr = req.query.url.split('/');
    const domain = urlArr[2];
    const fileType = urlArr[urlArr.length-1];
    if(domain && (allowDomain === domain || allowIp === domain) && allowType.test(fileType)){
        let url = `${req.query.url}?userId=${session.userIdEnc}&token=${session.xtoken}`;
        backend.download(url, {ignoreHead: true}, req, res).pipe(res);
    }else{
        res.send()
    }
});


/* 上传图片 */
router.post('/upload', function(req, res, next) {
    upload(req, res, function () {
        let file = req.files.file[0];
        let data = fs.createReadStream(file.path);
        const params = req.body;
        params.headers = {
            "Content-Type" : "multipart/form-data"
        };
        params.file = data;
        const session = Session.get(req,res);
        backend.post( `/pc/v1/${session.userIdEnc}${req.body.url}`,params,req,res,function(data){
            res.json(data);
            fs.unlink(file.path,function(err){
                console.log("upload err:"+err)
            });
        });
    });


});


/* 上传附件 */
router.post('/temp_attachs', function(req, res, next) {
    upload(req, res, function () {
        let file = req.files.file[0];
        let data = fs.createReadStream(file.path);
        const params = req.body;
        params.headers = {
            "Content-Type" : "multipart/form-data"
        };
        params.file = data;
        backend.post(config.abizBackendUrl +'/temp_attachs.json?relationType=2&Filename=' + encodeURIComponent(file.originalname),params,req,res,function(data){
            res.json(data);
            fs.unlink(file.path,function(err){
                console.log("upload err:"+err)
            });
        });
    });


});

/* 上传附件 上传到ffs*/
router.post('/new_temp_attachs', function(req, res, next) {
    const session = Session.get(req, res);
    upload(req, res, function () {
        let file = req.files.file[0];
        let data = fs.createReadStream(file.path);
        const params = req.body;
        params.headers = {
            "Content-Type" : "multipart/form-data"
        };
        params.file = data;
        backend.post(`/pc/v1/${session.userIdEnc}/file/upload`,params,req,res,function(data){
            res.json(data);
            fs.unlink(file.path,function(err){
                console.log("upload err:"+err)
            });
        });
    });
});

module.exports = router;
