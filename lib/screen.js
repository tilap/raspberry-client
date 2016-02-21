'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.currentScreenState = undefined;
exports.on = on;
exports.off = off;

var _nightingale = require('nightingale');

var _scripts = require('./scripts');

var _tcpClient = require('./tcp-client');

const logger = new _nightingale.ConsoleLogger('app.screen', _nightingale.LogLevel.INFO);

/**
 * @function
*/function on() {
    return (0, _scripts.runScript)('./screen.sh', ['on']);
}

/**
 * @function
*/function off() {
    return (0, _scripts.runScript)('./screen.sh', ['off']);
}

/**
 * @returns {string} on|off|unavailable
 * @function
*/
function state() {
    return (0, _scripts.runScript)('./screen.sh', ['state']);
}

/**
 * @returns {string} on|off
 * @function
*/
function subscribe() {
    return (0, _scripts.listenScript)('./screen.sh', ['subscribe']);
}

let currentScreenState = exports.currentScreenState = state();
setInterval(() => {
    const newScreenState = state();
    if (newScreenState != currentScreenState) {
        logger.info('screen state changed', { old: currentScreenState, new: newScreenState });
        exports.currentScreenState = currentScreenState = newScreenState;
        (0, _tcpClient.sendUpdate)({ screenState: newScreenState });
    }
}, 5000);
//# sourceMappingURL=screen.js.map