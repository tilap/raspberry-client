'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.reload = reload;
exports.refresh = refresh;
exports.selfUpdate = selfUpdate;

var _child_process = require('child_process');

var _nightingale = require('nightingale');

var _scripts = require('./scripts');

const logger = new _nightingale.ConsoleLogger('app.actions', _nightingale.LogLevel.INFO);

/**
 * @function
 * @param url
*/function reload(url) {
    (0, _scripts.runScript)('screen.sh', ['reload', url]);
}

/**
 * @function
*/function refresh() {
    (0, _scripts.runScript)('screen.sh', ['refresh']);
}

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
//# sourceMappingURL=actions.js.map