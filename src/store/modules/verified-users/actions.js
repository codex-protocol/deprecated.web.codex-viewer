import axios from 'axios'
import debug from 'debug'

const logger = debug('app:store:verified-users:actions')

export default {
  FETCH_ADDRESS_NAME_MAP({ commit }) {
    logger('FETCH_ADDRESS_NAME_MAP action being executed')

    const requestOptions = {
      url: '/verified-users',
      method: 'get',
    }

    return axios(requestOptions)
      .then((response) => {
        commit('SET_ADDRESS_NAME_MAP', response.data.result)
      })
  },
}
