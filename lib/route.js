/**
 * Automatic Routing Module
 *
 * This module reads routing configuration from filesystem and register endpoint to Express app.
 *
 * @author qiumingsheng
 */

const walk = require('walk');
const fs = require('fs');
const logger = require('./logger').getLogger();
const conf = require('../config').getConfig();

/**
 * Register routing group
 *
 * @param app
 * @param routes
 * @param key
 */

// let regexp = /^\/(login|logout|register|sso|info|mobile|main)/;

function readFileProcessor(app,root,fileStats){
    var endpointGroup = fileStats.name.match(/(.+)\.js$/);
    var parentGroup = root.match(new RegExp("routes" + '(.*)'));
    if (endpointGroup && endpointGroup.length > 0 && parentGroup.length > 0) {

        var filePath = conf.devMode?root.replace(/\\/gi, '/'):root;
        filePath = filePath + "/" + fileStats.name;
        var data = "";
        try{
            data = fs.readFileSync(filePath, 'utf8');
        }catch (e) {
            logger.error("readFileSync error:"+e);
        }
        if(data!==""){
            var endpoint = endpointGroup[1] === 'index' ? '' : endpointGroup[1];
            var parent = parentGroup[1]+(endpoint?'/':'');
            var key = conf.devMode?(parent + endpoint).replace(/\\/gi, '/'):(parent + endpoint);
            key = key||'/';
            var router = require("../" + filePath);
            if (router) {
                app.use(key, router);
            }
            else {
                logger.warn('No routes found in "' + key + '".');
            }
        }
    }
}

/**
 * @param app
 */
exports.route = function(app) {
    // Walker options
    var options = {
        listeners: {
            file: function(root, fileStats, next) {
                readFileProcessor(app,root,fileStats);
                next();
            },
            errors: function(root, nodeStatsArray, next) {
                if(nodeStatsArray.error){
                    logger.error("register failure:" + JSON.stringify(nodeStatsArray));
                }
                next();
            }
        }
    };
    walk.walkSync("routes", options);
};