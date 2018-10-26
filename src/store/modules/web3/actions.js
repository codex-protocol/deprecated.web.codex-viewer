import Web3 from 'web3'
import debug from 'debug'
import contractsByNetwork from '@codex-protocol/ethereum-service/dist/contracts-by-network.json'

import config from '../../../util/config'
import { Web3Errors } from '../../../util/constants/web3'

const logger = debug('app:store:web3:actions')

const registerWalletProvider = () => {
  if (typeof window.web3 === 'undefined') {
    throw Web3Errors.Missing
  }

  const web3 = new Web3(window.web3.currentProvider)
  return web3.eth.net.getId()
    .then((networkId) => {
      const networkIdString = String(networkId)
      if (networkIdString !== config.expectedNetworkId) {
        throw Web3Errors.WrongNetwork
      }

      return web3.eth.getAccounts()
    })
    .then((accounts) => {
      if (!accounts.length) {
        throw Web3Errors.Locked
      }

      return {
        web3,
        account: accounts[0],
      }
    })
}

export default {
  REGISTER_INFURA_PROVIDER({ commit, dispatch }) {
    logger('REGISTER_INFURA_PROVIDER action being executed')

    commit('SET_WEB3', {
      web3: new Web3(process.env.VUE_APP_ETHEREUM_RPC_URL),
    })

    return dispatch('REGISTER_ALL_CONTRACTS')
  },

  REGISTER_WALLET_PROVIDER({ commit, dispatch, state }) {
    logger('REGISTER_WALLET_PROVIDER action being executed')

    return registerWalletProvider()
      .then(({ web3, account }) => {
        commit('SET_WEB3', {
          web3,
          account,
        })

        return dispatch('REGISTER_ALL_CONTRACTS')
      })
      .catch((error) => {
        commit('SET_REGISTRATION_ERROR', {
          error,
          ignoreInSentry: true,
        })
      })
  },

  POLL_WEB3({ commit, dispatch, state }) {
    if (state.instance && state.isPolling) {
      registerWalletProvider()
        .then(({ account }) => {
          if (state.providerAccount !== account) {
            throw Web3Errors.AccountChanged
          }
        })
        .catch((error) => {
          commit('SET_REGISTRATION_ERROR', {
            message: 'Error while polling',
            error,
            ignoreInSentry: true,
          })

          commit('SET_IS_POLLING', {
            isPolling: false,
          })

          dispatch('auth/LOGOUT_USER', null, { root: true })
        })
    }

    window.setTimeout(() => {
      dispatch('POLL_WEB3')
    }, 1000)
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
}
