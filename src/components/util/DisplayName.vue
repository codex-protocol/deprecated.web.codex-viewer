<template>
  <span>
    <img
      class="icon"
      v-b-tooltip.hover
      v-if="isUserVerified"
      src="../../assets/icons/verified-user.svg"
    >
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
    ...mapState('app', ['publicCollections', 'verifiedUsers']),

    matchedPublicCollection() {

      const matchedPublicCollection = this.publicCollections.find((publicCollection) => {
        return publicCollection.userAddress === this.address
      })

      if (matchedPublicCollection && matchedPublicCollection.type && matchedPublicCollection.shareCode) {
        return matchedPublicCollection
      }

      return null

    },

    destinationRoute() {

      if (!this.matchedPublicCollection) return null

      return {
        name: this.matchedPublicCollection.type,
        params: { shareCode: this.matchedPublicCollection.shareCode },
      }

    },

    isUserVerified() {
      return this.address !== this.verifiedName
    },

    verifiedName() {

      if (!this.verifiedUsers || !this.address) {
        return this.address
      }

      const verifiedName = this.verifiedUsers[this.address.toLowerCase()]

      if (!verifiedName) {
        return this.address
      }

      return this.verifiedUsers[this.address]
    },

    tooltipTitle() {

      if (this.name === 'You') {
        if (this.isUserVerified) {
          return this.verifiedName
        }
        return this.isNotSavvyUser ? this.user.email : this.address
      }

      if (this.isUserVerified) {
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

.icon
  width: 1.2em
  height: @width
  margin-right: .5em
  vertical-align: middle

</style>
