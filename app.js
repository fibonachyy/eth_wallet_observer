const Web3 = require("web3");

class TransactionChecker {
  web3;
  web3ws;
  account;
  subscription;
  constructor(projectId, account) {
    this.web3ws = new Web3(
      new Web3.providers.WebsocketProvider(
        "wss://rinkeby.infura.io/ws/v3/" + projectId
      )
    );
    this.web3 = new Web3(
      new Web3.providers.HttpProvider(
        "https://rinkeby.infura.io/v3/" + projectId
      )
    );
    this.account = account.toLowerCase();
  }

  subscribe(topic) {
    this.subscription = this.web3ws.eth.subscribe(topic, (err, res) => {
      if (err) console.log(err);
    });
  }
  watchTransaction() {
    console.log("watching all pending transaction....");
    this.subscription.on("data", (txHash) => {
      setTimeout(async () => {
        try {
          let tx = await this.web3.eth.getTransaction(txHash);
          if (tx != null) {
            if (this.account == tx.to.toLowerCase()) {
              console.log({
                address: tx.from,
                value: this.web3.utils.fromWei(tx.value, "ether"),
                timestamp: new Date(),
              });
            }
          }
        } catch (e) {
          console.log(e);
        }
      }, 10000);
    });
  }
}

let txChecker = new TransactionChecker(
  "a1f9ce9c8dd649c1a64e672dc8b18885",
  "0xcB4d2736C23d6aC1f63898CAA3F354291839BE1f"
);

txChecker.subscribe("pendingTransactions");
txChecker.watchTransaction();
