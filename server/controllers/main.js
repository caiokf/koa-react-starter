const views = require('co-views');
const render = views('public', { map: { html: 'swig' } });

module.exports.index = function* index() {
  return this.body = yield render('index');
};
