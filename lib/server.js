/**
 * Module dependencies.
 */
const express = require('express');
const app = express();
const http = require('http');
const server = http.Server(app);
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const log4js = require('log4js');
const hbs = require('./hbs-support');
const history = require('connect-history-api-fallback');

const globalFilter = require('./filter/global-filter');
const loginFilter = require('./filter/login-filter');
const csrfFilter = require('./filter/csrf-filter');
const errors = require('./errors');
const logger = require('./logger');
const conf = require('../config').getConfig();
const routerRigister = require('./route');

const Session = require('./session');

exports.create = function(dirname) {
    hbs.init(dirname);
    // all environments
    app.set("trust proxy", true);
    app.set('port', process.env.PORT || conf.port);
    app.set('views', path.join(dirname, 'views'));
    app.set('view engine', 'hbs');
    app.use(favicon(path.join(dirname, 'public', 'favicon.ico')));
    app.use(log4js.connectLogger(logger.getLogger('access'), {
        level: log4js.levels.INFO,
        format: ':remote-addr ":method :url HTTP/:http-version" :status :content-length ":referrer" ":user-agent" :response-time',
        nolog: /\/(\d+\/)?(js|css|styles|images|img|fonts|lib|MP_verify_LZxff8o1qTWPoNhs.txt)/
    }));

    app.use((req, res, next) => {
        res.set('Expries', -1);
        res.set('Cache-Control', 'no-store');
        res.set('Cache-Pragma', 'no-store');
        next()
    });

    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use(bodyParser.json({limit: '50mb'}));

    app.use(cookieParser());

    app.use(express.static(path.join(dirname,  conf.devMode?'public':'dist'),{
        cacheControl: false
    }));
    app.use(errors.domain);

    //
    app.use(globalFilter.filter);
    app.use(loginFilter.filter);
    // app.use(csrfFilter.filters);

    routerRigister.route(app);
    app.use(history({
        rewrites: [
            {
                from:'/mobile',
                to:'/mobile/index.html'
            }
        ],
        index:'/index.html',
    }));
    // 配合 connect-history-api-fallback 处理静态资源，不要以为是和前面代码重复了
    app.use(express.static(path.join(dirname,  conf.devMode?'public':'dist'),{
        cacheControl: false
    }));

    app.use(errors.notFound);
    app.use(errors.handler);

    app.use(function(req, res, next) {
        next(createError(404));
    });

    // error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });


    server.listen(app.get('port'), function() {
        logger.getLogger().info('Server unit ' + process.pid + ' listening on port ' + app.get('port'));
    });


    return server;
};
