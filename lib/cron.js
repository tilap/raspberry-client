'use strict';

var _nodeCron = require('node-cron');

var _nightingale = require('nightingale');

var _screen = require('./screen');

var screen = _interopRequireWildcard(_screen);

var _display = require('./display');

var display = _interopRequireWildcard(_display);

/**
 * @function
 * @param obj
*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const logger = new _nightingale.ConsoleLogger('cron', _nightingale.LogLevel.INFO);

(0, _nodeCron.schedule)('0 30 8 * 1-5', () => {
    logger.log('screen on');
    screen.on();
});

(0, _nodeCron.schedule)('0 0 20 * 1-5', () => {
    logger.log('screen off');
    screen.off();
});

(0, _nodeCron.schedule)('* */30 9-19 * 1-5', () => {
    logger.log('refresh');
    display.refresh();
});
//# sourceMappingURL=cron.js.map