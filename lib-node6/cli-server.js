'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.close = close;

var _net = require('net');

var _fs = require('fs');

var _os = require('os');

var _nightingale = require('nightingale');

var _nightingale2 = _interopRequireDefault(_nightingale);

var _objectstream = require('objectstream');

var _screen = require('./screen');

var screen = _interopRequireWildcard(_screen);

var _display = require('./display');

var display = _interopRequireWildcard(_display);

var _update = require('./update');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingale2.default('app.cli-server');

function run(data) {
    if (!data || !data._ || !data._[0]) {
        throw new Error('Missing action');
    }
    const action = data._[0];
    switch (action) {
        case 'self-update':
        case 'selfUpdate':
            return (0, _update.selfUpdate)();
        case 'screen':
            switch (data._[1]) {
                case 'on':
                case 'off':
                case 'state':
                    return screen[data._[1]]();
            }
            throw new Error(`Unsupported screen instruction: ${ data._[1] }`);
        case 'display':
            switch (data._[1]) {
                case 'start':
                    return display.start();
                case 'openbox-started':
                    return display.openboxStarted();
                case 'restart':
                    return display.restart();
                case 'refresh':
                    return display.refresh();
            }
            throw new Error(`Unsupported display instruction: ${ data._[1] }`);
    }
    throw new Error(`Unsupported instruction: ${ action }`);
}

const server = (0, _net.createServer)(socket => {
    logger.info('client connected');
    const jsonStream = (0, _objectstream.createStream)(socket);

    socket.on('end', () => {
        logger.info('client disconnected');

        if (jsonStream) {
            jsonStream.end();
        }
    });

    jsonStream.on('data', data => {
        logger.info('data', { data });
        try {
            const result = run(data);
            jsonStream.write({ type: 'done', result });
        } catch (err) {
            jsonStream.write({ error: err.message });
        }
    });
});

const socketPath = `${ (0, _os.tmpDir)() }/raspberry-client`;

try {
    (0, _fs.unlinkSync)(socketPath);
} catch (e) {}

server.listen(socketPath, () => {
    logger.info('Listening');
});

function close() {
    return new Promise(resolve => {
        logger.info('Closing...');
        server.close(() => {
            logger.info('Closed');
            resolve();
        });
    });
}
//# sourceMappingURL=cli-server.js.map