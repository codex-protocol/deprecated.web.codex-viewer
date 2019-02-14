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
          <h1>{{ headerText }}</h1>
          <p>{{ bodyText }}</p>

          <b-button
            size="sm"
            variant="link"
            class="pl-0 pr-0"
            v-b-modal.resendConfirmationEmailModal
          >
            {{ buttonText }}
          </b-button>

          <ResendConfirmationEmailModal :default-email="emailAddressToConfirm" />

          <b-button
            size="sm"
            variant="link"
            class="pl-0 pr-0"
            @click.prevent="confirmEmail"
            v-if="showManualConfirm && emailAddressToConfirm"
          >
            Confirm email
          </b-button>
        </div>

      </div>
      <div class="col-12 col-md-6 secondary">
        <div class="login-art"><img src="../assets/images/login-art.png" v-party-mode-activator /></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import config from '../util/config'
import EmailConfirmation from '../util/api/emailConfirmation'

import ResendConfirmationEmailModal from '../components/modals/ResendConfirmationEmailModal'

export default {

  components: {
    ResendConfirmationEmailModal,
  },

  data() {
    return {
      headerText: 'Confirm Your Email Address',
      buttonText: 'Didn\'t receive a confirmation email?',
      bodyText: 'Please check your email for a confirmation link from Codex Protocol. Once your email is confirmed, you\'ll automatically be logged into the Codex Registry.',
      showManualConfirm: config.showManualConfirm,
    }
  },

  computed: {
    ...mapState('app', ['apiErrorCode', 'emailAddressToConfirm']),
  },

  mounted() {
    if (this.apiErrorCode) {
      this.buttonText = 'Resend Confirmation Email?'
      this.headerText = 'Could Not Confirm Your Email Address'
      this.bodyText = 'There was an error while confirming your email address.'
    }
  },

  methods: {
    confirmEmail() {
      EmailConfirmation.confirm(this.emailAddressToConfirm)
        .then(() => {
          this.$router.replace('/')
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

.login-art img
  width: 100%
  margin-top: 3rem

</style>
