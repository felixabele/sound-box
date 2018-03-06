const express      = require('express');
const http         = require('http');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const path         = require('path');
const socketIo     = require('socket.io');
const logger       = require('morgan');

const app = express();
const port = process.env.PORT || 3000;
let io;

function server(routes, onIoConnection) {

  // if we're developing, use webpack middleware for module hot reloading
  if (process.env.NODE_ENV !== 'production') {
    console.log('==> 🌎 using webpack');

    // load and configure webpack
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const config = require('../webpack/dev.config');

    // setup middleware
    const compiler = webpack(config);
    app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
    app.use(webpackHotMiddleware(compiler));
  }

  app.set('port', port);
  app.use(logger('dev'))
    .use(cookieParser())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .use(express.static(path.resolve(__dirname, '../public')))
    .use('/', routes);

  const httpServer = http.Server(app);
  io = socketIo(httpServer);
  io.on('connection', onIoConnection);

  // Start her up, boys
  httpServer.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'));
  });
}

module.exports = server;
