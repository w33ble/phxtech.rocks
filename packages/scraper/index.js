var db = require('phxtech-db');
var debug = require('phxtech-debug')('scraper');
var scrapeEvents = require('./lib/scrape_events');

module.exports = function saveEvents() {
  return scrapeEvents()
  .then((events) => {
    debug('Scraper found %d events', events.length);

    events.forEach(event => {
      db.get('events').upsert(event).write();
    });

    debug('Database contains %d docs', db.get('events').value().length)
  })
  .catch(console.log)
}
