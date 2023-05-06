/**
 * 日志模块
 *
 * @author qiumingsheng
 */
const log4js = require('log4js');

const config = require('../config').getConfig();
const distPath = config.logDist||'log';

const params = ['access','default'];
const appenders = {console: { type: 'console' }},categories = {};
for (let i in params){
    let name = params[i];
    appenders[name] = { type: 'file', filename: distPath + '/' + name + '.log' };
    //categories[name] = { appenders: config.devMode?[name,'console']:[name], level: 'info' };
    categories[name] = { appenders: [name,'console'], level: 'info' };
}
log4js.configure({
    appenders,
    categories
});

let loggers = {};

module.exports = {
    getLogger: function(category) {
        var logger = loggers[category];

        if (!logger) {
            var name = category || 'default';
            logger = log4js.getLogger(name);
            logger.level = config.logLevel||'debug';
            logger.info('Logger "' + name + '" initialized.');
            loggers[category] = logger;
        }
        return logger;
    }
};

