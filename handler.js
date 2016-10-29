'use strict';

const cheerio = require('cheerio');
const request = require('request');

module.exports.main = (event, context, callback) => {
  request(event.body.uri, function (error, response, html) {
    if (error) {
      callback(error, null);
      return;
    }
    var $ = cheerio.load(html);
    callback(null, html);
  });
};
