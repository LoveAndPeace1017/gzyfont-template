const domain = require('domain');
const logger = require('./logger').getLogger();
const conf = require('../config').getConfig();



module.exports = {
    domain: function(req, res, next) {
        const reqd = domain.create();
        reqd.add(req);
        reqd.add(res);

        reqd.on('error', function(err) {
            res.on('close', function() {
                logger.info('Disposing domain for url ' + req.url);
                reqd.dispose();
            });

            next(err);
        });

        reqd.run(next);
    },
    raise: function(req, res) {
        res.status(404);
        res.render('errors/error');
    },
    notFound: function(req, res, next) {
        const err = new Error('Page Not Found');
        err.status = 404;
        next(err);
    },
    handler: function(err, req, res, next) {
        if(err.status === 404){
            logger.warn('Request failed: "' + req.url + '":' + err.stack);
        }else{
            logger.error('Request failed: "' + req.url + '":' + err.stack);
        }
        res.status(err.status || (conf.devMode ? 500 : 404));
        res.render('errors/error', {
            error: err
        });
    }
};