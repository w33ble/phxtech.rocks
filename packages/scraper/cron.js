var cron = require('cron');
var debug = require('phxtech-debug')('cron');
var saveEvents = require('.');
var CronJob = cron.CronJob;

debug('Cron intialized');
return new CronJob('0 17 6,11,17 * * *', function () {
  debug('Cron executing');
  saveEvents();
}, null, true, 'America/Phoenix');
