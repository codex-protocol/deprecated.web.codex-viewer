<template>
  <div class="mb-5" v-if="personalStakes[0]">
    <p>Your stakes</p>

    <!-- eslint-disable vue/require-v-for-key -->
    <div class="table">
      <div class="table-header">Actual amount</div>
      <div v-for="(property, index) in personalStakes[1]" :style="{ order: index + 2 }">{{ formatTokenAmount(property) }} CODX</div>

      <div class="table-header">Perceived amount</div>
      <div v-for="(property, index) in personalStakes[2]" :style="{ order: index + 2 }">{{ formatTokenAmount(property) }} CODX</div>

      <div class="table-header addresses">Staked for</div>
      <div class="addresses" v-for="(property, index) in personalStakes[3]" :style="{ order: index + 2 }">{{ property }}</div>

      <div class="table-header">Unlock date</div>
      <div v-for="(property, index) in personalStakes[0]" :style="{ order: index + 2 }">{{ (new Date(parseInt(property) * 1000)).toLocaleDateString() }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'personal-stakes-table',
  props: ['personalStakes'],
  methods: {
    formatTokenAmount(rawAmount) {
      return rawAmount.div('1e18').toFixed(3)
    },
  },
}
</script>

<style lang="stylus" scoped>
.table
  display: flex
  flex-wrap: wrap
  text-align: center

  div
    width: 20%;

  .addresses
    width: 40%

.table-header
  order: 1
</style>
