import { createServer } from 'net';
import { unlinkSync } from 'fs';
import Logger from 'nightingale';
import { createStream } from 'objectstream';
import * as screen from './screen';
import * as display from './display';
import { selfUpdate } from './update';

const logger = new Logger('app.tcp-server');

function run(data: Object) {
    if (!data || !data._ || !data._[0]) {
        throw new Error('Missing action');
    }
    const action = data._[0];
    switch (action) {
        case 'self-update':
        case 'selfUpdate':
            return selfUpdate();
        case 'screen':
            switch (data._[1]) {
                case 'on':
                case 'off':
                case 'state':
                    return screen[data._[1]]();
            }
            throw new Error(`Unsupported screen instruction: ${data._[1]}`);
        case 'display':
            switch (data._[1]) {
                case 'start':
                    return display.start();
                case 'openbox-started':
                    return display.openboxStarted();
                case 'restart':
                    return display.restart();
                case 'refresh':
                    return display.refresh();
            }
            throw new Error(`Unsupported display instruction: ${data._[1]}`);
    }
    throw new Error(`Unsupported instruction: ${action}`);
}

const server = createServer(socket => {
    logger.info('client connected');
    const jsonStream = createStream(socket);

    socket.on('end', () => {
        logger.info('client disconnected');

        if (jsonStream) {
            jsonStream.end();
        }
    });

    jsonStream.on('data', data => {
        logger.info('data', { data });
        try {
            const result = run(data);
            jsonStream.write({ type: 'done', result });
        } catch (err) {
            jsonStream.write({ error: err.message });
        }
    });
});

try {
    unlinkSync(`${__dirname}/../socket`);
} catch (e) {}

server.listen(`${__dirname}/../socket`, () => {
    logger.info('Listening');
});

export function close() {
    return new Promise((resolve) => {
        logger.info('Closing...');
        server.close(() => {
            logger.info('Closed');
            resolve();
        });
    });
}
