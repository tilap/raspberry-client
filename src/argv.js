const argv = require('minimist')(process.argv.slice(2));

export const port = argv.port || 3002;
export const host = argv.host || 'localhost';
