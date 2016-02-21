import { runScript, listenScript } from './scripts';

/**
 * @returns {string} on|off
 */
function status() {
    return runScript('./screen.sh', ['status']);
}

/**
 * @returns {string} on|off
 */
function subscribe() {
    return listenScript('./screen.sh', ['subscribe']);
}


export function isOn() {
    return status() === 'on';
}

export function isOff() {
    return status() !== 'on';
}

