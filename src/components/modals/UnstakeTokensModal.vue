<template>
  <meta-mask-notification-modal
    id="unstakeTokensModal"
    title="Unstake tokens"
    ok-title="Unstake"
    :ok-disabled="!canSubmit()"
    cancel-variant="outline-primary"
    :ok-method="unstakeTokens"
    :on-shown="focusModal"
  >
    <div class="text-center">
      <img class="token-icon" src="../../assets/icons/codx-token.svg">
    </div>
    <b-form-group
      :label="`Number of tokens to unstake (Current stake: ${currentStake} CODX)`"
      label-for="unstakeAmount"
      label-size="sm"
    >
      <b-form-input
        required
        id="unstakeAmount"
        type="text"
        class="mb-4"
        placeholder="Number of tokens"
        ref="defaultModalFocus"
        v-model="unstakeAmount"
      />
    </b-form-group>
  </meta-mask-notification-modal>
</template>

<script>
import callContract from '../../util/web3/callContract'
import MetaMaskNotificationModal from './MetaMaskNotificationModal'

export default {
  name: 'unstake-tokens-modal',
  props: ['currentStake'],
  components: {
    MetaMaskNotificationModal,
  },
  data() {
    return {
      unstakeAmount: null,
    }
  },
  methods: {
    canSubmit() {
      return this.unstakeAmount
    },
    focusModal() {
      this.$refs.defaultModalFocus.focus()
    },
    unstakeTokens(event) {
      event.preventDefault()

      const input = [this.web3.instance().toWei(this.unstakeAmount, 'ether'), '0x0']
      return callContract(this.stakeContract.unstake, input, this.web3)
    },
  },
  computed: {
    web3() {
      return this.$store.state.web3
    },
    stakeContract() {
      return this.web3.stakeContainerContractInstance()
    },
  },
}
</script>

<style lang="stylus" scoped>
.token-icon
  width: 8rem
  margin-bottom: 2rem

</style>
