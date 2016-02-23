const argv = require('minimist-argv');

export const port = argv.port || 3002;
export const host = argv.host || 'localhost';
