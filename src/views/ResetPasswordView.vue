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

          <div v-if="hasError">
            <h1>Could Not Reset Password</h1>
            <p>
              A error occurred while resetting your password. Please request a
              new password reset email and try again.
            </p>
            <b-button
              variant="primary"
              v-b-modal.forgotPasswordModal
            >
              Try Again?
            </b-button>
          </div>

          <div v-else>

            <LoadingOverlay :show="isLoading" type="dark" size="large" />

            <h1>Reset Password</h1>

            <p>
              Use the form below to reset the password for the Codex Viewer
              account with email <strong>{{ passwordResetEmail }}</strong>.
            </p>

            <p>
              <b-alert
                variant="danger"
                v-html="formSubmitError"
                :show="!!formSubmitError"
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

            <b-form @submit.prevent="resetPassword()">
              <b-form-group>
                <b-form-input
                  required
                  type="password"
                  v-model="newPassword"
                  placeholder="New Password (4+ characters)"
                />
              </b-form-group>
              <b-form-group>
                <b-form-input
                  required
                  type="password"
                  v-model="confirmNewPassword"
                  placeholder="Confirm New Password"
                />
              </b-form-group>
              <div class="form-button-container">
                <b-button
                  type="submit"
                  variant="primary"
                  class="form-button"
                  :disabled="isLoading"
                >
                  Reset Password
                </b-button>
              </div>
            </b-form>

          </div>
        </div>

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
import { mapState } from 'vuex'

import EventBus from '../util/eventBus'

import LoadingOverlay from '../components/util/LoadingOverlay'
import ForgotPasswordModal from '../components/modals/ForgotPasswordModal'

export default {

  components: {
    LoadingOverlay,
    ForgotPasswordModal,
  },

  data() {
    return {
      isLoading: false,
      formSubmitError: null,
      formValidateErrors: [],

      newPassword: null,
      confirmNewPassword: null,
    }
  },

  computed: {
    ...mapState('app', ['apiErrorCode', 'passwordResetCode', 'passwordResetEmail']),

    hasError() {
      return this.apiErrorCode || !this.passwordResetCode || !this.passwordResetEmail
    },

    $formContainer() {
      return this.$refs['form-container']
    },
  },

  methods: {

    clearErrors() {
      this.formSubmitError = null
      this.formValidateErrors = []
    },

    shakeForm() {
      this.$formContainer.classList.add('is-shaking')
      setTimeout(() => {
        this.$formContainer.classList.remove('is-shaking')
      }, 300)
    },

    resetPassword() {

      this.clearErrors()

      if (!this.newPassword) {
        this.formValidateErrors.push('Password is required')
      }

      if (this.newPassword !== this.confirmNewPassword) {
        this.formValidateErrors.push('Passwords fields must match')
      }

      if (this.newPassword.length < 4) {
        this.formValidateErrors.push('Password must be longer than 4 characters')
      }

      if (this.formValidateErrors.length !== 0) {
        this.shakeForm()
        return null
      }

      this.isLoading = true

      const requestOptions = {
        url: `/login/reset-password/${this.passwordResetCode}/reset`,
        method: 'put',
        data: {
          newPassword: this.newPassword,
          confirmNewPassword: this.confirmNewPassword,
        },
      }

      return axios(requestOptions)
        .then((response) => {
          EventBus.$emit('toast:success', 'Password succesfully reset! You can now login with your new password.', 5000)
          return this.$router.push({ name: 'login' })
        })
        .catch((error) => {
          this.shakeForm()
          this.formSubmitError = error.message || error.toString()
        })
        .finally(() => {
          this.isLoading = false
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

  .form-button-container
    display: flex
    align-items: flex-end
    flex-direction: column

    .form-button
      width: 100%

.login-art img
  width: 100%
  margin-top: 3rem

</style>
