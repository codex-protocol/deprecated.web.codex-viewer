// IMPORTANT: web3 injected by MetaMask is version 0.x.x instead of 1.x.x-beta.
//  Documentation here: https://github.com/ethereum/wiki/wiki/JavaScript-API

import { ExpectedNetworkId, Web3Errors } from '../../util/constants/web3'

const registerWeb3 = () => {
  return new Promise((resolve, reject) => {
    if (typeof window.web3 !== 'undefined') {
      resolve(new window.Web3(window.web3.currentProvider))
    } else {
      reject(Web3Errors.Unknown)
    }
  })
    .then((localWeb3) => {
      return new Promise((resolve, reject) => {
        localWeb3.version.getNetwork((error, networkId) => {
          if (error) {
            reject(Web3Errors.Unknown)
            return
          }

          if (networkId !== ExpectedNetworkId) {
            reject(Web3Errors.WrongNetwork)
            return
          }

          const returnValue = Object.assign({}, {
            web3: localWeb3,
            networkId,
          })
          resolve(returnValue)
        })
      })
    })
    .then((state) => {
      return new Promise((resolve, reject) => {
        state.web3.eth.getAccounts((error, accounts) => {
          if (error) {
            reject(Web3Errors.Unknown)
            return
          }

          const returnValue = Object.assign({}, state, { accounts })
          resolve(returnValue)
        })
      })
    })
}

export default registerWeb3
