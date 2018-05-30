import contract from 'truffle-contract'

let codexTitleJson
let codexTitleProxyJson
let codexTokenJson

/* eslint-disable global-require */
if (process.env.TARGET_ENV === 'production') {
  // codexTitleJson = require('@codex-protocol/ethereum-service/static/contracts/1/CodexTitle.json') // eslint-disable-line import/no-unresolved
  // codexTitleProxyJson = require('@codex-protocol/ethereum-service/static/contracts/1/CodexTitleProxy.json') // eslint-disable-line import/no-unresolved
  // codexTokenJson = require('@codex-protocol/ethereum-service/static/contracts/1/CodexToken.json') // eslint-disable-line import/no-unresolved
} else if (process.env.TARGET_ENV === 'staging') {
  codexTitleJson = require('@codex-protocol/ethereum-service/static/contracts/4/CodexTitle.json')
  codexTitleProxyJson = require('@codex-protocol/ethereum-service/static/contracts/4/CodexTitleProxy.json')
  codexTokenJson = require('@codex-protocol/ethereum-service/static/contracts/4/CodexToken.json')
} else {
  codexTitleJson = require('@codex-protocol/ethereum-service/static/contracts/5777/CodexTitle.json')
  codexTitleProxyJson = require('@codex-protocol/ethereum-service/static/contracts/5777/CodexTitleProxy.json')
  codexTokenJson = require('@codex-protocol/ethereum-service/static/contracts/5777/CodexToken.json')
}
/* eslint-enable */

// Exporting the address directly so it can be used without waiting for the promises to resolve
const codexRegistryContractAddress = codexTitleProxyJson.address

let codexTitle
const getCodexTitleContract = (web3) => {
  return new Promise((resolve, reject) => {

    if (!codexTitle) {
      const contractInstance = contract(codexTitleJson)
      contractInstance.setProvider(web3.currentProvider)
      codexTitle = contractInstance.at(codexTitleProxyJson.address)
    }

    resolve(codexTitle)
  })
}

let codexToken
const getCodexTokenContract = (web3) => {
  return new Promise((resolve, reject) => {

    if (!codexToken) {
      const contractInstance = contract(codexTokenJson)
      contractInstance.setProvider(web3.currentProvider)
      codexToken = contractInstance.at(codexTokenJson.address)
    }

    resolve(codexToken)
  })
}

export {
  getCodexTitleContract,
  getCodexTokenContract,
  codexRegistryContractAddress,
}
