var cron = require('cron');
var CronJob = cron.CronJob;
var debug = require('phxtech-debug')('cron');
var saveEvents = require('.');

debug('Cron intialized');
return new CronJob('0 17 6,11,17 * * *', function () {
  debug('Cron executing');
  saveEvents();
}, null, true, 'America/Phoenix');