/**
 * App
 * @author gaozhiyuan
 */
const cluster = require('cluster');

const server = require('./lib/server');
const logger = require('./lib/logger').getLogger();
const conf = require('./config').getConfig();

const numCPUs = require('os').cpus().length;


// cluster setup
if (!conf.devMode && conf.clusters && cluster.isMaster) {
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('fork', function(worker, code, signal) {
        logger.info('Worker ' + worker.process.pid + ' started...');
    });

    cluster.on('exit', function(worker, code, signal) {
        logger.info('Worker ' + worker.process.pid + ' died');
        if (worker.suicide === true) {
            logger.info(' Worker committed suicide');
        }
        cluster.fork();
    });
}
else {
    const webServer = server.create(__dirname);

    function shutdown() {
        webServer.close(function() {
            logger.info('Connections closed.')
            process.exit();
        });
    }

    process.on('SIGINT', function() {
        logger.info('Caught interrupt signal.');

        if (conf.devMode) {
            shutdown();
        }
        else {
            logger.warn('Interrupt signal in production mode will be ignored.');
        }
    });

    process.on('SIGTERM', function() {
        logger.info('Caught terminate signal.');
        shutdown();
    });
}

