
class Security {

  static getRandomGUID(size = 12)  {
    const charsCollection = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charsLength = charsCollection.length;

    let hash = '';
    let index = 0;
    for (index; index < size; index++) {
      hash += charsCollection[Math.floor(Math.random() * charsLength)];
    }

    return hash;
  }

  static generateOrderID(size = 15) {
    const charsCollection = "0123456789";
    const charsLength = charsCollection.length;

    let hash = '';
    let index = 0;
    for (index; index < size; index++) {
      hash += charsCollection[Math.floor(Math.random() * charsLength)];
    }

    return hash;
  }
}

module.exports = Security;

