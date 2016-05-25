/* eslint-disable no-console */

import { Socket } from 'net';
import Logger from 'nightingale';
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
    console.log('      refresh: refresh the browser (only for kweb3/chromimum)');
    console.log('      openbox-started: notify that openbox is started');
}

const logger = new Logger('cli');

const socket = new Socket();
const jsonStream = createStream(socket);

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
