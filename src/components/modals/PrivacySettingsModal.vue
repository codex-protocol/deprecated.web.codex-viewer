<template>
  <b-modal
    id="titlePrivacySettings"
    title="Title Privacy Settings"
    ok-title="Save"
    v-model="modalVisible"
    v-on:ok="saveSettings"
  >
    <b-form-group
      label="Share Title Publicly"
      label-for="togglePrivacy"
      label-size="sm"
      label-class="text-secondary"
    >
      <b-form-checkbox
        class="toggle-checkbox"
        v-model="isPrivate"
        value=false
        unchecked-value=true
      >
      </b-form-checkbox>
      <b-form-text>
        By making your title public, everyone can view the title, description and image of this title.
      </b-form-text>
    </b-form-group>
  </b-modal>
</template>

<script>
import axios from 'axios'

export default {
  name: '',
  props: ['titleId', 'titleIsPrivate'],
  data() {
    return {
      isPrivate: this.titleIsPrivate,
      modalVisible: false,
    }
  },
  methods: {
    saveSettings(event) {
      event.preventDefault()

      const url = `/users/titles/${this.titleId}`
      axios.put(url, {
        isPrivate: this.isPrivate,
      }).then((response) => {
        const { error } = response.data
        if (error) {
          console.log('there was an error setting title privacy', error)
          this.error = error
        } else {
          this.modalVisible = false
        }
      }).catch((error) => {
        console.log('there was an error setting title privacy', error)
        this.error = error
      })
    },
  },
}
</script>

<style scope>
form {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
</style>
