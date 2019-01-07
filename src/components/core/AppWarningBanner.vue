<template>
  <div class="banner">
    You're currently on the {{ network }} Testnet. This is for testing purposes only. To use Codex Protocol, visit <a href="https://codex-viewer.com">codex-viewer.com</a>.
  </div>
</template>

<script>
import config from '../../util/config'

export default {
  computed: {
    network() {
      // Title case
      return config.expectedNetworkName.charAt(0).toUpperCase() + config.expectedNetworkName.substr(1)
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../../assets/variables.styl"

  .banner
    padding: 1.5rem
    background-color: $color-warning
    color: $color-dark
    width: 100%
    font-weight: 600
    text-align: center

    a
      color: $color-dark
      text-decoration: underline
</style>
