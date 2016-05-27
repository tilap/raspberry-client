'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.updateConfig = updateConfig;
exports.getTime = getTime;
exports.get = get;

var _fs = require('fs');

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _argv = require('./argv');

var _networkInterface = require('./networkInterface');

var _networkInterface2 = _interopRequireDefault(_networkInterface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function defaultConfig() {
    const networkInterface = (() => {
        try {
            return (0, _networkInterface2.default)();
        } catch (err) {
            return null;
        }
    })();

    return {
        display: 'kweb3',
        url: `${ _argv.host }/no-config?ip=${ networkInterface && networkInterface.ip }`
    };
}

const configFilename = `${ __dirname }/../data/config.json`;
let config = (() => {
    try {
        return JSON.parse((0, _fs.readFileSync)(configFilename));
    } catch (err) {
        return defaultConfig();
    }
})();

if (!config.display) {
    config = defaultConfig();
}

if (['livestreamer', 'kweb3', 'chromium'].indexOf(config.display) === -1) {
    config.display = 'kweb3';
    save();
}

function save() {
    (0, _fs.writeFileSync)(configFilename, JSON.stringify(config, null, 4));
}

function updateConfig(newConfig) {
    if (!(newConfig instanceof Object)) {
        throw new TypeError('Value of argument "newConfig" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(newConfig));
    }

    if ((0, _deepEqual2.default)(config, newConfig)) {
        return false;
    }

    config = newConfig;
    save();
    return true;
}

function getTime() {
    return config.time;
}

function get() {
    return config;
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
//# sourceMappingURL=config.js.map