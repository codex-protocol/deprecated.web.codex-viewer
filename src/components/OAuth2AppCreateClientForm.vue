<template>
  <b-form @submit.prevent="onSubmit">
    <b-form-group
      label="Application name"
      label-for="appName"
    >
      <b-form-input
        id="appName"
        type="text"
        v-model="appName"
        required
        placeholder="Enter the name for the app"
      />
    </b-form-group>
    <b-form-group
      label="Admin email address"
      label-for="adminEmail"
    >
      <b-form-input
        id="adminEmail"
        type="email"
        v-model="adminEmail"
        required
        placeholder="Enter the email address for the app admin"
      />
    </b-form-group>
    <b-form-group
      label="Webhook URL"
      label-for="webhookUrl"
    >
      <b-form-input
        id="webhookUrl"
        type="text"
        v-model="webhookUrl"
        required
        placeholder="Enter the webhook callback URL"
      />
    </b-form-group>
    <b-button type="submit" variant="primary">Submit</b-button>
  </b-form>
</template>

<script>
import axios from 'axios'
import config from '../util/config'

export default {
  name: 'OAuth2AppCreateClientForm',

  props: {
    showResult: Function,
  },

  data() {
    return {
      appName: null,
      adminEmail: null,
      webhookUrl: `${config.apiUrl}/test/webhook`,
    }
  },

  methods: {
    onSubmit() {
      axios.post('/admin/oauth2/clients', {
        user: {
          name: this.appName,
          email: this.adminEmail,
        },
        webhookUrl: this.webhookUrl,
      }).then(this.showResult)
    },
  },
}
</script>
