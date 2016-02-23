import { ConsoleLogger, LogLevel } from 'nightingale';
import { getUrl } from './config';
import { runScript, spawn } from './scripts';

const logger = new ConsoleLogger('app.display', LogLevel.INFO);

export function refresh() {
    return runScript('./browser.sh', ['refresh']);
}

export function update() {
    return runScript('./browser.sh', ['load', getUrl()]);
}

let autoRestart;
let childProcess;

export function start() {
    if (childProcess) {
        return;
    }

    logger.info('start display');
    autoRestart = true;
    childProcess = spawn('./browser.sh', ['start', getUrl()]);
    childProcess.stdout.on('data', data => logger.debug(data.toString()));
    childProcess.stderr.on('data', data => logger.error(data.toString()));
    childProcess.on('close', code => {
        childProcess = null;
        logger.error(`child process exited with code ${code}`);
        if (autoRestart) {
            process.nextTick(() => start());
        }
    });
}

export function restart() {
    Promise.resolve(stop())
        .then(() => start());
}


export function stop() {
    logger.info('stop display');
    autoRestart = false;
    if (childProcess) {
        return new Promise((resolve) => {
            childProcess.once('close', () => resolve());
            childProcess.kill();
            childProcess = null;
        });
    }
}
