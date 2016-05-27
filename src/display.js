import Logger from 'nightingale';
import { get as getConfig } from './config';
import { runScript, spawn } from './scripts';

const logger = new Logger('app.display');

let currentDisplay;
let autoRestart;
let childProcess;

const displays = {
    kweb3: { openbox: true },
    chromium: { openbox: true },
    livestreamer: { openbox: false },
};

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
    logger.info('update');
    const config = getConfig();
    if (config.display === 'kweb3' && currentDisplay === config.display) {
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

    currentDisplay = config.display;
    logger.info('start', { display: currentDisplay, url: config.url });
    childProcess = spawn(`./${currentDisplay}.sh`, ['start', config.url]);
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
    const config = getConfig();
    logger.info('openbox started', { display: config.display });

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

    logger.info('stop', { display: currentDisplay });
    runScript('./display.sh', ['stop']);
    stopOpenBox();
}
