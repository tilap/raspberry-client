import { spawn as spawnChild, spawnSync } from 'child_process';
import { ConsoleLogger, LogLevel } from 'nightingale';

const logger = new ConsoleLogger('app.scripts', LogLevel.INFO);

export function runScript(script, args, { cwd } = {}) {
    logger.debug('run script', { script, args });
    const result = spawnSync(script, args, { cwd: cwd || `${__dirname}/../scripts/` });
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

export function listenScript(script, args, callbackOnData) {
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

export function spawn(script, args) {
    logger.debug('spawn', { script, args });
    return spawnChild(script, args, { cwd: `${__dirname}/../scripts/` });
}
