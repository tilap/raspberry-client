'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.runScript = runScript;
exports.listenScript = listenScript;
exports.spawn = spawn;

var _child_process = require('child_process');

var _nightingale = require('nightingale');

var _nightingale2 = _interopRequireDefault(_nightingale);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingale2.default('app.scripts');

const scriptDirname = `${ __dirname }/../scripts/`;

function runScript(script, args) {
    var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    let cwd = _ref.cwd;

    if (!(typeof script === 'string')) {
        throw new TypeError('Value of argument "script" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(script));
    }

    if (!(Array.isArray(args) && args.every(function (item) {
        return typeof item === 'string' || typeof item === 'number';
    }))) {
        throw new TypeError('Value of argument "args" violates contract.\n\nExpected:\nArray<string | number>\n\nGot:\n' + _inspect(args));
    }

    logger.debug('run script', { script: script, args: args });
    const result = (0, _child_process.spawnSync)(script, args, { cwd: cwd || scriptDirname });
    if (result.error) {
        logger.error(result.error.message);
    }

    if (result.stderr) {
        const stderr = result.stderr.toString();
        if (stderr) {
            logger.error(stderr, { script: script, args: args });
        }
    }

    if (result.stdout) {
        const stdout = result.stdout.toString().trim();
        logger.debug(stdout, { script: script, args: args });
        return stdout;
    }
}

function listenScript(script, args, callbackOnData) {
    if (!(typeof script === 'string')) {
        throw new TypeError('Value of argument "script" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(script));
    }

    if (!(Array.isArray(args) && args.every(function (item) {
        return typeof item === 'string' || typeof item === 'number';
    }))) {
        throw new TypeError('Value of argument "args" violates contract.\n\nExpected:\nArray<string | number>\n\nGot:\n' + _inspect(args));
    }

    if (!(typeof callbackOnData === 'function')) {
        throw new TypeError('Value of argument "callbackOnData" violates contract.\n\nExpected:\nFunction\n\nGot:\n' + _inspect(callbackOnData));
    }

    return new Promise((resolve, reject) => {
        const childProcess = spawn(script, args);
        childProcess.stdout.on('data', data => {
            data = data.toString();
            logger.debug(data);
            callbackOnData(data);
        });

        childProcess.stderr.on('data', data => {
            data = data.toString();
            logger.debug(data);
            callbackOnData(data);
        });

        childProcess.on('close', code => {
            if (code) {
                logger.error(`child process exited with code ${ code }`);
                return reject(code);
            }

            resolve(code);
        });
    });
}

function spawn(script, args) {
    if (!(typeof script === 'string')) {
        throw new TypeError('Value of argument "script" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(script));
    }

    if (!(Array.isArray(args) && args.every(function (item) {
        return typeof item === 'string' || typeof item === 'number';
    }))) {
        throw new TypeError('Value of argument "args" violates contract.\n\nExpected:\nArray<string | number>\n\nGot:\n' + _inspect(args));
    }

    logger.debug('spawn', { script: script, args: args });
    return (0, _child_process.spawn)(script, args, { cwd: scriptDirname });
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
//# sourceMappingURL=scripts.js.map