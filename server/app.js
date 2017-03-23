import koa from 'koa';
import serve from 'koa-static';
import session from 'koa-generic-session';
import bodyParser from 'koa-bodyparser';
import views from 'koa-views';

import config from '../config.js';

const app = new koa();
exports.app = app;

app.proxy = true;
app.keys = [config.site.secret];

app.use(session());
app.use(bodyParser());
app.use(serve('./public'));
app.use(views('./public'), {
  extension: 'pug',
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.body = { message: err.message }
    ctx.status = err.status || 500
  }
});

require('./routes');

console.log(`${config.site.name} is now listening on port ${config.site.port}`);
app.listen(config.site.port);

process.on('SIGINT', function exit() {
  process.exit();
});
