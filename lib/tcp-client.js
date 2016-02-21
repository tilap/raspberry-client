'use strict';

var _extends = Object.assign || /**
                                 * @function
                                 * @param target
                                */ function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _net = require('net');

var _nightingale = require('nightingale');

var _objectstream = require('objectstream');

var _actions = require('./actions');

var actions = _interopRequireWildcard(_actions);

var _argv = require('./argv');

var _config = require('./config');

var _networkInterface = require('./networkInterface');

var _networkInterface2 = _interopRequireDefault(_networkInterface);

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
    logger.warn(`socket ended`);

    if (pingInterval) {
        clearInterval(pingInterval);
    }

    setTimeout(() => _connect(), 1000);
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

    pingInterval = setInterval(() => jsonStream.write({ type: 'ping' }), 10000);

    jsonStream.write(_extends({ type: 'hello', version: _package.version }, networkInterface));
});

jsonStream.on('data', data => {
    if (data.type === 'ping') {
        logger.debug('ping');
        return;
    }

    logger.info('data', data);
    switch (data.type) {
        case 'update-config':
            (0, _config.updateConfig)(data.config);
            break;
        case 'refresh':
        case 'selfUpdate':
            actions[data.type]();
            break;
        default:
            logger.warn(`unknown action: ${ data.type }`);

    }
});

_connect();
//# sourceMappingURL=tcp-client.js.map