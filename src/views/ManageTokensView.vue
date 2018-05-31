<template>
  <div>
    <app-header title="Manage Tokens" />
    <h5 class="mb-5">Get CODX from the faucet & stake CODX for discounts!</h5>

    <div class="item">
      <p>Registry contract approved? {{ registryContractApproved ? 'Yes!' : 'No' }}</p>
      <b-button variant="primary" v-b-modal.approveRegistryModal :disabled="registryContractApproved">
        Approve the registry contract
      </b-button>
    </div>

    <div class="item">
      <p>Stake contract approved? {{ stakeContractApproved ? 'Yes!' : 'No' }}</p>
      <b-button variant="primary" v-b-modal.approveStakeModal :disabled="stakeContractApproved">
        Approve the staking contract
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
      <b-button variant="primary" v-b-modal.stakeModal>
        Stake more CODX
      </b-button>
      <b-button variant="outline-primary">
        Unstake CODX
      </b-button>
    </div>

    <faucet-modal />

    <approve-contract-modal id="approveRegistryModal" :contractInstance="titleContract" stateProperty="registryContractApproved">
      This will grant the Codex Viewer permission to spend CODX on your behalf.
    </approve-contract-modal>

    <approve-contract-modal id="approveStakeModal" :contractInstance="stakeContract" stateProperty="stakeContractApproved">
      This will allow you to stake CODX.
    </approve-contract-modal>

    <stake-tokens-modal />
  </div>
</template>

<script>
import AppHeader from '../components/AppHeader'
import ApproveContractModal from '../components/modals/ApproveContractModal'
import FaucetModal from '../components/modals/FaucetModal'
import StakeTokensModal from '../components/modals/StakeTokensModal'

export default {
  name: 'manage-tokens-view',
  components: {
    AppHeader,
    ApproveContractModal,
    FaucetModal,
    StakeTokensModal,
  },
  data: () => {
    return {
      shouldShowFaucetButton: process.env.TARGET_ENV !== 'production',
    }
  },
  computed: {
    registryContractApproved() {
      return this.$store.state.auth.registryContractApproved
    },
    stakeContractApproved() {
      return this.$store.state.auth.stakeContractApproved
    },
    balance() {
      return this.$store.state.auth.balance
    },
    stakeContract() {
      return this.$store.state.web3.stakeContainerContractInstance()
    },
    titleContract() {
      return this.$store.state.web3.titleContractInstance()
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
