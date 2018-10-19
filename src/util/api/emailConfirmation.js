import callApi from './callApi'

export default {
  resend: (email) => {
    const requestOptions = {
      method: 'post',
      url: '/email-confirmation/resend',
      data: {
        email,
      },
    }

    return callApi(requestOptions)
  },

  // @NOTE: This is available in development environments only (enforced on the API)
  confirm: (email) => {
    const requestOptions = {
      method: 'post',
      url: '/email-confirmation',
      data: {
        email,
      },
    }

    return callApi(requestOptions)
  },
}
