import Networks from '../../util/constants/networks'
import registerWeb3 from '../../util/web3/registerWeb3'
import pollWeb3 from '../../util/web3/pollWeb3'
import getContract from '../../util/web3/getContract'

const state = {
  instance: null,
  network: null,
  account: null,
  balance: null,
  error: null,
  contractInstance: null,
  useMockData: window.localStorage.getItem('useMockData') === 'true'
    || (typeof window.localStorage.getItem('useMockData') !== 'string' && true),
}

const getters = {
}

const actions = {
  registerWeb3({ commit }) {
    registerWeb3.then((result) => {
      console.log('committing result to registerWeb3Instance mutation')
      commit('registerWeb3Instance', result)
    }).catch((e) => {
      console.log('error in action registerWeb3', e)
    })
  },
  pollWeb3({ commit }, payload) {
    console.log('pollWeb3 action being executed')
    commit('pollWeb3Instance', payload)
  },
  getContract({ commit }) {
    getContract.then((result) => {
      commit('getContractInstance', result)
    }).catch((e) => {
      console.log('error in action getContractInstance', e)
    })
  },
  toggleMockData(context) {
    localStorage.setItem('useMockData', !context.state.useMockData)
    context.commit('setMockData', !context.state.useMockData)
  },
}

const mutations = {
  registerWeb3Instance(currentState, payload) {
    console.log('registerWeb3instance mutation being executed', payload)

    currentState.account = payload.account
    currentState.network = Networks[payload.networkId]
    currentState.balance = parseInt(payload.balance, 10)
    currentState.instance = payload.web3

    pollWeb3()
  },

  pollWeb3Instance(currentState, payload) {
    console.log('pollWeb3Instance mutation being executed', payload)
    currentState.account = payload.account
    currentState.balance = payload.balance
  },

  getContractInstance(currentState, payload) {
    console.log('getContractInstance mutation being executed', payload)
    currentState.contractInstance = payload
  },

  setMockData(currentState, useMockData) {
    console.log('setMockData mutation being executed', useMockData)
    currentState.useMockData = useMockData
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
