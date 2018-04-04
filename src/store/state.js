const state = {
  web3: {
    instance: null,
    network: null,
    account: null,
    balance: null,
    error: null,
  },
  contractInstance: null,
  useMockData: true,
  authToken: window.localStorage.getItem('authToken') || null,
}

export default state
