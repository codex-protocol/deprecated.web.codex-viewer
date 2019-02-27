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
      url: '/login/savvy',
      method: 'post',
      data,
    }

    return callApi(requestOptions)
  },

  getAuthTokenFromEmailAndPassword: (data) => {
    const requestOptions = {
      url: '/login/local',
      method: 'post',
      data,
    }

    return callApi(requestOptions)
  },

  update: (data) => {

    if (Object.prototype.hasOwnProperty.call(data, 'isAdmin') && process.env.VUE_APP_TARGET_ENV !== 'development') {
      return Promise.reject(new Error('ಠ_ಠ'))
    }

    const requestOptions = {
      method: 'put',
      url: '/user',
      data,
    }

    return callApi(requestOptions)
  },

  updateReferralSurvey: (data) => {
    const requestOptions = {
      method: 'put',
      url: '/user/referral-survey',
      data,
    }

    return callApi(requestOptions)
  },
}
