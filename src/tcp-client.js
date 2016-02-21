import { Socket } from 'net';
import { ConsoleLogger, LogLevel } from 'nightingale';
import { createStream } from 'objectstream';
import * as actions from './actions';
import { host, port } from './argv';
import { updateConfig } from './config';
import findNetworkInterface from './networkInterface';
import { isOn as isScreenOn } from './screen';
import { version } from '../package.json';

const logger = new ConsoleLogger('app.tcp-client', LogLevel.INFO);


let pingInterval;
const socket = new Socket({ host, port });
const jsonStream = createStream(socket);

jsonStream.on('error', err => {
    logger.error(err);
});

socket.on('error', err => {
    logger.error(err);

    if (pingInterval) {
        clearInterval(pingInterval);
    }

    setTimeout(() => _connect(), 1000);
});

socket.on('end', () => {
    logger.warn(`socket ended`);

    if (pingInterval) {
        clearInterval(pingInterval);
    }

    setTimeout(() => _connect(), 1000);
});

function _connect() {
    if (socket.writable) {
        return;
    }

    logger.info(`connecting to ${host}:${port}`);
    try {
        socket.connect({ port, host });
    } catch (err) {
        logger.warn('could not connect', { message: err.message });
    }
}

socket.on('connect', () => {
    const networkInterface = findNetworkInterface();
    logger.info(`connected to ${host}:${port}`, { networkInterface });

    pingInterval = setInterval(() => jsonStream.write({ type: 'ping' }), 10000);

    jsonStream.write({
        type: 'hello',
        version,
        screenState: isScreenOn() ? 'on' : 'off',
        ...networkInterface,
    });
});

jsonStream.on('data', data => {
    if (data.type === 'ping') {
        logger.debug('ping');
        return;
    }

    logger.info('data', data);
    switch (data.type) {
        case 'update-config':
            updateConfig(data.config);
            break;
        case 'refresh':
        case 'selfUpdate':
            actions[data.type]();
            break;
        default:
            logger.warn(`unknown action: ${data.type}`);

    }
});

_connect();
