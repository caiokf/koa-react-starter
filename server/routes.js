import Router from 'koa-router';

export default function routes(app) {
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

  return router.routes();
}
