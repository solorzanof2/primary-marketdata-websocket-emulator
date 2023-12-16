const LocalStorage = require("./localStorage");
const { threadSleep, getRandomFromList, getRandomNumber, getRandomFromRange } = require("./utils");


// FIXME maybe this can be handled as configuration on demand
// const MINIMAL = 30000;
// const MAXIMUM = 58000;


class MarketEngine {
  static turnOn = true;

  static limits = {
    ARS: {
      Minimum: 30000,
      Maximum: 58000,
    },
    USD: {
      Minimum: 30,
      Maximum: 70,
    },
  };

  static async marketData(callback) {
    if (!MarketEngine.turnOn) {
      MarketEngine.turnOn = true;
    }

    let data;
    let clients;
    let client;
    while (true) {
      if (!MarketEngine.turnOn) {
        break;
      }

      await threadSleep(getRandomNumber(500));

      data = MarketEngine.#marketEmulator();

      clients = LocalStorage.findAllByValue(data.instrumentId.symbol);

      if (!clients?.length) {
        LocalStorage.removeInstrument(data.instrumentId.symbol);
        continue;
      }

      for (client of clients) {
        client.data = data;
      }

      callback(clients);
    }
  }

  static #marketEmulator() {
    const symbol = getRandomFromList(LocalStorage.instruments);

    const [
      currency, symbolValue,
    ] = symbol.split('::');

    const {
      Minimum, Maximum,
    } = MarketEngine.limits[currency];

    return {
      type: "Md",
      timestamp: Date.now(),
      instrumentId: {
        marketId: "ROFX",
        symbol: symbolValue,
      },
      marketData: {
        CL: {
          price: getRandomFromRange(Minimum, Maximum),
          date: Date.now(),
        },
        BI: [],
        OF: [],
        LA: {
          price: getRandomFromRange(Minimum, Maximum),
          size: 0,
          date: Date.now(),
        },
      },
    }
  };

  static stop() {
    MarketEngine.turnOn = false;
  }
}

module.exports = {
  MarketEngine,
}

