const Security = require("./security");
const { threadSleep } = require("./utils");


class Market {

  processed = [];

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
  }

  static async processOrderMarketType(orderRequest, callback) {
    let transaction;
    for (let index = 0; index < 2; index++) {
      await threadSleep(200);

      if (index === 0) {
        transaction = this.mapResponse(orderRequest, 'PENDING_NEW');
        console.log(`[INF0] ORDER_REPORT Sending Back order: ${JSON.stringify(transaction)}`);
        callback(transaction);
        orderRequest.transactions.push(transaction);
        continue;
      }

      transaction = this.mapResponse(orderRequest, 'FILLED');
      console.log(`[INF0] ORDER_REPORT Sending Back order: ${JSON.stringify(transaction)}`);
      callback(transaction);
      orderRequest.transactions.push(transaction);
    }

    // this.processed.push(orderRequest);
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

