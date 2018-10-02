<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-md-6 primary">
        <div class="logo">
          <b-link href="/" replace>
            <img src="../assets/logos/codex/gold.svg" />
          </b-link>
        </div>
        <div v-if="isMobile">
          <h1 v-html="pageContent.title"></h1>
          <div class="lead" v-html="pageContent.description"></div>
          <div v-if="showCoinbaseWalletLink">
            <div class="mb-3">
              <a :href="oauthLoginUrl">
                <img src="../assets/images/google-signin@2x.png" width="200">
              </a>
            </div>
            <!-- <a href="https://wallet.coinbase.com/">
              <img src="../assets/images/get-coinbase-wallet@3x.png" width="150">
            </a> -->
            <b-button
              variant="outline-primary"
            >
              Get Coinbase Wallet
            </b-button>
          </div>
          <div v-else>
            <a :href="oauthLoginUrl">
              <img src="../assets/images/google-signin@2x.png" width="200">
            </a>
            <b-button
              v-if="buttonTitle"
              variant="outline-primary"
              @click="buttonMethod"
            >
              {{ buttonTitle }}
            </b-button>
          </div>
        </div>
        <div v-else>
          <h1>Login</h1>
          <div class="lead">Login to create, view &amp; transfer Codex Records</div>
          <a :href="oauthLoginUrl" class="mr-4">
            <img src="../assets/images/google-signin@2x.png" width="200">
          </a>
          <b-button
            v-if="buttonTitle"
            variant="outline-primary"
            @click="buttonMethod"
          >
            {{ buttonTitle }}
          </b-button>
          <p class="mt-3">You're on the wrong Ethereum network. Expected network is Ganache. Sign in with Google or change the network in your wallet settings.</p>
        </div>
        <LoginMarketingCard v-if="showLoginMarketingCard" />
      </div>
      <div class="col-12 col-md-6 secondary">
        <div class="login-art"><img src="../assets/images/login-art.png" /></div>
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

import LoginMarketingCard from '../components/LoginMarketingCard'

const logger = debug('app:component:login-view')

export default {
  name: 'LoginView',

  components: {
    LoginMarketingCard,
  },

  data() {
    return {
      buttonTitle: 'Login with Web3',
      buttonMethod: this.web3Login,

      // @NOTE: Disabled for now, but we'll leave the component around for
      //  marketing purposes later
      showLoginMarketingCard: false,
      isMobile: is.mobile(),
      oauthLoginUrl: `${config.apiUrl}/oauth2/login/google`,
    }
  },

  created() {
    EventBus.$emit('events:viewer:view-login-page', this)
  },

  computed: {
    ...mapState('auth', ['authError']),
    ...mapState('web3', ['account', 'instance', 'error']),

    pageContent() {
      if (this.authError) {
        return this.handleAuthError(this.authError)
      }

      if (this.error) {
        return this.handleWeb3Error(this.error)
      }

      this.setButton('Login with Web3', this.web3Login)

      return {
        title: 'Login',
        description: 'Login to create, view, &amp; transfer Codex Records',
      }
    },

    showCoinbaseWalletLink() {
      return this.isMobile && this.error === Web3Errors.Missing
    },
  },

  methods: {
    installMetamask() {
      window.open('https://www.metamask.io', '_blank')
      this.setButton('MetaMask has been installed', this.checkMetamask)
      EventBus.$emit('events:click-install-metamask', this)
    },

    checkMetamask() {
      EventBus.$emit('events:click-check-metamask', this)
      window.location.reload(true)
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

    setButton(title, method) {
      this.buttonTitle = title
      this.buttonMethod = method
    },

    handleAuthError(error) {
      this.setButton()

      return {
        title: 'There was a problem logging in',
        description: error.message
          || 'We were unable to log you in with your Google account. Try again later.',
      }
    },

    handleWeb3Error(error) {
      let title
      let description

      switch (error) {
        case Web3Errors.Locked:
          title = 'Your account is locked'
          description = 'Your account is locked. Open your Ethereum wallet and follow the instructions to unlock it'

          // Your Web3 account is locked. To login with Web3, open your Ethereum wallet and follow the instructions to unlock it.

          this.setButton()
          break

        case Web3Errors.Unknown:
          title = 'Let&rsquo;s get started'

          if (this.isMobile) {
            description = '<p>Use a DApp browser, such as Coinbase Wallet.</p>'
            this.setButton()
          } else {
            description = '<p>To continue, install the MetaMask browser extension.</p>'
            description += '<p>The best place to store your Codex Records is a secure wallet like MetaMask. This will also be used as your login (no password needed)'
            this.setButton('Install MetaMask', this.installMetamask)
          }
          break

        case Web3Errors.WrongNetwork:
          title = 'Wrong Ethereum network'
          description = `You're on the wrong Ethereum network. Expected network is ${Networks[config.expectedNetworkId]}. Sign in with Google or change the network in your wallet settings.`
          this.setButton()
          break

        default:
        case Web3Errors.Missing:
          title = 'Let&rsquo;s get started'

          if (this.isMobile) {
            description = '<p>Use a DApp browser, such as Coinbase Wallet or Status.</p>'
            this.setButton()
          } else {
            description = '<p>To continue, install the MetaMask browser extension.</p>'
            description += '<p>The best place to store your Codex Records is a secure wallet like MetaMask. This will also be used as your login (no password needed)'
            this.setButton('Install MetaMask', this.installMetamask)
          }

          if (this.isMobile) {
            title = 'Login with Web3'
            description = '<p>To create, view, &amp; transfer Codex Records, sign in with Google or a Web3 browser such as Coinbase Wallet.</p>'
            this.setButton()
          } else {
            title = 'Login with Web3'
            description = '<p>To create, view, &amp; transfer Codex Records, sign in with Google or use a Web3 browser extension such as Metamask.</p>'
            this.setButton('Install MetaMask', this.installMetamask)
          }
          break
      }

      return {
        title,
        description,
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

  .container
    height: 100%
    display: flex
    align-items: center

  .primary
    margin-bottom: 2rem

    @media screen and (min-width: $breakpoint-md)
      margin-bottom: 0

  .secondary
    text-align: right
    align-self: center

  .logo
    max-width: 100px
    margin-bottom: 2.5rem
    margin-top: 2.5rem

  h1
    font-weight: bold
    font-family: $font-family-serif

  .lead
    margin-bottom: 3rem

  .login-art img
    width: 100%
    margin-top: 3rem

    @media screen and (max-width: $breakpoint-md)
      margin-top: 0

</style>
