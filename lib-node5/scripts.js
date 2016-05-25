'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.runScript = runScript;
exports.listenScript = listenScript;
exports.spawn = spawn;

var _child_process = require('child_process');

var _nightingale = require('nightingale');

var _nightingale2 = _interopRequireDefault(_nightingale);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingale2.default('app.scripts');

const scriptDirname = `${ __dirname }/../scripts/`;

function runScript(script, args) {
    var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    let cwd = _ref.cwd;

    logger.debug('run script', { script: script, args: args });
    const result = (0, _child_process.spawnSync)(script, args, { cwd: cwd || scriptDirname });
    if (result.error) {
        logger.error(result.error.message);
    }

    if (result.stderr) {
        const stderr = result.stderr.toString();
        if (stderr) {
            logger.error(stderr, { script: script, args: args });
        }
    }

    if (result.stdout) {
        const stdout = result.stdout.toString().trim();
        logger.debug(stdout, { script: script, args: args });
        return stdout;
    }
}

function listenScript(script, args, callbackOnData) {
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

function spawn(script, args) {
    logger.debug('spawn', { script: script, args: args });
    return (0, _child_process.spawn)(script, args, { cwd: scriptDirname });
}
//# sourceMappingURL=scripts.js.map