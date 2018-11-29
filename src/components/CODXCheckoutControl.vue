<template>
  <div class="checkout-container">
    <div class="column">
      <slot></slot>
    </div>
    <div class="column">
      <h3>Summary</h3>
      <div class="row">
        <p>{{ action }}</p>
        <p>{{ cost | formatCODXBalance }}</p>
      </div>
      <div class="row">
        <p>Total</p>
        <p>{{ cost | formatCODXBalance }}</p>
      </div>
      <div class="row">
        <p>Remaining credits after</p>
        <p>{{ newBalance | formatCODXBalance }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js'

export default {
  name: 'CODXCheckoutControl',

  props: {
    action: {
      type: String,
      required: true,
    },

    cost: {
      type: String,
      required: true,
    },

    currentBalance: {
      type: String,
      required: true,
    },
  },

  data() {
    const newBalance = new BigNumber(this.currentBalance).sub(this.cost)

    return {
      newBalance,
    }
  },
}
</script>

<style lang="stylus" scoped>
.checkout-container
  display: flex
  flex-direction: row
  font-size: 80%
  text-align: left

  .column
    width: 50%

    .row
      justify-content: space-between
      margin: 0
      width: 80%

      @media screen and (min-width: $breakpoint-sm)
        flex-direction: column
        background-color: red
</style>
