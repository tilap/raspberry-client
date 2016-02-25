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

var _display = require('./display');

var display = _interopRequireWildcard(_display);

/**
 * @function
 * @param obj
*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const logger = new _nightingale.ConsoleLogger('app.screen', _nightingale.LogLevel.INFO);

let currentScreenState = exports.currentScreenState = state();

/**
 * @returns {string} on|off|unavailable
 * @function
*/
function state() {
    return (0, _scripts.runScript)('./screen.sh', ['state']);
}

/**
 * @function
*/function on() {
    logger.info('turning screen on');
    (0, _scripts.runScript)('./screen.sh', ['on']);
    exports.currentScreenState = currentScreenState = 'on';
    (0, _tcpClient.sendUpdate)({ screenState: currentScreenState });
}

/**
 * @function
*/function off() {
    logger.info('turning screen off');
    (0, _scripts.runScript)('./screen.sh', ['off']);
    exports.currentScreenState = currentScreenState = 'off';
    (0, _tcpClient.sendUpdate)({ screenState: currentScreenState });
}

if (currentScreenState === 'on') {
    display.start();
}
//# sourceMappingURL=screen.js.map