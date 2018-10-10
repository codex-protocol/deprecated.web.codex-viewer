<template>
  <div class="footer mt-3 mb-3">
    <div class="links mb-1">
      <a href="https://www.codexprotocol.com/">Home</a>
      <a href="https://www.codexprotocol.com/Terms-of-Service.pdf">Terms of Use</a>
      <a href="https://www.codexprotocol.com/privacy-policy.html">Privacy Policy</a>
      <a href="https://dev.codexprotocol.com">Documentation</a>
      <a href="mailto:support@codexprotocol.com">Contact Us</a>
    </div>
    <div class="links mb-3">
      <a href="https://codex-viewer.com">Mainnet</a>
      <a href="https://rinkeby.codex-viewer.com">Rinkeby</a>
      <a href="http://ropsten.codex-viewer.com">Ropsten</a>
      <b-link to="/test/oauth2-app" v-if="showTestApp">Test OAuth2 API</b-link>
    </div>
    <div class="icons">
      <a href="https://github.com/codex-protocol/">
        <icon-base iconName="github" width="24" height="24" class="icon">
          <icon-github />
        </icon-base>
      </a>
      <a href="https://twitter.com/codexprotocol">
        <icon-base iconName="twitter" width="24" height="24" class="icon">
          <icon-twitter />
        </icon-base>
      </a>
      <a href="http://t.me/codexprotocol">
        <icon-base iconName="telegram" width="24" height="24" class="icon">
          <icon-telegram />
        </icon-base>
      </a>
      <a href="https://medium.com/codexprotocol">
        <icon-base iconName="medium" width="24" height="24" class="icon">
          <icon-medium />
        </icon-base>
      </a>
    </div>
  </div>
</template>

<script>

import IconBase from '../icons/IconBase'
import IconGithub from '../icons/IconGithub'
import IconTwitter from '../icons/IconTwitter'
import IconTelegram from '../icons/IconTelegram'
import IconMedium from '../icons/IconMedium'

import config from '../../util/config'

export default {
  name: 'AppFooter',
  components: {
    IconBase,
    IconGithub,
    IconTwitter,
    IconTelegram,
    IconMedium,
  },
  data() {
    return {
      showTestApp: config.showTestApp,
      showBugBountyInfo: config.showBugBountyMarketingCard,
    }
  },
}
</script>

<style lang="stylus" scoped>
@import "../../assets/variables.styl"

.footer
  display: flex
  align-items: center
  flex-direction: column
  font-size: 1rem

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
      font-size: .8em
      text-align: center
      width: 100%

      @media(min-width: $breakpoint-md)
        width: auto

  .icons
    max-width: 10rem

    a
      display: inline-block

</style>
