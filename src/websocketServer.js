const { WebSocket } = require("ws");
const { MarketEngine } = require("./marketData");
const LocalStorage = require("./localStorage");
const Security = require("./security");
const { Market } = require("./market");


class WebsocketServer {
  static instance;

  constructor() { }

  start(server) {
    this.#starterLog();

    const callback = async (websocket) => {
      websocket.uid = Security.getRandomGUID();

      websocket.on('message', (message) => {
        const payload = JSON.parse(message);

        if (payload === 'ping') {
          return;
        }

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
            LocalStorage.setItem(websocket.uid, instrument.symbol);
          }

          MarketEngine.marketData((results) => {
            for (const client of WebsocketServer.instance.clients) {
              for (const result of results) {
                if (result.uid === client.uid) {
                  client.send(JSON.stringify(result.data));
                }
              }
            }
          });
        }

        if (payload.type === 'os') {
          console.log(`[INF0] order subscription has been received...`);
          console.log({payload});
        }

        if (payload.type === 'no') {
          console.log(`[INF0] order has been sent...`);
          Market.sendOrder(payload, (executionReport) => {
            for (const client of WebsocketServer.instance.clients) {
              // if (result.uid === client.uid) {
              client.send(JSON.stringify(executionReport));
              // }
            }
          });
        }
      });

      websocket.on('close', () => {
        console.log(`[INFO] WEBSOCKET_SERVER Connection has been closed...`);
        if (LocalStorage.length === 1) {
          MarketEngine.stop();
        }

        LocalStorage.removeSubscription(websocket.uid);
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

