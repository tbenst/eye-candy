var Main = require('./Main.purs');
// vanilla hot module reloading
// @see https://webpack.github.io/docs/hot-module-replacement.html
if(module.hot) {
	var main = Main.main();

	module.hot.accept();
} else {
	Main.main();
}