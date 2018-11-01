import callApi from './callApi'

export default {
  getStats: (pendingUserCode) => {
    const requestOptions = {
      method: 'get',
      url: `/pending-users/${pendingUserCode}/stats`,
    }

    return callApi(requestOptions)
  },
}
