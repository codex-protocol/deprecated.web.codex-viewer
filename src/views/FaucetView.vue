<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <AppHeader title="Get more CODX" />

        <div class="content">
          <div v-if="showFaucet">
            <p>
              Click the button below to request the Codex Protocol ERC-20 token, CodexCoin.
              After requesting a drip from the faucet, CodexCoin will be sent to the account you are currently logged in to.
              You can request 1 drip every 24 hours.
            </p>
            <b-button
              class="mb-3"
              variant="primary"
              v-b-modal.faucetModal
              :disabled="!user.canRequestFaucetTokens"
            >
              Get more CODX
            </b-button>

            <p>Your balance: {{ user.codxBalance | formatCODXBalance }} CODX</p>
            <p v-if="!user.canRequestFaucetTokens">
              <strong>You'll be able to request more CODX in {{ nextRequestIn }}</strong>
            </p>

            <faucet-modal />

            <hr />

            <div v-if="!isSimpleUser">
              <p>Registry contract approved? {{ registryContractApproved ? 'Yes!' : 'No' }}</p>
              <b-button variant="primary" v-b-modal.approveRegistryModal :disabled="registryContractApproved">
                Approve the registry contract
              </b-button>

              <approve-contract-modal id="approveRegistryModal" :contract="recordContract" stateProperty="registryContractApproved">
                This will grant the Codex Viewer permission to spend CODX on your behalf.
              </approve-contract-modal>

              <hr />
            </div>
          </div>

          <div v-if="stripeHandler">
            <p>
              Click the button below to purchase the Codex Protocol ERC-20 token, CodexCoin.
            </p>
            <b-button
              id="codex-payment"
              @click.prevent="promptForPayment"
              variant="primary"
            >
              Pay with Stripe
            </b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
} from 'vuex'

import config from '../util/config'
import { timeSince } from '../util/dateHelpers'

import AppHeader from '../components/core/AppHeader'
import FaucetModal from '../components/modals/FaucetModal'
import ApproveContractModal from '../components/modals/ApproveContractModal'

export default {
  name: 'FaucetView',

  components: {
    AppHeader,
    FaucetModal,
    ApproveContractModal,
  },

  data() {
    return {
      showFaucet: config.showFaucet,
    }
  },

  beforeDestroy() {
    if (this.stripeHandler) {
      this.stripeHandler.close()
    }
  },

  computed: {
    ...mapState('auth', ['registryContractApproved', 'user']),
    ...mapState('app', ['stripeHandler']),
    ...mapState('web3', ['recordContract']),
    ...mapGetters('auth', ['isSimpleUser']),

    nextRequestIn() {
      const now = Date.now()
      const faucetDripNextRequestAt = new Date(this.user.faucetDripNextRequestAt).getTime()
      return timeSince(new Date(now - (faucetDripNextRequestAt - now)))
    },
  },

  methods: {
    promptForPayment() {
      this.stripeHandler.open({
        name: 'Codex Labs, Inc',
        description: 'CodexCoin',
        amount: 2000,
      })
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.content

  @media screen and (min-width: $breakpoint-lg)
    max-width: 50%

hr
  width: 100%
  margin-top: 2rem
  margin-bottom: 2rem
  border-color: rgba($color-primary, .25)
</style>
