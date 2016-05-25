'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.exit = exit;

var _display = require('./display');

var _tcpClient = require('./tcp-client');

var _tcpServer = require('./tcp-server');

require('./cron');

var _nightingale = require('nightingale');

var _nightingaleConsole = require('nightingale-console');

var _nightingaleConsole2 = _interopRequireDefault(_nightingaleConsole);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _nightingale.addGlobalHandler)(new _nightingaleConsole2.default());

function exit() {
    Promise.all([(0, _display.stop)(), (0, _tcpClient.close)(), (0, _tcpServer.close)()]).then(() => {
        process.exit();
    });
}

process.on('SIGINT', () => {
    exit();
});
//# sourceMappingURL=index.js.map