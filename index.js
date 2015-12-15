var express = require('express');
var ehbs  = require('express-handlebars');
var app = express();
var hbs = ehbs.create({
  defaultLayout: 'main',
  extname: '.hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('port', (process.env.PORT || 8080));

app.get('/calendar', function(req, res) {
  res.redirect(302, 'http://nextplex.com/phoenix-az/calendar');
});

app.use(express.static(__dirname + '/public', {
  index: false,
  maxAge: '1d'
}));

app.get('/', function (req, res) {
  res.render('home');
});

app.get('*', function (req, res) {
  res.redirect(302, '/');
});

app.listen(app.get('port'), function () {
  console.log('Server listening on port', app.get('port'));
});