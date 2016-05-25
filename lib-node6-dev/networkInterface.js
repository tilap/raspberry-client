'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    const interfaces = (0, _os.networkInterfaces)();
    _Object$keys = Object.keys(interfaces);

    if (!(_Object$keys && (typeof _Object$keys[Symbol.iterator] === 'function' || Array.isArray(_Object$keys)))) {
        throw new TypeError('Expected _Object$keys to be iterable, got ' + _inspect(_Object$keys));
    }

    for (let key of _Object$keys) {
        var _Object$keys;

        let netInterface = interfaces[key];
        let filtered = netInterface.filter(item => {
            return item.family === 'IPv4';
        });

        if (filtered.length !== 0) {
            netInterface = filtered;
        }

        if (!(netInterface && (typeof netInterface[Symbol.iterator] === 'function' || Array.isArray(netInterface)))) {
            throw new TypeError('Expected netInterface to be iterable, got ' + _inspect(netInterface));
        }

        for (let item of netInterface) {
            if (!item.mac || !item.address) {
                continue;
            }

            if (item.mac === '00:00:00:00:00:00') {
                continue;
            }

            if (item.address === '127.0.0.1' || item.address === '::1') {
                continue;
            }

            return {
                mac: item.mac,
                ip: item.address
            };
        }
    }

    throw new Error('Could not find valid mac/ip');
};

var _os = require('os');

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
//# sourceMappingURL=networkInterface.js.map