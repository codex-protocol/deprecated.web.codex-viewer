<template>
  <b-modal
    ok-title="Send"
    @hidden="reset"
    @shown="focusModal"
    v-model="modalVisible"
    cancel-variant="outline-primary"
    id="resendConfirmationEmailModal"
    title="Resend Confirmation Email"
    @ok="resendConfirmationEmail(emailAddress)"
  >
    <b-form @submit.prevent="resendConfirmationEmail(emailAddress)">
      <b-form-group
        label-size="sm"
        label="Email Address"
        label-for="emailAddress"
      >
        <b-form-input
          required
          type="email"
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

import debug from 'debug'

import EventBus from '../../util/eventBus'
import EmailConfirmation from '../../util/api/emailConfirmation'

const logger = debug('app:component:resend-confirmation-email-modal')

export default {

  props: {
    defaultEmail: String,
  },

  data() {
    return {
      modalVisible: false,
      emailAddress: this.defaultEmail,
    }
  },

  methods: {
    reset() {
      this.emailAddress = this.defaultEmail
    },

    resendConfirmationEmail(emailAddress) {

      if (!emailAddress) {
        this.modalVisible = false
        return
      }

      EmailConfirmation.resend(emailAddress)
        .then(() => {
          EventBus.$emit('events:resend-confirmation-email', emailAddress)
          EventBus.$emit('toast:success', 'Confirmation email has been re-sent!', 5000)
          this.modalVisible = false
        })
        .catch((error) => {
          logger('Could not resend confirmation email:', error)
          EventBus.$emit('toast:error', 'Could not resend confirmation email.')
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
