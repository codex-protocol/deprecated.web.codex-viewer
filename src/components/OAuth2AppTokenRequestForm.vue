<template>
  <b-form @submit="onSubmit">
    <b-form-group
      label="Unique client identifier"
      label-for="clientId"
    >
      <b-form-input
        id="clientId"
        type="text"
        v-model="clientId"
        required
        placeholder="Enter the clientId"
      />
    </b-form-group>
    <b-form-group
      label="Unique client secret"
      label-for="clientSecret"
    >
      <b-form-input
        id="clientSecret"
        type="text"
        v-model="clientSecret"
        required
        placeholder="Enter the clientSecret"
      />
    </b-form-group>
    <b-button type="submit" variant="primary">Submit</b-button>
  </b-form>
</template>

<script>
import axios from 'axios'

export default {
  name: 'OAuth2AppTokenRequestForm',

  props: {
    showResult: Function,
  },

  data() {
    return {
      clientId: null,
      clientSecret: null,
    }
  },

  methods: {
    onSubmit() {
      axios.post('/oauth2/token', {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
      }).then(this.showResult)
    },
  },
}
</script>
