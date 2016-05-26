require('dotenv').load();

var PouchDB = require('pouchdb');
var getEvents = require('./lib/get_events');

var db = new PouchDB('db/events');

getEvents()
.then((events) => {
  var eventDocs = events.map((event) => {
    return db.get(event._id)
    .then((doc) => {
      return db.put(Object.assign(doc, event));
    })
    .catch((err) => {
      if (err.status === 404) return db.put(event);
      throw err;
    });
  });

  return Promise.all(eventDocs)
  .then(() => {
    console.log('Saved %d events', events.length)

    return db.allDocs()
    .then((docs) => {
      console.log('Database contains %d docs', docs.rows.length)
    })
  })
})
.catch(console.log)
