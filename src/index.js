import { stop as stopDisplay } from './display';
import { close as clientClose } from './tcp-client';
import { close as serverClose } from './tcp-server';
import './display';
import './cron';

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

