'use strict';

var request = require('request');
var cheerio = require('cheerio');
var rfs = require('require-from-string');

module.exports.main = (event, context, callback) => {
  var body = JSON.parse(event.body);
  request(body.url, function (error, response, html) {
    if (error) {
      callback(error, null);
      return;
    }

    try {
      var result = rfs(body.config);
      var $ = cheerio.load(html);
      Object.keys(result).forEach(function(key) {
        if(typeof result[key] === 'function') {
          result[key] = result[key]($);
        }
      });
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
      });
    } catch (e) {
      callback(e, null);
    }
  });
};
