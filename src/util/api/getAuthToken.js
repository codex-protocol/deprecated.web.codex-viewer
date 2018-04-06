import config from './config'

const getAuthToken = body => fetch(`${config.apiUrl}/auth-token`, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
  },
  body: JSON.stringify(body),
}).then(response => response.json())

export default getAuthToken
