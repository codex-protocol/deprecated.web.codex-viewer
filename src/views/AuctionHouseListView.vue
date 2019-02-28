<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <AppHeader title="Auction Houses" />

        <div v-if="auctionHouses.length">
          <b-card-group deck>
            <AuctionHouseListItem
              v-if="auctionHouse.previewImages && auctionHouse.previewImages.length !== 0"
              v-for="(auctionHouse, index) in auctionHouses"
              :slideDuration="3000 + (250 * index)"
              :auctionHouse="auctionHouse"
              :key="auctionHouse.id"
            />
          </b-card-group>
        </div>

        <div v-else>
          No auction houses have been created yet.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import AppHeader from '../components/core/AppHeader'
import AuctionHouseListItem from '../components/AuctionHouseListItem'

export default {

  components: {
    AppHeader,
    AuctionHouseListItem,
  },

  computed: {
    ...mapState('app', ['auctionHouses']),
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

.card
  card()
  min-width: 180px

</style>
