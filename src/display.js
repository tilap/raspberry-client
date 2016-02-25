import { ConsoleLogger, LogLevel } from 'nightingale';
import { get as getConfig } from './config';
import { runScript, spawn } from './scripts';

const logger = new ConsoleLogger('app.display', LogLevel.INFO);

export function refresh() {
    return runScript('./browser.sh', ['refresh']);
}

export function update() {
    return runScript('./browser.sh', ['load', getConfig().url]);
}

export function runOpenBox() {
    return runScript('./openbox.sh', ['start']);
}

let autoRestart;
let childProcess;

export function start() {
    if (runOpenBox() !== 'started') {
        logger.warn('openbox not yet started');
        return;
    }

    if (childProcess) {
        logger.warn('restarting');
        return restart();
    }

    logger.info('start display');
    autoRestart = true;

    const config = getConfig();
    const script = config.display === 'livestreamer' ? 'livestreamer' : 'browser';
    childProcess = spawn(`./${script}.sh`, ['start', config.url]);
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
