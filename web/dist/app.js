'use strict';

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _koaEjs = require('koa-ejs');

var _koaEjs2 = _interopRequireDefault(_koaEjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var Koa = require('koa');
var router = require('koa-router')();
var path = require('path');

var app = new Koa();
(0, _koaEjs2.default)(app, {
  root: path.join(__dirname, '../view'),
  layout: 'template',
  viewExt: 'html',
  cache: false,
  debug: true
});

app.context.render = _co2.default.wrap(app.context.render);

router.get('/', function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
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
    }, _callee, undefined);
  }));

  return function (_x) {
    return ref.apply(this, arguments);
  };
}());

// ctx.body = 'Hello ty';
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);