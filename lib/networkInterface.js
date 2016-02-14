'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = /**
                   * @function
                  */function () {
    const interfaces = (0, _os.networkInterfaces)();
    for (let key of Object.keys(interfaces)) {
        let netInterface = interfaces[key];
        let filtered = netInterface.filter(item => item.family === 'IPv4');

        if (filtered.length !== 0) {
            netInterface = filtered;
        }

        for (let item of netInterface) {
            if (!item.mac || !item.address) {
                continue;
            }

            if (item.mac === '00:00:00:00:00:00') {
                continue;
            }

            if (item.address === '127.0.0.1' || item.address === '::1') {
                continue;
            }

            return {
                mac: item.mac,
                ip: item.address
            };
        }
    }

    throw new Error('Could not find valid mac/ip');
};

var _os = require('os');
//# sourceMappingURL=networkInterface.js.map