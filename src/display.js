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
        logger.warn('start: already started');
        return restart();
    }

    logger.info('starting...');
    autoRestart = true;

    const config = getConfig();

    if (['livestreamer', 'kweb3', 'chromium', 'browser'].indexOf(config.display) === -1) {
        config.display = 'browser';
    }

    let script = config.display;
    if (script === 'browser') {
        script = 'kweb3';
    }

    logger.info('start', { script, url: config.url });
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
    logger.info('restarting...');
    Promise.resolve(stop())
        .then(() => start());
}


let killing = false;
export function stop() {
    autoRestart = false;
    if (childProcess) {
        logger.info('stop: already stopping');
        if (killing) {
            return new Promise((resolve, reject) => {
                killing
                    .then(() => resolve())
                    .catch(err => reject(err));
            });
        }
        logger.info('stopping...');

        return new Promise((resolve) => {
            killing = new Promise((resolveKilling) => {
                const timeoutForceKill = setTimeout(() => {
                    logger.info('sending SIGKILL');
                    childProcess.kill('SIGKILL');
                }, 10000);
                childProcess.once('close', () => {
                    let cp = childProcess;
                    logger.info('display stopped');
                    resolve();
                    resolveKilling();
                    childProcess = null;
                    killing = false;
                    clearTimeout(timeoutForceKill);
                    process.nextTick(() => cp.removeAllListeners());
                });

                // send both SIGINT and SIGTERM
                childProcess.kill('SIGINT');
                childProcess.kill('SIGTERM');
            });
        });
    }
}
