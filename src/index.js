import { close as clientClose } from './tcp-client';
import { close as serverClose } from './tcp-server';
import './display';

process.on('SIGINT', () => {
    Promise.all([
        clientClose(),
        serverClose(),
    ]).then(() => {
        process.exit();
    });
});

