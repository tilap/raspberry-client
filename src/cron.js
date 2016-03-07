import { schedule } from 'node-cron';
import { ConsoleLogger, LogLevel } from 'nightingale';
import * as screen from './screen';
import * as display from './display';

const logger = new ConsoleLogger('cron', LogLevel.INFO);

schedule('0 30 8 * 1-5', () => {
    logger.log('screen on');
    screen.on();
});


schedule('0 0 20 * 1-5', () => {
    logger.log('screen off');
    screen.off();
});

schedule('* */30 9-19 * 1-5', () => {
    logger.log('refresh');
    display.refresh();
});
