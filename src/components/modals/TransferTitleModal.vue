<template>
  <b-modal id="transferTitleModal"
    title="Transfer title"
    ok-title="Transfer with MetaMask"
    v-model="modalVisible"
    v-on:shown="focusModal"
    v-on:ok="transferTitle"
  >
    <b-form-group
      label="Type or paste wallet address"
      label-for="toEthAddress" label-size="sm" label-class="text-secondary"
    >
      <b-form-input
        id="toEthAddress"
        type="text"
        placeholder="e.g., 0x627306090aba..."
        ref="defaultModalFocus"
        v-model="toEthAddress"
      />
      <b-form-text>
        Make sure the person you are sending the Codex Title to has a wallet that can
        handle ERC-721 tokens. MetaMask is a great example!
      </b-form-text>
    </b-form-group>
    <!--
    <b-form-group
      label="Email address of the wallet owner (optional)"
      label-for="toEmailAddress" label-size="sm" label-class="text-secondary"
    >
      <b-form-input
        id="toEmailAddress"
        type="text"
        placeholder="e.g., user@example.com"
        v-model="toEmailAddress"
      />
      <b-form-text>
        If you know the email address of the person you are sending the Codex Title to,
        we will send them an email once the transfer has been completed.
      </b-form-text>
    </b-form-group>
    -->
  </b-modal>
</template>

<script>
import callContract from '../../util/web3/callContract'

export default {
  name: 'transfer-title-modal',
  props: ['titleId'],
  data() {
    return {
      toEthAddress: null,
      toEmailAddress: null,
      modalVisible: false,
    }
  },
  methods: {
    focusModal() {
      this.$refs.defaultModalFocus.focus()
    },
    transferTitle(event) {
      event.preventDefault()

      const input = [this.web3.account, this.toEthAddress, this.titleId]
      callContract(this.contract.transferFrom, input, this.web3)
        .then(() => {
          this.modalVisible = false
        })
        .catch((error) => {
          console.log('There was an error transferring the token', error)
        })
    },
  },
  computed: {
    web3() {
      return this.$store.state.web3
    },
    contract() {
      return this.web3.contractInstance()
    },
  },
  watch: {
    // When the modal dialog is closed, we reset the component data
    modalVisible(newVisibility) {
      if (!newVisibility) {
        Object.assign(this.$data, this.$options.data.apply(this))
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
form
  display flex
  flex-direction column
  justify-content space-around
</style>
