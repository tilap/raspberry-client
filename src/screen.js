import { ConsoleLogger, LogLevel } from 'nightingale';
import { runScript, listenScript } from './scripts';
import { sendUpdate } from './tcp-client';

const logger = new ConsoleLogger('app.screen', LogLevel.INFO);

export function on() {
    return runScript('./screen.sh', ['on']);
}

export function off() {
    return runScript('./screen.sh', ['off']);
}

/**
 * @returns {string} on|off|unavailable
 */
function state() {
    return runScript('./screen.sh', ['state']);
}

/**
 * @returns {string} on|off
 */
function subscribe() {
    return listenScript('./screen.sh', ['subscribe']);
}

export let currentScreenState = state();
setInterval(() => {
    const newScreenState = state();
    if (newScreenState != currentScreenState) {
        logger.info('screen state changed', { old: currentScreenState, new: newScreenState })
        currentScreenState = newScreenState;
        sendUpdate({ screenState: newScreenState })
    }
}, 5000);
