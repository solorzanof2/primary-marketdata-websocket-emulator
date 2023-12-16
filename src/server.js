const http = require('http');
const Security = require('./security');


class Server {
  static instance;

  #port = 30000;
  #url = 'http://localhost';
  #apiKey = '';

  constructor(options) {
    this.#port = options.DEFAULT_PORT;
    this.#url = options.DEFAULT_URL;
    this.#apiKey = options.DEFAULT_APIKEY;
  }

  start() {
    this.#starterLog();

    const callback = async (request, response) => {
      let timeLabel = `Server: Request ${Security.getRandomGUID(24)} -- duration`;
      try {
        console.log('');
        console.log('');
        console.log(`Server: ${request.method} ${request.url}`);
        console.time(timeLabel);

        // INFO return a default response, due to this will be only for websocket usage;
        response.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
        });
        response.write({
          status: 200,
          payload: {
            app: 'Market Emulator',
            version: '0.0.1',
          },
        });
        response.end();
        return;
      }
      catch (error) {
        if (error instanceof Exception) {
          response.writeHead(error.code, error.message);
          response.write(error.message);
          response.end();
          return;
        }

        response.writeHead(HttpStatus.ServerError, 'Internal Server Error');
        response.write(error.message);
        response.end();
      }
      finally {
        console.timeEnd(timeLabel);
        console.log('');
        console.log('');
      }
    }

    Server.instance = http.createServer(callback).listen(+this.#port);
  }

  #starterLog() {
    console.log('');
    console.log('MarketEmulator: API - version 0.0.1');
    console.log('MarketEmulator: ');
    console.log('MarketEmulator: key with token: %s', this.#apiKey);
    console.log('MarketEmulator: Remember to use x-api-key on the request headers');
    console.log('MarketEmulator: ');
    console.log('MarketEmulator: [HTTP] server ready: %s:%d', this.#url, this.#port);
    console.log('');
  }

}

module.exports = Server;
