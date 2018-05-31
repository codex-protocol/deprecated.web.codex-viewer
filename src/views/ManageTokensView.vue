<template>
  <div>
    <app-header title="Manage Tokens" />
    <h5 class="mb-5">Get CODX from the faucet &amp; stake CODX for discounts!</h5>

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
      <p>Your balance: {{ formatTokenAmount(userState.balance) }} CODX</p>
      <b-button variant="primary" v-b-modal.faucetModal v-if="shouldShowFaucetButton" v-once>
        Get more CODX
      </b-button>
    </div>

    <div class="item">
      <p v-if="!stakeContractApproved">Before you can stake CODX, you have to approve the contract above</p>
      <p>Personal stake: {{ formatTokenAmount(userState.personalStakeAmount) }} CODX</p>
      <p v-if="userState.personalStake">Staked for: {{ userState.personalStakeFor }}</p>
      <p>Total tokens staked for you (including your own): {{ formatTokenAmount(userState.totalStakedFor) }} CODX</p>
      <b-button variant="primary" v-b-modal.stakeModal :disabled="!stakeContractApproved">
        Stake more CODX
      </b-button>
      <b-button variant="outline-primary" :disabled="!stakeContractApproved">
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
    web3() {
      return this.$store.state.web3.instance()
    },
    userState() {
      return this.$store.state.auth
    },
    registryContractApproved() {
      return this.userState.registryContractApproved
    },
    stakeContractApproved() {
      return this.userState.stakeContractApproved
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
    formatTokenAmount(rawAmount) {
      return this.web3.fromWei(rawAmount, 'ether').toFixed(3)
    },
  },
}
</script>

<style lang="stylus" scoped>
  .item
    margin-bottom: 4rem
</style>
