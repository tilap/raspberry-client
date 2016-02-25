import { ConsoleLogger, LogLevel } from 'nightingale';
import { runScript, listenScript } from './scripts';
import { sendUpdate } from './tcp-client';
import * as display from './display';

const logger = new ConsoleLogger('app.screen', LogLevel.INFO);

export let currentScreenState = state();

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
}

export function off() {
    logger.info('turning screen off');
    runScript('./screen.sh', ['off']);
    currentScreenState = 'off';
    sendUpdate({ screenState: currentScreenState });
}

if (currentScreenState === 'on') {
    display.start();
}
