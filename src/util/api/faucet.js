import callApi from './callApi'

export default {

  requestDrip: () => {
    const requestOptions = {
      url: '/user/faucet/drip',
      method: 'get',
    }

    return callApi(requestOptions)
  },
}
