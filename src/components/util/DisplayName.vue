<template>
  <b-link
    v-b-tooltip.hover
    class="display-name"
    :title="tooltipTitle"
    :to="destinationRoute"
    v-if="destinationRoute"
  >
    {{ name }}
  </b-link>
  <span
    v-else
    v-b-tooltip.hover
    class="display-name"
    :title="tooltipTitle"
  >
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
    ...mapState('app', ['auctionHouses']),
    ...mapGetters('auth', ['isNotSavvyUser']),
    ...mapGetters('app', ['getVerifiedNameFromAddress']),

    destinationRoute() {

      const matchedAuctionHouse = this.auctionHouses.find((auctionHouse) => {
        return auctionHouse.userAddress === this.address
      })

      if (matchedAuctionHouse) {
        return {
          name: 'auction-house',
          params: { auctionHouseShareCode: matchedAuctionHouse.shareCode },
        }
      }

      return null

    },

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
