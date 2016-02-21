'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.refresh = refresh;
exports.update = update;

var _nightingale = require('nightingale');

var _config = require('./config');

var _scripts = require('./scripts');

const logger = new _nightingale.ConsoleLogger('app.display', _nightingale.LogLevel.INFO);

/**
 * @function
*/function refresh() {
    return (0, _scripts.runScript)('./browser.sh', ['refresh']);
}

/**
 * @function
*/function update() {
    return (0, _scripts.runScript)('./browser.sh', ['load', (0, _config.getUrl)()]);
}
//# sourceMappingURL=display.js.map