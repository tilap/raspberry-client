'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.sendUpdate = sendUpdate;
exports.close = close;

var _nightingale = require('nightingale');

var _nightingale2 = _interopRequireDefault(_nightingale);

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingale2.default('app.client');

const socket = (0, _socket2.default)(`${ _argv.host }:${ _argv.port }/raspberry-client`, {
    reconnectionDelay: 500,
    reconnectionDelayMax: 1000,
    timeout: 4000,
    transports: ['websocket']
});

process.nextTick(() => {
    logger.debug('Connecting', { host: _argv.host, port: _argv.port });
    socket.connect();
});

function emit(eventName) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    logger.debug('emit', { eventName, args });
    return socket.emit(eventName, ...args);
}

socket.on('connect_error', err => logger.error('connect error', { host: _argv.host, port: _argv.port, errMessage: err.message }));
socket.on('reconnect_error', err => logger.debug('reconnect error', { host: _argv.host, port: _argv.port, err }));

socket.on('disconnect', () => logger.warn('disconnected'));

socket.on('reconnect', () => logger.success('reconnected'));

socket.on('connect', () => {
    logger.success('connected');

    const networkInterface = (0, _networkInterface2.default)();
    emit('hello', _extends({
        configTime: (0, _config.getTime)(),
        version: _package.version,
        screenState: screen.currentScreenState
    }, networkInterface));
});

socket.on('updateConfig', config => {
    if ((0, _config.updateConfig)(config)) {
        display.update();
    }
});

socket.on('changeConfig', config => {
    if ((0, _config.updateConfig)(config)) {
        display.update();
    }
});

socket.on('selfUpdate', () => (0, _update.selfUpdate)());

socket.on('action', action => {
    switch (action) {
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

    logger.warn(`unknown action: ${ action }`);
});

function sendUpdate(data) {
    socket.emit('update', data);
}

function close() {
    if (!socket.connected) {
        return;
    }

    return new Promise(resolve => {
        logger.info('Closing...');
        socket.close();
        socket.once('disconnect', () => {
            resolve();
        });
    });
}
//# sourceMappingURL=client.js.map