import debug from 'debug'
import Raven from 'raven-js'

import { Networks, Web3Errors } from '../../../util/constants/web3'

const logger = debug('app:store:web3:mutations')

export default {
  registerWeb3Instance(currentState, { result }) {
    logger('registerWeb3instance mutation being executed', result)

    currentState.network = Networks[result.networkId]

    // We call Object.freeze here to prevent any errors from being thrown when
    //  Vue walks over the object's properties to make them observable
    // If a new web3 instance is ever needed, a full page refresh has to occur
    currentState.instance = Object.freeze(result.web3)

    if (!result.accounts.length) {
      currentState.error = Web3Errors.Locked
    } else {
      currentState.account = result.accounts[0]
      currentState.error = Web3Errors.None
    }
  },

  // @NOTE: If MetaMask stops refreshing the page when the network changes
  //  we'll have to start polling for networkId in addition to account.
  // i.e., basically just dupe the registerWeb3 functionality into the polling mechanism.
  setPollResult(currentState, { account }) {
    logger('setPollResult mutation being executed', account)

    currentState.error = Web3Errors.None
    currentState.account = account
  },

  registerContractInstance(currentState, { propertyName, contractInstance }) {
    logger('registerContractInstance mutation being executed for contract', propertyName)

    currentState[propertyName] = Object.freeze(contractInstance)
  },

  setWeb3Error(currentState, { message, error }) {
    logger('setWeb3Error mutation being executed', message, error)
    Raven.captureException(error)

    currentState.error = error
    currentState.account = null
  },
}
