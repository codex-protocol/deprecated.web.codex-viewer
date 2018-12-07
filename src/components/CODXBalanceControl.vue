<template>
  <div class="codx-balance-container">
    <div class="balance-wrapper">
      <h4>Credit Balance</h4>
      <div>{{ user.codxBalance | formatCODXAmount }}</div>
    </div>
    <img
      @click.stop
      src="../assets/icons/info.svg"
      id="codx-balance-popover-trigger"
    >

    <b-popover
      container="app"
      triggers="click"
      boundary="viewport"
      placement="righttop"
      title="What is CODX?"
      :show.sync="showPopover"
      target="codx-balance-popover-trigger"
    >
      <div class="codx-balance-popover">
        <p>CODX is the utility token used to interact with The Codex Protocol.</p>
        <div
          :key="methodName"
          v-for="(description, methodName) in orderedMethodDescriptions"
        >
          <strong>{{ description }}:</strong> {{ codxCosts.CodexRecord[methodName] | formatCODXAmount }}
        </div>

        <b-button
          to="/get-codx"
          :active="false"
          variant="primary"
          @click="getCODXButtonClicked"
        >
          Get More CODX
        </b-button>
      </div>
    </b-popover>
  </div>
</template>

<script>

import { mapState, mapActions } from 'vuex'

export default {
  name: 'CODXBalanceControl',

  data() {
    return {
      // originally, the v-for above was looping over codxCosts.CodexRecord
      //  directly, but there wasn't a good way to sort that list in a logical
      //  way (e.g. grouping mint & modifyMetadataHashes together), so instead
      //  we'll define the order here and loop over this object instead
      //
      // as a bonus, we can also define descriptions for each method here
      orderedMethodDescriptions: {
        mint: 'Create a Codex Record',
        modifyMetadataHashes: 'Modify a Codex Record',
        safeTransferFrom: 'Accept a Transfer',
      },

      showPopover: false,
    }
  },

  computed: {
    ...mapState('auth', ['user']),
    ...mapState('app', ['codxCosts']),
  },

  methods: {
    ...mapActions('app', ['TOGGLE_NAV']),

    getCODXButtonClicked() {
      this.TOGGLE_NAV(false)
      this.showPopover = false
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.codx-balance-container
  width: 100%
  display: flex
  align-items: center
  word-break: break-all

  .balance-wrapper
    flex-grow: 1

  #codx-balance-popover-trigger
    opacity: .8
    width: 1.5em
    height: @width
    vertical-align: text-bottom

    &:hover
      opacity: 1
      cursor: pointer

</style>

<style lang="stylus">

.codx-balance-popover
  .btn
    width: 100%
    margin-top: 2rem

</style>
