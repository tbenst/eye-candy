import redisStore from 'koa-redis'

var session = koaSession({
    store: new RedisStore({...}),
	secret: '...',
	resave: true,
	saveUninitialized: true
});

export default session