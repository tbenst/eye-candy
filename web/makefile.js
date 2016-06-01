var rollup = require( 'rollup' );
var babel = require('rollup-plugin-babel');
var json = require('rollup-plugin-json');
var nodeResolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');

rollup.rollup({
    entry: 'src/app.js',
    plugins: [ json(), babel({
        exclude: 'node_modules/**'
    }) ],
}).then( function ( bundle ) {
    bundle.write({
        format: 'cjs',
        dest: 'bundle.js'
    });
}).catch( function (argument) {
    console.log(argument)
});



// rollup.rollup({
//     entry: 'src/view/stimulus.js',
//     plugins: [ json(), babel({
//         exclude: 'node_modules/**'
//     }), commonjs(),
//     nodeResolve({
//         jsnext: true,
//         browser: true
//     })],
// }).then( function ( bundle ) {
//     bundle.write({
//         format: 'umd',
//         dest: 'view/js/stimulus.js'
//     });
// }).catch( function (argument) {
//     console.log(argument)
// });

