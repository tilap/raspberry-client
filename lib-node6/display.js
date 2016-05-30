'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.refresh = refresh;
exports.update = update;
exports.openboxStarted = openboxStarted;
exports.start = start;
exports.restart = restart;
exports.stop = stop;

var _nightingale = require('nightingale');

var _nightingale2 = _interopRequireDefault(_nightingale);

var _config = require('./config');

var _scripts = require('./scripts');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingale2.default('app.display');

let currentDisplay;
let autoRestart;
let childProcess;

const displays = {
    kweb3: { openbox: true },
    chromium: { openbox: true },
    livestreamer: { openbox: false }
};

function refresh() {
    if (childProcess) {
        logger.log('refresh');
        const config = (0, _config.get)();
        return (0, _scripts.runScript)(`./${ config.display }.sh`, ['refresh']);
    } else {
        logger.warn('display stopped');
    }
}

function update() {
    logger.info('update');
    const config = (0, _config.get)();
    if (config.display === 'kweb3' && currentDisplay === config.display) {
        return (0, _scripts.runScript)(`./${ config.display }.sh`, ['load', config.url]);
    } else {
        return restart();
    }
}

function startOpenBox() {
    logger.info('start openbox');
    return (0, _scripts.runScript)('./openbox.sh', ['start']);
}

function stopOpenBox() {
    logger.info('stop openbox');
    return (0, _scripts.runScript)('./openbox.sh', ['stop']);
}

function startChild() {
    logger.info('starting child');
    if (childProcess) {
        throw new Error('child process already started');
    }

    autoRestart = true;

    const config = (0, _config.get)();

    currentDisplay = config.display;
    logger.info('start', { display: currentDisplay, url: config.url });
    childProcess = (0, _scripts.spawn)(`./${ currentDisplay }.sh`, ['start', config.url]);
    const thisChildProcess = childProcess;
    childProcess.stdout.on('data', data => logger.debug(data.toString()));
    childProcess.stderr.on('data', data => logger.error(data.toString()));
    childProcess.on('close', code => {
        const sameChildProcess = thisChildProcess === childProcess;
        childProcess = null;
        logger.error(`child process exited with code ${ code }`);
        if (autoRestart && sameChildProcess) {
            process.nextTick(() => start());
        }
    });
}

function openboxStarted() {
    const config = (0, _config.get)();
    logger.info('openbox started', { display: config.display });

    if (!displays[config.display].openbox) {
        stopOpenBox();
    } else {
        startChild();
    }
}

function start() {
    if (childProcess) {
        logger.warn('start: already started');
        return;
    }

    const config = (0, _config.get)();
    logger.info('starting...', { config });

    if (!displays[config.display].openbox) {
        stopOpenBox();
        startChild();
    } else {
        if (startOpenBox() !== 'started') {
            logger.warn('openbox not yet started');
            return;
        } else {
            startChild();
        }
    }
}

function restart() {
    logger.info('restarting...');
    stop();
    return start();
}

function stop() {
    autoRestart = false;
    if (childProcess) {
        childProcess.removeAllListeners();
    }
    childProcess = null;

    logger.info('stop', { display: currentDisplay });
    (0, _scripts.runScript)('./display.sh', ['stop']);
    stopOpenBox();
}
//# sourceMappingURL=display.js.map