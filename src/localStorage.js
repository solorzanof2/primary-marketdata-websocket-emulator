

class LocalStorage {

  static data = [];

  static setItem(key) {
    if (this.data.some(row => row === key)) {
      return;
    }

    this.data.push(key);
  }

  static getItem(key) {
    return this.data.find(row => row === key);
  }

  static getAll() {
    return this.data;
  }

  static clear() {
    this.data.length = 0;
  }

  static removeItem(key) {
    const index = this.data.findIndex(key);
    this.data.splice(index, 1);
  }

}


module.exports = LocalStorage;

