import Koa from 'koa';
import serve from 'koa-static';
import views from 'koa-views';

import config from '../config.js';

const app = new Koa();
exports.app = app;

app.proxy = true;

app.use(serve('./public'));
app.use(views('./public', { extension: 'pug' }));

require('./routes');

console.log(`${config.site.name} is now listening on port ${config.site.port}`);
app.listen(config.site.port);

process.on('SIGINT', function exit() {
  process.exit();
});
