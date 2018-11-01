<template>
  <b-form @submit.prevent="onSubmit">
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
    <b-button type="submit" variant="primary">Submit</b-button>
  </b-form>
</template>

<script>
import axios from 'axios'

export default {
  name: 'OAuth2AppReadRecordForm',

  props: {
    showResult: Function,
    accessToken: String,
  },

  data() {
    return {
      recordId: null,
    }
  },

  methods: {
    onSubmit() {
      axios.get(`v1/record/${this.recordId}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }).then(this.showResult)
    },
  },
}
</script>
