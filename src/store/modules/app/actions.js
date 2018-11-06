import axios from 'axios'
import debug from 'debug'

import router from '../../../router'

const logger = debug('app:store:app:actions')

export default {
  HANDLE_QUERY_PARAMS({ commit, rootState }) {
    logger('HANDLE_QUERY_PARAMS action being executed')

    const { query } = rootState.route

    // @TODO: Strip errors from here too
    const {
      email,
      authToken,
      pendingUserCode,
    } = query

    if (email) commit('SET_EMAIL_ADDRESS_TO_CONFIRM', email)
    if (pendingUserCode) commit('SET_PENDING_USER_CODE', pendingUserCode)

    // If there's a cached authToken in localstorage this will replace it with
    //  the one from the query string
    if (authToken) commit('auth/SET_AUTH_STATE', { authToken }, { root: true })

    const paramRemoved = !!(email || authToken || pendingUserCode)
    if (paramRemoved) {
      router.replace(rootState.route.name)
    }
  },

  FETCH_VERIFIED_USERS({ commit }) {
    logger('FETCH_VERIFIED_USERS action being executed')

    const requestOptions = {
      url: '/verified-users',
      method: 'get',
    }

    return axios(requestOptions)
      .then((response) => {
        commit('SET_VERIFIED_USERS', response.data.result)
      })
      .catch((error) => {
        logger('Error retrieving the Verified Users address map, ignoring.', error)
      })
  },
}
