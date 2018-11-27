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
  },

  update: (data) => {
    const requestOptions = {
      method: 'put',
      url: '/user',
      data,
    }

    return callApi(requestOptions)
  },

  buyTokens: (source) => {
    const requestOptions = {
      method: 'post',
      url: '/user/codex-coin',
      data: {
        source,
      },
    }
    return callApi(requestOptions)
  },
}
