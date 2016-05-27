import argv from 'minimist-argv';

export const port = argv.port || 3333;
export const host = argv.host || 'http://localhost';
