import config from './config'

const getTitles = userAddress => fetch(`${config.apiUrl}/user/${userAddress}/titles`, {
  method: 'GET',
  headers: {
    'content-type': 'application/json',
  },
}).then(response => response.json())

export default getTitles
