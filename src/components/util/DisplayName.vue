<template>
  <span class="display-name" v-b-tooltip.hover :title="tooltipTitle">
    {{ name }}
  </span>
</template>

<script>

import {
  mapState,
  mapGetters,
} from 'vuex'

export default {

  props: {
    address: String,
  },

  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters('auth', ['isNotSavvyUser']),
    ...mapGetters('app', ['getVerifiedNameFromAddress']),

    verifiedName() {
      return this.getVerifiedNameFromAddress(this.address)
    },

    tooltipTitle() {

      if (this.name === 'You') {
        if (this.verifiedName === this.address) {
          return this.isNotSavvyUser ? this.user.email : this.address
        }
        return this.verifiedName
      }

      if (this.name !== this.address) {
        return this.address
      }

      return this.name
    },

    name() {
      if (this.user && this.address === this.user.address) {
        return 'You'
      }

      return this.verifiedName
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../../assets/variables.styl"

.display-name
  max-width: 100%
  overflow: hidden
  white-space: nowrap
  display: inline-block
  vertical-align: middle
  text-overflow: ellipsis

</style>
