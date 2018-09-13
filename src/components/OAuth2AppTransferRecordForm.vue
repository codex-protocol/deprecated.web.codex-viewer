<template>
  <b-form @submit="onSubmit">
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
      label="Receiving email address"
      label-for="receivingAddress"
    >
      <b-form-input
        id="receivingAddress"
        type="email"
        v-model="receivingAddress"
        required
        placeholder="Enter the email address to send the record to"
      />
    </b-form-group>
    <b-button type="submit" variant="primary">Submit</b-button>
  </b-form>
</template>

<script>
import axios from 'axios'

export default {
  name: 'OAuth2AppTransferRecordForm',

  props: {
    showResult: Function,
  },

  data() {
    return {
      recordId: null,
      receivingAddress: null,
    }
  },

  methods: {

    // @TODO: Verify params
    onSubmit() {
      axios.post('/admin/oauth2/clients', {
        recordId: this.recordId,
        emailAddress: this.receivingAddress,
      }).then(this.showResult)
    },
  },
}
</script>
