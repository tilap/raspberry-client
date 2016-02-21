import { ConsoleLogger, LogLevel } from 'nightingale';
import { getUrl } from './config';
import { runScript, listenScript } from './scripts';

const logger = new ConsoleLogger('app.display', LogLevel.INFO);

export function refresh() {
    return runScript('./browser.sh', ['refresh']);
}

export function update() {
    return runScript('./browser.sh', ['load', getUrl()]);
}
