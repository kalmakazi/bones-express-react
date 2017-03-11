/* eslint no-console: 0 */

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../webpack.config.dev.js');

const isDev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;
const app = express();

if (isDev) {
  const config = require('../webpack.config.dev.js');
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false,
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get(/^(?!.*api).*$/, (req, res) => {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '../index.html')));
    res.end();
  });
} else {
  app.use('/', express.static(path.join(__dirname + '../build')));
  app.route('/').get((req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
  });
}

console.log('connect on port:', port);
app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
});
