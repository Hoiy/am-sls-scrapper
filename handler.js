'use strict';

var request = require('request');
var cheerio = require('cheerio');
var rfs = require('require-from-string');
var iconv = require('iconv-lite');
var charsetParser = require('charset-parser');

module.exports.main = (event, context, callback) => {
  var body = JSON.parse(event.body);
  request({
    uri: body.url,
    encoding: null,
  }, function (error, response, binary) {
    if (error) {
      callback(error, null);
      return;
    }

    try {
      var charset = charsetParser(response.headers['content-type'], binary, 'iso-8859-1');
      var html = iconv.decode(binary, charset); // convert any encoding to UTF-8
      var $ = cheerio.load(html);

      var result = rfs(body.config);
      Object.keys(result).forEach(function(key) {
        if(typeof result[key] === 'function') {
          result[key] = result[key]($);
        }
      });

      callback(null, {
        statusCode: 200,
        body: JSON.stringify(result),
        headers: {
          "Content-Type" : "application/json; charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        },
      });
    } catch (e) {
      callback(e, null);
    }
  });
};
