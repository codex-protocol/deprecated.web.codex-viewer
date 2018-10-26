import Web3 from 'web3'
import debug from 'debug'
import contractsByNetwork from '@codex-protocol/ethereum-service/dist/contracts-by-network.json'

import config from '../../../util/config'
import { Web3Errors } from '../../../util/constants/web3'
import registerWeb3 from '../../../util/web3/registerWeb3'

const logger = debug('app:store:web3:actions')

export default {
  REGISTER_INFURA_PROVIDER({ commit, dispatch }) {
    logger('REGISTER_INFURA_PROVIDER action being executed')

    commit('SET_WEB3', {
      web3: new Web3(process.env.VUE_APP_ETHEREUM_RPC_URL),
    })

    return dispatch('REGISTER_ALL_CONTRACTS')
  },

  REGISTER({ commit, dispatch, state }, overrideWeb3) {
    logger('REGISTER action being executed')

    let hasWeb3Browser
    return registerWeb3(overrideWeb3)
      .then((result) => {
        commit('SET_INITIAL_STATE', { result })

        ;({ hasWeb3Browser } = result)

        return dispatch('REGISTER_ALL_CONTRACTS')
      })
      .then(() => {
        if (hasWeb3Browser && !state.isPolling) {
          commit('SET_IS_POLLING', { isPolling: true })
          dispatch('POLL_WEB3')
        }
      })
      .catch((error) => {
        commit('SET_ERROR', {
          message: 'Unable to register',
          error,

          // Most of these errors pertain to Web3 missing or on the wrong network
          //  so it's not helpful to push them to sentry
          ignoreInSentry: true,
        })
      })
  },

  REGISTER_ALL_CONTRACTS({ state, commit }) {
    const interfaces = contractsByNetwork[config.expectedNetworkId]

    const recordContract = new state.instance.eth.Contract(interfaces.CodexRecord.abi, interfaces.CodexRecord.address)
    commit('SET_CONTRACT', {
      propertyName: 'recordContract',
      contract: recordContract,
    })

    const tokenContract = new state.instance.eth.Contract(interfaces.CodexCoin.abi, interfaces.CodexCoin.address)
    commit('SET_CONTRACT', {
      propertyName: 'tokenContract',
      contract: tokenContract,
    })

    const stakeContract = new state.instance.eth.Contract(interfaces.CodexStakeContract.abi, interfaces.CodexStakeContract.address)
    commit('SET_CONTRACT', {
      propertyName: 'stakeContract',
      contract: stakeContract,
    })
  },

  POLL_WEB3({ commit, dispatch, state, rootGetters }) {
    if (state.instance) {
      state.instance.eth.getAccounts((error, accounts) => {
        if (error) {
          commit('SET_ERROR', {
            message: 'Error while polling',
            error: Web3Errors.Unknown,
            ignoreInSentry: true,
          })
        } else if (!accounts.length) {
          if (rootGetters['auth/isAuthenticated']) {
            dispatch('auth/LOGOUT_USER', null, { root: true })
          }

          commit('SET_ERROR', {
            message: 'MetaMask is locked',
            error: Web3Errors.Locked,
            ignoreInSentry: true,
          })
        } else if (state.account !== accounts[0]) {
          dispatch('auth/LOGOUT_USER', null, { root: true })

          commit('SET_POLL_RESULT', {
            account: accounts[0],
          })
        }
      })
    }

    window.setTimeout(() => {
      dispatch('POLL_WEB3')
    }, 1000)
  },
}
