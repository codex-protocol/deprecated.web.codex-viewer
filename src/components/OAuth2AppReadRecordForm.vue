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
    <b-button type="submit" variant="primary">Submit</b-button>
  </b-form>
</template>

<script>
import axios from 'axios'

export default {
  name: 'OAuth2AppReadRecordForm',

  props: {
    showResult: Function,
  },

  data() {
    return {
      recordId: null,
    }
  },

  methods: {

    // @TODO: Verify params
    onSubmit() {
      axios.get('/admin/oauth2/clients', {
        recordId: this.recordId,
      }).then(this.showResult)
    },
  },
}
</script>
