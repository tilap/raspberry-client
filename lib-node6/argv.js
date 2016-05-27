'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.host = exports.port = undefined;

var _minimistArgv = require('minimist-argv');

var _minimistArgv2 = _interopRequireDefault(_minimistArgv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const port = exports.port = _minimistArgv2.default.port || 3333;
const host = exports.host = _minimistArgv2.default.host || 'http://localhost';
//# sourceMappingURL=argv.js.map