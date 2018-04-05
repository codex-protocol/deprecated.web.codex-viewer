import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth'
import web3 from './modules/web3'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  strict: debug,
  modules: {
    auth,
    web3,
  },
})
