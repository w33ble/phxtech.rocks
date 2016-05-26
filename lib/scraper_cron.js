var cron = require('cron');
var CronJob = cron.CronJob;

exports.init = function () {
  return new CronJob('0 35 */12 * * *', function () {
    console.log(new Date());
    console.log('tick...');
  }, function () {
    console.log('tock...');
  }, true, 'America/Phoenix');
}

console.log(new Date());

