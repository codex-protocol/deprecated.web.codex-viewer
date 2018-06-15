import { getApi } from './helpers'

export default {
  getUser: () => {
    return getApi('/user')
      .then((response) => {
        return response.data.result
      })
  },
}
