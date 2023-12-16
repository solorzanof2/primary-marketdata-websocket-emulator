

const getRandomFromRange = (minValue, maxValue) =>
  Math.floor(Math.random() * (maxValue - minValue)) + minValue;

const getRandomNumber = (maxLimit) => Math.floor(Math.random() * maxLimit);

const getRandomFromList = (collection) => collection[Math.floor(Math.random() * collection.length)];

const threadSleep = async (millis) => new Promise(resolve => setTimeout(resolve, millis));

const symbolCurrencyAnalizer = (value) => {
  const [
    merv,
    xmev,
    instrument,
    payType,
  ] = value.split(' - ');

  const instrumentChars = instrument.split('');

  const lastChar = instrumentChars.pop();

  let prefix = 'ARS';
  if (lastChar === 'D') {
    prefix = 'USD';
  }

  return `${prefix}::${value}`;
}

module.exports = {
  getRandomFromRange,
  getRandomNumber,
  getRandomFromList,
  threadSleep,
  symbolCurrencyAnalizer,
}
