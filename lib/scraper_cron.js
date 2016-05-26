var cron = require('cron');
var CronJob = cron.CronJob;

var saveEvents = require('./lib/save_events');

exports.init = function () {
  return new CronJob('0 51 10,19 * * *', function () {
    saveEvents();
  }, null, true, 'America/Phoenix');
}