'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.reload = reload;
exports.refresh = refresh;
exports.selfUpdate = selfUpdate;

var _child_process = require('child_process');

var _nightingale = require('nightingale');

const logger = new _nightingale.ConsoleLogger('app.actions', _nightingale.LogLevel.INFO);

/**
 * @function
 * @param script
 * @param args
*/function runScript(script, args) {
    logger.info('run script', { script, args });
    try {
        (0, _child_process.spawnSync)(script, args, { stdio: 'inherit', cwd: `${ __dirname }/../scripts/` });
    } catch (err) {
        logger.error(err.message);
    }
}

/**
 * @function
 * @param url
*/function reload(url) {
    runScript('screen.sh', ['reload', url]);
}

/**
 * @function
*/function refresh() {
    runScript('screen.sh', ['refresh']);
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