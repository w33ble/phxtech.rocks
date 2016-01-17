require('dotenv').load();

const path = require('path');
const express = require('express');
const ehbs  = require('express-handlebars');
const routes = require('./routes');
const mwLogger = require('./middleware/logger');

const app = express();
const hbs = ehbs.create({
  defaultLayout: 'main',
  extname: '.hbs'
});

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
  console.log('Server listening on port', app.get('port'));
});