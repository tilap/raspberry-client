import { stop as stopDisplay } from './display';
import { close as clientClose } from './client';
import { close as serverClose } from './cli-server';
import './cron';
import { addGlobalHandler } from 'nightingale';
import ConsoleLogger from 'nightingale-console';

addGlobalHandler(new ConsoleLogger());

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

