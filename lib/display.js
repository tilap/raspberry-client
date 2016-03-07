'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.refresh = refresh;
exports.update = update;
exports.start = start;
exports.restart = restart;
exports.stop = stop;

var _nightingale = require('nightingale');

var _config = require('./config');

var _scripts = require('./scripts');

const logger = new _nightingale.ConsoleLogger('app.display', _nightingale.LogLevel.INFO);

let autoRestart;
let childProcess;

/**
 * @function
*/function refresh() {
    if (childProcess) {
        logger.log('refresh');
        const config = (0, _config.get)();
        return (0, _scripts.runScript)(`./${ config.display }.sh`, ['refresh']);
    } else {
        logger.warn('display stopped');
    }
}

/**
 * @function
*/function update() {
    const config = (0, _config.get)();
    if (config.display === 'kweb3') {
        return (0, _scripts.runScript)(`./${ config.display }.sh`, ['load', config.url]);
    } else {
        return restart();
    }
}

/**
 * @function
*/function runOpenBox() {
    return (0, _scripts.runScript)('./openbox.sh', ['start']);
}

/**
 * @function
*/function start() {
    if (runOpenBox() !== 'started') {
        logger.warn('openbox not yet started');
        return;
    }

    if (childProcess) {
        logger.warn('start: already started');
        return;
    }

    logger.info('starting...');
    autoRestart = true;

    const config = (0, _config.get)();

    let script = config.display;
    logger.info('start', { script, url: config.url });
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
    logger.info('restarting...');
    stop();
    return start();
}

/**
 * @function
*/function stop() {
    autoRestart = false;
    if (childProcess) {
        childProcess.removeAllListeners();
    }
    childProcess = null;

    let script = (0, _config.get)().display;
    logger.info('stop', { script });
    (0, _scripts.runScript)(`./${ script }.sh`, ['stop']);
}
//# sourceMappingURL=display.js.map