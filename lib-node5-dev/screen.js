'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.screenshot = exports.currentScreenState = undefined;

let screenshot = exports.screenshot = function () {
    var ref = _asyncToGenerator(function* () {
        if (currentScreenState !== 'on') {
            logger.warn('screenshot: screen is off');
            return;
        }

        if (lockScreenshot) {
            logger.warn('screenshot: locked');
            return;
        }

        logger.info('getting screenshot');

        const filename = `${ (0, _os.tmpdir)() }/screenshot.png`;
        lockScreenshot = true;
        (0, _scripts.runScript)('./screen.sh', ['screenshot', filename]);

        return new Promise(function (resolve, reject) {
            (0, _fs.readFile)(filename, function (err, buffer) {
                lockScreenshot = false;
                resolve({
                    buffer: buffer,
                    callback: function callback() {
                        try {
                            (0, _fs.unlinkSync)(filename);
                        } catch (err) {}
                    }
                });
            });
        });
    });

    return function screenshot() {
        return ref.apply(this, arguments);
    };
}();

exports.on = on;
exports.off = off;

var _fs = require('fs');

var _os = require('os');

var _nightingale = require('nightingale');

var _nightingale2 = _interopRequireDefault(_nightingale);

var _scripts = require('./scripts');

var _client = require('./client');

var _display = require('./display');

var display = _interopRequireWildcard(_display);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const logger = new _nightingale2.default('app.screen');

let currentScreenState = exports.currentScreenState = state();
logger.info('init', { currentScreenState: currentScreenState });

/**
 * @returns {string} on|off|unavailable
 */
function state() {
    return (0, _scripts.runScript)('./screen.sh', ['state']);
}

function on() {
    logger.info('turning screen on');
    (0, _scripts.runScript)('./screen.sh', ['on']);
    exports.currentScreenState = currentScreenState = 'on';
    (0, _client.sendUpdate)({ screenState: currentScreenState });
    display.start();
}

function off() {
    logger.info('turning screen off');
    (0, _scripts.runScript)('./screen.sh', ['off']);
    exports.currentScreenState = currentScreenState = 'off';
    (0, _client.sendUpdate)({ screenState: currentScreenState });
    display.stop();
}

if (currentScreenState === 'on') {
    display.start();
}

let lockScreenshot;
//# sourceMappingURL=screen.js.map