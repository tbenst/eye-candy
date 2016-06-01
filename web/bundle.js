'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Koa = _interopDefault(require('koa'));
var path = _interopDefault(require('path'));
var co = _interopDefault(require('co'));
var render = _interopDefault(require('koa-ejs'));

var babelHelpers = {};

babelHelpers.asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            return step("next", value);
          }, function (err) {
            return step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

babelHelpers;

var _this = this;

// const Koa = require('koa');
// const router = require('koa-router')();
// const path = require('path')

require("babel-polyfill");
var router = require('koa-router')();
var serve = require('koa-static');

var app = new Koa();
render(app, {
    root: path.join(__dirname, './view'),
    layout: 'template',
    viewExt: 'html',
    cache: false,
    debug: true
});

app.context.render = co.wrap(app.context.render);

router.get('/', function () {
    var ref = babelHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return ctx.render('stimulus');

                    case 2:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, _this);
    }));
    return function (_x) {
        return ref.apply(this, arguments);
    };
}());

// router.get('/stimulus', async (ctx) => {
//     // ctx.body = 'Hello ty';
//     serve('stimulus/stimulus.html')
// });

// ctx.body = 'Hello ty';
app.use(serve('view')).use(router.routes()).use(router.allowedMethods());

app.listen(3000);