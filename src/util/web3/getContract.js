import contract from 'truffle-contract'

let codexTitleJson
let tokenProxyJson

/* eslint-disable global-require */
if (process.env.NODE_ENV === 'production') {
  // TODO: change this back to 1 when staging config is done
  codexTitleJson = require('@codex-protocol/ethereum-service/static/contracts/4/CodexTitle.json')
  tokenProxyJson = require('@codex-protocol/ethereum-service/static/contracts/4/TokenProxy.json')
} else if (process.env.NODE_ENV === 'staging') {
  codexTitleJson = require('@codex-protocol/ethereum-service/static/contracts/4/CodexTitle.json')
  tokenProxyJson = require('@codex-protocol/ethereum-service/static/contracts/4/TokenProxy.json')
} else {
  codexTitleJson = require('@codex-protocol/ethereum-service/static/contracts/5777/CodexTitle.json')
  tokenProxyJson = require('@codex-protocol/ethereum-service/static/contracts/5777/TokenProxy.json')
}
/* eslint-enable */

const getContract = (web3) => {
  return new Promise((resolve, reject) => {

    const codexTitle = contract(codexTitleJson)

    codexTitle.setProvider(web3.currentProvider)

    resolve(codexTitle.at(tokenProxyJson.address))
  })
}

export default getContract
