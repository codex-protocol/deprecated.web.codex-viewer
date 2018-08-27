// IMPORTANT: web3 injected by MetaMask is version 0.x.x instead of 1.x.x-beta.
//  Documentation here: https://github.com/ethereum/wiki/wiki/JavaScript-API

import { ExpectedNetworkId, Web3Errors } from '../../util/constants/web3'

const registerWeb3 = () => {
  return new Promise((resolve, reject) => {
    const web3js = window.web3

    if (typeof web3js !== 'undefined') {
      const web3 = new window.Web3(web3js.currentProvider)

      // resolve({
      //   web3() {
      //     return web3
      //   },
      // })

      resolve(web3)

    } else {
      reject(Web3Errors.Unknown)
    }
  })
    .then((web3) => {
      return new Promise((resolve, reject) => {
        web3.version.getNetwork((error, networkId) => {
          if (error) {
            reject(Web3Errors.Unknown)
            return
          }

          if (networkId !== ExpectedNetworkId) {
            reject(Web3Errors.WrongNetwork)
            return
          }

          const returnValue = Object.assign({}, { web3, networkId })
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
