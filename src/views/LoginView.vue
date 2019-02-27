<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-md-6 primary">
        <div class="logo" v-party-mode-activator>
          <b-link to="/">
            <img src="../assets/logos/codex/gold.svg" />
          </b-link>
        </div>

        <div class="form-container" ref="form-container">

          <LoadingOverlay :show="isLoading" type="dark" size="large" />

          <h1>
            <template v-if="showFormType === 'login'">Sign In</template>
            <template v-if="showFormType === 'signup'">Sign Up</template>
          </h1>

          <p>
            Codex Viewer allows you to create Codex Records, securely storing
            your collection's provenance on the Ethereum blockchain.
            <small><a href="https://codexprotocol.com/">Learn more &raquo;</a></small>
          </p>

          <hr>

          <b-alert
            show
            class="mt-4 mb-4"
            variant="secondary"
            v-if="pendingUserMessage"
          >
            <!--
              @NOTE: using v-html here should be fine, since the only user-defined
              data is the email address... and the database verifies all email
              addresses when creating users

              even if someone could put some malicious text into an invited user's
              email field, nobody would ever actually receive an email with a link
              that would generate this page since the email would be invalid...
            -->
            <span v-html="pendingUserMessage"></span>
            <!-- add a "claim with a different email" link here if/when that flow is implemented -->
          </b-alert>

          <p>
            <b-alert
              variant="danger"
              v-html="errorMessage"
              :show="!!errorMessage"
            />

            <b-alert
              variant="danger"
              :show="formValidateErrors.length !== 0"
            >
              Please fix these error(s):
              <ul class="mb-0">
                <li v-for="(error, index) in formValidateErrors" :key="index">{{ error }}</li>
              </ul>
            </b-alert>
          </p>

          <b-form
            v-if="showFormType === 'login'"
            @submit.prevent="login('local')"
          >
            <b-form-group>
              <b-form-input
                required
                type="email"
                placeholder="Email"
                v-model="loginForm.email"
              />
            </b-form-group>
            <b-form-group>
              <b-form-input
                required
                type="password"
                placeholder="Password"
                v-model="loginForm.password"
              />
            </b-form-group>
            <div class="form-button-container">
              <b-link
                size="sm"
                variant="link"
                class="forgot-password-button"
                v-b-modal.forgotPasswordModal
              >
                Forgot Password?
              </b-link>
              <b-button
                type="submit"
                variant="primary"
                class="form-button"
              >
                Login
              </b-button>
            </div>
          </b-form>

          <b-form
            @submit.prevent="createUser()"
            v-if="showFormType === 'signup'"
          >
            <b-form-group>
              <b-form-input
                v-model="signupForm.name"
                placeholder="Name (Optional)"
              />
            </b-form-group>
            <b-form-group>
              <b-form-input
                required
                type="email"
                placeholder="Email (Required)"
                v-model="signupForm.email"
              />
            </b-form-group>
            <div class="password-fields-container">
              <b-form-input
                required
                type="password"
                placeholder="Password (4+ characters)"
                v-model="signupForm.password"
              />
              <b-form-input
                required
                type="password"
                placeholder="Confirm Password"
                v-model="signupForm.confirmPassword"
              />
            </div>
            <b-form-group label="I am...">
              <b-form-checkbox-group
                stacked
                v-model="signupForm.userRoleSurvey.answers"
                :options="signupForm.userRoleSurvey.options"
              />
            </b-form-group>
            <div class="form-button-container">
              <b-button
                type="submit"
                variant="primary"
                class="form-button"
              >
                Get Started Now
              </b-button>
            </div>
          </b-form>

          <div class="divider">
            <span></span>
            <span>
              <template v-if="showFormType === 'login'">or sign in with</template>
              <template v-if="showFormType === 'signup'">or sign up with</template>
            </span>
            <span></span>
          </div>

          <div class="social-icons">

            <!-- oauth2 login buttons -->
            <b-link
              :key="index"
              v-b-tooltip.hover
              :disabled="provider.isDisabled"
              :title="provider.name | titleCase"
              :href="getOAuth2LoginUrl(provider)"
              v-for="(provider, index) in oAuth2Providers"
            >
              <IconBase :iconName="provider.name" width="48" height="48" />
            </b-link>

            <!-- web3 login buttons -->
            <b-link
              title="MetaMask"
              v-b-tooltip.hover
              @click="login('web3', 'metaMask')"
            >
              <IconBase iconName="metaMask" width="48" height="48" />
            </b-link>
            <b-link
              v-b-tooltip.hover
              title="Coinbase Wallet"
              @click="login('web3', 'coinbaseWallet')"
            >
              <IconBase iconName="coinbaseWallet" width="48" height="48" />
            </b-link>
          </div>

          <hr>

          <!--
            @NOTE: the button below triggers a page reload on click, which is
            slightly inefficient but allows the url to stay in sync with what
            form type we're showing and since people probably aren't going to be
            switching forms too often, I think it's fine. if it becomes a
            problem, the click handler could be changed to
            @click="showFormType = 'signup'"
          -->
          <div class="switch-form-link" v-if="showFormType === 'login'">
            Need an account?
            <b-button
              size="sm"
              variant="link"
              @click="$router.replace({ path: '/signup' })"
            >
              Get started absolutely free!
            </b-button>
          </div>

          <!--
            @NOTE: the button below triggers a page reload on click, which is
            slightly inefficient but allows the url to stay in sync with what
            form type we're showing and since people probably aren't going to be
            switching forms too often, I think it's fine. if it becomes a
            problem, the click handler could be changed to
            @click="showFormType = 'login'"
          -->
          <div class="switch-form-link" v-if="showFormType === 'signup'">
            Already have an account?
            <b-button
              size="sm"
              variant="link"
              @click="$router.replace({ path: '/login' })"
            >
              Sign In &raquo;
            </b-button>
          </div>
        </div>

        <b-alert
          show
          class="mt-4"
          variant="primary"
        >
          <p>
            If you are already using Codex Viewer with a managed wallet (e.g.
            MetaMask or Coinbase Wallet), you must log in with that wallet to
            access your existing Codex Records.
          </p>
          <p class="mb-0">
            <strong>
              Logging in with a different method will create a new account that
              is not linked to your existing wallet address.
            </strong>
          </p>
        </b-alert>
      </div>
      <div class="col-12 col-md-6 secondary">
        <div class="login-art"><img src="../assets/images/login-art.png" v-party-mode-activator /></div>
      </div>
    </div>
    <ForgotPasswordModal />
  </div>
</template>

<script>
import axios from 'axios'
import debug from 'debug'
import { mapState } from 'vuex'

import config from '../util/config'
import PendingUser from '../util/api/pendingUser'
import { Web3Errors, Networks } from '../util/constants/web3'

import IconBase from '../components/icons/IconBase'
import LoadingOverlay from '../components/util/LoadingOverlay'
import ForgotPasswordModal from '../components/modals/ForgotPasswordModal'

const logger = debug('app:component:login-view')

export default {

  components: {
    IconBase,
    LoadingOverlay,
    ForgotPasswordModal,
  },

  data() {
    return {
      isLoading: false,
      walletProvider: null,

      showFormType: 'login',
      formSubmitError: null,
      formValidateErrors: [],

      loginForm: {
        email: null,
        password: null,
      },

      signupForm: {
        name: null,
        email: null,
        password: null,
        confirmPassword: null,
        userRoleSurvey: {
          answers: [],
          options: [
            { value: 'artist', text: 'An Artist / Creator' },
            { value: 'collector', text: 'A Collector' },
            { value: 'gallery', text: 'A Marketplace / Gallery' },
            { value: 'auction-house', text: 'An Auction House' },
            { value: 'appraiser', text: 'An Appraiser' },
            { value: 'crypto-enthusiast', text: 'Crypto Enthusiast' },
            { value: 'just-curious', text: 'Just Curious' },
          ],
        },
      },

      oAuth2Providers: [
        {
          name: 'google',
          isDisabled: false,
        },
        // facebook and microsoft only support https for redirect_uri so we
        //  disable these in ropsten
        {
          name: 'facebook',
          isDisabled: config.expectedNetworkName === 'ropsten',
        },
        {
          name: 'microsoft',
          isDisabled: config.expectedNetworkName === 'ropsten',
        },
      ],

      pendingUserStats: null,
    }
  },

  created() {

    if (this.$router.currentRoute.path === '/signup') {
      this.showFormType = 'signup'
    }

    if (this.pendingUserCode) {
      this.getPendingUserStats(this.pendingUserCode)
    }

  },

  computed: {
    ...mapState('auth', ['user']),
    ...mapState('web3', ['providerAccount', 'instance', 'registrationError']),
    ...mapState('app', ['apiErrorCode', 'pendingUserCode', 'postLoginDestination']),

    $formContainer() {
      return this.$refs['form-container']
    },

    loginQueryParams() {
      return {
        destination: this.postLoginDestination,
        pendingUserCode: this.pendingUserCode,
      }
    },

    errorMessage() {
      return this.web3ErrorMessage || this.apiErrorMessage || this.formSubmitError
    },

    apiErrorMessage() {
      // Even though we read the error message from the QS, we use a generic one as opposed to rendering
      //  arbitrary text from the query string. Later we'll deprecate the message param and just pivot
      //  based on error codes.
      return this.apiErrorCode
        ? 'We were unable to log you in to your account. Please try again later.'
        : null
    },

    web3ErrorMessage() {
      if (!this.registrationError) {
        return null
      }

      switch (this.registrationError.message) {
        case Web3Errors.Missing:
          return `You don't have a Web3 wallet installed. To install one, visit <a href="${this.walletProviderUrl}" target="_blank">${this.walletProviderUrl}</a>.`

        case Web3Errors.Locked:
          return 'Your Web3 account is locked. To sign in with Web3, open your Ethereum wallet and follow the instructions to unlock it.'

        case Web3Errors.WrongNetwork:
          return `You're on the wrong Ethereum network. The expected network is ${Networks[config.expectedNetworkId]}. To sign in with Web3, change the network in your wallet settings.`

        case Web3Errors.UserDeniedSignature:
          return 'In order to sign in with your Web3 account, use your wallet to sign the message that you are prompted with. This will not spend any gas.'

        case Web3Errors.AccountChanged:
          return 'In order to preserve your privacy, we logged you out of Codex Viewer because we detected a change in the Web3 wallet your\'re currently using.'

        default:
          return 'We were unable to log you in to your account. Please try again later.'
      }
    },

    walletProviderUrl() {
      switch (this.walletProvider) {
        case 'coinbaseWallet':
          return 'https://wallet.coinbase.com'

        default:
        case 'metaMask':
          return 'https://www.metamask.io'
      }
    },

    pendingUserMessage() {

      const { numApproved, numWhitelisted, email } = this.pendingUserStats || {}

      if (!email) {
        return null
      }

      // always show the "you have X records waiting to be claimed" message,
      //  even if they also have some whitelisted records, since this is the
      //  "most important" message to show and combining the two is kind of
      //  complicated
      if (numApproved > 0) {

        const [recordOrRecords, itOrThem] = numApproved > 1
          ? ['Records', 'them']
          : ['Record', 'it']

        return `
          You have ${numApproved} Codex ${recordOrRecords} waiting to be
          claimed. Sign up with the email <strong>${email}</strong> to claim
          ${itOrThem}!
        `
      }

      if (numWhitelisted > 0) {

        const [recordOrRecords, hasOrHave, itOrThem] = numWhitelisted > 1
          ? ['Records', 'have', 'them']
          : ['Record', 'has', 'it']

        return `
          ${numWhitelisted} Codex ${recordOrRecords} ${hasOrHave} been shared
          with you. Sign up with the email <strong>${email}</strong> to view
          ${itOrThem}!
        `
      }

      // this is a generic message that will show if this pending user has
      //  nothing available... which can only really happen if someone approves
      //  an unregistered email address, then they approve someone else before
      //  the invited user can click the link in thier email
      //
      // this message is a little missleading, but I suppose it's better than
      //  showing nothing
      return `
        Sign up with the email <strong>${email}</strong> to see what's waiting
        for you!
      `
    },
  },

  methods: {

    clearErrors() {
      this.formSubmitError = null
      this.formValidateErrors = []
      this.$store.commit('app/SET_API_ERROR_CODE', null)
      this.$store.commit('web3/SET_REGISTRATION_ERROR', null)
    },

    createUser() {

      this.clearErrors()

      if (!this.signupForm.email) {
        this.formValidateErrors.push('Email is required')
      }

      if (!this.signupForm.password) {
        this.formValidateErrors.push('Password is required')
      }

      if (this.signupForm.password !== this.signupForm.confirmPassword) {
        this.formValidateErrors.push('Passwords fields must match')
      }

      if (this.signupForm.password.length < 4) {
        this.formValidateErrors.push('Password must be longer than 4 characters')
      }

      if (this.formValidateErrors.length !== 0) {
        this.shakeForm()
        return null
      }

      this.isLoading = true

      const requestOptions = {
        url: '/users',
        method: 'post',
        data: Object.assign({}, this.signupForm, {
          pendingUserCode: this.pendingUserCode,
        }),
      }

      return axios(requestOptions)
        .then((response) => {
          const { result } = response.data

          // since the SET_AUTH_TOKEN_AND_CLEAR_QUERY_PARAMS mutation clears the
          //  saved "destination" query param, we need to save it here and pass
          //  it to afterSuccessfulLogin() below
          const destination = this.postLoginDestination

          if (result.authToken) {
            return this.$store.dispatch('auth/SET_AUTH_TOKEN_AND_CLEAR_QUERY_PARAMS', result.authToken)
              .then(() => {
                return this.$store.dispatch('auth/LOGIN_FROM_CACHED_TOKEN')
              })
              .then(() => {
                return this.afterSuccessfulLogin(destination)
              })
          }

          this.$store.commit('app/SET_EMAIL_ADDRESS_TO_CONFIRM', result.user.email, { root: true })

          return this.$router.push({ name: 'confirm-email' })

        })
        .catch((error) => {
          this.shakeForm()

          // @TODO: add better error handling
          this.formSubmitError = error.message || error.toString()
        })
        .finally(() => {
          this.isLoading = false
        })

    },

    login(type, provider) {

      this.clearErrors()

      // since the LOGIN_FROM_SIGNED_DATA mutation clears the saved
      //  "destination" query param, we need to save it here and pass it to
      //  afterSuccessfulLogin() below
      const destination = this.postLoginDestination

      let promise = null

      if (type === 'web3') {
        this.walletProvider = provider
        promise = this.$store.dispatch('auth/LOGIN_FROM_SIGNED_DATA')
      } else {
        promise = this.$store.dispatch('auth/LOGIN_FROM_EMAIL_AND_PASSWORD', Object.assign({}, this.loginQueryParams, {
          password: this.loginForm.password,
          email: this.loginForm.email,
        }))
      }

      this.isLoading = true

      return promise
        .then(() => {

          // if this user has not confirmed their email, the LOGIN_FROM_EMAIL_AND_PASSWORD
          //  action will redirect them to the confirm-email route and no user
          //  will be set
          if (!this.user) return null

          return this.afterSuccessfulLogin(destination)

        })
        .catch((error) => {
          this.shakeForm()

          // @NOTE: web3 login erros have their own weird vuex logic so no need
          //  to print the error again
          if (type !== 'web3') {
            this.loginForm.password = null
            this.formSubmitError = error.message || error.toString()
          }

        })
        .finally(() => {
          this.isLoading = false
        })

    },

    afterSuccessfulLogin(destination = this.loginQueryParams.destination) {

      console.log('destination', destination)

      // start fetching app & user data that is dependent on authentication
      //  (no need to block on these async actions)
      this.$store.dispatch('records/FETCH_USER_DATA')
      this.$store.dispatch('app/FETCH_ELIGIBLE_GIVEAWAY')

      // no need to worry about the global isLoading flag here since it is
      //  already set to true
      if (destination) {
        return this.$router.push({ path: destination })
      }

      return this.$router.push({ name: 'collection' })

    },

    shakeForm() {
      this.$formContainer.classList.add('is-shaking')
      // const duration = 2000 * getComputedStyle(this.$formContainer).animationDuration.replace(/^([\d\.]*).*/, '$1') || .15
      setTimeout(() => {
        this.$formContainer.classList.remove('is-shaking')
      }, 300)
    },

    getOAuth2LoginUrl(provider) {

      if (!this.oAuth2Providers.includes(provider)) {
        return null
      }

      const queryString = Object
        .keys(this.loginQueryParams)
        .filter((key) => {
          return !!this.loginQueryParams[key] // remove any empty values
        })
        .map((key) => {
          return `${key}=${encodeURIComponent(this.loginQueryParams[key])}`
        })
        .join('&')

      return `${config.apiUrl}/login/oauth2/${provider.name}?${queryString}`

    },

    getPendingUserStats(pendingUserCode) {
      PendingUser.getStats(pendingUserCode)
        .then((pendingUserStats) => {
          this.pendingUserStats = pendingUserStats
        })
        .catch((error) => {
          // do nothing, since this likely means the pending user code was
          //  invalid
          logger(error)
        })
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

.logo
  max-width: 128px
  margin: 2rem auto 1rem

.form-container
  padding: 2rem
  position: relative
  background-color: rgba($color-dark, .8)
  box-shadow: 0 0 .5rem rgba($color-dark, .2)

  h1
    font-weight: bold
    font-family: $font-family-serif

  .alert
    word-wrap: break-word

  .password-fields-container
    display: flex
    flex-direction: column
    justify-content: space-between

    >input
      width: 100%
      margin-bottom: 1rem

    @media screen and (min-width: $breakpoint-xl)
      flex-direction: row

      >input
        width: calc(50% - .5rem)

  .form-button-container
    display: flex
    align-items: flex-end
    flex-direction: column

    .form-button
      width: 100%

    .forgot-password-button
      padding: 0
      font-size: small
      margin-bottom: .25rem

  .divider
    display: flex
    margin: 1rem 0
    font-size: small
    font-weight: bold
    align-items: center

    span:nth-child(odd)
      flex-grow: 1
      border-bottom: 1px solid rgba(white, .1)

    span:nth-child(2)
      margin: 0 1rem
      line-height: 1.5rem

  .social-icons
    display: flex
    position: relative
    justify-content: space-around

    a
      width: 2rem
      height: @width
      display: inline-block
      min-width: 0 // see: https://stackoverflow.com/a/33811151/1696150

      @media screen and (min-width: $breakpoint-sm)
        width: 3rem
        height: @width

      svg
        width: 100%
        height: 100%

      &.disabled
      &[disabled]
        opacity: .5

        // disable hover state changes
        &:hover
          cursor: unset
          color: $color-primary

  .switch-form-link
  .signup-link
    font-weight: bold
    text-align: center

.login-art img
  width: 100%
  margin-top: 3rem

</style>
