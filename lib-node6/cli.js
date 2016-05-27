'use strict';

var _net = require('net');

var _os = require('os');

var _nightingale = require('nightingale');

var _nightingale2 = _interopRequireDefault(_nightingale);

var _updateNotifier = require('update-notifier');

var _updateNotifier2 = _interopRequireDefault(_updateNotifier);

var _minimistArgv = require('minimist-argv');

var _minimistArgv2 = _interopRequireDefault(_minimistArgv);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _objectstream = require('objectstream');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _updateNotifier2.default)({ pkg: _package2.default }).notify(); /* eslint-disable no-console */


if (!_minimistArgv2.default._[0]) {
    console.log('Usage: cli <action> [args]');
    console.log('actions:');
    console.log('  - self-update');
    console.log('  - screen');
    console.log('      on: turn the screen on');
    console.log('      off: turn the screen off');
    console.log('      state: display the current state of the screen');
    console.log('  - display');
    console.log('      restart: restart the current display (kweb3 / twitch / ...)');
    console.log('      refresh: refresh the browser (only for kweb3/chromimum)');
    console.log('      openbox-started: notify that openbox is started');
}

const logger = new _nightingale2.default('cli');

const socket = new _net.Socket();
const jsonStream = (0, _objectstream.createStream)(socket);

jsonStream.on('error', err => {
    logger.error(err);
});

socket.on('error', err => {
    logger.error(err);
});

socket.on('end', () => {
    logger.debug('socket ended');
    jsonStream.end();
});

socket.on('connect', () => {
    logger.debug('connected');

    jsonStream.write(_minimistArgv2.default);
});

jsonStream.on('data', data => {
    if (data.type === 'done') {
        console.log(data.result);
        socket.end();
    } else if (data.error) {
        console.log(data.error);
        socket.end();
    } else {
        console.log(data);
    }
});

const socketPath = `${ (0, _os.tmpDir)() }/raspberry-client`;
socket.connect(socketPath);
//# sourceMappingURL=cli.js.map