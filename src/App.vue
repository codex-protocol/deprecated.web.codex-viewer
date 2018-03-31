<template>
  <div id="app">
    <title-viewer />
  </div>
</template>

<script>
import TitleViewer from './components/TitleViewer'

export default {
  name: 'App',
  components: {
    TitleViewer,
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
