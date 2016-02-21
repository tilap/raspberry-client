'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isOn = isOn;
exports.isOff = isOff;

var _scripts = require('./scripts');

/**
 * @returns {string} on|off
 * @function
*/
function status() {
    return (0, _scripts.runScript)('./screen.sh', ['status']);
}

/**
 * @returns {string} on|off
 * @function
*/
function subscribe() {
    return (0, _scripts.listenScript)('./screen.sh', ['subscribe']);
}

/**
 * @function
*/function isOn() {
    return status() === 'on';
}

/**
 * @function
*/function isOff() {
    return status() !== 'on';
}
//# sourceMappingURL=screen.js.map