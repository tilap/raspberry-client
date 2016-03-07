'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.selfUpdate = selfUpdate;

var _child_process = require('child_process');

var _nightingale = require('nightingale');

var _tcpClient = require('./tcp-client');

var _index = require('./index');

const logger = new _nightingale.ConsoleLogger('app.update', _nightingale.LogLevel.INFO);

/**
 * @function
*/function selfUpdate() {
    (0, _tcpClient.sendUpdate)({ updating: true });
    logger.info('self update');
    try {
        (0, _child_process.spawnSync)('git', ['fetch'], { stdio: 'inherit', cwd: `${ __dirname }/../` });

        var _spawnSync = (0, _child_process.spawnSync)('git', ['status', '--porcelain', '-b'], { cwd: `${ __dirname }/../` });

        const stdout = _spawnSync.stdout;

        if (!stdout.toString().includes('behind')) {
            logger.info('nothing to update');
            (0, _tcpClient.sendUpdate)({ updating: false });
            return false;
        }

        (0, _child_process.spawnSync)('git', ['pull'], { stdio: 'inherit', cwd: `${ __dirname }/../` });
        (0, _child_process.spawnSync)('npm', ['install', '--production'], { stdio: 'inherit', cwd: `${ __dirname }/../` });
        (0, _child_process.spawnSync)('npm', ['prune', '--production'], { stdio: 'inherit', cwd: `${ __dirname }/../` });
        (0, _index.exit)();
        return true;
    } catch (err) {
        logger.error(err.message);
    }
}
//# sourceMappingURL=update.js.map