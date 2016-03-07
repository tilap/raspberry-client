import { readFileSync, writeFileSync } from 'fs';
import { host } from './argv';
import deepEqual from 'deep-equal';

const configFilename = `${__dirname}/../data/config.json`;
let config = (() => {
    try {
        return JSON.parse(readFileSync(configFilename));
    } catch (err) {
        return { url: `https://${host}/no-config` };
    }
})();


if (['livestreamer', 'kweb3', 'chromium'].indexOf(config.display) === -1) {
    config.display = 'kweb3';
    save();
}


function save() {
    writeFileSync(configFilename, JSON.stringify(config, null, 4));
}

export function updateConfig(newConfig) {
    if (deepEqual(config, newConfig)) {
        return false;
    }

    config = newConfig;
    save();
    return true;
}

export function getTime() {
    return config.time;
}

export function get() {
    return config;
}
