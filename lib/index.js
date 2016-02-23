'use strict';

var _tcpClient = require('./tcp-client');

var _tcpServer = require('./tcp-server');

require('./display');

process.on('SIGINT', () => {
    Promise.all([(0, _tcpClient.close)(), (0, _tcpServer.close)()]).then(() => {
        process.exit();
    });
});
//# sourceMappingURL=index.js.map