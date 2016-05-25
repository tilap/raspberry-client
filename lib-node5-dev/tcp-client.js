'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.sendUpdate = sendUpdate;
exports.close = close;

var _net = require('net');

var _nightingale = require('nightingale');

var _nightingale2 = _interopRequireDefault(_nightingale);

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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingale2.default('app.tcp-client');

let autorestart = true;
let pingInterval;
const socket = new _net.Socket({ host: _argv.hostname, port: _argv.port });
const jsonStream = (0, _objectstream.createStream)(socket);

jsonStream.on('error', err => {
    logger.error(err);
});

socket.on('error', err => {
    logger.error(err);

    if (pingInterval) {
        clearInterval(pingInterval);
    }

    setTimeout(() => {
        return internalConnect();
    }, 1000);
});

socket.on('end', () => {
    logger[autorestart ? 'warn' : 'info']('Closed');

    if (pingInterval) {
        clearInterval(pingInterval);
    }

    if (autorestart) {
        setTimeout(() => {
            return internalConnect();
        }, 1000);
    }
});

socket.setTimeout(120000, () => {
    socket.destroy(new Error('timeout'));
});

function internalConnect() {
    if (socket.writable) {
        return;
    }

    logger.info(`connecting to ${ _argv.hostname }:${ _argv.port }`);
    try {
        socket.connect({ port: _argv.port, host: _argv.hostname });
    } catch (err) {
        logger.warn('could not connect', { message: err.message });
    }
}

socket.on('connect', () => {
    const networkInterface = (0, _networkInterface2.default)();
    logger.info(`connected to ${ _argv.hostname }:${ _argv.port }`, { networkInterface: networkInterface });

    pingInterval = setInterval(() => {
        return jsonStream.write({ type: 'ping' });
    }, 30000);

    jsonStream.write(_extends({
        type: 'hello',
        configTime: (0, _config.getTime)(),
        version: _package.version,
        screenState: screen.currentScreenState
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

internalConnect();

function sendUpdate(data) {
    if (!(data instanceof Object)) {
        throw new TypeError('Value of argument "data" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(data));
    }

    if (jsonStream.writable || socket.writable) {
        jsonStream.write(_extends({
            type: 'update'
        }, data));
    }
}

function close() {
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
//# sourceMappingURL=tcp-client.js.map