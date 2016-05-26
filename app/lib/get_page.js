var fs = require('fs');
var path = require('path');
var axios = require('axios');

var mockData = process.env.MOCK_DATA || false;

function getMockPage() {
  try {
    var data = fs.readFileSync('page.html');
    return Promise.resolve(data);
  } catch (e) {
    return getRealPage();
  }
}

function getRealPage() {
  return axios.get('http://nextplex.com/phoenix-az/calendar')
  .then((response) => response.data)
  .then((html) => {
    if (mockData === 'yes') fs.writeFileSync('page.html', html);
    return html;
  });
}

module.exports = function getPage() {
  if (mockData === 'yes') return getMockPage();
  return getRealPage();
}