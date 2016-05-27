import Logger from 'nightingale';
import createSocketClient from 'socket.io-client';
import { host, port } from './argv';
import { getTime as getConfigTime, updateConfig } from './config';
import * as display from './display';
import findNetworkInterface from './networkInterface';
import * as screen from './screen';
import { selfUpdate } from './update';
import { version } from '../package.json';

const logger = new Logger('app.client');

const socket = createSocketClient(`${host}:${port}/raspberry-client`, {
    reconnectionDelay: 500,
    reconnectionDelayMax: 1000,
    timeout: 4000,
    transports: ['websocket'],
});

process.nextTick(() => {
    logger.debug('Connecting', { host, port });
    socket.connect();
});


function emit(eventName: string, ...args) {
    logger.debug('emit', { eventName, args });
    return socket.emit(eventName, ...args);
}

socket.on('connect_error', err => logger.error('connect error', { host, port, errMessage: err.message }));
socket.on('reconnect_error', err => logger.debug('reconnect error', { host, port, err }));

socket.on('disconnect', () => logger.warn('disconnected'));

socket.on('reconnect', () => logger.success('reconnected'));

socket.on('connect', () => {
    logger.success('connected');

    const networkInterface = findNetworkInterface();
    emit('hello', {
        configTime: getConfigTime(),
        version,
        screenState: screen.currentScreenState,
        ...networkInterface,
    });
});

socket.on('updateConfig', (config) => {
    if (updateConfig(config)) {
        display.update();
    }
});

socket.on('changeConfig', (config) => {
    if (updateConfig(config)) {
        display.update();
    }
});

socket.on('selfUpdate', () => selfUpdate());

socket.on('action', (action: string) => {
    switch (action) {
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

    logger.warn(`unknown action: ${action}`);
});

export function sendUpdate(data: Object): void {
    socket.emit('update', data);
}

export function close(): Promise|void {
    if (!socket.connected) {
        return;
    }

    return new Promise((resolve) => {
        logger.info('Closing...');
        socket.close();
        socket.once('disconnect', () => {
            resolve();
        });
    });
}
