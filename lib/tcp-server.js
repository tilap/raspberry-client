'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.close = close;

var _net = require('net');

var _fs = require('fs');

var _nightingale = require('nightingale');

var _objectstream = require('objectstream');

var _screen = require('./screen');

var screen = _interopRequireWildcard(_screen);

var _display = require('./display');

var display = _interopRequireWildcard(_display);

var _update = require('./update');

/**
 * @function
 * @param obj
*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const logger = new _nightingale.ConsoleLogger('app.tcp-server', _nightingale.LogLevel.INFO);

/**
 * @function
 * @param data
*/function run(data) {
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
                case 'openbox-started':
                case 'restart':
                    return display.restart();
            }
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

try {
    (0, _fs.unlinkSync)(`${ __dirname }/../socket`);
} catch (e) {}

server.listen(`${ __dirname }/../socket`, () => {
    logger.info('Listening');
});

/**
 * @function
*/function close() {
    return new Promise(resolve => {
        logger.info('Closing...');
        server.close(() => {
            logger.info('Closed');
            resolve();
        });
    });
}
//# sourceMappingURL=tcp-server.js.map