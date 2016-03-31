import { parse as parseUrl } from 'url';
import argv from 'minimist-argv';

export const port = argv.port || 3002;
export const host = argv.host || 'http://localhost';
export const hostname = parseUrl(host).hostname;
