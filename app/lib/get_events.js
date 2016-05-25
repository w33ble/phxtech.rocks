var cheerio = require('cheerio');
var moment = require('moment');

var getPage = require('./get_page');

function mapDayEvents($, month) {
  return function () {
    var results = [];
    var $this = $(this);
    var day = $this.find('.day-num').first().text();
    var events = $this.find('a');
    var date = moment(month, 'MMMM YYYY').add(day - 1, 'day');

    events.each(function () {
      var $event = $(this);
      var detailsId = $event.data('content-source');
      var href = $event.attr('href');
      var id = href.split('/').pop().split('-')[0];
      var event = {
        _id: id,
        detailsId: detailsId,
        title: $event.text(),
        href: href,
        date: date.toISOString(),
      };

      results.push(event);
    });

    return results;
  }
}

function walkDays($) {
  return function (index) {
    var $this = $(this);
    var month = $this.siblings('h1').eq(index).text();
    var cells = $this.find('td').not('.off');

    var days = cells.map(mapDayEvents($, month)).toArray();
    return days;
  }
}

function getEvents() {
  return getPage()
  .then((html) => {
    var $ = cheerio.load(html);

    var tables = $('#event_calendar table');
    return tables.map(walkDays($)).toArray();
  })
}

module.exports = getEvents;