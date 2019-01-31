<template>
  <span class="valid-hash-badge">
    <template v-if="isValid">
      <img
        v-b-tooltip.hover
        src="../../assets/icons/hash-valid.svg"
        title="This record has not been tampered with; the calculated hash matches the value on the blockchain."
      >
    </template>
    <template v-else>
      <img
        v-b-tooltip.hover
        src="../../assets/icons/hash-invalid.svg"
        title="This record may have been tampered with; the calculated hash does not match the value on the blockchain."
      >
    </template>
  </span>
</template>

<script>

import Web3 from 'web3'

export default {

  props: {
    hash: {
      type: String,
      required: true,
    },
    string: {
      type: String,
      required: true,
    },
  },

  computed: {
    isValid() {
      return this.hash === Web3.utils.sha3(this.string)
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../../assets/variables.styl"

.valid-hash-badge
  img
    width: 1rem
    height: @width
    vertical-align: text-bottom

</style>
