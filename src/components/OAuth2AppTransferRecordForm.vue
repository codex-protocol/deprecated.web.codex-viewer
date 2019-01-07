<template>
  <b-form @submit.prevent="onSubmit">
    <b-form-group
      label="Access token"
      label-for="accessToken"
    >
      <div v-text="accessToken"></div>
    </b-form-group>
    <b-form-group
      label="Unique Record Identifier"
      label-for="recordId"
    >
      <b-form-input
        id="recordId"
        type="text"
        v-model="recordId"
        required
        placeholder="Enter the recordId"
      />
    </b-form-group>
    <b-form-group
      label="Receiving Ethereum or Email Address"
      label-for="receivingAddress"
    >
      <b-form-input
        id="receivingAddress"
        type="text"
        v-model="receivingAddress"
        required
        placeholder="Enter the Ethereum or email address to send the record to"
      />
    </b-form-group>
    <b-button type="submit" variant="primary">Submit</b-button>
  </b-form>
</template>

<script>
import axios from 'axios'

export default {

  props: {
    showResult: Function,
    accessToken: String,
  },

  data() {
    return {
      recordId: null,
      receivingAddress: null,
    }
  },

  methods: {
    onSubmit() {

      const addressKey = this.receivingAddress.includes('@') ? 'email' : 'address'

      axios.put(`/v1/client/record/${this.recordId}/transfer/approve`, {
        [addressKey]: this.receivingAddress,
      }, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }).then(this.showResult)
    },
  },
}
</script>
