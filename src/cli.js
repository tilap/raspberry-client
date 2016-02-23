/* eslint-disable no-console */

import { Socket } from 'net';
import { ConsoleLogger, LogLevel } from 'nightingale';
const argv = require('minimist-argv');
import { createStream } from 'objectstream';

if (!argv._[0]) {
    console.log('Usage: cli <action> [args]');
    console.log('actions:');
    console.log('  - self-update');
    console.log('  - screen');
    console.log('      on: turn the screen on');
    console.log('      off: turn the screen off');
    console.log('      state: display the current state of the screen');
    console.log('  - display');
    console.log('      restart: restart the current display (kweb3 / twitch / ...)');
}

const logger = new ConsoleLogger('cli', LogLevel.INFO);

const socket = new Socket();
const jsonStream = createStream(socket);

jsonStream.on('error', err => {
    logger.error(err);
});

socket.on('error', err => {
    logger.error(err);
});

socket.on('end', () => {
    logger.debug(`socket ended`);
    jsonStream.end();
});


socket.on('connect', () => {
    logger.debug(`connected`);

    jsonStream.write(argv);
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


socket.connect(`${__dirname}/../socket`);
