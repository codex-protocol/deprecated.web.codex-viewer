<template>
  <span class="display-name" v-b-tooltip.hover :title="tooltipTitle">
    {{ processedName }}
  </span>
</template>

<script>
import {
  mapState,
  mapGetters,
} from 'vuex'

export default {
  name: 'DisplayName',

  props: {
    name: String,
    userObject: Object,
  },

  data() {
    const selectedName = this.userObject
      ? this.userObject.email || this.userObject.address
      : this.name

    return {
      selectedName,
    }
  },

  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters('app', ['getVerifiedNameFromAddress']),

    tooltipTitle() {
      return this.processedName === 'You'
        ? this.getVerifiedNameFromAddress(this.selectedName)
        : this.processedName
    },

    processedName() {
      // If userObject is defined, show the full selected name instead of 'You'
      if (this.user && !this.userObject && this.selectedName === this.user.address) {
        return 'You'
      }

      return this.getVerifiedNameFromAddress(this.selectedName)
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
