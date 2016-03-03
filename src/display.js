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
    if (config.display === 'kweb3') {
        return runScript(`./${config.display}.sh`, ['load', config.url]);
    } else {
        return restart();
    }
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
            return new Promise((resolve, reject) => {
                killing
                    .then(() => resolve())
                    .catch(err => reject(err));
            });
        }

        return new Promise((resolve) => {
            killing = new Promise((resolveKilling) => {
                const timeoutForceKill = setTimeout(() => {
                    childProcess.kill('SIGKILL');
                }, 10000);
                childProcess.once('exit', () => {
                    logger.info('display stopped');
                    resolve();
                    resolveKilling();
                    childProcess = null;
                    killing = false;
                    clearTimeout(timeoutForceKill);
                    process.nextTick(() => childProcess.removeAllListeners());
                });
                childProcess.kill();
            });
        });
    }
}
