<template>
  <div class="banner" @click="onClick" v-if="showBanner">
    You're currently on the {{ network | titleCase }} Testnet. This is for testing purposes only. To use Codex Protocol, visit <a href="https://codex-viewer.com">codex-viewer.com</a>.
  </div>
</template>

<script>
import config from '../../util/config'

export default {
  data() {
    return {
      clickCount: 0,
      timeoutId: null,
      showBanner: true,
      network: config.expectedNetworkName,
    }
  },
  methods: {
    onClick() {

      this.clickCount += 1
      clearTimeout(this.timeoutId)

      if (this.clickCount === 10) {
        this.showBanner = false
      } else {
        this.timeoutId = setTimeout(() => {
          this.clickCount = 0
        }, 500)
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../../assets/variables.styl"

.banner
  width: 100%
  padding: .8rem
  font-size: small
  font-weight: 600
  color: $color-dark
  text-align: center
  background-color: $color-warning

  @media screen and (min-width: $breakpoint-sm)
    padding: 1.5rem
    font-size: 1rem

  a
    color: $color-dark
    text-decoration: underline

</style>
