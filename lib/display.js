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
    const config = (0, _config.get)();
    return (0, _scripts.runScript)(`./${ config.display }.sh`, ['refresh']);
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
        logger.warn('start: already started');
        return restart();
    }

    logger.info('starting...');
    autoRestart = true;

    const config = (0, _config.get)();

    if (['livestreamer', 'kweb3', 'chromium', 'browser'].indexOf(config.display) === -1) {
        config.display = 'browser';
    }

    let script = config.display;
    if (script === 'browser') {
        script = 'kweb3';
    }

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
    Promise.resolve(stop()).then(() => start());
}

let killing = false;
/**
 * @function
*/function stop() {
    autoRestart = false;
    if (childProcess) {
        logger.info('stop: already stopping');
        if (killing) {
            return new Promise((resolve, reject) => {
                killing.then(() => resolve()).catch(err => reject(err));
            });
        }
        logger.info('stopping...');

        return new Promise(resolve => {
            killing = new Promise(resolveKilling => {
                const timeoutForceKill = setTimeout(() => {
                    logger.info('sending SIGKILL');
                    childProcess.kill('SIGKILL');
                }, 10000);
                childProcess.once('close', () => {
                    logger.info('display stopped');
                    let cp = childProcess;
                    if (cp) {
                        resolve();
                        resolveKilling();
                        childProcess = null;
                        killing = false;
                        clearTimeout(timeoutForceKill);
                        process.nextTick(() => cp.removeAllListeners());
                    }
                });

                // send both SIGINT and SIGTERM
                childProcess.kill('SIGINT');
                childProcess.kill('SIGTERM');
            });
        });
    }
}
//# sourceMappingURL=display.js.map