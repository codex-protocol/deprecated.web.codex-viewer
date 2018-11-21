<template>
  <div class="footer">
    <div class="links">
      <a href="https://www.codexprotocol.com/">Home</a>
      <a href="https://www.codexprotocol.com/Terms-of-Service.pdf">Terms of Use</a>
      <a href="https://www.codexprotocol.com/privacy-policy.html">Privacy Policy</a>
      <a href="https://dev.codexprotocol.com">Documentation</a>
      <b-link to="/contact">Contact Us</b-link>
    </div>
    <div class="links">
      <a href="https://codex-viewer.com">Mainnet</a>
      <a href="https://rinkeby.codex-viewer.com">Rinkeby</a>
      <a href="http://ropsten.codex-viewer.com">Ropsten</a>
      <b-link to="/test/oauth2-app" v-if="showTestApp">Test OAuth2 API</b-link>
    </div>
    <div class="icons">
      <a href="https://github.com/codex-protocol/">
        <IconBase iconName="gitHub" width="24" height="24" class="icon" />
      </a>
      <a href="https://twitter.com/codexprotocol">
        <IconBase iconName="twitter" width="24" height="24" class="icon" />
      </a>
      <a href="http://t.me/codexprotocol">
        <IconBase iconName="telegram" width="24" height="24" class="icon" />
      </a>
      <a href="https://medium.com/codexprotocol">
        <IconBase iconName="medium" width="24" height="24" class="icon" />
      </a>
    </div>
  </div>
</template>

<script>

import IconBase from '../icons/IconBase'

import config from '../../util/config'

export default {
  name: 'AppFooter',

  components: {
    IconBase,
  },

  data() {
    return {
      showTestApp: config.showTestApp && config.supportEmailAccounts,
    }
  },
}
</script>

<style lang="stylus" scoped>
@import "../../assets/variables.styl"

.footer
  display: flex
  padding: 1rem 0
  font-size: small
  align-items: center
  flex-direction: column

  @media screen and (min-width: $breakpoint-md)
    height: 8rem
    min-height: @height
    max-height: @height

  > div:not(:first-child)
    margin-top: 1rem

  .links
  .icons
    width: 100%
    display: flex
    justify-content: space-around

    a
      padding: 0 .5em
      color: $color-light

  .links
    flex-wrap: wrap
    max-width: 30rem

    a
      width: 100%
      text-align: center

      @media(min-width: $breakpoint-md)
        width: auto

  .icons
    max-width: 10rem

    a
      display: inline-block

</style>
