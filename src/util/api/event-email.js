import callApi from './callApi'

export default {
  getEventEmails: () => {
    const requestOptions = {
      method: 'get',
      url: '/event-emails',
    }

    return callApi(requestOptions)
  },
}
