import axios from 'axios'
import BigNumber from 'bignumber.js'

// If a token is present on page load, then add it to all future API requests
let token = window.localStorage.getItem('authToken')
if (token) {
  axios.defaults.headers.common.Authorization = token
}

const initialState = () => {
  return {
    token: token || null,
    balance: new BigNumber(0),
    contractApproved: false,
  }
}

const getters = {
  isAuthenticated: (currentState) => {
    return !!currentState.token
  },
}

const actions = {
  sendAuthRequest({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      axios.post('auth-token', payload).then((response) => {
        const { result, error } = response.data
        if (error) {
          console.log(error)
          commit('clearUserState')
          reject(error)
        } else {
          dispatch('updateUserState', result.token)
          resolve()
        }
      }).catch((error) => {
        console.log(error)
        commit('clearUserState')
        reject(error)
      })
    })
  },

  updateUserState({ commit, dispatch, rootState }, authToken) {
    const { web3 } = rootState
    const tokenContract = web3.tokenContractInstance()
    const registryContract = web3.titleContractInstance()

    dispatch('getLatestBalance')

    tokenContract.allowance(web3.account, registryContract.address).then((allowance) => {
      commit('updateApprovalStatus', allowance)
    })

    if (authToken) {
      commit('setAuthToken', authToken)
    }
  },

  getLatestBalance({ commit, rootState }) {
    const { web3 } = rootState
    const tokenContract = web3.tokenContractInstance()

    tokenContract.balanceOf(web3.account).then((balance) => {
      commit('updateBalance', balance)
    })
  },

  logout({ commit }, router) {
    commit('clearUserState')

    router.replace('/login')
  },
}

const mutations = {
  setAuthToken(currentState, authToken) {
    console.log('setAuthToken mutation being executed', authToken)

    currentState.token = authToken
    axios.defaults.headers.common.Authorization = authToken

    window.localStorage.setItem('authToken', authToken)
  },

  clearUserState(currentState) {
    console.log('clearUserState mutation being executed')

    token = null
    delete axios.defaults.headers.common.Authorization
    window.localStorage.removeItem('authToken')

    // Reset state to its initial values
    const originalState = initialState()
    Object.keys(originalState).forEach((key) => {
      currentState[key] = originalState[key]
    })
  },

  updateBalance(currentState, newBalance) {
    console.log('updateBalance mutation being executed')

    currentState.balance = newBalance
  },

  updateApprovalStatus(currentState, allowance) {
    console.log('updateApprovalStatus mutation being executed')

    // The approval exposed in the UI is not a binary operation, but it does
    //  approve the contract's allowance to a high value (2^255).
    // Here we check to see if it's greater than 1 token, and if so assume that
    //  approval has taken place.
    // If somehow the user has used so many tokens that their allowance is now low,
    //  they'll need to re-approve the contract for more.
    currentState.contractApproved = allowance.greaterThan(new BigNumber('10e18'))
  },
}

export default {
  state: initialState(),
  getters,
  actions,
  mutations,
}
