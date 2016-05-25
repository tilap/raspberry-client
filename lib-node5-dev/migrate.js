'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = migrate;

var _semver = require('semver');

var _fs = require('fs');

function migrate(previousVersion, newVersion) {
    if (!(typeof previousVersion === 'string')) {
        throw new TypeError('Value of argument "previousVersion" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(previousVersion));
    }

    if (!(typeof newVersion === 'string')) {
        throw new TypeError('Value of argument "newVersion" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(newVersion));
    }

    return new Promise((resolve, reject) => {
        (0, _fs.readdir)(`${ __dirname }/../migrate/`, (err, files) => {
            if (err) {
                return reject(err);
            }

            files.filter(file => {
                return file.slice(-3) === '.sh';
            }).map(file => {
                return { file: file, version: /([^_]+)(_.*).sh$/.exec(file)[1] };
            }).filter(file => {
                return (0, _semver.lt)(file.version, previousVersion);
            }).sort((a, b) => {
                return (0, _semver.gt)(a.version, b.version);
            }).forEach(file => {
                console.log(file);
                // runScript(file.file, [], { cwd: `${__dirname}/../migrate/` });
            });
        });
    });
}
// import { runScript } from 'scripts';

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
//# sourceMappingURL=migrate.js.map