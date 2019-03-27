<template>
  <b-card>
    <h2>Finish setting up your account</h2>
    <b-progress
      class="mt-4 mb-4"
      :value="currentStep"
      :max="numSteps"
      variant="success"
    />
    <ul>
      <li :class="{ 'completed': currentStep >= 1 }">Create account</li>
      <li :class="{ 'completed': currentStep >= 2 }">Get CODX</li>
      <li :class="{ 'completed': currentStep >= 3 }">Approve the registry contract</li>
    </ul>
    <b-button
      variant="primary"
      :disabled="done"
      @click.prevent="completeStep"
    >
      {{ buttonText }}
    </b-button>
    <p class="dismiss">
      <a href="#" @click.prevent="hide">Hide This</a>
    </p>
    <ApproveContractModal
      id="approveRegistryModal"
      :contract="recordContract"
      stateProperty="registryContractApproved"
    >
      This will grant the Codex Viewer permission to spend CODX on your behalf.
    </ApproveContractModal>
    <FaucetDripModal />
  </b-card>
</template>

<script>
import { mapState } from 'vuex'

import FaucetDripModal from './../modals/FaucetDripModal'
import ApproveContractModal from './../modals/ApproveContractModal'

export default {
  components: {
    ApproveContractModal,
    FaucetDripModal,
  },
  data() {
    return {
      numSteps: 3,
    }
  },
  computed: {
    ...mapState('web3', ['recordContract']),
    ...mapState('auth', ['registryContractApproved', 'user']),

    done() {
      return this.currentStep === this.numSteps
    },

    currentStep() {
      if (this.user.availableCODXBalance === 0) {
        return 1
      }

      if (!this.registryContractApproved) {
        return 2
      }

      return 3
    },

    buttonText() {
      switch (this.currentStep) {
        case 1:
          return 'Get CODX'

        case 2:
          return 'Approve Contract'

        case 3:
        default:
          return 'Setup complete!'
      }
    },
  },
  methods: {
    completeStep() {
      switch (this.currentStep) {
        case 1:
          this.$root.$emit('bv::show::modal', 'faucetDripModal')
          break

        case 2:
          this.$root.$emit('bv::show::modal', 'approveRegistryModal')
          break

        default:
          break
      }
    },
    hide() {
      this.$store.dispatch('auth/HIDE_SETUP')
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../../assets/variables.styl"

.card
  card()

  .card-body
    flex: 1
    padding: 1.25rem
    background-color: transparent

    p:last-of-type
      margin-bottom: 0

    ul
      list-style-position: inside

    h2
      font-weight: bold
      font-size: 1.25rem
      color: $color-light

    button
      width: 100%
      margin: 1rem 0

    ul
      padding: 0
      font-size: 1.125rem

    li
      margin-bottom: 1rem

      &.completed
        opacity: .5
        text-decoration: line-through

  .dismiss
    font-size: 0.75rem
    text-align: center

    > a
      color: $color-light
      font-weight: normal

</style>
