<template>
  <b-modal
    @shown="onShow"
    @hidden="onHide"
    :busy="isLoading"
    ok-title="Submit"
    @ok.prevent="submit"
    id="claimRecordModal"
    v-model="modalVisible"
    :ok-disabled="!canSubmit"
    title="Claim Codex Record"
  >

    <b-alert variant="danger" :show="!user">
      To submit a Claim Codex Record request, you must be a registered user.
      Please <b-link to="/login">login</b-link> or <b-link to="/signup">create an account</b-link> and try again.
    </b-alert>

    <b-form
      ref="form"
      v-if="!!user"
      @submit.prevent="submit"
    >

      <b-alert
        variant="danger"
        v-html="formSubmitError"
        :show="!!formSubmitError"
      />

      <p>
        Use this form if you believe you have won this asset at auction. Your
        request will be sent to the Auction House for evaluation and you should
        hear back from the Auction House directly.
      </p>

      <!--
        for whatever reason, label-for doesn't seem to like "name" as an id, so
        we'll just use _name instead
      -->
      <b-form-group
        label="Name"
        label-size="sm"
        label-for="_name"
      >
        <b-form-input
          required
          id="_name"
          v-model="name"
          ref="nameField"
        />
      </b-form-group>

      <b-form-group
        label="Email"
        label-size="sm"
        label-for="email"
      >
        <b-form-input
          required
          id="email"
          type="email"
          v-model="email"
          ref="emailField"
        />
      </b-form-group>

      <b-form-group
        label="Details"
        label-size="sm"
        label-for="details"
      >
        <b-form-textarea
          required
          :rows="4"
          id="details"
          v-model="details"
          ref="detailsField"
        />
        <b-form-text>
          Be sure to include any identifying information to help support your
          claim (e.g. auction date, lot number, order confirmation number,
          transaction ID, etc.)
        </b-form-text>
      </b-form-group>

      <!--
        add an invisible submit button so pressing enter submits the form
        (since the modal's "ok" button is not inside the form...)
      -->
      <button class="d-none" type="submit"></button>

    </b-form>
  </b-modal>
</template>

<script>

import axios from 'axios'
import { mapState } from 'vuex'

import EventBus from '../../util/eventBus'

export default {

  props: {
    codexRecord: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      name: null,
      email: null,
      details: null,
      isLoading: false,
      modalVisible: false,
      formSubmitError: null,
    }
  },

  computed: {
    ...mapState('auth', ['user']),

    canSubmit() {
      return !this.isLoading && this.user && this.name && this.email && this.details
    },
  },

  methods: {

    onShow() {

      if (!this.user) {
        return
      }

      this.name = this.user.name || null
      this.email = this.user.email || null

      if (!this.name && this.$refs.nameField) {
        this.$refs.nameField.focus()
      } else if (!this.email && this.$refs.emailField) {
        this.$refs.emailField.focus()
      } else {
        this.$refs.detailsField.focus()
      }
    },

    onHide() {

      Object.assign(this.$data, this.$options.data.apply(this))

      if (this.$refs.form) {
        this.$refs.form.reset()
        // toggling novalidate gets rid of the :invalid pseudo-classes applied
        //  to the inputs that seem to stick around in firefox even after a
        //  reset()
        this.$refs.form.setAttribute('novalidate', '')
        this.$refs.form.removeAttribute('novalidate')
      }
    },

    submit() {

      if (!this.canSubmit) {
        this.formSubmitError = 'Please fill out all fields.'
        return null
      }

      const requestOptions = {
        url: `/record/${this.codexRecord.tokenId}/claim`,
        method: 'post',
        data: {
          name: this.name,
          email: this.email,
          details: this.details,
        },
      }

      this.isLoading = true

      return axios(requestOptions)
        .then((response) => {
          this.modalVisible = false
          this.formSubmitError = null
          EventBus.$emit('events:claim-record-request', this.codexRecord.tokenId)
          EventBus.$emit('toast:success', 'Claim Codex Record request successfully sent to Auction House!', 5000)
        })
        .catch((error) => {
          this.formSubmitError = error.message || error.toString()
        })
        .finally(() => {
          this.isLoading = false
        })
    },

  },
}
</script>
