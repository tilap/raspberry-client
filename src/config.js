import { readFileSync, writeFileSync } from 'fs';
import deepEqual from 'deep-equal';
import { host } from './argv';
import findNetworkInterface from './networkInterface';

function defaultConfig() {
    const networkInterface = (() => {
        try {
            return findNetworkInterface();
        } catch (err) {
            return null;
        }
    })();

    return {
        display: 'kweb3',
        url: `${host}/no-config?ip=${networkInterface && networkInterface.ip}`,
    };
}

const configFilename = `${__dirname}/../data/config.json`;
let config = (() => {
    try {
        return JSON.parse(readFileSync(configFilename));
    } catch (err) {
        return defaultConfig();
    }
})();

if (!config.display) {
    config = defaultConfig();
}

if (['livestreamer', 'kweb3', 'chromium'].indexOf(config.display) === -1) {
    config.display = 'kweb3';
    save();
}


function save() {
    writeFileSync(configFilename, JSON.stringify(config, null, 4));
}

export function updateConfig(newConfig: Object) {
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
