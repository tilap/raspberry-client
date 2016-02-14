'use strict';

require('./tcp-client');

var _config = require('./config');

var _actions = require('./actions');

(0, _actions.reload)((0, _config.getUrl)());
//# sourceMappingURL=index.js.map