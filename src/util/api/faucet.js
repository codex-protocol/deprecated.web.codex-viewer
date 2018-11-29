import callApi from './callApi'

export default {

  requestDrip: () => {
    const requestOptions = {
      url: '/user/faucet/drip',
      method: 'get',
    }

    return callApi(requestOptions)
  },

  purchaseCODX: (source) => {

    const requestOptions = {
      method: 'post',
      url: '/user/faucet/purchase',
      data: {
        source,
      },
    }

    return callApi(requestOptions)
  },
}
