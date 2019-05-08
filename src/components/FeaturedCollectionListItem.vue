<template>
  <b-card
    img-top
    @click.prevent="viewFeaturedCollection"
    :img-src="featuredCollection.previewImages[0]"
  >
    <div class="card-text">
      <p>
        <a href="#" @click.prevent="viewFeaturedCollection">
          {{ featuredCollection.name }}
        </a>
      </p>
      <small class="text-muted">
        {{ featuredCollection.description }}
      </small>
    </div>
  </b-card>
</template>

<script>

export default {

  props: {
    featuredCollection: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      route: { name: 'featured-collection', params: { shareCode: this.featuredCollection.shareCode } },
    }
  },

  methods: {
    viewFeaturedCollection() {
      this.$router.push(this.route)
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.card
  card()
  cursor: pointer

</style>
