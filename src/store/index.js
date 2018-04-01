import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import Networks from '../util/constants/networks'
import mockTitlesArray from '../util/constants/mockTitles'
import registerWeb3 from '../util/registerWeb3'
import pollWeb3 from '../util/pollWeb3'
import getContract from '../util/getContract'
import getTitles from '../util/getTitles'

Vue.use(Vuex)
const store = new Vuex.Store({
  strict: true,
  state,
  mutations: {
    registerWeb3Instance(currentState, payload) {
      console.log('registerWeb3instance mutation being executed', payload)

      const result = payload
      const web3Copy = state.web3

      web3Copy.account = result.account
      web3Copy.network = Networks[result.networkId]
      web3Copy.balance = parseInt(result.balance, 10)
      web3Copy.instance = result.web3
      currentState.web3 = web3Copy

      pollWeb3()
    },
    pollWeb3Instance(currentState, payload) {
      console.log('pollWeb3Instance mutation being executed', payload)

      currentState.web3.account = payload.account
      currentState.web3.balance = payload.balance
    },
    getContractInstance(currentState, payload) {
      console.log('registerContractInstance mutation being executed', payload)

      currentState.contractInstance = () => payload
    },
    setTitles(currentState, titles) {
      console.log('setTitles mutation being executed', titles)

      currentState.titles = titles
    },
    setMockData(currentState, useMockData) {
      console.log('setMockData mutation being executed', useMockData)

      currentState.useMockData = useMockData
    },
  },
  actions: {
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
    getTitles({ commit }, account) {
      getTitles(account).then((response) => {
        if (response.error) {
          console.log('error in action getTitles', response.error)
        } else {
          commit('setTitles', response.result)
        }
      }).catch((e) => {
        console.log('error in action getTitles', e)
      })
    },
    toggleMockData(context) {
      const { commit } = context
      const useMockData = !state.useMockData

      if (useMockData) {
        commit('setMockData', true)
        commit('setTitles', mockTitlesArray)
      } else {
        commit('setMockData', false)
        context.dispatch('getTitles', context.state.web3.account)
      }
    },
  },
})

export default store
