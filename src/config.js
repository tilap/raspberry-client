import Configstore from 'configstore';
import deepEqual from 'deep-equal';
import { host } from './argv';
import { name } from '../package.json';
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

const configStore = new Configstore(name, defaultConfig());
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
