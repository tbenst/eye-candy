import { rollup } from 'rollup';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

rollup({
	entry: 'src/app.js',
	format: 'cjs',
	plugins: [ json(), babel() ],
	dest: 'dist/bundle.js'
}).then(...);

rollup({
	entry: 'src/client/stimulus.js',
	format: 'cjs',
	plugins: [ json(), babel() ],
	dest: 'dist/stimulus.js'
}).then(...);

// export default {
// 	entry: 'src/client/stimulus.js',
// 	format: 'cjs',
// 	plugins: [ json(), babel() ],
// 	dest: 'dist/stimulus.js'
// };

// export default {
//   entry: 'src/client/stimulus.js',
//   format: 'cjs',
//   plugins: [ json(), babel() ],
//   dest: 'dist/stimulus.js'
// };