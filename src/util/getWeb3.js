// IMPORTANT: web3 injected by MetaMask is version 0.x.x instead of 1.x.x-beta.
//  Documentation here: https://github.com/ethereum/wiki/wiki/JavaScript-API

const getWeb3 = new Promise(((resolve, reject) => {
  const web3js = window.web3;
  if (typeof web3js !== 'undefined') {
    const web3 = new window.Web3(web3js.currentProvider);
    resolve({
      web3() {
        return web3;
      },
    });
  } else {
    // TODO: Show an error to the user that web3 was unavailable
    reject(new Error('Unable to connect to Metamask'));
  }
}))
  .then(result => new Promise(((resolve, reject) => {
    result.web3().version.getNetwork((err, networkId) => {
      if (err) {
        reject(new Error('Unable to retrieve network ID'));
      } else {
        const returnValue = Object.assign({}, result, { networkId });
        resolve(returnValue);
      }
    });
  })))
  .then(result => new Promise(((resolve, reject) => {
    result.web3().eth.getAccounts((err, accounts) => {
      if (err) {
        reject(new Error('Unable to retrieve accounts'));
      } else {
        const returnValue = Object.assign({}, result, { account: accounts[0] });
        resolve(returnValue);
      }
    });
  })))
  .then(result => new Promise(((resolve, reject) => {
    result.web3().eth.getBalance(result.account, (err, balance) => {
      if (err) {
        reject(new Error(`Unable to retrieve balance for address: ${result.account}`));
      } else {
        const returnValue = Object.assign({}, result, { balance });
        resolve(returnValue);
      }
    });
  })));

export default getWeb3;
