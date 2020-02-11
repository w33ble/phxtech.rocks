var path = require('path');
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var lodashId = require('lodash-id');

// set up the json database
var adapter = new FileSync(path.resolve(__dirname, 'data', 'db.json'));
var db = low(adapter);

// add support for id based queries, see https://github.com/typicode/lodash-id
db._.mixin(lodashId);
db._.id = '_id';

db
  .defaults({
    events: [],
    groups: [],
  })
  .write();

module.exports = db;
