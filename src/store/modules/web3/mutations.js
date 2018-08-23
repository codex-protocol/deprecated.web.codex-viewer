import debug from 'debug'
import Raven from 'raven-js'

import { Networks, Web3Errors } from '../../../util/constants/web3'
import pollWeb3 from '../../../util/web3/pollWeb3'

const logger = debug('app:store:web3:mutations')

export default {
  setIsLoaded(currentState, newIsLoaded) {
    currentState.isLoaded = newIsLoaded
  },
  registerWeb3Instance(currentState, payload) {
    const { result, router } = payload
    logger('registerWeb3instance mutation being executed', result)

    currentState.network = Networks[result.networkId]
    currentState.instance = result.web3

    if (!result.accounts.length) {
      currentState.error = Web3Errors.Locked
    } else {
      currentState.account = result.accounts[0]
      currentState.error = Web3Errors.None
    }

    pollWeb3(router)
  },

  pollWeb3Instance(currentState, payload) {
    logger('pollWeb3Instance mutation being executed', payload)

    // @NOTE: We don't change the network here because changing the network
    //  in MetaMask triggers a full page reload so registerWeb3Instance will
    //  fire again.

    currentState.error = Web3Errors.None
    currentState.account = payload.account
  },

  registerContractInstance(currentState, payload) {
    const {
      propertyName,
      contractInstance,
    } = payload

    logger('registerContractInstance mutation being executed for contract', propertyName)

    currentState[propertyName] = () => {
      return contractInstance
    }
  },

  setWeb3Error(currentState, payload) {
    const { message, error } = payload

    logger(message, error)
    Raven.captureException(error)

    currentState.error = error
    currentState.account = null
  },
}
