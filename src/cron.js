import { schedule } from 'node-cron';
import Logger from 'nightingale';
import * as screen from './screen';
import * as display from './display';

const logger = new Logger('cron');

schedule('30 8 * * 1-5', () => {
    logger.info('screen on');
    screen.on();
});


schedule('0 20 * * 1-5', () => {
    logger.info('screen off');
    screen.off();
});

schedule('*/30 9,10,11,12,13,14,15,16,17,18,19 * * 1-5', () => {
    logger.info('refresh');
    display.refresh();
});
