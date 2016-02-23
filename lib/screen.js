'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.currentScreenState = undefined;
exports.on = on;
exports.off = off;
exports.state = state;

var _nightingale = require('nightingale');

var _scripts = require('./scripts');

var _tcpClient = require('./tcp-client');

var _display = require('./display');

var display = _interopRequireWildcard(_display);

/**
 * @function
 * @param obj
*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const logger = new _nightingale.ConsoleLogger('app.screen', _nightingale.LogLevel.INFO);

/**
 * @function
 * @param expectedState
 * @param ms
*/function checkStateWhile(expectedState, ms) {
    const newState = checkState();
    if (newState !== expectedState) {
        setTimeout(() => checkStateWhile(expectedState, ms), ms);
    }
}

/**
 * @function
*/function on() {
    (0, _scripts.runScript)('./screen.sh', ['on']);
    checkStateWhile('on', 500);
}

/**
 * @function
*/function off() {
    (0, _scripts.runScript)('./screen.sh', ['off']);
    checkStateWhile('off', 500);
}

/**
 * @returns {string} on|off|unavailable
 */
/**
 * @function
*/function state() {
    return (0, _scripts.runScript)('./screen.sh', ['state']);
}

let currentScreenState = exports.currentScreenState = state();

/**
 * @returns {string} on|off
 * @function
*/
function subscribe() {
    return (0, _scripts.listenScript)('./screen.sh', ['subscribe'], () => {
        if (currentScreenState !== 'off') {
            checkState();
        }
    });
}

setInterval(checkState, 60000);

/**
 * @function
*/function checkState() {
    const newScreenState = state();
    if (newScreenState != currentScreenState) {
        logger.info('screen state changed', { old: currentScreenState, new: newScreenState });
        exports.currentScreenState = currentScreenState = newScreenState;
        (0, _tcpClient.sendUpdate)({ screenState: newScreenState });
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
//# sourceMappingURL=screen.js.map