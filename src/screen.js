import { ConsoleLogger, LogLevel } from 'nightingale';
import { runScript, listenScript } from './scripts';
import { sendUpdate } from './tcp-client';
import * as display from './display';

const logger = new ConsoleLogger('app.screen', LogLevel.INFO);

function checkStateWhile(expectedState, ms) {
    const newState = checkState();
    if (newState !== expectedState) {
        setTimeout(() => checkStateWhile(expectedState, ms), ms);
    }
}


export function on() {
    runScript('./screen.sh', ['on']);
    checkStateWhile('on', 500);
}

export function off() {
    runScript('./screen.sh', ['off']);
    checkStateWhile('off', 500);
}

/**
 * @returns {string} on|off|unavailable
 */
export function state() {
    return runScript('./screen.sh', ['state']);
}

export let currentScreenState = state();

/**
 * @returns {string} on|off
 */
function subscribe() {
    return listenScript('./screen.sh', ['subscribe'], () => {
        if (currentScreenState !== 'off') {
            checkState();
        }
    });
}

setInterval(checkState, 60000);

function checkState() {
    const newScreenState = state();
    if (newScreenState != currentScreenState) {
        logger.info('screen state changed', { old: currentScreenState, new: newScreenState });
        currentScreenState = newScreenState;
        sendUpdate({ screenState: newScreenState });
        if (currentScreenState !== 'on') {
            display.stop();
        }
    }
    return newScreenState;
}


subscribe();

if (currentScreenState === 'on') {
    display.start();
}
