var fs = require('fs');
var path = require('path');
var axios = require('axios');

module.exports = function getPage() {
  // TODO: remove read from file cache
  return Promise.resolve(fs.readFileSync('page.html'));

  return axios.get('http://nextplex.com/phoenix-az/calendar')
  .then((response) => response.data)
  // .then((html) => {
  //   fs.writeFileSync('page.html', html);
  //   return html;
  // })
}