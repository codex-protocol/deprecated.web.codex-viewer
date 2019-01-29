import axios from 'axios'
import debug from 'debug'

const logger = debug('app:call-api')

const callApi = (requestOptions, includeTotalCount = false) => {
  logger(`Calling ${requestOptions.method} ${requestOptions.url}`)

  return axios(requestOptions)
    .then((response) => {
      if (includeTotalCount) {
        return {
          result: response.data.result,
          totalCount: response.headers['x-total-count'],
        }
      }
      return response.data.result
    })
    .catch((error) => {
      logger(`Error when calling ${requestOptions.method} ${requestOptions.url}:`, error)

      throw error
    })
}

export default callApi
