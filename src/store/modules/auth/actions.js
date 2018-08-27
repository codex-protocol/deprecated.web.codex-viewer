import axios from 'axios'
import Raven from 'raven-js'

import User from '../../../util/api/user'
import EventBus from '../../../util/eventBus'

export default {
  sendAuthRequest({ commit, dispatch }, data) {

    const requestOptions = {
      method: 'post',
      url: '/auth-token',
      data,
    }

    return axios(requestOptions)
      .then((response) => {
        const { result } = response.data
        dispatch('updateUserState', result.token, result.user)
      })
      .catch((error) => {
        EventBus.$emit('toast:error', `Could not log in: ${error.message}`)
        Raven.captureException(error)
        commit('clearUserState')
      })
  },

  updateUserState({ commit, dispatch, rootState }, newAuthToken, newUser) {

    const { web3 } = rootState
    const { account } = web3
    const tokenContract = web3.tokenContractInstance()
    const registryContract = web3.recordContractInstance()
    const stakeContract = web3.stakeContractInstance()

    dispatch('getTokenBalance', {
      account,
      tokenContract,
    })

    dispatch('getStakeBalances', {
      account,
      stakeContract,
    })

    dispatch('getApprovalStatus', {
      account,
      tokenContract,
      registryContractAddress: registryContract.address,
      stakeContractAddress: stakeContract.address,
    })

    if (newAuthToken) {
      commit('setAuthToken', newAuthToken)

      if (newUser) {
        commit('setUser', newUser)

      } else {
        User.getUser()
          .then((user) => {
            commit('setUser', user)
          })
          .catch((error) => {
            commit('clearUserState')
          })
      }

    }
  },

  getTokenBalance({ commit }, payload) {
    const {
      account,
      tokenContract,
    } = payload

    tokenContract.balanceOf(account).then((balance) => {
      commit('updateTokenBalance', balance)
    })
  },

  getStakeBalances({ commit }, payload) {
    const {
      account,
      stakeContract,
    } = payload

    stakeContract.getPersonalStakes(account).then((personalStakes) => {
      commit('updatePersonalStakes', personalStakes)
    })

    stakeContract.creditBalanceOf(account).then((balance) => {
      commit('updateCreditBalance', balance)
    })
  },

  getApprovalStatus({ commit }, payload) {
    const {
      account,
      tokenContract,
      registryContractAddress,
      stakeContractAddress,
    } = payload

    tokenContract.allowance(account, registryContractAddress).then((allowance) => {
      commit('updateApprovalStatus', {
        allowance,
        stateProperty: 'registryContractApproved',
      })
    })

    tokenContract.allowance(account, stakeContractAddress).then((allowance) => {
      commit('updateApprovalStatus', {
        allowance,
        stateProperty: 'stakeContractApproved',
      })
    })
  },

  handleFaucetRequest({ commit }, optimisticBalance) {
    commit('updateTokenBalance', optimisticBalance)
    commit('updateUser', {
      canRequestFaucetTokens: false,
      faucetLastRequestedAt: (new Date()).toISOString(),
    })
  },

  hideSetup({ commit }) {
    commit('hideSetup')
  },

  // This is currently used for handling some Metamask state changes
  //  Changing the route this navigates to will require updating how we handle
  //  the state changes.
  logout({ commit }, router) {
    commit('clearUserState')

    // if this is an unauthenticated route, clear their auth token (i.e. log
    //  the user out), but do not redirect them to the homepage
    if (router.currentRoute.meta && router.currentRoute.meta.allowUnauthenticatedUsers) {
      return
    }

    router.replace('/')
  },
}
