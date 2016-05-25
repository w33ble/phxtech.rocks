var PouchDB = require('pouchdb');
var getEvents = require('./lib/get_events');

// var events = new PouchDB('db/events');

getEvents()
.then((events) => {
  console.log('found %d events', events.length)
})
.catch(console.log)
