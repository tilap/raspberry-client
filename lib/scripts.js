'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.runScript = runScript;
exports.listenScript = listenScript;
exports.spawn = spawn;

var _child_process = require('child_process');

var _nightingale = require('nightingale');

const logger = new _nightingale.ConsoleLogger('app.scripts', _nightingale.LogLevel.INFO);

/**
 * @function
 * @param script
 * @param args
*/function runScript(script, args) {
    logger.debug('run script', { script, args });
    const result = (0, _child_process.spawnSync)(script, args, { cwd: `${ __dirname }/../scripts/` });
    if (result.error) {
        logger.error(result.error.message);
    }

    if (result.stderr) {
        const stderr = result.stderr.toString();
        if (stderr) {
            logger.error(stderr, { script, args });
        }
    }

    if (result.stdout) {
        const stdout = result.stdout.toString().trim();
        logger.debug(stdout, { script, args });
        return stdout;
    }
}

/**
 * @function
 * @param script
 * @param args
 * @param callbackOnData
*/function listenScript(script, args, callbackOnData) {
    return new Promise((resolve, reject) => {
        const childProcess = spawn(script, args);
        childProcess.stdout.on('data', data => {
            data = data.toString();
            logger.debug(data);
            callbackOnData(data);
        });

        childProcess.stderr.on('data', data => {
            data = data.toString();
            logger.debug(data);
            callbackOnData(data);
        });

        childProcess.on('close', code => {
            if (code) {
                logger.error(`child process exited with code ${ code }`);
                return reject(code);
            }

            resolve(code);
        });
    });
}

/**
 * @function
 * @param script
 * @param args
*/function spawn(script, args) {
    logger.debug('spawn', { script, args });
    return (0, _child_process.spawn)(script, args, { cwd: `${ __dirname }/../scripts/` });
}
//# sourceMappingURL=scripts.js.map