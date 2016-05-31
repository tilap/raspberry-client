import { readFile, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import Logger from 'nightingale';
import { runScript } from './scripts';
import { sendUpdate } from './client';
import * as display from './display';

const logger = new Logger('app.screen');

export let currentScreenState = state();
logger.info('init', { currentScreenState });

/**
 * @returns {string} on|off|unavailable
 */
function state() {
    return runScript('./screen.sh', ['state']);
}

export function on() {
    logger.info('turning screen on');
    runScript('./screen.sh', ['on']);
    currentScreenState = 'on';
    sendUpdate({ screenState: currentScreenState });
    display.start();
}

export function off() {
    logger.info('turning screen off');
    runScript('./screen.sh', ['off']);
    currentScreenState = 'off';
    sendUpdate({ screenState: currentScreenState });
    display.stop();
}

if (currentScreenState === 'on') {
    display.start();
}

let lockScreenshot;

export async function screenshot() {
    if (currentScreenState !== 'on') {
        logger.warn('screenshot: screen is off');
        return;
    }

    if (lockScreenshot) {
        logger.warn('screenshot: locked');
        return;
    }

    logger.info('getting screenshot');

    const filename = `${tmpdir()}/screenshot.png`;
    lockScreenshot = true;
    runScript('./screen.sh', ['screenshot', filename]);

    return new Promise((resolve, reject) => {
        readFile(filename, (err, buffer) => {
            lockScreenshot = false;
            resolve({
                buffer,
                callback: () => {
                    try {
                        unlinkSync(filename);
                    } catch (err) {
                    }
                },
            });
        });
    });
}
