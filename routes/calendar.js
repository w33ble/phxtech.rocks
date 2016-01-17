module.exports = function (router) {
  router.get('/calendar', function(req, res) {
    res.redirect(302, 'http://nextplex.com/phoenix-az/calendar');
  });
};

