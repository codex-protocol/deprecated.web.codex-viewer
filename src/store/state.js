import mockTitlesArray from '../util/constants/mockTitles'

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
  titles: mockTitlesArray,
}

export default state
