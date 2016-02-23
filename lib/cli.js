'use strict';

var _net = require('net');

var _nightingale = require('nightingale');

var _objectstream = require('objectstream');

const argv = require('minimist')(process.argv.slice(2));


const logger = new _nightingale.ConsoleLogger('cli', _nightingale.LogLevel.INFO);

const socket = new _net.Socket();
const jsonStream = (0, _objectstream.createStream)(socket);

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

socket.connect(`${ __dirname }/../socket`);
//# sourceMappingURL=cli.js.map