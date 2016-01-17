var path = require('path');
var express = require('express');

module.exports = function (router) {
  var public = path.resolve('..', 'public');

  router.use(express.static(public, {
    index: false,
    maxAge: '1d'
  }));
}