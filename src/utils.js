

const getRandomFromRange = (minValue, maxValue) =>
  Math.floor(Math.random() * (maxValue - minValue)) + minValue;

const getRandomDecimals = (minValue, maxValue) =>
  Math.random() * (maxValue - minValue) + minValue;

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

const getPercentValueFromPrice = (price, percent) => +((+price * +percent) / 100).toFixed(2);

const getOperationType = () => {
  const collection = ['plus', 'hold', 'substract'];
  return getRandomFromList(collection);
}

const doOperation = (basePrice, percentValue) => {
  const operation = getOperationType();

  if (operation === 'substract') {
    return +(basePrice - percentValue).toFixed(2);
  }

  if (operation === 'hold') {
    return +(basePrice).toFixed(2);
  }

  return +(basePrice + percentValue).toFixed(2);
}

module.exports = {
  getRandomFromRange,
  getRandomNumber,
  getRandomFromList,
  threadSleep,
  symbolCurrencyAnalizer,
  getRandomDecimals,
  getPercentValueFromPrice,
  getOperationType,
  doOperation,
}
