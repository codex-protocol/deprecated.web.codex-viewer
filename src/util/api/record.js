import { getApi } from './helpers'

export default {
  getUserRecords: () => {
    return getApi('/user/records')
      .then((response) => {
        return response.data.result
      })
  },
}
