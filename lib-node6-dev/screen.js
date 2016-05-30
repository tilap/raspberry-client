'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.currentScreenState = undefined;
exports.on = on;
exports.off = off;

var _nightingale = require('nightingale');

var _nightingale2 = _interopRequireDefault(_nightingale);

var _scripts = require('./scripts');

var _client = require('./client');

var _display = require('./display');

var display = _interopRequireWildcard(_display);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingale2.default('app.screen');

let currentScreenState = exports.currentScreenState = state();
logger.info('init', { currentScreenState });

/**
 * @returns {string} on|off|unavailable
 */
function state() {
    return (0, _scripts.runScript)('./screen.sh', ['state']);
}

function on() {
    logger.info('turning screen on');
    (0, _scripts.runScript)('./screen.sh', ['on']);
    exports.currentScreenState = currentScreenState = 'on';
    (0, _client.sendUpdate)({ screenState: currentScreenState });
    display.start();
}

function off() {
    logger.info('turning screen off');
    (0, _scripts.runScript)('./screen.sh', ['off']);
    exports.currentScreenState = currentScreenState = 'off';
    (0, _client.sendUpdate)({ screenState: currentScreenState });
    display.stop();
}

if (currentScreenState === 'on') {
    display.start();
}
//# sourceMappingURL=screen.js.map