import config from './config'

const getTitle = (titleId, authToken) => fetch(`${config.apiUrl}/title/${titleId}?include=provenance`, {
  method: 'GET',
  headers: {
    'content-type': 'application/json',
    authorization: authToken,
  },
}).then(response => response.json())

export default getTitle
