import { readFileSync } from 'fs';
import { version as currentVersion } from '../package.json';
import { spawnSync } from 'child_process';
import { ConsoleLogger, LogLevel } from 'nightingale';
import { sendUpdate } from './tcp-client';
import { exit } from './index';

const logger = new ConsoleLogger('app.update', LogLevel.INFO);

export function selfUpdate() {
    sendUpdate({ updating: true });
    logger.info('self update');
    try {
        spawnSync('git', ['fetch'], { stdio: 'inherit', cwd: `${__dirname}/../` });
        const { stdout } = spawnSync('git', ['status', '--porcelain', '-b'], { cwd: `${__dirname}/../` });
        if (!stdout.toString().includes('behind')) {
            logger.info('nothing to update');
            sendUpdate({ updating: false });
            return false;
        }

        spawnSync('git', ['pull'], { stdio: 'inherit', cwd: `${__dirname}/../` });
        spawnSync('npm', ['install', '--production'], { stdio: 'inherit', cwd: `${__dirname}/../` });
        spawnSync('npm', ['prune', '--production'], { stdio: 'inherit', cwd: `${__dirname}/../` });
        const newVersion = JSON.parse(readFileSync(`${__dirname}/../package.json`)).version;
        if (newVersion !== currentVersion) {
            spawnSync('node', ['migrate.js', currentVersion, newVersion], { stdio: 'inherit', cwd: __dirname });
        }
        exit();
        return true;
    } catch (err) {
        logger.error(err.message);
    }
}
