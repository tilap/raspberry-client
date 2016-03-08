'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || /**
                                 * @function
                                 * @param target
                                */ function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.sendUpdate = sendUpdate;
exports.close = close;

var _net = require('net');

var _nightingale = require('nightingale');

var _objectstream = require('objectstream');

var _argv = require('./argv');

var _config = require('./config');

var _display = require('./display');

var display = _interopRequireWildcard(_display);

var _networkInterface = require('./networkInterface');

var _networkInterface2 = _interopRequireDefault(_networkInterface);

var _screen = require('./screen');

var screen = _interopRequireWildcard(_screen);

var _update = require('./update');

var _package = require('../package.json');

/**
 * @function
 * @param obj
*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @function
 * @param obj
*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const logger = new _nightingale.ConsoleLogger('app.tcp-client', _nightingale.LogLevel.INFO);

let autorestart = true;
let pingInterval;
const socket = new _net.Socket({ host: _argv.host, port: _argv.port });
const jsonStream = (0, _objectstream.createStream)(socket);

jsonStream.on('error', err => {
    logger.error(err);
});

socket.on('error', err => {
    logger.error(err);

    if (pingInterval) {
        clearInterval(pingInterval);
    }

    setTimeout(() => _connect(), 1000);
});

socket.on('end', () => {
    logger[autorestart ? 'warn' : 'info'](`Closed`);

    if (pingInterval) {
        clearInterval(pingInterval);
    }

    if (autorestart) {
        setTimeout(() => _connect(), 1000);
    }
});

socket.setTimeout(120000, () => {
    socket.destroy(new Error('timeout'));
});

/**
 * @function
*/function _connect() {
    if (socket.writable) {
        return;
    }

    logger.info(`connecting to ${ _argv.host }:${ _argv.port }`);
    try {
        socket.connect({ port: _argv.port, host: _argv.host });
    } catch (err) {
        logger.warn('could not connect', { message: err.message });
    }
}

socket.on('connect', () => {
    const networkInterface = (0, _networkInterface2.default)();
    logger.info(`connected to ${ _argv.host }:${ _argv.port }`, { networkInterface });

    pingInterval = setInterval(() => jsonStream.write({ type: 'ping' }), 30000);

    jsonStream.write(_extends({
        type: 'hello',
        configTime: (0, _config.getTime)(),
        version: _package.version,
        screenState: _screen.currentScreenState
    }, networkInterface));
});

jsonStream.on('data', data => {
    if (data.type === 'ping') {
        logger.debug('ping');
        return;
    }

    logger.info('data', data);
    switch (data.type) {
        case 'update-config':
        case 'change-config':
            if ((0, _config.updateConfig)(data.config)) {
                display.update();
            }
            return;

        case 'self-upgrade':
        case 'self-update':
        case 'selfUpdate':
            return (0, _update.selfUpdate)();

        case 'action':
            switch (data.action) {
                case 'self-upgrade':
                case 'self-update':
                case 'selfUpdate':
                    return (0, _update.selfUpdate)();

                case 'screen-off':
                    return screen.off();
                case 'screen-on':
                    return screen.on();

                case 'refresh':
                    return display.refresh();
            }
            logger.warn(`unknown action: ${ data.action }`);
            return;

        default:
            logger.warn(`unknown type: ${ data.type }`);
    }
});

_connect();

/**
 * @function
 * @param data
*/function sendUpdate(data) {
    if (jsonStream.writable || socket.writable) {
        jsonStream.write(_extends({
            type: 'update'
        }, data));
    }
}

/**
 * @function
*/function close() {
    autorestart = false;
    if (socket.writable) {
        return new Promise(resolve => {
            logger.info('Closing...');
            socket.end(() => {
                socket.once('end', () => {
                    resolve();
                });
            });
        });
    }
}
//# sourceMappingURL=tcp-client.js.map