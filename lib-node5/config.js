'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.updateConfig = updateConfig;
exports.getTime = getTime;
exports.get = get;

var _configstore = require('configstore');

var _configstore2 = _interopRequireDefault(_configstore);

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _argv = require('./argv');

var _package = require('../package.json');

var _networkInterface = require('./networkInterface');

var _networkInterface2 = _interopRequireDefault(_networkInterface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function defaultConfig() {
    const networkInterface = (() => {
        try {
            return (0, _networkInterface2.default)();
        } catch (err) {
            return null;
        }
    })();

    return {
        display: 'kweb3',
        url: `${ _argv.host }/no-config?ip=${ networkInterface && networkInterface.ip }`
    };
}

const configStore = new _configstore2.default(_package.name, defaultConfig());
let config = configStore.all;

if (!config.display) {
    config = defaultConfig();
}

if (['livestreamer', 'kweb3', 'chromium'].indexOf(config.display) === -1) {
    config.display = 'kweb3';
    save();
}

function save() {
    configStore.all = config;
}

function updateConfig(newConfig) {
    if ((0, _deepEqual2.default)(config, newConfig)) {
        return false;
    }

    config = newConfig;
    save();
    return true;
}

function getTime() {
    return config.time;
}

function get() {
    return config;
}
//# sourceMappingURL=config.js.map