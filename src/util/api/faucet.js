import callApi from './callApi'

export default {
  getDripFromFaucet: () => {
    const requestOptions = {
      url: '/user/faucet/drip',
      method: 'get',
    }

    return callApi(requestOptions)
  },
}
