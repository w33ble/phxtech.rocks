var PouchDB = require('pouchdb');
var getEvents = require('./lib/get_events');

var db = new PouchDB('db/events');

getEvents()
.then((events) => {
  var eventDocs = events.map((event) => {
    db.get(event._id)
    .then((doc) => {
      return db.put(event, event._id, doc._rev);
    })
    .catch(() => {
      return db.put(event);
    });
  });

  Promise.all(eventDocs)
  .then(() => {
    console.log('Saved %d events', events.length)
  })
  .then(() => {
    return db.allDocs()
    .then((docs) => {
      console.log('Database contains %d docs', docs.rows.length)
    })
  })
})
.catch(console.log)
