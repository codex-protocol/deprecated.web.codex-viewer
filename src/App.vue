<template>
  <div id="app">
    <app-side-bar />
    <div class="container" v-if="authToken">
      <app-header />
      <router-view />
      <create-title-modal />
      <app-footer />
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
  beforeCreate() {
    this.$store.dispatch('registerWeb3')
  },
  created() {
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
          this.$store.dispatch('clearAuthToken')
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
</style>
