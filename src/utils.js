

const getRandomFromRange = (minValue, maxValue) =>
  Math.floor(Math.random() * (maxValue - minValue)) + minValue;

const getRandomNumber = (maxLimit) => Math.floor(Math.random() * maxLimit);

const getRandomFromList = (collection) => collection[Math.floor(Math.random() * collection.length)];

const threadSleep = async (millis) => new Promise(resolve => setTimeout(resolve, millis));

module.exports = {
  getRandomFromRange,
  getRandomNumber,
  getRandomFromList,
  threadSleep,
}
