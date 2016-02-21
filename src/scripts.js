import { spawn, spawnSync } from 'child_process';
import { ConsoleLogger, LogLevel } from 'nightingale';

const logger = new ConsoleLogger('app.scripts', LogLevel.INFO);

export function runScript(script, args) {
    logger.info('run script', { script, args });
    const result = spawnSync(script, args, { cwd: `${__dirname}/../scripts/` });
    if (result.error) {
        logger.error(result.error.message);
    }

    if (result.stderr) {
        const stderr = result.stderr.toString();
        if (stderr) {
            logger.error(stderr);
        }
    }

    if (result.stdout) {
        const stdout = result.stdout.toString().trim();
        logger.debug(stdout);
        return stdout;
    }
}

export function listenScript(script, args) {
    const childProcess = spawn(script, args, { cwd: `${__dirname}/../scripts/` });
    childProcess.stdout.on('data', function (data) {
        logger.debug(data.toString());
    });

    childProcess.stderr.on('data', function (data) {
        logger.error(data.toString());
    });

    childProcess.on('close', function (code) {
        console.log('child process exited with code ' + code);
    });
}
