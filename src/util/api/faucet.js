import callApi from './callApi'

export default {

  requestDrip: () => {
    const requestOptions = {
      url: '/user/faucet/drip',
      method: 'get',
    }

    return callApi(requestOptions)
  },

  purchaseCODXPackage: (source, packageName) => {

    const requestOptions = {
      method: 'post',
      url: '/user/faucet/purchase',
      data: {
        source,
        packageName,
      },
    }

    return callApi(requestOptions)
  },
}
