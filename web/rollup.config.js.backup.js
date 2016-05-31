import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/app.js',
  format: 'cjs',
  plugins: [ json(), babel() ],
  dest: 'dist/bundle.js'
};

// export default {
//   entry: 'src/client/stimulus.js',
//   format: 'cjs',
//   plugins: [ json(), babel() ],
//   dest: 'dist/stimulus.js'
// };