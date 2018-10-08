<template>
  <div class="allowance-container" v-if="isSimpleUser">
    <div><b>Prepaid Transactions</b></div>
    <b-progress
      class="progress-container"
      :max="max"
    >
      <b-progress-bar
        class="progress-bar"
        :value="parseInt(user.gasAllowance)"
        :variant="variant"
      />
    </b-progress>
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
} from 'vuex'

export default {
  name: 'PrepaidTransactionsControl',

  data() {
    return {
      // @todo: replace with gasMaxAllowance when it's ready
      max: 4050000,
    }
  },

  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters('auth', ['isSimpleUser']),

    variant() {
      const percentageRemaining = ((parseInt(this.user.gasAllowance, 10) / this.max) * 100).toFixed(0)

      if (percentageRemaining < 15) {
        return 'danger'
      }

      if (percentageRemaining < 35) {
        return 'warning'
      }

      return 'success'
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.allowance-container
  text-align: center

.progress-container
  background-color: rgba(white, .2)
  height: 2rem
  margin: 0.5rem

.progress-bar
  color: black
  font-weight: bold
  margin: 0.5rem
</style>
