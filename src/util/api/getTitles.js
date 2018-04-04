import config from './config'

const getTitles = (userAddress, authToken) => fetch(`${config.apiUrl}/user/titles`, {
  method: 'GET',
  headers: {
    'content-type': 'application/json',
    authorization: authToken,
  },
}).then(response => response.json())

export default getTitles
