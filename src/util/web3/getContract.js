import contract from 'truffle-contract'

let codexRecordJson
let codexRecordProxyJson
let codexCoinJson
let stakeContainerJson

/* eslint-disable global-require */
if (process.env.TARGET_ENV === 'production') {
  // codexRecordJson = require('@codex-protocol/ethereum-service/static/contracts/1/CodexRecord.json') // eslint-disable-line import/no-unresolved
  // codexRecordProxyJson = require('@codex-protocol/ethereum-service/static/contracts/1/CodexRecordProxy.json') // eslint-disable-line import/no-unresolved
  // codexCoinJson = require('@codex-protocol/ethereum-service/static/contracts/1/CodexCoin.json') // eslint-disable-line import/no-unresolved
} else if (process.env.TARGET_ENV === 'staging') {
  // codexRecordJson = require('@codex-protocol/ethereum-service/static/contracts/4/CodexRecord.json')
  // codexRecordProxyJson = require('@codex-protocol/ethereum-service/static/contracts/4/CodexRecordProxy.json')
  codexCoinJson = require('@codex-protocol/ethereum-service/static/contracts/4/CodexCoin.json')
  stakeContainerJson = require('@codex-protocol/ethereum-service/static/contracts/4/ERC900BasicStakeContainer.json')
} else {
  codexRecordJson = require('@codex-protocol/ethereum-service/static/contracts/5777/CodexRecord.json')
  codexRecordProxyJson = require('@codex-protocol/ethereum-service/static/contracts/5777/CodexRecordProxy.json')
  codexCoinJson = require('@codex-protocol/ethereum-service/static/contracts/5777/CodexCoin.json')
  stakeContainerJson = require('@codex-protocol/ethereum-service/static/contracts/5777/ERC900BasicStakeContainer.json')
}
/* eslint-enable */

const contracts = {
  codexRecord: null,
  codexCoin: null,
  stakeContainer: null,
}

const getContract = (contractProperty, json, address, provider) => {
  if (!contracts[contractProperty]) {
    const contractAbstraction = contract(json)
    contractAbstraction.setProvider(provider)
    contracts[contractProperty] = contractAbstraction.at(address)
  }

  return contracts[contractProperty]
}

const getCodexRecordContract = (web3) => {
  return getContract(
    'codexRecord',
    codexRecordJson,
    codexRecordProxyJson.address,
    web3.currentProvider
  )
}

const getCodexCoinContract = (web3) => {
  return getContract(
    'codexCoin',
    codexCoinJson,
    codexCoinJson.address,
    web3.currentProvider
  )
}

const getStakeContainerContract = (web3) => {
  return getContract(
    'stakeContainer',
    stakeContainerJson,
    stakeContainerJson.address,
    web3.currentProvider
  )
}

export {
  getCodexRecordContract,
  getCodexCoinContract,
  getStakeContainerContract,
}
