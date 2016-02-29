import { ConsoleLogger, LogLevel } from 'nightingale';
import { get as getConfig } from './config';
import { runScript, spawn } from './scripts';

const logger = new ConsoleLogger('app.display', LogLevel.INFO);

export function refresh() {
    const config = getConfig();
    return runScript(`./${config.display}.sh`, ['refresh']);
}

export function update() {
    const config = getConfig();
    return runScript(`./${config.display}.sh`, ['load', config.url]);
}

function runOpenBox() {
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

    if (['livestreamer', 'kweb3', 'chromium', 'browser'].indexOf(config.display) === -1) {
        config.display = 'browser';
    }

    let script = config.display;
    if (script === 'browser') {
        script = 'kweb3';
    }

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


let killing = false;
export function stop() {
    logger.info('stoping display');
    autoRestart = false;
    if (childProcess) {
        if (killing) {
            childProcess.kill('SIGKILL');
            return Promise.reject();
        }

        killing = true;
        return new Promise((resolve) => {
            childProcess.once('close', () => {
                logger.info('display stopped');
                resolve();
            });
            childProcess.kill();
            childProcess = null;
            killing = false;
        });
    }
}
