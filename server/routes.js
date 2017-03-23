import views from 'koa-views';
import Router from 'koa-router';
import serve from 'koa-static';

import config from './config.js';
import { app } from './app.js';

const router = new Router();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.body = { message: err.message }
    ctx.status = err.status || 500
  }
});

router.get('/api', (ctx, next) => {
  ctx.body = 'result';
});

router.get('/', async (ctx, next) => {
  await ctx.render('index');
});

app.use(router.routes());
