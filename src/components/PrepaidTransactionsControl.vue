<template>
  <div class="allowance-container" v-if="isSimpleUser">
    <h4>
      Prepaid Transactions
      <img id="prepaid-transactions-info" src="../assets/icons/info.svg">
    </h4>
    <b-progress
      class="progress-container"
      :max="parseInt(user.gasAllowance, 10)"
    >
      <b-progress-bar
        class="progress-bar"
        :value="parseInt(user.gasAllowanceRemaining, 10)"
        :variant="variant"
      />
      <b-popover
        target="prepaid-transactions-info"
        :placement="popoverPlacement"
        triggers="hover click"
        class="popover-theme"
        boundary="viewport"
        @click.stop
      >
        <div class="popover-theme">
          <p>
            <b>{{ percentageRemaining }}% remaining for this month</b>
          </p>
          <p>
            Your balance will reset on {{ resetDate }}.
          </p>
          Each month Codex gives you prepaid transactions that will pay for roughly:
          <ul>
            <li>10 Record Creations</li>
            <li>10 Modifications</li>
            <li>10 Transfers</li>
          </ul>
        </div>
      </b-popover>
    </b-progress>

  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
} from 'vuex'
import is from 'is_js'
import BigNumber from 'bignumber.js'

import { formatDate } from '../util/dateHelpers'

export default {
  name: 'PrepaidTransactionsControl',

  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters('auth', ['isSimpleUser']),

    resetDate() {
      return formatDate(this.user.gasAllowanceNextResetAt, true)
    },

    percentageRemaining() {
      const remaining = new BigNumber(this.user.gasAllowanceRemaining)
        .div(this.user.gasAllowance)
        .mul(100)
        .toFixed(0)

      return remaining
    },

    popoverPlacement() {
      if (is.mobile()) {
        return 'top'
      }

      return 'right'
    },

    variant() {
      if (this.percentageRemaining < 15) {
        return 'danger'
      }

      if (this.percentageRemaining < 35) {
        return 'warning'
      }

      return 'success'
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

#prepaid-transactions-info
  width: 1.2em
  height: @width
  vertical-align: text-bottom

.allowance-container
  width: 100%

.progress-container
  height: 1.5rem
  background-color: rgba(white, .2)

.progress-bar
  color: black
  font-weight: bold

</style>
