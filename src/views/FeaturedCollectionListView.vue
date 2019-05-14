<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <AppHeader title="Featured Collections" />

        <div v-if="truncatedFeaturedCollections.length">
          <b-card-group deck>
            <FeaturedCollectionListItem
              :order="index + 1"
              :key="featuredCollection.shareCode"
              :featuredCollection="featuredCollection"
              v-for="(featuredCollection, index) in truncatedFeaturedCollections"
              v-if="featuredCollection.previewImages && featuredCollection.previewImages.length !== 0"
            />
            <b-card
              class="upsell-card"
              title="Get Featured"
              :style="{ order: upsellCardSlotNumber }"
            >
              <p class="card-text">
                Are you interested in having your collection feature here?
                Click the button below to start the application process!
              </p>
              <b-button variant="primary" target="_blank" :href="verifiedUserLinks.apply">Apply Here</b-button>
            </b-card>
          </b-card-group>

          <div class="pagination-controls" v-if="featuredCollections.length > paginationOptions.pageSize">
            <b-button
              size="sm"
              @click="loadMore()"
              variant="outline-primary"
              :disabled="truncatedFeaturedCollections.length >= featuredCollections.length"
            >
              Load More
            </b-button>
          </div>

        </div>

        <div v-else>
          No featured collections have been created yet.
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import is from 'is_js'
import { mapState } from 'vuex'

import config from '../util/config'

import AppHeader from '../components/core/AppHeader'
import LoadingIcon from '../components/util/LoadingIcon'
import FeaturedCollectionListItem from '../components/FeaturedCollectionListItem'

export default {

  components: {
    AppHeader,
    LoadingIcon,
    FeaturedCollectionListItem,
  },

  data() {
    return {
      paginationOptions: {
        pageNumber: 1,
        pageSize: is.mobile() ? 4 : 15, // a page size of 15 allows for 4 rows of 4, including the "upsell card"
      },
      verifiedUserLinks: config.verifiedUserLinks,
    }
  },

  computed: {
    ...mapState('app', ['featuredCollections']),

    // always position the upsell card somewhere on the second row
    upsellCardSlotNumber() {
      return Math.round(Math.random() * 3) + 4
    },

    truncatedFeaturedCollections() {
      return this.featuredCollections.slice(0, this.paginationOptions.pageSize * this.paginationOptions.pageNumber)
    },
  },

  methods: {
    loadMore() {
      if (this.truncatedFeaturedCollections.length >= this.featuredCollections.length) return
      this.paginationOptions.pageNumber += 1
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

.card
  card()

  &.upsell-card
    border-radius: 0
    align-self: flex-start

    .card-body
      background-color: transparent

.pagination-controls
  display: flex
  margin: 2rem 0
  justify-content: center

</style>
