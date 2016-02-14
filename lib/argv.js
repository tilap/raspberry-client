'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const argv = require('minimist')(process.argv.slice(2));

const port = exports.port = argv.port || 3002;
const host = exports.host = argv.host || 'localhost';
//# sourceMappingURL=argv.js.map