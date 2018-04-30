<template>
  <div id="app">
    <div v-if="authToken">
      <app-side-bar />
      <div class="container">
        <router-view />
        <create-title-modal />
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

import AppSideBar from './components/AppSideBar'
import CreateTitleModal from './components/modals/CreateTitleModal'

export default {
  name: 'App',
  components: {
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

<style lang="stylus">
@import "./assets/variables.styl"

body
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  background-color: $color-black
  color: $color-secondary

#app
  padding-top: 3em
  margin-bottom: 3em

// Buttons
.btn-secondary
  padding: 0.5em 2em
  font-weight: bold
  color: $color-primary
  background-color: $color-secondary

// CSS Checkbox toggle
// <input type="checkbox"> toggle
// https//danklammer.com/articles/simple-css-toggle-switch/
.toggle-checkbox
  padding-left: 0

  label
    display: none

  input
    opacity: 1
    z-index: 0
    -webkit-appearance: none
    appearance: none
    width: 62px
    height: 32px
    display: inline-block
    position: relative
    border-radius: 50px
    overflow: hidden
    outline: none
    border: none
    cursor: pointer
    background-color: #707070 // TODO: Update using our pallete
    transition: background-color ease 0.3s

    &:before
      content: "on off"
      display: block
      position: absolute
      z-index: 2
      width: 28px
      height: 28px
      background: color-white
      left: 2px
      top: 2px
      border-radius: 50%
      font: 10px/28px Helvetica
      text-transform: uppercase
      font-weight: bold
      text-indent: -22px
      word-spacing: 37px
      color: $color-white
      text-shadow: -1px -1px rgba(0,0,0,0.15)
      white-space: nowrap
      box-shadow: 0 1px 2px rgba(0,0,0,0.2)
      transition: all cubic-bezier(0.3, 1.5, 0.7, 1) 0.3s

    &:checked
      background-color: #32194C

      &:before
        left: 32px
// End CSS Checkbox toggle
</style>
