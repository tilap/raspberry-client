'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.updateConfig = updateConfig;
exports.getTime = getTime;
exports.get = get;

var _fs = require('fs');

var _argv = require('./argv');

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

/**
 * @function
 * @param obj
*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const configFilename = `${ __dirname }/../data/config.json`;
let config = (() => {
    try {
        return JSON.parse((0, _fs.readFileSync)(configFilename));
    } catch (err) {
        return { url: `${ _argv.host }/no-config` };
    }
})();

if (['livestreamer', 'kweb3', 'chromium'].indexOf(config.display) === -1) {
    config.display = 'kweb3';
    save();
}

/**
 * @function
*/function save() {
    (0, _fs.writeFileSync)(configFilename, JSON.stringify(config, null, 4));
}

/**
 * @function
 * @param newConfig
*/function updateConfig(newConfig) {
    if ((0, _deepEqual2.default)(config, newConfig)) {
        return false;
    }

    config = newConfig;
    save();
    return true;
}

/**
 * @function
*/function getTime() {
    return config.time;
}

/**
 * @function
*/function get() {
    return config;
}
//# sourceMappingURL=config.js.map