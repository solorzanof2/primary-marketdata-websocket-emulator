const LocalStorage = require("./localStorage");
const { threadSleep, getRandomFromList, getRandomNumber, getRandomFromRange } = require("./utils")


// FIXME maybe this can be handled as configuration on demand
const MINIMAL = 30000;
const MAXIMUM = 58000;

const marketData = async (callback) => {
  while (true) {
    await threadSleep(getRandomNumber(1000));

    callback(marketEmulator());
  }
}

const marketEmulator = () => {
  const symbol = getRandomFromList(LocalStorage.getAll());
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
  marketData,
}

