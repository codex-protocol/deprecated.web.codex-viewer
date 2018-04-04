<template>
  <div id="app">
    <title-viewer v-if="authToken" />
    <login v-else />
  </div>
</template>

<script>
import Login from './components/Login'
import TitleViewer from './components/TitleViewer'

export default {
  name: 'App',
  components: {
    Login,
    TitleViewer,
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
