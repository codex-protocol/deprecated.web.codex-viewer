import Web3 from 'web3'

import { ExpectedNetworkId, Web3Errors } from '../../util/constants/web3'

const registerWeb3 = () => {
  return new Promise((resolve, reject) => {
    // Avoid race conditions with web3 injection
    window.addEventListener('load', () => {
      if (typeof window.web3 !== 'undefined') {
        resolve({
          web3: new Web3(window.web3.currentProvider),
          hasWeb3Browser: true,
        })
      } else {
        const providerUrl = process.env.VUE_APP_PROVIDER
        const provider = new Web3.providers.HttpProvider(providerUrl)
        resolve({
          web3: new Web3(provider),
          hasWeb3Browser: false,
        })
      }
    })
  })
    .then(({ web3, hasWeb3Browser }) => {
      return web3.eth.net.getId()
        .then((networkId) => {
          const networkIdStr = String(networkId)
          if (networkIdStr !== ExpectedNetworkId) {
            throw Web3Errors.WrongNetwork
          }
          const returnValue = Object.assign({}, {
            web3,
            networkId,
            hasWeb3Browser,
          })
          // truffle-contract assumes web3@0.2.x which uses sendAsync.
          returnValue.web3.providers.HttpProvider.prototype.sendAsync = web3.providers.HttpProvider.prototype.send
          return returnValue
        })
    })
    .then((state) => {
      return state.web3.eth.getAccounts()
        .then((accounts) => {
          const returnValue = Object.assign({}, state, { accounts })
          return returnValue
        })
        .catch((error) => {
          return Web3Errors.Unknown
        })
    })
}

export default registerWeb3
