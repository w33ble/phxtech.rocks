var moment = require('moment');
var PouchDB = require('pouchdb');
var pouchFind = require('pouchdb-find')

PouchDB.plugin(pouchFind);

var db = new PouchDB('db/events');

function findFromDate(date, days) {
  days = parseInt(days) || 1;

  var startDate = moment(date).startOf('day').valueOf();
  var endDate = moment(date).add(days - 1, 'days').endOf('day').valueOf();

  return db.createIndex({
    index: {
      fields: ['timestamp']
    }
  }).then(function () {
    return db.find({
      selector: {
        timestamp: { $gte: startDate, $lte: endDate }
      },
      sort: ['timestamp']
    })
    .then((data) => {
      return data.docs.map((event) => {
        event.details = event.address + ' - ' + event.time;
        event.href = 'http://nextplex.com/' + event.href;
        return event;
      })
    })
  });
}

exports.today = function () {
  return findFromDate(moment.now(), 1);
}

exports.thisWeek = function () {
  return findFromDate(moment.now(), 7);
}