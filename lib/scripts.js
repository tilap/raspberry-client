'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.runScript = runScript;
exports.listenScript = listenScript;

var _child_process = require('child_process');

var _nightingale = require('nightingale');

const logger = new _nightingale.ConsoleLogger('app.scripts', _nightingale.LogLevel.INFO);

/**
 * @function
 * @param script
 * @param args
*/function runScript(script, args) {
    logger.info('run script', { script, args });
    const result = (0, _child_process.spawnSync)(script, args, { cwd: `${ __dirname }/../scripts/` });
    if (result.error) {
        logger.error(result.error.message);
    }

    if (result.stderr) {
        const stderr = result.stderr.toString();
        if (stderr) {
            logger.error(stderr);
        }
    }

    if (result.stdout) {
        const stdout = result.stdout.toString().trim();
        logger.debug(stdout);
        return stdout;
    }
}

/**
 * @function
 * @param script
 * @param args
*/function listenScript(script, args) {
    const childProcess = (0, _child_process.spawn)(script, args, { cwd: `${ __dirname }/../scripts/` });
    childProcess.stdout.on('data', /**
                                    * @function
                                    * @param data
                                   */function (data) {
        logger.debug(data.toString());
    });

    childProcess.stderr.on('data', /**
                                    * @function
                                    * @param data
                                   */function (data) {
        logger.error(data.toString());
    });

    childProcess.on('close', /**
                              * @function
                              * @param code
                             */function (code) {
        console.log('child process exited with code ' + code);
    });
}
//# sourceMappingURL=scripts.js.map