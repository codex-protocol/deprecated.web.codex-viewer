const getTitles = userAddress => fetch(`http://localhost:3001/address/${userAddress}/titles`, {
  method: 'GET',
  headers: {
    'content-type': 'application/json',
  },
}).then(response => response.json())

export default getTitles
