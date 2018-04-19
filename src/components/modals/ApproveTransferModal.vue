<template>
  <b-modal id="approveTransferModal"
    title="Approve title transfer"
    ok-title="Approve transfer with MetaMask"
    v-model="modalVisible"
    v-on:shown="focusModal"
    v-on:ok="approveTransfer"
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
        After approving a transfer, the owner of the Ethereum address will have to accept the title.
        This is the recommended way of transferring titles.
      </b-form-text>
    </b-form-group>
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
        If you know the email address of the person you are approving,
        we will send them an email once they've been approved to accept the title.
      </b-form-text>
    </b-form-group>
  </b-modal>
</template>

<script>
export default {
  name: 'approve-transfer-modal',
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
    approveTransfer(event) {
      event.preventDefault()

      this.contract.approve(this.toEthAddress, this.titleId, { from: this.account })
        .then(() => {
          this.modalVisible = false
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
</style>
