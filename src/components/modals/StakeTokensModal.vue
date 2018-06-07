<template>
  <meta-mask-notification-modal
    id="stakeTokensModal"
    title="Stake tokens"
    ok-title="Stake"
    :ok-disabled="!canSubmit()"
    cancel-variant="outline-primary"
    :ok-method="stakeTokens"
    :on-clear="clearModal"
  >
    <div class="text-center">
      <img class="token-icon" src="../../assets/icons/codx-token.svg">
    </div>
    <b-form-group
      label-size="sm"
      label-for="stakeAmount"
      label="Number of tokens to stake"
    >
      <b-form-input
        required
        id="stakeAmount"
        ref="stakeAmount"
        type="number"
        class="mb-4"
        placeholder="Number of tokens"
        v-model="stakeAmount"
      />
    </b-form-group>
  </meta-mask-notification-modal>
</template>

<script>
import callContract from '../../util/web3/callContract'
import MetaMaskNotificationModal from './MetaMaskNotificationModal'

export default {
  name: 'stake-tokens-modal',
  components: {
    MetaMaskNotificationModal,
  },
  data() {
    return {
      stakeAmount: null,
      modalVisible: false,
    }
  },
  methods: {
    canSubmit() {
      return this.stakeAmount
    },
    focusModal() {
      this.$refs.stakeAmount.focus()
    },
    stakeTokens() {
      const input = [this.web3.instance().toWei(this.stakeAmount, 'ether'), '0x0']
      return callContract(this.stakeContract.stake, input, this.web3)
        .catch((error) => {
          console.log('there was an error calling stakeTokens', error)

          // @NOTE: we must throw the error here so the MetaMaskNotificationModal
          //  can catch() it too
          throw error
        })
    },
    clearModal() {
      Object.assign(this.$data, this.$options.data.apply(this))
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
