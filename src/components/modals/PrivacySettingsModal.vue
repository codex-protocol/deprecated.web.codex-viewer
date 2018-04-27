<template>
  <b-modal id="titlePrivacySettings"
    title="Title Privacy Settings"
    ok-title="Save"
    v-model="modalVisible"
    v-on:ok="saveSettings"
  >
    <b-form-group
      label="Share Title Publicly"
      label-for="togglePrivacy" label-size="sm" label-class="text-secondary"
    >
      <b-form-checkbox
        class="privacy-toggle"
        v-model="isPrivate"
        value=false
        unchecked-value=true>
      </b-form-checkbox>
      <b-form-text>
        {{isPrivate}} By making your title public, everyone can view the title, description and image of this title.
      </b-form-text>
    </b-form-group>
  </b-modal>
</template>

<script>
import axios from 'axios'

export default {
  name: '',
  props: ['titleId'],
  data() {
    return {
      isPrivate: true,
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
        const { result, error } = response.data
        // @FIXME: remove debug code here.
        console.log('result', result)
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
  computed: {
    account() {
      return this.$store.state.web3.account
    },
    contract() {
      return this.$store.state.web3.contractInstance()
    },
  },
}
</script>

<style>
form {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

/* CSS Toggle from:
   https://danklammer.com/articles/simple-css-toggle-switch/
*/
.privacy-toggle {
  padding-left: 0;
}

.privacy-toggle label {
  display: none;
}

.privacy-toggle input {
  opacity: 1;
  z-index: 0;
  -webkit-appearance: none;
  appearance: none;
  width: 62px;
  height: 32px;
  display: inline-block;
  position: relative;
  border-radius: 50px;
  overflow: hidden;
  outline: none;
  border: none;
  cursor: pointer;
  background-color: #707070;
  transition: background-color ease 0.3s;
}

.privacy-toggle input:before {
  content: "on off";
  display: block;
  position: absolute;
  z-index: 2;
  width: 28px;
  height: 28px;
  background: #fff;
  left: 2px;
  top: 2px;
  border-radius: 50%;
  font: 10px/28px Helvetica;
  text-transform: uppercase;
  font-weight: bold;
  text-indent: -22px;
  word-spacing: 37px;
  color: #fff;
  text-shadow: -1px -1px rgba(0,0,0,0.15);
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
  transition: all cubic-bezier(0.3, 1.5, 0.7, 1) 0.3s;
}

.privacy-toggle input:checked {
  background-color: #32194C;
}

.privacy-toggle input:checked:before {
  left: 32px;
}
</style>
