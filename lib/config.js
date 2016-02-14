'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.updateConfig = updateConfig;
exports.getUrl = getUrl;

var _fs = require('fs');

var _argv = require('./argv');

const configFilename = `${ __dirname }/../data/config.json`;
let config = (() => {
    try {
        return JSON.parse((0, _fs.readFileSync)(configFilename));
    } catch (err) {
        return { url: `http://${ _argv.host }/no-config` };
    }
})();

/**
 * @function
*/function save() {
    (0, _fs.writeFileSync)(configFilename, JSON.stringify(config, null, 4));
}

/**
 * @function
 * @param newConfig
*/function updateConfig(newConfig) {
    config = newConfig;
    save();
}

/**
 * @function
*/function getUrl() {
    return config.url;
}
//# sourceMappingURL=config.js.map