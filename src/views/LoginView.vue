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
          <a :href="facebookLoginUrl" v-if="showFacebook">
            <IconBase iconName="facebook" width="48" height="48" />
          </a>
          <a :href="microsoftLoginUrl" v-if="showMicrosoft">
            <IconBase iconName="microsoft" width="48" height="48" />
          </a>
          <b-link
            @click="registerWalletProvider"
            :disabled="web3LoginDisabled"
          >
            <IconBase iconName="metaMask" width="48" height="48" />
          </b-link>
          <b-link
            @click="registerWalletProvider"
            :disabled="web3LoginDisabled"
          >
            <IconBase iconName="coinbaseWallet" width="48" height="48" />
          </b-link>
        </div>

        <b-alert
          show
          class="mt-5"
          variant="danger"
          v-if="errorMessage"
        >
          {{ errorMessage }}
        </b-alert>
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

import User from '../util/api/user'
import config from '../util/config'
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
      web3LoginDisabled: false,
      isMobile: is.mobile(),
      googleLoginUrl: `${config.apiUrl}/oauth2/login/google`,
      facebookLoginUrl: `${config.apiUrl}/oauth2/login/facebook`,
      microsoftLoginUrl: `${config.apiUrl}/oauth2/login/microsoft`,

      // Facebook and Microsoft support HTTPS for redirect_uri so we hide these in ropsten
      showFacebook: config.expectedNetworkName !== 'ropsten',
      showMicrosoft: config.expectedNetworkName !== 'ropsten',
    }
  },

  computed: {
    ...mapState('auth', ['apiError']),
    ...mapState('web3', ['providerAccount', 'instance', 'registrationError']),

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

    errorMessage() {
      switch (this.registrationError) {
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
    registerWalletProvider() {
      this.$store.dispatch('web3/REGISTER_WALLET_PROVIDER')
        .then(this.web3Login)
        .catch((registrationError) => {
          console.log(registrationError)
        })
    },

    loginWithMetaMask() {
      if (this.registrationError === Web3Errors.Unknown || this.registrationError === Web3Errors.Missing) {
        window.open('https://www.metamask.io', '_blank')
      } else {
        this.web3Login()
      }
    },

    loginWithCoinbase() {
      if (this.registrationError === Web3Errors.Unknown || this.registrationError === Web3Errors.Missing) {
        window.open('https://wallet.coinbase.com', '_blank')
      } else {
        this.web3Login()
      }
    },

    web3Login() {
      const personalMessageToSign = 'Please sign this message to authenticate with the Codex Registry.'
      const sendAsyncOptions = {
        method: 'personal_sign',
        params: [
          this.providerAccount,
          this.instance.utils.toHex(personalMessageToSign),
        ],
      }

      return this.instance.currentProvider.sendAsync(sendAsyncOptions, (error, result) => {
        // @TODO: Show a message to the user
        // result.error will be populated if the user rejects the signature prompt
        if (error || result.error) {
          logger(error || result.error)
          return
        }

        User.getAuthTokenFromSignedData({
          userAddress: this.providerAccount,
          signedData: result.result.substr(2),
        })
          .then((response) => {
            this.$store.commit('auth/SET_AUTH_STATE', {
              authToken: response.token,
            })

            this.$store.commit('auth/SET_USER', {
              user: response.user,
            })

            this.$store.commit('web3/SET_IS_POLLING', {
              isPolling: true,
            })

            this.$store.dispatch('web3/POLL_WEB3')

            return this.$store.dispatch('auth/UPDATE_CONTRACT_STATE')
          })
          .then(() => {
          // @TODO: This could probably be done in the background prior to login. I don't think this endpoint is authenticated
          //  In fact, I think we need to do this separately because we leverage this information for provenance (un-auth flow)
            return this.$store.dispatch('oauth2/FETCH_CLIENTS')
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

    &.disabled
      opacity: .5

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
