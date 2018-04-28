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
}

const getters = {
}

const actions = {
  registerWeb3({ commit }, router) {
    registerWeb3.then((result) => {
      console.log('committing result to registerWeb3Instance mutation')
      commit('registerWeb3Instance', { result, router })
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
}

const mutations = {
  registerWeb3Instance(currentState, payload) {
    const { result, router } = payload
    console.log('registerWeb3instance mutation being executed', result)


    currentState.account = result.account
    currentState.network = Networks[result.networkId]
    currentState.balance = parseInt(result.balance, 10)
    currentState.instance = result.web3

    pollWeb3(router)
  },

  pollWeb3Instance(currentState, payload) {
    console.log('pollWeb3Instance mutation being executed', payload)
    currentState.account = payload.account
    currentState.balance = payload.balance
  },

  getContractInstance(currentState, payload) {
    console.log('getContractInstance mutation being executed', payload)
    currentState.contractInstance = () => {
      return payload
    }
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
