import Vue from 'vue';
import Vuex from 'vuex';
import state from './state';
import getWeb3 from '../util/getWeb3';
import getContract from '../util/getContract';

Vue.use(Vuex);
const store = new Vuex.Store({
  strict: true,
  state,
  mutations: {
    registerWeb3Instance(currentState, payload) {
      console.log('registerWeb3instance Mutation being executed', payload);
      const result = payload;
      const web3State = currentState.web3;

      web3State.web3Instance = result.web3;
      web3State.networkId = result.networkId;
      web3State.balance = parseInt(result.balance, 10);
      web3State.account = result.account;

      // eslint-disable-next-line
      currentState.web3 = web3State;
    },
    registerContractInstance(currentState, payload) {
      console.log('registerContractInstance Mutation being executed', payload);

      // eslint-disable-next-line
      currentState.contractInstance = () => payload;
    },
  },
  actions: {
    registerWeb3({ commit }) {
      console.log('registerWeb3 Action being executed');
      getWeb3.then((result) => {
        console.log('committing result to registerWeb3Instance mutation');
        commit('registerWeb3Instance', result);
      }).catch((e) => {
        console.log('error in action registerWeb3', e);
      });
    },
    registerContract({ commit }) {
      getContract.then((result) => {
        commit('registerContractInstance', result);
      }).catch((e) => {
        console.log('error in action registerContract', e);
      });
    },
  },
});

export default store;
