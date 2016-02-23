import { Socket } from 'net';
import { ConsoleLogger, LogLevel } from 'nightingale';
const argv = require('minimist')(process.argv.slice(2));
import { createStream } from 'objectstream';

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
