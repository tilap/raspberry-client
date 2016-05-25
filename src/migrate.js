import { gt, lt } from 'semver';
// import { runScript } from 'scripts';
import { readdir } from 'fs';

export default function migrate(previousVersion: string, newVersion: string) {
    return new Promise((resolve, reject) => {
        readdir(`${__dirname}/../migrate/`, (err, files) => {
            if (err) {
                return reject(err);
            }

            files
                .filter(file => file.slice(-3) === '.sh')
                .map(file => ({ file, version: /([^_]+)(_.*).sh$/.exec(file)[1] }))
                .filter(file => lt(file.version, previousVersion))
                .sort((a, b) => gt(a.version, b.version))
                .forEach(file => {
                    console.log(file);
                    // runScript(file.file, [], { cwd: `${__dirname}/../migrate/` });
                });
        });
    });
}
