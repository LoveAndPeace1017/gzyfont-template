const express = require('express');
const router = express.Router();

/* images */
router.get('/:name', function(req, res, next) {
    res.render('info/images/' + req.params.name);
});


module.exports = router;
