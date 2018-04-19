import contract from 'truffle-contract'
import codexTitleJson from '@codex-protocol/ethereum-service/static/contracts-source/5777/CodexTitle.json'
import tokenProxyJson from '@codex-protocol/ethereum-service/static/contracts/5777/TokenProxy.json'

// TODO: Use $store.state.web3.instance instead of window.web3
// TODO: Use $store.state.web3.network hardcoding 5777 above...
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
