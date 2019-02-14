<template>
  <b-modal
    ok-title="Send"
    @hidden="reset"
    @shown="focusModal"
    v-model="modalVisible"
    title="Forgot Password"
    id="forgotPasswordModal"
    cancel-variant="outline-primary"
    @ok="requestPasswordResetEmail(emailAddress)"
  >
    <p>
      If you've forgotten your password, enter your email address below and
      we'll send you a link you can use to reset your password.
    </p>
    <b-form @submit.prevent="requestPasswordResetEmail(emailAddress)">
      <b-form-group
        label-size="sm"
        label="Email Address"
        label-for="emailAddress"
      >
        <b-form-input
          required
          class="mb-4"
          id="emailAddress"
          v-model="emailAddress"
          ref="defaultModalFocus"
        />
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script>

import axios from 'axios'
import debug from 'debug'

import EventBus from '../../util/eventBus'

const logger = debug('app:component:forgot-password-modal')

export default {

  data() {
    return {
      emailAddress: null,
      modalVisible: false,
    }
  },

  methods: {
    reset() {
      this.emailAddress = null
    },

    requestPasswordResetEmail(email) {

      if (!email) {
        this.hide()
        return null
      }

      const requestOptions = {
        method: 'post',
        url: '/login/reset-password/send-email',
        data: {
          email,
        },
      }

      return axios(requestOptions)
        .then(() => {
          EventBus.$emit('events:forgot-password-request', email)
          EventBus.$emit('toast:success', 'Password reset email has been sent! Please check your email.', 5000)
          this.modalVisible = false
        })
        .catch((error) => {
          logger('Could not send password reset email:', error)
          EventBus.$emit('toast:error', 'Could not send password reset email. Please try again later.')
        })
    },

    focusModal() {
      if (this.$refs.defaultModalFocus) {
        this.$refs.defaultModalFocus.focus()
      }
    },
  },
}
</script>

<style lang="stylus" scoped>

</style>
