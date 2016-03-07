'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.exit = exit;

var _display = require('./display');

var _tcpClient = require('./tcp-client');

var _tcpServer = require('./tcp-server');

require('./cron');

/**
 * @function
*/function exit() {
    Promise.all([(0, _display.stop)(), (0, _tcpClient.close)(), (0, _tcpServer.close)()]).then(() => {
        process.exit();
    });
}

process.on('SIGINT', () => {
    exit();
});
//# sourceMappingURL=index.js.map