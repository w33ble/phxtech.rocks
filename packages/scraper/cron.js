var cron = require('cron');
var debug = require('phxtech-debug')('cron');
var saveEvents = require('.');
var CronJob = cron.CronJob;

function shutdown() {
  // clean up your resources and exit
  process.exit();
};

process.on('SIGINT', function onSigint() {
  shutdown();
});

process.on('SIGTERM', function onSigterm() {
  shutdown();
});

debug('Cron intialized');

return new CronJob('0 17 6,11,17 * * *', function () {
  debug('Cron executing');
  saveEvents();
}, null, true, 'America/Phoenix');
