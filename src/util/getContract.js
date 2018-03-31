import contract from 'truffle-contract'
import codexTitleJson from './constants/CodexTitle.json'

// TODO: Use $store.state.web3.instance instead of window.web3
const getContract = new Promise(((resolve, reject) => {
  if (window.web3) {
    const codexTitle = contract(codexTitleJson)
    codexTitle.setProvider(window.web3.currentProvider)
    resolve(codexTitle)
  } else {
    reject(new Error('Unable to connect to Metamask'))
  }
}))

export default getContract
