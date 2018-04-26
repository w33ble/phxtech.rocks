var PouchDB = require('pouchdb');
var pouchFind = require('pouchdb-find')

PouchDB.plugin(pouchFind);

var db = new PouchDB('../phxtech-db/db');
module.exports = db;
