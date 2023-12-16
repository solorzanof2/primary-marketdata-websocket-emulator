const Server = require('./src/server');
const WebsocketServer = require('./src/websocketServer');

const env = require('dotenv').config([__dirname, './.env']);


async function bootstrap() {
  // initialize timezone;
  process.env.TZ = env.parsed.DEFAULT_TIMEZONE;

  // create server;
  (new Server(env.parsed)).start();

  // * initialize websocket;
  (new WebsocketServer).start(Server.instance);
}

bootstrap();
