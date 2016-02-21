import { spawnSync } from 'child_process';
import { ConsoleLogger, LogLevel } from 'nightingale';
import { runScript } from './scripts';

const logger = new ConsoleLogger('app.update', LogLevel.INFO);

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
