import { ConsoleLogger, LogLevel } from 'nightingale';
import { get as getConfig } from './config';
import { runScript, spawn } from './scripts';

const logger = new ConsoleLogger('app.display', LogLevel.INFO);

let autoRestart;
let childProcess;

export function refresh() {
    if (childProcess) {
        logger.log('refresh');
        const config = getConfig();
        return runScript(`./${config.display}.sh`, ['refresh']);
    } else {
        logger.warn('display stopped');
    }
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

export function start() {
    if (runOpenBox() !== 'started') {
        logger.warn('openbox not yet started');
        return;
    }

    if (childProcess) {
        logger.warn('start: already started');
        return;
    }

    logger.info('starting...');
    autoRestart = true;

    const config = getConfig();

    let script = config.display;
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
    stop();
    return start();
}

export function stop() {
    autoRestart = false;
    if (childProcess) {
        childProcess.removeAllListeners();
    }
    childProcess = null;

    let script = getConfig().display;
    logger.info('stop', { script });
    runScript(`./${script}.sh`, ['stop']);
}
