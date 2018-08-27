import debug from 'debug'

import { Web3Errors } from '../../../util/constants/web3'
import registerWeb3 from '../../../util/web3/registerWeb3'
import {
  getCodexRecordContract,
  getCodexCoinContract,
  getStakeContract,
} from '../../../util/web3/getContract'

const logger = debug('app:store:web3:actions')

export default {
  registerWeb3({ commit, dispatch }, router) {
    logger('registerWeb3 action being executed')

    return registerWeb3()
      .then((result) => {
        commit('registerWeb3Instance', { result, router })
        return dispatch('registerAllContracts')
      })
      .then(() => {
        dispatch('pollWeb3')
      })
      .catch((error) => {
        commit('setWeb3Error', {
          message: 'Unable to register web3',
          error,
        })
      })
  },

  registerAllContracts({ dispatch }) {
    return Promise.all([
      dispatch('registerContract', {
        registrationFunction: getCodexRecordContract,
        propertyName: 'recordContract',
      }),
      dispatch('registerContract', {
        registrationFunction: getCodexCoinContract,
        propertyName: 'tokenContract',
      }),
      dispatch('registerContract', {
        registrationFunction: getStakeContract,
        propertyName: 'stakeContract',
      }),
    ])
  },

  registerContract({ commit, state }, { registrationFunction, propertyName }) {
    logger('registerContract action being executed for contract', registrationFunction.name)

    return registrationFunction(state.instance.currentProvider)
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

  pollWeb3({ commit, dispatch, state }) {
    // logger('pollWeb3 action being executed')

    if (state.instance) {
      state.instance.eth.getAccounts((error, accounts) => {
        if (error) {
          commit('setWeb3Error', {
            message: 'Error while polling web3',
            error: Web3Errors.Unknown,
          })
        } else if (!accounts.length) {
          commit('setWeb3Error', {
            message: 'MetaMask is locked',
            error: Web3Errors.Locked,
          })
        } else if (state.account !== accounts[0]) {
          dispatch('auth/logout', null, { root: true })

          commit('setPollResult', {
            account: accounts[0],
          })
        }
      })
    }

    window.setTimeout(() => {
      dispatch('pollWeb3')
    }, 1000)
  },
}
