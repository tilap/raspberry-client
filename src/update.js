import { readFileSync } from 'fs';
import { version as currentVersion } from '../package.json';
import { spawnSync } from 'child_process';
import Logger from 'nightingale';
import { sendUpdate } from './client';
import { exit } from './index';

const logger = new Logger('app.update');

export function selfUpdate() {
    sendUpdate({ updating: true });
    logger.info('self update');
    try {
        spawnSync('sudo', ['npm', 'install', '-g', 'raspberry-client'], { stdio: 'inherit', cwd: `${__dirname}/../` });
        const newVersion = JSON.parse(readFileSync(`${__dirname}/../package.json`)).version;
        if (newVersion !== currentVersion) {
            spawnSync(
                'node',
                ['migrate.js', currentVersion, newVersion],
                { stdio: 'inherit', cwd: __dirname }
            );
        }
        exit();
        return true;
    } catch (err) {
        logger.error(err.message);
    }
}
