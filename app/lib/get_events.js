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
        details_id: detailsId,
        title: $event.text(),
        href: href,
        date: date,
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
    var events = tables.map(walkDays($)).toArray();

    return events.map((event) => {
      var $details = $('#' + event.detailsId);
      var address = $details.find('address').first().find('strong').text();
      var time = $('#' + event.detailsId + ' time').first().text().replace(/\s\s/g, ' ');
      var startTime = time.match(/at.+?(\d\:\d.+?(am|pm))/);
      var endTime = time.match(/to.+?(\d\:\d.+?(am|pm))/);

      if (startTime) {
        var timeParts = startTime[1].match(/(\d.*?)\:(\d.*?)(am|pm)/);
        event.date.add(timeParts[1], 'hours');
        event.date.add(timeParts[2], 'minutes');
        if (timeParts[3] === 'pm') event.date.add(12, 'hours');
      }

      return Object.assign(event, {
        address: address,
        time: time,
        start_time: startTime && startTime[1],
        end_time: endTime && endTime[1],
        date: event.date.toISOString()
      });
    });
  })
}

module.exports = getEvents;