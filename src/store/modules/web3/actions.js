import debug from 'debug'

import registerWeb3 from '../../../util/web3/registerWeb3'
import {
  getCodexRecordContract,
  getCodexCoinContract,
  getStakeContract,
} from '../../../util/web3/getContract'

const logger = debug('app:store:web3:actions')

export default {
  registerWeb3({ commit, dispatch, state }, router) {

    // prevent web3 & contracts from being loaded multiple times, since this is
    //  really just a bootstrapping method
    if (state.isLoaded) {
      return null
    }

    logger('registerWeb3 action being executed')

    return registerWeb3()
      .then((result) => {
        commit('registerWeb3Instance', { result, router })

        const web3 = result.web3()

        return Promise.all([
          dispatch('registerContract', {
            web3,
            registrationFunction: getCodexRecordContract,
            propertyName: 'recordContractInstance',
          }),
          dispatch('registerContract', {
            web3,
            registrationFunction: getCodexCoinContract,
            propertyName: 'tokenContractInstance',
          }),
          dispatch('registerContract', {
            web3,
            registrationFunction: getStakeContract,
            propertyName: 'stakeContractInstance',
          }),
        ])

      })
      .then(() => {
        commit('setIsLoaded', true)
      })
      .catch((error) => {
        commit('setWeb3Error', { message: 'Unable to register web3', error })
      })
  },

  pollWeb3({ commit }, payload) {
    logger('pollWeb3 action being executed')
    commit('pollWeb3Instance', payload)
  },

  registerContract({ commit }, payload) {
    const {
      web3,
      registrationFunction,
      propertyName,
    } = payload

    logger('registerContract action being executed for contract', registrationFunction.name)

    return registrationFunction(web3)
      .then((result) => {
        commit('registerContractInstance', {
          propertyName,
          contractInstance: result,
        })
      })
      .catch((error) => {
        commit('setWeb3Error', { message: 'Unable to register the contract', error })
      })
  },
}
