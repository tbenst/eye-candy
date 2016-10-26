const redisStore = require('koa-redis').redisStore

var session = koaSession({
    store: new RedisStore({...}),
	secret: '...',
	resave: true,
	saveUninitialized: true
});

exports.session = session