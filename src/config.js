import { readFileSync, writeFileSync } from 'fs';
import { host } from './argv';

const configFilename = `${__dirname}/../data/config.json`;
let config = (() => {
    try {
        return JSON.parse(readFileSync(configFilename));
    } catch (err) {
        return { url: `http://${host}/no-config` };
    }
})();

function save() {
    writeFileSync(configFilename, JSON.stringify(config, null, 4));
}

export function updateConfig(newConfig) {
    config = newConfig;
    save();
}

export function getUrl() {
    return config.url;
}
