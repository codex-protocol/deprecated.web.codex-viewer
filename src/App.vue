<template>
  <div id="app">
    <div class="container" v-if="authToken">
      <app-header :showBack="titleId >= 0" />
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
import CreateTitleModal from './components/CreateTitleModal'
import AppHeader from './components/AppHeader'
import AppFooter from './components/AppFooter'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    CreateTitleModal,
  },
  beforeCreate() {
    this.$store.dispatch('registerWeb3')
  },
  mounted() {
    this.$store.dispatch('getContract')
  },
  computed: {
    authToken() {
      return this.$store.state.authToken
    },
    titleId() {
      return this.$route.params.titleId
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
