'use strict';

var Horseman = require('node-horseman')
var cheerio = require('cheerio')
var rfs = require('require-from-string')

module.exports.main = (event, context, callback) => {
    let body = JSON.parse(event.body)
    let horseman = new Horseman()
    horseman
        .viewport(1920, 1080)
        .open(body.url)
        .html()
        .then(html => {
            let $ = cheerio.load(html);
            let result = rfs(body.config);
            Object.keys(result).forEach(function(key) {
                if (typeof result[key] === 'function') {
                    result[key] = result[key]($, horseman)
                }
            })
            callback(null, {
                statusCode: 200,
                body: JSON.stringify(result),
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                    "Access-Control-Allow-Origin": "*"
                },
            })
            return horseman.close()
        })
        .catch(function(e) {
            callback(e, {
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }
            })
        })
};
