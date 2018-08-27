import axios from 'axios'
import Raven from 'raven-js'

export default {
  updateOAuth2Clients({ commit }) {

    const requestOptions = {
      url: '/oauth2/clients',
      method: 'get',
    }

    return axios(requestOptions)
      .then((response) => {
        commit('setOAuth2Clients', response.data.result)
      })
      .catch((error) => {
        Raven.captureException(error)
      })
  },
}
