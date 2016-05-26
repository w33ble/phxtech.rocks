var path = require('path');
var express = require('express');
var getEvents = require('../lib/get_events');

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

// calendar site redirect
router.get('/event-feed', function(req, res) {
  getEvents.thisWeek()
  .then((events) => {
    res.render('event_feed', {
      layout: false,
      events: events
    });
  }).
  catch((err) => {
    res.status(500).end();
  })
});

// home page route
router.get('/', function (req, res) {
  res.render('home');
});

module.exports = router;