const express = require('express');
const router = express.Router();



let seo = {
    "hiddenPolicy":{
        title: '隐私政策'
    },
    "userAgreement":{
        title: '用户协议'}
};

/* agreement info */
router.get('/:name', function(req, res, next) {
    res.render('info/agreement/' + req.params.name, {
        title:seo[req.params.name].title
    });
});


module.exports = router;
