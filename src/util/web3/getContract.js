import contract from 'truffle-contract'

let codexTitleJson
let tokenProxyJson

/* eslint-disable global-require */
if (process.env.NODE_ENV === 'production') {
  // codexTitleJson = require('@codex-protocol/ethereum-service/static/contracts-source/1/CodexTitle.json')
  // tokenProxyJson = require('@codex-protocol/ethereum-service/static/contracts/1/TokenProxy.json')
} else if (process.env.NODE_ENV === 'staging') {
  // codexTitleJson = require('@codex-protocol/ethereum-service/static/contracts-source/4/CodexTitle.json')
  tokenProxyJson = require('@codex-protocol/ethereum-service/static/contracts/4/TokenProxy.json')
} else {
  codexTitleJson = require('@codex-protocol/ethereum-service/static/contracts-source/5777/CodexTitle.json')
  tokenProxyJson = require('@codex-protocol/ethereum-service/static/contracts/5777/TokenProxy.json')
}
/* eslint-enable */

// TODO: Use $store.state.web3.instance instead of window.web3
const getContract = new Promise((resolve, reject) => {

  if (!window.web3) {
    reject(new Error('Unable to connect to Metamask'))
    return
  }

  const codexTitle = contract(codexTitleJson)

  codexTitle.setProvider(window.web3.currentProvider)

  resolve(codexTitle.at(tokenProxyJson.address))

})

export default getContract
