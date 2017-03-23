const Api = {
  configure: (router) => {
    router.get('/api', (ctx, next) => {
      ctx.body = 'result';
    });
  }
};

export default Api;
