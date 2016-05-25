import { spawn as spawnChild, spawnSync } from 'child_process';
import Logger from 'nightingale';

const logger = new Logger('app.scripts');

const scriptDirname = `${__dirname}/../scripts/`;

export function runScript(script: string, args: Array<string|number>, { cwd } = {}) {
    logger.debug('run script', { script, args });
    const result = spawnSync(script, args, { cwd: cwd || scriptDirname });
    if (result.error) {
        logger.error(result.error.message);
    }

    if (result.stderr) {
        const stderr = result.stderr.toString();
        if (stderr) {
            logger.error(stderr, { script, args });
        }
    }

    if (result.stdout) {
        const stdout = result.stdout.toString().trim();
        logger.debug(stdout, { script, args });
        return stdout;
    }
}

export function listenScript(script: string, args: Array<string|number>, callbackOnData: Function) {
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
                logger.error(`child process exited with code ${code}`);
                return reject(code);
            }

            resolve(code);
        });
    });
}

export function spawn(script: string, args: Array<string|number>) {
    logger.debug('spawn', { script, args });
    return spawnChild(script, args, { cwd: scriptDirname });
}
