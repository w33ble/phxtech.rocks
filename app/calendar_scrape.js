require('dotenv').load();

var PouchDB = require('pouchdb');
var getEvents = require('./lib/get_events');

var db = new PouchDB('db/events');

getEvents()
.then((events) => {
  var eventDocs = events.map((event) => {
    return db.get(event._id)
    .then((doc) => {
      return Object.assign(doc, event);
    })
    .catch((err) => {
      if (err.status === 404) return event;
      throw err;
    });
  });

  return Promise.all(eventDocs)
  .then((events) => db.bulkDocs(events))
  .then(() => console.log('Saved %d events', events.length))
  // show event count
  .then(() => {
    return db.allDocs()
    .then((docs) => {
      console.log('Database contains %d docs', docs.total_rows)
    })
  })
})
.catch(console.log)
