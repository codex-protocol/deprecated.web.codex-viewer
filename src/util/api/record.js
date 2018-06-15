import { getApi } from './helpers'

export default {
  getUserRecords: () => {
    return getApi('/user/records')
      .then((response) => {
        return response.data.result
      })
  },
  findRecord: (recordId) => {
    return getApi(`/record/${recordId}`)
      .then((response) => {
        return response.data.result
      })
  },
}
