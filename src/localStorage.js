

class LocalStorage {

  static data = [];

  static instruments = [];

  static get length() {
    return this.data.length;
  }

  static setItem(key, value) {
    let client = this.data.find(row => row.uid === key);

    let isNewClient = false;
    if (!client?.uid) {
      client = {
        uid: key,
        collection: [],
      }

      isNewClient = true;
    }

    if (client.collection.some(row => row === value)) {
      return;
    }

    client.collection.push(value);

    if (isNewClient) {
      this.data.push(client);
    }
    else {
      const length = this.length;
      for (let index = 0; index < length; index++) {
        if (this.data[index].uid !== key) continue;
        this.data[index] = client;
      }
    }

    if (!this.instruments.some(row => row === value)) {
      this.instruments.push(value);
    }
  }

  static findAllByValue(value) {
    const collection = this.data.filter(row => row.collection.some(innerRow => innerRow === value));
    return collection.map(client => ({ uid: client.uid, data: value }));
  }

  static clear() {
    this.data = [];
  }

  static removeItem(key, value) {
    const client = this.data.find(client => client.uid === key);

    if (!client?.uid) {
      return;
    }

    // check if any other client has the same value in its collection
    // before remove it from the instruments list;
    if (!this.data.some(row => row.collection.some(innerRow => innerRow === value))) {
      const instrumentIndex = this.instruments.findIndex(row => row === value);
      this.instruments.splice(instrumentIndex, 1);
    }

    const index = client.collection.findIndex(row => row === value);
    client.collection.splice(index, 1);
  }

  static removeInstrument(value) {
    const index = this.instruments.findIndex(row => row === value);
    this.instruments.splice(index, 1);
  }

  static removeSubscription(key) {
    const client = this.data.find(client => client.uid === key);

    if (!client?.uid) {
      return;
    }

    for (const instrument of client.collection) {
      if (!this.data.some(row => row.collection.some(innerRow => innerRow === instrument))) {
        const instrumentIndex = this.instruments.findIndex(row => row === value);
        this.instruments.splice(instrumentIndex, 1);
      }
    }

    const index = this.data.findIndex(row => row.uid === key);
    this.data.splice(index, 1);
  }

}


module.exports = LocalStorage;

