'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = migrate;

var _semver = require('semver');

var _scripts = require('scripts');

var _fs = require('fs');

/**
 * @function
 * @param previousVersion
 * @param newVersion
*/function migrate(previousVersion, newVersion) {
    return new Promise((resolve, reject) => {
        (0, _fs.readdir)(`${ __dirname }/../migrate/`, (err, files) => {
            if (err) {
                return reject(err);
            }

            files.filter(file => file.slice(-3) === '.sh').map(file => ({ file, version: /([^_]+)(_.*).sh$/.exec(file)[1] })).filter(file => (0, _semver.lt)(file.version, previousVersion)).sort((a, b) => (0, _semver.gt)(a.version, b.version)).forEach(file => {
                console.log(file);
                // runScript(file.file, [], { cwd: `${__dirname}/../migrate/` });
            });
        });
    });
}
//# sourceMappingURL=migrate.js.map