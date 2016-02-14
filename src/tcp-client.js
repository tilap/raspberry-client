import { ConsoleLogger } from 'nightingale';
import findNetworkInterface from './networkInterface';
import { createStream } from 'objectstream';
import { Socket } from 'net';
import { updateConfig } from './config';
import * as actions from './actions';
import { host, port } from './argv';

const logger = new ConsoleLogger('client');


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

    jsonStream.write({ type: 'hello', ...networkInterface });
});

jsonStream.on('data', data => {
    logger.info('data', data);
    switch (data.type) {
        case 'ping':
            break;
        case 'update-config':
            updateConfig(data.config);
            break;
        case 'refresh':
        case 'self-update':
            actions[data.type]();
            break;
        default:
            logger.warn(`unknown action: ${data.type}`);

    }
});

_connect();
