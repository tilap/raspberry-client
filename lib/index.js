'use strict';

var _display = require('./display');

var _tcpClient = require('./tcp-client');

var _tcpServer = require('./tcp-server');

process.on('SIGINT', () => {
    Promise.all([(0, _display.stop)(), (0, _tcpClient.close)(), (0, _tcpServer.close)()]).then(() => {
        process.exit();
    });
});
//# sourceMappingURL=index.js.map