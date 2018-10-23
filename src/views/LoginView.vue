<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-md-6 primary">
        <div class="logo">
          <b-link href="/" replace>
            <img src="../assets/logos/codex/gold.svg" />
          </b-link>
        </div>

        <h1>{{ title }}</h1>
        <div class="lead">{{ description }}</div>
        <p class="mt-5 mb-3">
          <b>Sign in below to get started</b>
        </p>

        <div class="icons mb-3">
          <a :href="googleLoginUrl">
            <IconBase iconName="google" width="48" height="48" />
          </a>
          <a :href="facebookLoginUrl">
            <IconBase iconName="facebook" width="48" height="48" />
          </a>
          <a :href="microsoftLoginUrl">
            <IconBase iconName="microsoft" width="48" height="48" />
          </a>
          <b-link
            :disabled="buttonDisabled"
            @click="loginWithMetaMask"
          >
            <IconBase iconName="metaMask" width="48" height="48" />
          </b-link>
          <b-link
            :disabled="buttonDisabled"
            @click="loginWithCoinbase"
          >
            <IconBase iconName="coinbaseWallet" width="48" height="48" />
          </b-link>
        </div>

        <p v-if="errorMessage">{{ errorMessage }}</p>
      </div>
      <div class="col-12 col-md-6 secondary">
        <div class="login-art"><img src="../assets/images/login-art.png" v-party-mode-activator /></div>
      </div>
    </div>
  </div>
</template>

<script>
import is from 'is_js'
import debug from 'debug'
import { mapState } from 'vuex'

import config from '../util/config'
import EventBus from '../util/eventBus'
import { Web3Errors, Networks } from '../util/constants/web3'

import IconBase from '../components/icons/IconBase'

const logger = debug('app:component:login-view')

export default {
  name: 'LoginView',

  components: {
    IconBase,
  },

  data() {
    return {
      isMobile: is.mobile(),
      googleLoginUrl: `${config.apiUrl}/oauth2/login/google`,
      facebookLoginUrl: `${config.apiUrl}/oauth2/login/facebook`,
      microsoftLoginUrl: `${config.apiUrl}/oauth2/login/microsoft`,
    }
  },

  created() {
    EventBus.$emit('events:view-login-page', this)
  },

  computed: {
    ...mapState('auth', ['apiError']),
    ...mapState('web3', ['account', 'instance', 'error']),

    title() {
      if (this.apiError) {
        return 'Error'
      }

      return 'Sign in'
    },

    description() {
      if (this.apiError) {
        return 'We were unable to log you in with your account. Try again later.'
      }

      return 'Codex Viewer allows you to create, view, and transfer Codex Records'
    },

    buttonMethod() {
      switch (this.error) {
        case Web3Errors.Unknown:
        case Web3Errors.Missing:
          return this.installWeb3

        default:
          return this.web3Login
      }
    },

    buttonDisabled() {
      switch (this.error) {
        case Web3Errors.Locked:
        case Web3Errors.WrongNetwork:
          return true

        default:
          return false
      }
    },

    errorMessage() {
      switch (this.error) {
        case Web3Errors.Locked:
          return 'Your Web3 account is locked. To sign in with Web3, open your Ethereum wallet and follow the instructions to unlock it.'

        case Web3Errors.WrongNetwork:
          return `You're on the wrong Ethereum network. The expected network is ${Networks[config.expectedNetworkId]}. To sign in with Web3, change the network in your wallet settings.`

        default:
          return null
      }
    },
  },

  methods: {
    loginWithMetaMask() {
      if (this.error === Web3Errors.Unknown || this.error === Web3Errors.Missing) {
        window.open('https://www.metamask.io', '_blank')
      } else {
        this.web3Login()
      }
    },

    loginWithCoinbase() {
      if (this.error === Web3Errors.Unknown || this.error === Web3Errors.Missing) {
        window.open('https://wallet.coinbase.com', '_blank')
      } else {
        this.web3Login()
      }
    },

    web3Login() {
      const personalMessageToSign = 'Please sign this message to authenticate with the Codex Registry.'

      EventBus.$emit('events:click-login-button', this)

      const sendAsyncOptions = {
        method: 'personal_sign',
        params: [
          this.account,
          this.instance.utils.toHex(personalMessageToSign),
        ],
      }

      this.instance.currentProvider.sendAsync(sendAsyncOptions, (error, result) => {

        // result.error will be populated if the user rejects the signature
        //  prompt
        if (error || result.error) {
          logger(error || result.error)
          return
        }

        EventBus.$emit('events:login', this)

        this.$store.dispatch('auth/SEND_AUTH_REQUEST', {
          userAddress: this.account,
          signedData: result.result.substr(2),
        })
          .then(() => {
            this.$router.replace({ name: 'collection' })
          })
      })
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

  .icons a
    margin: 0 1rem

    &:first-child
      margin-left: 0

  .logo
    max-width: 100px
    margin-bottom: 2.5rem
    margin-top: 2.5rem

  h1
    font-weight: bold
    font-family: $font-family-serif

  .login-art img
    width: 100%
    margin-top: 3rem

</style>
