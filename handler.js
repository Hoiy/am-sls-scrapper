'use strict';

var request = require('request');
var cheerio = require('cheerio');

module.exports.main = (event, context, callback) => {
  request(event.body.url, function (error, response, html) {
    if (error) {
      callback(error, null);
      return;
    }

    try {
      var result = require('./config/example.js');
      var $ = cheerio.load(html);
      Object.keys(result).forEach(function(key) {
        if(typeof result[key] === 'function') {
          result[key] = result[key]($);
        }
      });
      callback(null, result);
    } catch (e) {
      callback(e, null);
    }
  });
};
