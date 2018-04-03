import config from './config'

const getTitle = titleId => fetch(`${config.apiUrl}/title/${titleId}`, {
  method: 'GET',
  headers: {
    'content-type': 'application/json',
  },
}).then(response => response.json())

export default getTitle
