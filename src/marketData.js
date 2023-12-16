const LocalStorage = require("./localStorage");
const { threadSleep, getRandomFromList, getRandomNumber, getRandomFromRange } = require("./utils");


// FIXME maybe this can be handled as configuration on demand
const MINIMAL = 30000;
const MAXIMUM = 58000;


class MarketEngine {
  static turnOn = true;

  static marketData = async (callback) => {
    let data;
    let clients;
    let client;
    while (true) {
      if (!MarketEngine.turnOn) {
        break;
      }

      await threadSleep(getRandomNumber(500));

      data = marketEmulator();

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
}


const marketEmulator = () => {
  const symbol = getRandomFromList(LocalStorage.instruments);
  return {
    type: "Md",
    timestamp: Date.now(),
    instrumentId: {
      marketId: "ROFX",
      symbol,
    },
    marketData: {
      CL: {
        price: getRandomFromRange(MINIMAL, MAXIMUM),
        date: Date.now(),
      },
      BI: [],
      OF: [],
      LA: {
        price: getRandomFromRange(MINIMAL, MAXIMUM),
        size: 0,
        date: Date.now(),
      },
    },
  }
};

module.exports = {
  MarketEngine,
}

