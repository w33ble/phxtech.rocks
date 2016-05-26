var debug = require('debug');
var debuggers = {};

module.exports = function (name) {
  id = 'phxtech:' + name;
  if (!debuggers[id]) debuggers[id] = debug(id);
  return debuggers[id];
}