<template>
  <b-card @click.prevent="viewAuctionHouse">
    <div slot="header" class="carousel-container">
      <b-carousel
        :interval="slideDuration"
        class="fixed-size-carousel"
      >
        <b-carousel-slide
          :key="index"
          :img-src="previewImage"
          v-for="(previewImage, index) in auctionHouse.previewImages"
        ></b-carousel-slide>
      </b-carousel>
    </div>
    <div class="card-text">
      <p>
        <a href="#" @click.prevent="viewAuctionHouse">
          {{ auctionHouse.name }}
        </a>
      </p>
      <small class="text-muted">
        {{ auctionHouse.description }}
      </small>
    </div>
  </b-card>
</template>

<script>

export default {

  props: {
    auctionHouse: {
      type: Object,
      required: true,
    },
    slideDuration: {
      type: Number,
      default: 3000,
    },
  },

  methods: {
    viewAuctionHouse() {
      this.$router.push({
        name: 'auction-house',
        params: {
          auctionHouseShareCode: this.auctionHouse.shareCode,
        },
      })
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
