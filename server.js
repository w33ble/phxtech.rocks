require('dotenv').load();

const path = require('path');
const express = require('express');
const ehbs  = require('express-handlebars');
const routes = require('./routes');
const mwLogger = require('./lib/middleware/logger');
const scraperCron = require('./lib/scraper_cron');

const app = express();
const hbs = ehbs.create({
  extname: '.hbs'
});

if (process.env.TRUST_PROXY === 'yes') app.enable('trust proxy');

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('port', (process.env.PORT || 8080));

app.use(mwLogger.access);

app.use(express.static(path.resolve(__dirname, 'public'), {
  index: false,
  maxAge: '1d'
}));

app.use('/', routes);

app.get('*', function (req, res) {
  res.redirect(302, '/');
});

app.use(mwLogger.error);

app.listen(app.get('port'), function () {
  var c = scraperCron.init();

  console.log('Server listening on port', app.get('port'));
});