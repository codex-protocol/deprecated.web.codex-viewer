<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <AppHeader title="Get CODX" />

        <div class="content">
          <section class="request-faucet-drip" v-if="showFaucetDripForm">
            <p>
              Click the button below to request the Codex Protocol ERC-20 token, CodexCoin.
              After requesting a drip from the faucet, CodexCoin will be sent to the account you are currently logged in to.
              You can request 1 drip every 24 hours.
            </p>
            <b-button
              class="mb-3"
              variant="primary"
              v-b-modal.faucetDripModal
              :disabled="!user.canRequestFaucetDrip"
            >
              Request CODX from faucet
            </b-button>

            <p v-if="!user.canRequestFaucetDrip">
              <strong>You'll be able to request more CODX in {{ nextRequestIn }}</strong>
            </p>

            <FaucetDripModal />

          </section>

          <section class="buy-on-exchange" v-if="!isSimpleUser && !faucetDripEnabled">
            <!--  @TODO: add info here about where savvy users can purchase CODX from an exchange -->
            <p>
              Buy CODX on an exchange.
            </p>
          </section>

          <section class="pay-with-stripe" v-if="stripeHandler && isSimpleUser">
            <p>
              Click the button below to purchase the Codex Protocol ERC-20 token, CodexCoin.
            </p>
            <b-button
              id="codex-payment"
              variant="primary"
              @click.prevent="promptForPayment"
            >
              Pay with Stripe
            </b-button>
          </section>

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
import FaucetDripModal from '../components/modals/FaucetDripModal'
import ApproveContractModal from '../components/modals/ApproveContractModal'

export default {
  name: 'GetCODXView',

  components: {
    AppHeader,
    FaucetDripModal,
    ApproveContractModal,
  },

  data() {
    return {
      faucetDripEnabled: config.faucetDripEnabled,
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

    showFaucetDripForm() {
      return (
        (config.faucetDripEnabled && this.isSimpleUser) ||
        (config.faucetDripEnabled && config.feesEnabled && !this.isSimpleUser)
      )
    },

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

section + section
  margin-top: 2rem
  padding-top: 2rem
  border-top: 1px solid rgba($color-primary, .25)
</style>
