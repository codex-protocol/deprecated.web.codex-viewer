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
      label="Updated name"
      label-for="name"
    >
      <b-form-input
        id="name"
        type="text"
        v-model="name"
        required
        placeholder="Enter the name"
      />
    </b-form-group>
    <b-form-group
      label="Updated description"
      label-for="description"
    >
      <b-form-input
        id="description"
        type="text"
        v-model="description"
        required
        placeholder="Enter the description"
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
      name: null,
      description: null,
    }
  },

  methods: {
    onSubmit() {
      const formData = new FormData()
      formData.append('name', this.name)
      formData.append('description', this.description)

      axios.put(`/v1/client/record/${this.recordId}/metadata`, formData, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        },
      }).then(this.showResult)
    },
  },
}
</script>
