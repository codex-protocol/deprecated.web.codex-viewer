<template>
  <!--
    @NOTE: having ~10 galleries on one page all loading several 1-5 MB images
    was making the page slow to a crawl, so as of 2019-03-21 the list view cards
    no longer show carousels and instead they just show the first (randomly
    sorted) preview image
  -->
  <b-card
    img-top
    @click.prevent="viewGallery"
    :img-src="gallery.previewImages[0]"
  >
    <!-- <div slot="header" class="carousel-container">
      <b-carousel
        :interval="slideDuration"
        class="fixed-size-carousel"
      >
        <b-carousel-slide
          :key="index"
          :img-src="previewImage"
          v-for="(previewImage, index) in gallery.previewImages"
        ></b-carousel-slide>
      </b-carousel>
    </div> -->
    <div class="card-text">
      <p>
        <a href="#" @click.prevent="viewGallery">
          {{ gallery.name }}
        </a>
      </p>
      <small class="text-muted">
        {{ gallery.description }}
      </small>
    </div>
  </b-card>
</template>

<script>

export default {

  props: {
    gallery: {
      type: Object,
      required: true,
    },
    slideDuration: {
      type: Number,
      default: 3000,
    },
  },

  data() {
    return {
      route: { name: 'gallery', params: { galleryShareCode: this.gallery.shareCode } },
    }
  },

  methods: {
    viewGallery() {
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
