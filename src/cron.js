import { schedule } from 'node-cron';
import { ConsoleLogger, LogLevel } from 'nightingale';
import * as screen from './screen';
import * as display from './display';

const logger = new ConsoleLogger('cron', LogLevel.INFO);

schedule('30 8 * * 1-5', () => {
    logger.info('screen on');
    screen.on();
});


schedule('0 20 * * 1-5', () => {
    logger.info('screen off');
    screen.off();
});

schedule('*/30 9-19 * * 1-5', () => {
    logger.info('refresh');
    display.refresh();
});
