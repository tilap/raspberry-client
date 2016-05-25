'use strict';

var _nodeCron = require('node-cron');

var _nightingale = require('nightingale');

var _nightingale2 = _interopRequireDefault(_nightingale);

var _screen = require('./screen');

var screen = _interopRequireWildcard(_screen);

var _display = require('./display');

var display = _interopRequireWildcard(_display);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingale2.default('cron');

(0, _nodeCron.schedule)('30 8 * * 1-5', () => {
    logger.info('screen on');
    screen.on();
});

(0, _nodeCron.schedule)('0 20 * * 1-5', () => {
    logger.info('screen off');
    screen.off();
});

(0, _nodeCron.schedule)('*/30 9,10,11,12,13,14,15,16,17,18,19 * * 1-5', () => {
    logger.info('refresh');
    display.refresh();
});
//# sourceMappingURL=cron.js.map