const http = require('http');
const request = require('request');
const async = require('async');
const extend = require('extend');

const logger = require('./logger').getLogger();
const ParamExtender = require('./utils/ParamExtender');
const query = require('./query');

const conf = require('../config').getConfig();

function doRequest(method, uri, params, callback) {


    let queryString = '';

    let headers = {
        'Connection': 'close',
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    let form = Object.assign({},params);
    if(form.headers){
        headers = extend(headers,form.headers);
        delete form.headers;
    }
    if(form.array){
        form = form.array;
    }

    let base = conf.backendUrl;
    if (method === 'get') {
        queryString = query.serialize(form);
    }

    if (!/^http(s)?:\/\/(.*)$/.test(uri)) {
        uri = base + uri;
    }

    uri = uri + (queryString ? (uri.indexOf('?')===-1?'?':'&') + queryString : '');

    conf.devMode && console.log('lasturl:',uri);

    const options = {
        url: uri,
        method: method.toUpperCase(),
        timeout: uri.indexOf('/excel')!==-1?conf.fileSocketTimeout||conf.socketTimeout:conf.socketTimeout,
        headers: headers
    };


    if (method === 'post'||method === 'put'||method === 'delete') {
        if (/^application\/json/.test(options.headers["Content-Type"])) {
            options.json = form;
        }else if(/^multipart\/form-data/.test(options.headers["Content-Type"])) {
            options.formData = form;
        }else{
            if(form.postData){
                options.form = form.postData;
            }else{
                options.form = form;
            }
        }
    }

    if(uri.indexOf('quotations/quotation/list')!== -1){
        logger.info('headers: +quotations/quotation/list', JSON.stringify(options))
    }

    const req = request(options, function(err, res, body) {
        if (err) {
            logger.error(err);
        }
        else if (typeof body !== 'undefined') {

            let json = {};
            if(typeof body === "string"){
                if(res.headers&&res.headers['content-type']=='application/octet-stream'){
                    json = body;
                }else{
                    try {
                        json = JSON.parse(body);
                    }
                    catch (e) {
                        logger.error('Error occurred when accessing backend "' + uri + '", response content is:\n' + body, e);
                    }
                }

            }else{
                json = body;
            }
            callback(null, json);
        }
    });
    req.once('error', function(e) {
        callback(e);
    });
}
/**
 * 解析参数
 *
 * @returns {{method: *, uri: string, params: {}, callback: callback}}
 */
function parseArguments() {
    let uri = '', params = {}, req, res, callback = function() {
    };
    for (const i in arguments) {
        const arg = arguments[i];
        switch (typeof arg) {
        case 'string':
            uri = arg;
            break;
        case 'object':
            if(arg instanceof http.IncomingMessage){
                req = arg;
            }else if(arg instanceof http.ServerResponse){
                res = arg;
            }else{
                params = arg;
            }
            break;
        case 'function':
            callback = arg;
        }
    }
    if(uri){
        params = ParamExtender.wrapIdentify(params, req, res);
    }else{
        params.map(function(task){
            return ParamExtender.wrapIdentify(task.params, req, res);
        });
    }
    return {uri: uri, params: params, callback: callback};
}

function execute(method, uri, params, callback) {
    if (uri) {
        doRequest(method, uri, params, function(err, data) {
            callback(data);
        });
    }
    else {
        if (params.length !== undefined) {
            // array
            const tasks = [];
            const errors = [];

            params.forEach(function(task) {
                let uri = task.uri;
                let requestParams = task.params;
                tasks.push(function(done) {
                    method = task.method||method;
                    doRequest(method, uri, requestParams, function(err, data) {
                        if (err) {
                            errors.push('Running task "' + task.uri + '" failed - ' + err.toString());
                        }
                        else {
                            task.task(data);
                        }
                        done();
                    });
                });
            });

            async.parallel(tasks, function() {
                if (errors && errors.length > 0) {
                    throw errors[0];
                }
                else {
                    callback();
                }
            });
        }
    }
}
module.exports = {
    get: function() {
        const args = parseArguments.apply(this, arguments);
        execute('get', args.uri, args.params, args.callback);
    },
    post: function() {
        const args = parseArguments.apply(this, arguments);
        execute('post', args.uri, args.params, args.callback);
    },
    put: function() {
        const args = parseArguments.apply(this, arguments);
        execute('put', args.uri, args.params, args.callback);
    },
    delete: function() {
        const args = parseArguments.apply(this, arguments);
        execute('delete', args.uri, args.params, args.callback);
    },
    download:function(uri,params,req,res) {

        params = ParamExtender.wrapIdentify(params, req, res);

        let base = conf.backendUrl;
        if (!/^http(s)?:\/\/(.*)$/.test(uri)) {
            uri = base + uri;
        }
        let method =  params.method&&params.method.toUpperCase()||"GET";

        let form = Object.assign({},params);
        let headers = {
            'Connection': 'close',
            'Content-Type': 'application/json',
        };
        if(form.headers){
            headers = extend(headers,form.headers);
            delete form.headers;
        }

        if(params.ignoreHead){
            delete headers['X-ClientVersion'];
            delete headers['X-ClientType'];
        }
        let queryString = '';
        if (method === 'GET') {
            queryString = query.serialize(form);
            uri = uri + (queryString ? (uri.indexOf('?')===-1?'?':'&') + queryString : '');
        }
        delete form.method;

        const options = {
            url: uri,
            method: method.toUpperCase(),
            timeout: conf.fileSocketTimeout||conf.socketTimeout,
            headers: headers
        };
        if (method === 'POST') {
            options.json = form;
        }

        options.url = uri;
        return request(options);
    }
};