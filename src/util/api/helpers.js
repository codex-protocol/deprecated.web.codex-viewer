import axios from 'axios'

// @TODO: This needs to be a global flag to toggle console logging
const debug = true

const getApi = (route) => {
  if (debug) {
    console.log(`Calling GET ${route}`)
  }

  return axios.get(route)
    .catch((error) => {
      console.error(`Error when calling GET ${route}:`, error)

      throw error
    })
}

const postApi = (route) => {
  if (debug) {
    console.log(`Calling POST ${route}`)
  }

  return axios.post(route)
    .catch((error) => {
      console.error(`Error when calling POST ${route}:`, error)

      throw error
    })
}

export {
  getApi,
  postApi,
}
