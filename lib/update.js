'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.selfUpdate = selfUpdate;

var _child_process = require('child_process');

var _nightingale = require('nightingale');

var _scripts = require('./scripts');

const logger = new _nightingale.ConsoleLogger('app.update', _nightingale.LogLevel.INFO);

/**
 * @function
*/function selfUpdate() {
    logger.info('self update');
    try {
        (0, _child_process.spawnSync)('git', ['pull'], { stdio: 'inherit', cwd: `${ __dirname }/../` });
        (0, _child_process.spawnSync)('npm', ['install', '--production'], { stdio: 'inherit', cwd: `${ __dirname }/../` });
        (0, _child_process.spawnSync)('npm', ['prune', '--production'], { stdio: 'inherit', cwd: `${ __dirname }/../` });
        (0, _child_process.spawnSync)('sudo', ['supervisorctl', 'restart', 'node-raspberry-client']);
    } catch (err) {
        logger.error(err.message);
    }
}
//# sourceMappingURL=update.js.map