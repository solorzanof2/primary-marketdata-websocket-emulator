const { WebSocket } = require("ws");
const { marketData } = require("./marketData");
const LocalStorage = require("./localStorage");


class WebsocketServer {
  static instance;

  constructor() { }

  start(server) {
    this.#starterLog();

    const callback = async (websocket) => {

      websocket.on('message', (message) => {
        const payload = JSON.parse(message);

        if (!('type' in payload)) {
          websocket.send(JSON.stringify({
            status: 500,
            payload: 'Malformed Websocket Message',
          }));
          return;
        }

        if (payload.type === 'smd') {
          if (!payload.products?.length) {
            return;
          }

          for (const instrument of payload.products) {
            LocalStorage.setItem(instrument.symbol);
          }

          marketData((result) => {
            for (const client of WebsocketServer.instance.clients) {
              client.send(JSON.stringify(result));
            }
          });
        }
      });

      websocket.on('close', () => {
        console.log(`[INFO] WEBSOCKET_SERVER Connection has been closed...`);
      });

      console.log(`[INFO] WEBSOCKET_SERVER A Websocket Client has been connected...`);

      websocket.send(JSON.stringify({ status: 200, payload: 'OK' }));
    }

    WebsocketServer.instance = new WebSocket.Server({ server });
    WebsocketServer.instance.on('connection', callback);
  }

  #starterLog(){
    console.log('');
    console.log('WebsocketServer: API - version 0.0.1');
    console.log('WebsocketServer: ');
    console.log('WebsocketServer: [WebSocket] server ready: %s:%d', 'ws://localhost', 30000);
    console.log('');
  }
}

module.exports = WebsocketServer;

