<template>
  <div>
    <app-header title="Manage Tokens" />
    <h5 class="mb-5">Get CODX from the faucet & stake CODX for discounts!</h5>

    <div class="item">
      <p>Contract approved? {{ contractApproved ? 'Yes!' : 'No' }}</p>
      <b-button variant="primary" v-b-modal.approveTokenModal :disabled="contractApproved">
        Approve the CodexRecord contract
      </b-button>
    </div>

    <div class="item">
      <p>Your balance: {{ balance.toString() }} CODX</p>
      <b-button variant="primary" v-b-modal.faucetModal v-if="shouldShowFaucetButton" v-once>
        Get more CODX
      </b-button>
    </div>

    <div class="item">
      <p>Tokens you've staked: </p>
      <b-button variant="primary">
        Stake more CODX
      </b-button>
      <b-button variant="outline-primary">
        Unstake CODX
      </b-button>
    </div>

    <faucet-modal />
    <approve-token-modal />
  </div>
</template>

<script>
import AppHeader from '../components/AppHeader'
import FaucetModal from '../components/modals/FaucetModal'
import ApproveTokenModal from '../components/modals/ApproveTokenModal'

export default {
  name: 'manage-tokens-view',
  components: {
    AppHeader,
    FaucetModal,
    ApproveTokenModal,
  },
  data: () => {
    return {
      shouldShowFaucetButton: process.env.TARGET_ENV !== 'production',
    }
  },
  computed: {
    contractApproved() {
      return this.$store.state.auth.contractApproved
    },
    balance() {
      return this.$store.state.auth.balance
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('logout', this.$router)
    },
  },
}
</script>

<style lang="stylus" scoped>
  .item
    margin-bottom: 4rem
</style>
