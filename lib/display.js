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

/**
 * @function
*/function refresh() {
    return (0, _scripts.runScript)('./browser.sh', ['refresh']);
}

/**
 * @function
*/function update() {
    return (0, _scripts.runScript)('./browser.sh', ['load', (0, _config.getUrl)()]);
}

let autoRestart;
let childProcess;

/**
 * @function
*/function start() {
    if (childProcess) {
        return;
    }

    logger.info('start display');
    autoRestart = true;
    childProcess = (0, _scripts.spawn)('./browser.sh', ['start', (0, _config.getUrl)()]);
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
    logger.info('stop display');
    autoRestart = false;
    if (childProcess) {
        return new Promise(resolve => {
            childProcess.once('close', () => resolve());
            childProcess.kill();
            childProcess = null;
        });
    }
}
//# sourceMappingURL=display.js.map