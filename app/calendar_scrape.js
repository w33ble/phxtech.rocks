var PouchDB = require('pouchdb');
var getEvents = require('./lib/get_events');

// var events = new PouchDB('db/events');

getEvents()
.then((events) => {
  console.log('found %d events', events.length)
  console.log(events[0]);
  console.log(events[7]);
  console.log(events[10]);
})
.catch(console.log)
