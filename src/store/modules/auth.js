import getAuthToken from '../../util/api/getAuthToken'

const state = {
  token: window.localStorage.getItem('authToken') || null,
}

const getters = {
  isAuthenticated: currentState => !!currentState.token,
}

const actions = {
  sendAuthRequest({ commit }, payload) {
    return new Promise((resolve, reject) => {
      getAuthToken(payload).then((response) => {
        if (response.error) {
          console.log(response.error)
          reject(response.error)
        } else {
          commit('setAuthToken', response.result.token)
          resolve()
        }
      })
    })
  },
}

const mutations = {
  setAuthToken(currentState, token) {
    console.log('setAuthToken mutation being executed', token)

    currentState.token = token

    window.localStorage.setItem('authToken', token)
  },
  clearAuthToken(currentState) {
    console.log('clearAuthToken mutation being executed')

    currentState.token = null

    window.localStorage.removeItem('authToken')
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
