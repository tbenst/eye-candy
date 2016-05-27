const Koa = require('koa');
const router = require('koa-router')();
const path = require('path')

import co from 'co';
import render from 'koa-ejs';


const app = new Koa();
render(app, {
  root: path.join(__dirname, '../view'),
  layout: 'template',
  viewExt: 'html',
  cache: false,
  debug: true
});

app.context.render = co.wrap(app.context.render);

router.get('/', async ctx => {
    await ctx.render('stimulus');
    // ctx.body = 'Hello ty';
});



app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);