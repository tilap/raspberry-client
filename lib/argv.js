'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hostname = exports.host = exports.port = undefined;

var _url = require('url');

var _minimistArgv = require('minimist-argv');

var _minimistArgv2 = _interopRequireDefault(_minimistArgv);

/**
 * @function
 * @param obj
*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const port = exports.port = _minimistArgv2.default.port || 3002;
const host = exports.host = _minimistArgv2.default.host || 'http://localhost';
const hostname = exports.hostname = (0, _url.parse)(host).hostname;
//# sourceMappingURL=argv.js.map