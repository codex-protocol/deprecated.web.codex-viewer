<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <AppHeader title="Galleries" />

        <div v-if="galleries.length">
          <b-card-group deck>
            <GalleryListItem
              v-if="gallery.previewImages && gallery.previewImages.length !== 0"
              v-for="(gallery, index) in galleries"
              :slideDuration="3000 + (250 * index)"
              :gallery="gallery"
              :key="gallery.id"
            />
            <b-card
              title="Coming Soon"
              class="upsell-card"
            >
              <p class="card-text">
                Create your own public galleries!
              </p>
              <p class="card-text">
                Soon you will be able to organize your Collection into public galleries so you can share groups of Codex Records like the one you see here.
              </p>
            </b-card>
          </b-card-group>
        </div>

        <div v-else>
          No galleries have been created yet.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import AppHeader from '../components/core/AppHeader'
import GalleryListItem from '../components/GalleryListItem'

export default {

  components: {
    AppHeader,
    GalleryListItem,
  },

  computed: {
    ...mapState('app', ['galleries']),
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

.card
  card()

  &.upsell-card
    .card-body
      background-color: rgba(white, .1)

</style>
