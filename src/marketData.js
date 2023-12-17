const LocalStorage = require("./localStorage");
const {
  threadSleep,
  getRandomFromList,
  getRandomNumber,
  getRandomDecimals,
  getPercentValueFromPrice,
  doOperation,
} = require("./utils");



class MarketEngine {
  static turnOn = true;

  // FIXME maybe this can be handled as configuration on demand
  static limits = {
    ARS: {
      CL: 58000,
    },
    USD: {
      CL: 70,
    },
  };

  static bias = 1;

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
      CL,
    } = MarketEngine.limits[currency];

    let basePrice = +CL;
    const symbolLastPricing = LocalStorage.getSymbolLastPricing(symbolValue);
    if (symbolLastPricing) {
      basePrice = +symbolLastPricing.value;
    }

    const percent = getRandomDecimals(0, this.bias);
    const percentValue = getPercentValueFromPrice(basePrice, percent);
    const price = doOperation(basePrice, percentValue);

    LocalStorage.setPricing(symbolValue, price);

    return {
      type: "Md",
      timestamp: Date.now(),
      instrumentId: {
        marketId: "ROFX",
        symbol: symbolValue,
      },
      marketData: {
        CL: {
          price: CL,
          date: Date.now(),
        },
        BI: [],
        OF: [],
        LA: {
          price,
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

