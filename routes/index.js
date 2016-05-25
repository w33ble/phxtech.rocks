var path = require('path');
var express = require('express');

var public = path.resolve('..', 'public');

var router = express.Router({
  caseSensitive: true
});

// static assets
router.use(express.static(public, {
  index: false,
  maxAge: '1d'
}));

// calendar site redirect
router.get('/calendar', function(req, res) {
  res.redirect(302, 'http://nextplex.com/phoenix-az/calendar');
});

// home page route
router.get('/', function (req, res) {
  res.render('home');
});

module.exports = router;