'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.close = close;

var _net = require('net');

var _fs = require('fs');

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

const logger = new _nightingale2.default('app.tcp-server');

function run(data) {
    if (!(data instanceof Object)) {
        throw new TypeError('Value of argument "data" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(data));
    }

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
        logger.info('data', { data: data });
        try {
            const result = run(data);
            jsonStream.write({ type: 'done', result: result });
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

function close() {
    return new Promise(resolve => {
        logger.info('Closing...');
        server.close(() => {
            logger.info('Closed');
            resolve();
        });
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
//# sourceMappingURL=tcp-server.js.map