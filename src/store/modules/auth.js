import axios from 'axios'
import BigNumber from 'bignumber.js'

const token = window.localStorage.getItem('authToken')

// If a token is present on page load, then add it to all future API requests
if (token) {
  axios.defaults.headers.common.Authorization = token
}

const state = {
  token: token || null,
  balance: new BigNumber(0),
}

const getters = {
  isAuthenticated: (currentState) => {
    return !!currentState.token
  },
}

const actions = {
  sendAuthRequest({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.post('auth-token', payload).then((response) => {
        const { result, error } = response.data
        if (error) {
          console.log(error)
          commit('clearAuthToken')
          reject(error)
        } else {
          commit('setAuthToken', result.token)
          resolve()
        }
      }).catch((error) => {
        console.log(error)
        commit('clearAuthToken')
        reject(error)
      })
    })
  },
  logout({ commit }, router) {
    commit('clearAuthToken')

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

  clearAuthToken(currentState) {
    console.log('clearAuthToken mutation being executed')

    currentState.token = null
    delete axios.defaults.headers.common.Authorization

    window.localStorage.removeItem('authToken')
  },

  updateBalance(currentState, newBalance) {
    console.log('updateBalance mutation being executed')

    currentState.balance = newBalance
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
