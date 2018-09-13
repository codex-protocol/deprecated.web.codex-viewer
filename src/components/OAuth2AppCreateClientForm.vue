<template>
  <b-form @submit="onSubmit">
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
  </b-form>
</template>

<script>
import axios from 'axios'

export default {
  name: 'OAuth2AppCreateClientForm',

  data() {
    return {
      appName: null,
      adminEmail: null,
    }
  },

  methods: {
    onSubmit() {
      axios.post('/admin/oauth2/clients', {
        name: this.appName,
        email: this.adminEmail,
      })
        .then((response) => {
          console.log(response)
        })
    },
  },
}
</script>

<style>

</style>
