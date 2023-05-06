var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});
router.get('/main', function(req, res, next) {
	res.redirect('/home');
});

module.exports = router;
