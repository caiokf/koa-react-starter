const config = require('./config.js');
const app = require('./app.js').app;
const views = require('co-views');
const Router = require('koa-router');
const serve = require('koa-static');
const render = views('public', { map: { html: 'swig' } });

const main = require('./controllers/main');

const routes = new Router();

app.use(serve('./public'));

routes.get('/index', main.index);

routes.get('*', function* all() {
  this.body = yield render('index');
});

app.use(routes.routes());
