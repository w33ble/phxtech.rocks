var moment = require('moment');
var db = require('phxtech-db');

function findFromDate(date, days) {
  days = parseInt(days) || 1;

  var startDate = moment(date)
    .startOf('day')
    .valueOf();

  var endDate = moment(date)
    .add(days - 1, 'days')
    .endOf('day')
    .valueOf();

  return new Promise(resolve => {
    const matches = db
      .get('events')
      .filter(event => event.timestamp >= startDate && event.timestamp <= endDate)
      .map(event =>
        Object.assign({}, event, {
          details: event.address + ' - ' + event.time,
          href: 'http://nextplex.com/' + event.href,
        })
      )
      .sortBy('timestamp')
      .value();
    resolve(matches);
  });
}

exports.today = function() {
  return findFromDate(moment.now(), 1);
};

exports.thisWeek = function() {
  return findFromDate(moment.now(), 7);
};
