<template>
  <div id="app">
    <div v-if="authToken">
      <!-- <app-side-bar /> -->
      <div class="container">
        <router-view />
        <create-title-modal />
        <app-footer />
      </div>
    </div>
    <div class="container" v-else>
      <router-view />
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import config from './util/config'

import AppHeader from './components/AppHeader'
import AppFooter from './components/AppFooter'
import AppSideBar from './components/AppSideBar'
import CreateTitleModal from './components/modals/CreateTitleModal'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    AppSideBar,
    CreateTitleModal,
  },
  created() {
    this.$store.dispatch('registerWeb3', this.$router)
    this.initializeApi()
  },
  mounted() {
    this.$store.dispatch('getContract')
  },
  computed: {
    authToken() {
      return this.$store.state.auth.token
    },
    titleId() {
      return this.$route.params.titleId
    },
  },
  methods: {
    initializeApi() {
      axios.defaults.baseURL = config.apiUrl
      axios.defaults.headers.common['Content-Type'] = 'application/json'

      // TODO: Need to test this by expiring the auth token on the server
      const authErrorHandler = (response) => {
        if ((response.error && response.error.status === 401) ||
        response.status === 401) {
          this.$store.commit('clearAuthToken')
        }

        return response
      }

      // TODO: If this route is authenticated we'll want to send the user
      //  to the /login endpoint
      axios.interceptors.response.use(
        authErrorHandler,
        authErrorHandler,
      )
    },
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

/* <input type="checkbox"> toggle */
/* CSS Toggle from:
   https://danklammer.com/articles/simple-css-toggle-switch/
*/
.toggle-checkbox {
  padding-left: 0;
}

.toggle-checkbox label {
  display: none;
}

.toggle-checkbox input {
  opacity: 1;
  z-index: 0;
  -webkit-appearance: none;
  appearance: none;
  width: 62px;
  height: 32px;
  display: inline-block;
  position: relative;
  border-radius: 50px;
  overflow: hidden;
  outline: none;
  border: none;
  cursor: pointer;
  background-color: #707070;
  transition: background-color ease 0.3s;
}

.toggle-checkbox input:before {
  content: "on off";
  display: block;
  position: absolute;
  z-index: 2;
  width: 28px;
  height: 28px;
  background: #fff;
  left: 2px;
  top: 2px;
  border-radius: 50%;
  font: 10px/28px Helvetica;
  text-transform: uppercase;
  font-weight: bold;
  text-indent: -22px;
  word-spacing: 37px;
  color: #fff;
  text-shadow: -1px -1px rgba(0,0,0,0.15);
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
  transition: all cubic-bezier(0.3, 1.5, 0.7, 1) 0.3s;
}

.toggle-checkbox input:checked {
  background-color: #32194C;
}

.toggle-checkbox input:checked:before {
  left: 32px;
}
</style>
