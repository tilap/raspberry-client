import { ConsoleLogger, LogLevel } from 'nightingale';
import { get as getConfig } from './config';
import { runScript, spawn } from './scripts';

const logger = new ConsoleLogger('app.display', LogLevel.INFO);

let autoRestart;
let childProcess;

const displays = {
    kweb3: { openbox: true },
    chromium: { openbox: true },
    livestreamer: { openbox: false },
}

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

function startOpenBox() {
    logger.info('start openbox');
    return runScript('./openbox.sh', ['start']);
}

function stopOpenBox() {
    logger.info('stop openbox');
    return runScript('./openbox.sh', ['stop']);
}

function startChild() {
    logger.info('starting child');
    if (childProcess) {
        throw new Error('child process already started');
    }


    autoRestart = true;

    const config = getConfig();

    let script = config.display;
    logger.info('start', { script, url: config.url });
    childProcess = spawn(`./${script}.sh`, ['start', config.url]);
    const thisChildProcess = childProcess;
    childProcess.stdout.on('data', data => logger.debug(data.toString()));
    childProcess.stderr.on('data', data => logger.error(data.toString()));
    childProcess.on('close', code => {
        const sameChildProcess = thisChildProcess === childProcess;
        childProcess = null;
        logger.error(`child process exited with code ${code}`);
        if (autoRestart && sameChildProcess) {
            process.nextTick(() => start());
        }
    });
}

export function openboxStarted() {
    logger.info('openbox started');
    const config = getConfig();
    if (!displays[config.display].openbox) {
        stopOpenBox();
    } else {
        startChild();
    }
}

export function start() {
    if (childProcess) {
        logger.warn('start: already started');
        return;
    }

    const config = getConfig();
    logger.info('starting...', { config });

    if (!displays[config.display].openbox) {
        stopOpenBox();
        startChild();
    } else {
        if (startOpenBox() !== 'started') {
            logger.warn('openbox not yet started');
            return;
        }

        startChild();
    }
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

    let display = getConfig().display;
    logger.info('stop');
    runScript(`./display.sh`, ['stop']);
    stopOpenBox();
}
