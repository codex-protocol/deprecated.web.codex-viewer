<template>
  <b-form @submit="onSubmit">
    <b-form-group
      label="Title"
      label-for="title"
    >
      <b-form-input
        id="title"
        type="text"
        v-model="title"
        required
        placeholder="Enter the title"
      />
    </b-form-group>
    <b-form-group
      label="Description"
      label-for="description"
    >
      <b-form-input
        id="description"
        type="text"
        v-model="description"
        required
        placeholder="Enter a short description"
      />
    </b-form-group>
    <b-form-group
      label="Image"
      label-for="image"
    >
      <b-form-input
        id="image"
        type="text"
        placeholder="(Coming soon)"
      />
    </b-form-group>
    <b-button type="submit" variant="primary">Submit</b-button>
  </b-form>
</template>

<script>
import axios from 'axios'

export default {
  name: 'OAuth2AppCreateRecordForm',

  props: {
    showResult: Function,
  },

  data() {
    return {
      title: null,
      description: null,
      image: null,
    }
  },

  methods: {
    onSubmit() {
      axios.post('', {
        title: this.title,
        description: this.description,
      }).then(this.showResult)
    },
  },
}
</script>
