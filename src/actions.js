import { spawnSync } from 'child_process';
import { ConsoleLogger, LogLevel } from 'nightingale';

const logger = new ConsoleLogger('app.actions', LogLevel.INFO);

function runScript(script, args) {
    logger.info('run script', { script, args });
    try {
        spawnSync(script, args, { stdio: 'inherit', cwd: `${__dirname}/../scripts/` });
    } catch (err) {
        logger.error(err.message);
    }
}

export function reload(url) {
    runScript('screen.sh', ['reload', url]);
}

export function refresh() {
    runScript('screen.sh', ['refresh']);
}

export function selfUpdate() {
    logger.info('self update');
    try {
        spawnSync('git', ['pull'], { stdio: 'inherit', cwd: `${__dirname}/../` });
        spawnSync('npm', ['install', '--production'], { stdio: 'inherit', cwd: `${__dirname}/../` });
        spawnSync('npm', ['prune', '--production'], { stdio: 'inherit', cwd: `${__dirname}/../` });
        spawnSync('sudo', ['supervisorctl', 'restart', 'node-raspberry-client']);
    } catch (err) {
        logger.error(err.message);
    }
}
