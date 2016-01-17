var express = require('express');
var router = express.Router({
  caseSensitive: true
});

require('./static')(router);
require('./calendar')(router);
require('./home')(router);

module.exports = router;