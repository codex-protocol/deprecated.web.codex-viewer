import contract from 'truffle-contract'
import codexTitleJson from '../constants/CodexTitle.json'

// TODO: Use $store.state.web3.instance instead of window.web3
const getContract = new Promise(((resolve, reject) => {
  if (window.web3) {
    // TODO: we should read the ABI and address instead of the entire JSON file
    //  otherwise this will continue to get blown away every time we build the contract
    //  locally and copy
    const codexTitle = contract(codexTitleJson)
    codexTitle.setProvider(window.web3.currentProvider)
    resolve(codexTitle)
  } else {
    reject(new Error('Unable to connect to Metamask'))
  }
}))

export default getContract
