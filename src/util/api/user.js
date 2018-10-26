import callApi from './callApi'

export default {
  getUser: () => {
    const requestOptions = {
      method: 'get',
      url: '/user',
    }

    return callApi(requestOptions)
  },

  getAuthTokenFromSignedData: (data) => {
    const requestOptions = {
      method: 'post',
      url: '/auth-token',
      data,
    }

    return callApi(requestOptions)

    // return axios(requestOptions)
    //   .then((response) => {
    //     const { result } = response.data

    //     commit('SET_AUTH_STATE', {
    //       authToken: result.token,
    //     })

    //     commit('SET_USER', {
    //       user: result.user,
    //     })

    //     return dispatch('UPDATE_CONTRACT_STATE')
    //   })
    //   .catch((error) => {
    //     EventBus.$emit('toast:error', `Could not log in: ${error.message}`)
    //     Raven.captureException(error)
    //     commit('CLEAR_USER_STATE')
    //   })
  },
}
