import { stop as stopDisplay } from './display';
import { close as clientClose } from './client';
import { close as serverClose } from './cli-server';
import './cron';
import './screen';
import Logger, { addGlobalHandler } from 'nightingale';
import ConsoleLogger from 'nightingale-console';

const logger = new Logger('app');
addGlobalHandler(new ConsoleLogger());

process.on('uncaughtException', err => logger.error('uncaughtException', { err }));
process.on('unhandledRejection', err => logger.error('unhandledRejection', { err }));

export function exit() {
    Promise.all([
        stopDisplay(),
        clientClose(),
        serverClose(),
    ]).then(() => {
        process.exit();
    });
}

process.on('SIGINT', () => {
    exit();
});

