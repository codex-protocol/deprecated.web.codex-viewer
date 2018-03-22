import Web3 from 'web3';

/*
* 1. Check for injected web3 (mist/metamask)
* 2. If metamask/mist create a new web3 instance and pass on result
* 3. Get networkId - Now we can check the user is connected to the right network to use our dApp
* 4. Get user account from metamask
* 5. Get user balance
*/

const getWeb3 = new Promise(((resolve, reject) => {
  // Check for injected web3 (mist/metamask)
  const web3js = window.web3;
  if (typeof web3js !== 'undefined') {
    const web3 = new Web3(web3js.currentProvider);
    resolve({
      web3() {
        return web3;
      },
    });
  } else {
    // web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545')) GANACHE FALLBACK
    reject(new Error('Unable to connect to Metamask'));
  }
}))
  .then(result => new Promise(((resolve, reject) => {
    // Retrieve network ID
    result.web3().eth.net.getId((err, networkId) => {
      if (err) {
        // If we can't find a networkId keep result the same and reject the promise
        reject(new Error('Unable to retrieve network ID'));
      } else {
        // Assign the networkId property to our result and resolve promise
        const returnValue = Object.assign({}, result, { networkId });
        resolve(returnValue);
      }
    });
  })))
  .then(result => new Promise(((resolve, reject) => {
    // Retrieve account
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
    // Retrieve balance for account
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
