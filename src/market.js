const Security = require("./security");
const { threadSleep } = require("./utils");


class Market {

  static processed = [];

  static book = [];

  static sendOrder(order, callback) {
    const orderRequest = {
      account: order.account,
      clientOrderID: Security.generateOrderID(),
      request: order,
      transactions: [],
    };

    if (order.ordType === 'MARKET') {
      this.processOrderMarketType(orderRequest, callback);
    }

    if (order.ordType === 'LIMIT') {
      this.processOrderLimitType(orderRequest, callback);
    }
  }

  static async processOrderMarketType(orderRequest, callback) {
    let transaction;
    for (let index = 0; index < 2; index++) {

      if (index === 0) {
        transaction = this.mapResponse(orderRequest, 'PENDING_NEW');
        console.log(`[INF0] ORDER_REPORT Sending Back order: ${JSON.stringify(transaction)}`);
        callback(transaction);
        orderRequest.transactions.push(transaction);
        continue;
      }

      await threadSleep(200);

      transaction = this.mapResponse(orderRequest, 'FILLED');
      console.log(`[INF0] ORDER_REPORT Sending Back order: ${JSON.stringify(transaction)}`);
      callback(transaction);
      orderRequest.transactions.push(transaction);
    }

    // this.processed.push(orderRequest);
  }

  static async processOrderLimitType(orderRequest, callback) {
    let transaction;
    for (let index = 0; index < 2; index++) {

      if (index === 0) {
        transaction = this.mapResponse(orderRequest, 'PENDING_NEW');
        console.log(`[INF0] ORDER_REPORT Sending Back order: ${JSON.stringify(transaction)}`);
        callback(transaction);
        orderRequest.transactions.push(transaction);
        continue;
      }

      await threadSleep(200);

      const result = await this.checkOpenedOrders(orderRequest);

      if (result.status === 'NEW') {
        transaction = this.mapResponse(result.orderRequest, result.status);
        console.log(`[INF0] ORDER_REPORT Sending Back order: ${JSON.stringify(transaction)}`);
        callback(transaction);
        orderRequest.transactions.push(transaction);
        continue;
      }

      if (result.status === 'FILLED') {
        for (let innerIndex = 0; innerIndex < 2; innerIndex++) {
          if (innerIndex === 0) {
            transaction = this.mapResponse(result.orderRequest, result.status);
            console.log(`[INF0] ORDER_REPORT Sending Back order: ${JSON.stringify(transaction)}`);
            callback(transaction);
            orderRequest.transactions.push(transaction);
            continue;
          }

          transaction = this.mapResponse(orderRequest, result.status);
          console.log(`[INF0] ORDER_REPORT Sending Back order: ${JSON.stringify(transaction)}`);
          callback(transaction);
          orderRequest.transactions.push(transaction);
        }
      }
    }
  }

  static async checkOpenedOrders(order) {
    // is there another order side?
    const orderSide = (order.request.side === 'BUY')
      ? 'SELL'
      : 'BUY';

    const [orderInBook] = this.book.filter(row => row.request.side === orderSide);

    if (!orderInBook) {
      this.book.push(order);

      return Promise.resolve({
        status: 'NEW',
        orderRequest: order,
      });
    }

    const bookIndex = this.book.findIndex(row => row.side === orderSide);
    this.book.splice(bookIndex, 1);

    return Promise.resolve({
      status: 'FILLED',
      orderRequest: orderInBook,
    });
  }

  static responseParams(orderRequest) {
    const {
      price, side, quantity, ordType, account, product, wsClOrdId,
    } = orderRequest.request;

    return {
      price,
      side,
      quantity,
      ordType,
      symbol: product.symbol,
      // status,
      account,
      clOrdId: orderRequest.clientOrderID,
      wsClOrdId,
    }
  }

  static mapResponse(orderRequest, status) {
    const {
      price, side, quantity, ordType, symbol, account, clOrdId, wsClOrdId
    } = this.responseParams(orderRequest);

    const orderReport = {
      side,
      text: " ",
      avgPx: price,
      price,
      cumQty: quantity,
      execId: "MERVE0H4LvxC6B2G",
      lastPx: price,
      status,
      clOrdId,
      iceberg: "true",
      lastQty: quantity,
      ordType,
      orderId: "O0H4M0nEPz9v-03733096",
      orderQty: quantity,
      accountId: {
        id: account,
      },
      leavesQty: 0,
      displayQty: 0,
      proprietary: "ISV_PBCP",
      timeInForce: "DAY",
      instrumentId: {
        symbol,
        marketId: "ROFX"
      },
      transactTime: "20231219-15:37:05.452-0300",
      numericOrderId: "03733096",
      originatingUsername: "ISV_PBCP"
    }

    if (status === 'PENDING_NEW') {
      orderReport.wsClOrdId = wsClOrdId;
    }

    return {
      type: "or",
      timestamp: Date.now(),
      orderReport,
    }
  }

}

module.exports = {
  Market,
}

