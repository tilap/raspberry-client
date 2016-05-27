'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.selfUpdate = selfUpdate;

var _fs = require('fs');

var _package = require('../package.json');

var _child_process = require('child_process');

var _nightingale = require('nightingale');

var _nightingale2 = _interopRequireDefault(_nightingale);

var _client = require('./client');

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingale2.default('app.update');

function selfUpdate() {
    (0, _client.sendUpdate)({ updating: true });
    logger.info('self update');
    try {
        (0, _child_process.spawnSync)('git', ['fetch'], { stdio: 'inherit', cwd: `${ __dirname }/../` });

        var _spawnSync = (0, _child_process.spawnSync)('git', ['status', '--porcelain', '-b'], { cwd: `${ __dirname }/../` });

        const stdout = _spawnSync.stdout;

        if (!stdout.toString().includes('behind')) {
            logger.info('nothing to update');
            (0, _client.sendUpdate)({ updating: false });
            return false;
        }

        (0, _child_process.spawnSync)('git', ['pull'], { stdio: 'inherit', cwd: `${ __dirname }/../` });
        (0, _child_process.spawnSync)('npm', ['install', '--production'], { stdio: 'inherit', cwd: `${ __dirname }/../` });
        (0, _child_process.spawnSync)('npm', ['prune', '--production'], { stdio: 'inherit', cwd: `${ __dirname }/../` });
        const newVersion = JSON.parse((0, _fs.readFileSync)(`${ __dirname }/../package.json`)).version;
        if (newVersion !== _package.version) {
            (0, _child_process.spawnSync)('node', ['migrate.js', _package.version, newVersion], { stdio: 'inherit', cwd: __dirname });
        }
        (0, _index.exit)();
        return true;
    } catch (err) {
        logger.error(err.message);
    }
}
//# sourceMappingURL=update.js.map