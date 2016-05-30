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
