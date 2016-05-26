var PouchDB = require('pouchdb');
var scrapeEvents = require('./scrape_events');
var debug = require('./debug')('scraper');

var db = new PouchDB('db/events');

module.exports = function saveEvents() {
  return scrapeEvents()
  .then((events) => {
    debug('Scraper found %d events', events.length);
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
    .then(() => {
      return db.allDocs()
      .then((docs) => {
        debug('Database contains %d docs', docs.total_rows)
      })
    })
  })
  .catch(console.log)
}
