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

    if (!(typeof eventName === 'string')) {
        throw new TypeError('Value of argument "eventName" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(eventName));
    }

    logger.debug('emit', { eventName: eventName, args: args });
    return socket.emit(eventName, ...args);
}

socket.on('connect_error', err => {
    return logger.error('connect error', { host: _argv.host, port: _argv.port, errMessage: err.message });
});
socket.on('reconnect_error', err => {
    return logger.debug('reconnect error', { host: _argv.host, port: _argv.port, err: err });
});

socket.on('disconnect', () => {
    return logger.warn('disconnected');
});

socket.on('reconnect', () => {
    return logger.success('reconnected');
});

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

socket.on('selfUpdate', () => {
    return (0, _update.selfUpdate)();
});

socket.on('action', action => {
    if (!(typeof action === 'string')) {
        throw new TypeError('Value of argument "action" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(action));
    }

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
    if (!(data instanceof Object)) {
        throw new TypeError('Value of argument "data" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(data));
    }

    socket.emit('update', data);
}

function close() {
    if (!socket.connected) {
        return;
    }

    return new Promise(resolve => {
        logger.info('Closing...');
        socket.once('disconnect', () => {
            logger.info('Closed');
            resolve();
        });
        socket.close();
    });
}

function _inspect(input, depth) {
    const maxDepth = 4;
    const maxKeys = 15;

    if (depth === undefined) {
        depth = 0;
    }

    depth += 1;

    if (input === null) {
        return 'null';
    } else if (input === undefined) {
        return 'void';
    } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return typeof input;
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            if (depth > maxDepth) return '[...]';

            const first = _inspect(input[0], depth);

            if (input.every(item => _inspect(item, depth) === first)) {
                return first.trim() + '[]';
            } else {
                return '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']';
            }
        } else {
            return 'Array';
        }
    } else {
        const keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        if (depth > maxDepth) return '{...}';
        const indent = '  '.repeat(depth - 1);
        let entries = keys.slice(0, maxKeys).map(key => {
            return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
        }).join('\n  ' + indent);

        if (keys.length >= maxKeys) {
            entries += '\n  ' + indent + '...';
        }

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
        } else {
            return '{\n  ' + indent + entries + '\n' + indent + '}';
        }
    }
}
//# sourceMappingURL=client.js.map