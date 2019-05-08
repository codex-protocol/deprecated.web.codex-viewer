<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <AppHeader title="Featured Collections" />

        <div v-if="featuredCollections.length">
          <b-card-group deck>
            <FeaturedCollectionListItem
              :key="featuredCollection.shareCode"
              :featuredCollection="featuredCollection"
              v-for="featuredCollection in featuredCollections"
              v-if="featuredCollection.previewImages && featuredCollection.previewImages.length !== 0"
            />
            <b-card title="Get Featured" class="upsell-card">
              <p class="card-text">
                Are you interested in having your collection feature here?
                Click the button below to start the application process!
              </p>
              <b-button variant="primary" target="_blank" :href="applyLink">Apply Here</b-button>
            </b-card>
          </b-card-group>
        </div>

        <div v-else>
          No featured collections have been created yet.
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'

import AppHeader from '../components/core/AppHeader'
import FeaturedCollectionListItem from '../components/FeaturedCollectionListItem'

export default {

  components: {
    AppHeader,
    FeaturedCollectionListItem,
  },

  computed: {
    ...mapState('app', ['featuredCollections']),
  },

  data() {
    return {
      applyLink: 'https://docs.google.com/forms/d/e/1FAIpQLScQ5TJch9l9suu3JbxiRsc0JWYc4znVJrafFFxpOHY6Lyfi7w/viewform',
    }
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

    .btn
      width: 100%

</style>
