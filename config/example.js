'use strict';

module.exports = {
  title: $ => {
    return $('#article-content header h1').text();
  },
  content: $ => {
    return $('#article-content .post-content').text();
  }
};
