'use strict';

let Horseman = require('node-horseman')
let Cheerio = require('cheerio')
let Rfs = require('require-from-string')

module.exports.main = (event, context, callback) => {
    let body = JSON.parse(event.body)
    let config = Rfs(body.config)
    let horseman = new Horseman()
    horseman
        .open(config.url)
        .html()
        .then(html => {
            let $ = Cheerio.load(html);
            let result = config.scrapper
            Object.keys(result).forEach(function(key) {
                if (typeof result[key] === 'function') {
                    result[key] = result[key]($)
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
