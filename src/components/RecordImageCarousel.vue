<template>
  <div class="record-carousel">
    <div v-if="codexRecord.metadata">
      <div v-if="!codexRecord.metadata.images.length">
        <b-img
          fluid
          :src="mainImageUri"
        />
      </div>
      <div
        v-else
        class="carousel-container"
      >
        <b-carousel
          controls
          :interval="0"
          class="fixed-size-carousel"
        >

          <b-carousel-slide :img-src="mainImageUri"></b-carousel-slide>

          <b-carousel-slide
            v-if="codexRecord.metadata.images.length"
            v-for="image in codexRecord.metadata.images"
            v-bind:key="image.id"
            :img-src="image.uri"
          />
        </b-carousel>
      </div>

    </div>
    <div class="private-img" v-else>
      <p>This Codex Record is private</p>
    </div>
  </div>
</template>

<script>
import getMainImageUri from '../filters/get-main-image-uri'

export default {
  props: ['codexRecord'],
  computed: {
    mainImageUri() {
      return this.activeMainImage || getMainImageUri(this.codexRecord.metadata)
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

.record-carousel
  padding: 1rem 0

.carousel
  width: 100%
  max-width: 100%
  height: 50vh

  @media (orientation: portrait)
    height: 50vh

  @media (orientation: landscape)
    height: 98vh

  @media (min-width: $breakpoint-sm) and (orientation: portrait)
    height: 60vh

  @media (min-width: $breakpoint-sm) and (orientation: landscape)
    height: 98vh

  @media (min-width: $breakpoint-md)
    height: 40vh

  @media (min-width: $breakpoint-sm) and (orientation: landscape)
    height: 40vh

.private-img
  width: 320px
  height: 320px
  display: flex
  text-align: center
  align-items: center
  justify-content: center
  background-color: $color-secondary

  > p
    color: white
    padding: 2em
    font-size: 2rem
</style>
