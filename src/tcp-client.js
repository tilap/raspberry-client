import { Socket } from 'net';
import { ConsoleLogger, LogLevel } from 'nightingale';
import { createStream } from 'objectstream';
import { hostname, port } from './argv';
import { getTime as getConfigTime, updateConfig } from './config';
import * as display from './display';
import findNetworkInterface from './networkInterface';
import { currentScreenState } from './screen';
import * as screen from './screen';
import { selfUpdate } from './update';
import { version } from '../package.json';

const logger = new ConsoleLogger('app.tcp-client', LogLevel.INFO);

let autorestart = true;
let pingInterval;
const socket = new Socket({ host: hostname, port });
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
    logger[autorestart ? 'warn' : 'info'](`Closed`);

    if (pingInterval) {
        clearInterval(pingInterval);
    }

    if (autorestart) {
        setTimeout(() => _connect(), 1000);
    }
});

socket.setTimeout(120000, () => {
    socket.destroy(new Error('timeout'));
});

function _connect() {
    if (socket.writable) {
        return;
    }

    logger.info(`connecting to ${hostname}:${port}`);
    try {
        socket.connect({ port, host: hostname });
    } catch (err) {
        logger.warn('could not connect', { message: err.message });
    }
}

socket.on('connect', () => {
    const networkInterface = findNetworkInterface();
    logger.info(`connected to ${hostname}:${port}`, { networkInterface });

    pingInterval = setInterval(() => jsonStream.write({ type: 'ping' }), 30000);

    jsonStream.write({
        type: 'hello',
        configTime: getConfigTime(),
        version,
        screenState: currentScreenState,
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
        case 'change-config':
            if (updateConfig(data.config)) {
                display.update();
            }
            return;

        case 'self-upgrade':
        case 'self-update':
        case 'selfUpdate':
            return selfUpdate();

        case 'action':
            switch (data.action) {
                case 'self-upgrade':
                case 'self-update':
                case 'selfUpdate':
                    return selfUpdate();

                case 'screen-off':
                    return screen.off();
                case 'screen-on':
                    return screen.on();

                case 'refresh':
                    return display.refresh();
            }
            logger.warn(`unknown action: ${data.action}`);
            return;

        default:
            logger.warn(`unknown type: ${data.type}`);
    }
});

_connect();

export function sendUpdate(data) {
    if (jsonStream.writable || socket.writable) {
        jsonStream.write({
            type: 'update',
            ...data,
        });
    }
}


export function close() {
    autorestart = false;
    if (socket.writable) {
        return new Promise((resolve) => {
            logger.info('Closing...');
            socket.end(() => {
                socket.once('end', () => {
                    resolve();
                });
            });
        });
    }
}
