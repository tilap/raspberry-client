'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.refresh = refresh;
exports.update = update;
exports.runOpenBox = runOpenBox;
exports.start = start;
exports.restart = restart;
exports.stop = stop;

var _nightingale = require('nightingale');

var _config = require('./config');

var _scripts = require('./scripts');

const logger = new _nightingale.ConsoleLogger('app.display', _nightingale.LogLevel.INFO);

/**
 * @function
*/function refresh() {
    return (0, _scripts.runScript)('./browser.sh', ['refresh']);
}

/**
 * @function
*/function update() {
    return (0, _scripts.runScript)('./browser.sh', ['load', (0, _config.get)().url]);
}

/**
 * @function
*/function runOpenBox() {
    return (0, _scripts.runScript)('./openbox.sh', ['start']);
}

let autoRestart;
let childProcess;

/**
 * @function
*/function start() {
    if (runOpenBox() !== 'started') {
        logger.warn('openbox not yet started');
        return;
    }

    if (childProcess) {
        logger.warn('restarting');
        return restart();
    }

    logger.info('start display');
    autoRestart = true;

    const config = (0, _config.get)();
    const script = config.display === 'livestreamer' ? 'livestreamer' : 'browser';
    childProcess = (0, _scripts.spawn)(`./${ script }.sh`, ['start', config.url]);
    childProcess.stdout.on('data', data => logger.debug(data.toString()));
    childProcess.stderr.on('data', data => logger.error(data.toString()));
    childProcess.on('close', code => {
        childProcess = null;
        logger.error(`child process exited with code ${ code }`);
        if (autoRestart) {
            process.nextTick(() => start());
        }
    });
}

/**
 * @function
*/function restart() {
    Promise.resolve(stop()).then(() => start());
}

/**
 * @function
*/function stop() {
    logger.info('stoping display');
    autoRestart = false;
    if (childProcess) {
        return new Promise(resolve => {
            childProcess.once('close', () => {
                logger.info('display stopped');
                resolve();
            });
            childProcess.kill();
            childProcess = null;
        });
    }
}
//# sourceMappingURL=display.js.map