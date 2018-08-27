import axios from 'axios'
import debug from 'debug'
import Raven from 'raven-js'

import router from '../../../router'
import User from '../../../util/api/user'
import EventBus from '../../../util/eventBus'

const logger = debug('app:store:auth:actions')

export default {
  INITIALIZE_AUTH({ dispatch, state, rootState }) {
    logger('INITIALIZE_AUTH action being executed')

    EventBus.$on('socket:codex-coin:transferred', () => {
      // @TODO: Optimize this, we only have to refresh the balance
      // dispatch('updateUserState')
    })

    EventBus.$on('socket:codex-coin:registry-contract-approved', () => {
      // @TODO: Optimize this, we only have to refresh the approval state
      // dispatch('updateUserState')
    })

    // @TODO: evaluate what happens when a bogus auth token is set in the
    //  route params
    if (rootState.route.query.authToken) {
      return dispatch('updateUserState', {
        authToken: rootState.route.query.authToken,
      })
        .then(() => {
          logger(rootState.route)

          const query = Object.assign({}, rootState.route.query)
          delete query.authToken

          return router.replace({
            name: rootState.route.meta.ifAuthenticatedRedirectTo || rootState.route.name,
            query,
          })
        })
    } else if (state.authToken) {
      // This means there's a cached auth token in local storage, so let's use it to pull user state
      return dispatch('updateUserState', {
        authToken: state.authToken,
      })
    }

    return null
  },

  // Dispatched after a user has signed a string via web3.
  // This calls the API to retrieve a JWT and the user object.
  sendAuthRequest({ commit, dispatch }, data) {
    logger('sendAuthRequest action being executed')

    const requestOptions = {
      method: 'post',
      url: '/auth-token',
      data,
    }

    return axios(requestOptions)
      .then((response) => {
        const { result } = response.data
        return dispatch('updateUserState', {
          newAuthToken: result.token,
          newUser: result.user,
        })
      })
      .catch((error) => {
        EventBus.$emit('toast:error', `Could not log in: ${error.message}`)
        Raven.captureException(error)
        commit('clearUserState')
      })
  },

  updateUserState({ commit, dispatch, rootState }, { authToken, user }) {
    logger('updateUserState action being executed')

    const {
      account,
      tokenContract,
      recordContract,
      stakeContract,
    } = rootState.web3

    return Promise.all([
      dispatch('getTokenBalance', {
        account,
        tokenContract,
      }),
      dispatch('getStakeBalances', {
        account,
        stakeContract,
      }),
      dispatch('getApprovalStatus', {
        account,
        tokenContract,
        recordContractAddress: recordContract.address,
        stakeContractAddress: stakeContract.address,
      }),
    ])
      .then(() => {
        if (authToken && user) {
          commit('SET_AUTH_STATE', {
            authToken,
            user,
          })
        } else if (authToken) {
          return User.getUser()
            .then((newUser) => {
              commit('SET_AUTH_STATE', {
                authToken,
                user: newUser,
              })
            })
        }

        return null
      })
      .catch((error) => {
        logger(error)
        commit('clearUserState')
      })
  },

  getTokenBalance({ commit }, { account, tokenContract }) {
    logger('getTokenBalance action being executed')

    return tokenContract.balanceOf(account).then((balance) => {
      commit('updateTokenBalance', balance)
    })
  },

  getStakeBalances({ commit }, { account, stakeContract }) {
    logger('getStakeBalances action being executed')

    return Promise.all([
      stakeContract.getPersonalStakes(account).then((personalStakes) => {
        commit('updatePersonalStakes', personalStakes)
      }),
      stakeContract.creditBalanceOf(account).then((balance) => {
        commit('updateCreditBalance', balance)
      }),
    ])
  },

  getApprovalStatus({ commit }, { account, tokenContract, recordContractAddress, stakeContractAddress }) {
    logger('getApprovalStatus action being executed')

    return Promise.all([
      tokenContract.allowance(account, recordContractAddress).then((allowance) => {
        commit('updateApprovalStatus', {
          allowance,
          stateProperty: 'registryContractApproved',
        })
      }),
      tokenContract.allowance(account, stakeContractAddress).then((allowance) => {
        commit('updateApprovalStatus', {
          allowance,
          stateProperty: 'stakeContractApproved',
        })
      }),
    ])
  },

  handleFaucetRequest({ commit }, optimisticBalance) {
    logger('handleFaucetRequest action being executed')

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
  logout({ commit }) {
    logger('logout action being executed')

    commit('clearUserState')

    // if this is an unauthenticated route, clear their auth token (i.e. log
    //  the user out), but do not redirect them to the homepage
    if (router.currentRoute.meta && router.currentRoute.meta.allowUnauthenticatedUsers) {
      return
    }

    router.replace('/')
  },
}
