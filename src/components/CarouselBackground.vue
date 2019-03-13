<template>
  <div
     ref="container"
    class="carousel-background"
    :class="{ 'is-loading': isLoading, 'running': isRunning && !isLoading }"
  >
    <div class="images" ref="images">
      <img @load="imageLoaded(index)" :src="url" :key="index" v-for="(url, index) in urls">
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'

export default {

  props: {
    urls: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      numLoaded: 0,
      isLoading: true,
      isRunning: false,

      animationSpeed: 0.1,
      animationPosition: 0,
      animationDirection: -1, // start going to the left
    }
  },

  computed: {
    ...mapState('app', ['$globalRefs']),

    $images() {
      return this.$refs.images
    },

    $container() {
      return this.$refs.container
    },

    $mainContentWrapper() {
      return this.$globalRefs['main-content-wrapper']
    },
  },

  watch: {
    isRunning(newValue, oldValue) {
      if (newValue) {
        window.requestAnimationFrame(this.animationFrame)
      }
    },
  },

  mounted() {
    this.$globalRefs['main-content-wrapper'].addEventListener('scroll', this.onScroll)
  },

  beforeDestroy() {
    this.$globalRefs['main-content-wrapper'].removeEventListener('scroll', this.onScroll)
    this.stop() // make sure the requestAnimationFrame loop doesn't leak
  },

  methods: {

    play() {
      this.isRunning = true
    },

    stop() {
      this.isRunning = false
    },

    onScroll() {
      if (this.isLoading) return

      if (!this.isRunning && this.$globalRefs['main-content-wrapper'].scrollTop < this.$container.offsetHeight) {
        this.play()
      }

      if (this.isRunning && this.$globalRefs['main-content-wrapper'].scrollTop >= this.$container.offsetHeight) {
        this.stop()
      }
    },

    animationFrame(currentTime) {

      if (!this.isRunning || this.isLoading) return

      this.animationPosition += this.animationSpeed * this.animationDirection

      if (this.animationPosition <= -100) {
        this.animationPosition = -100
        this.animationDirection *= -1

      } else if (this.animationPosition > 0) {
        this.animationPosition = 0
        this.animationDirection *= -1
      }

      this.$images.style.transform = `translateX(calc(${this.animationPosition}% + ${this.$container.offsetWidth * (this.animationPosition / -100)}px))`

      window.requestAnimationFrame(this.animationFrame)
    },

    imageLoaded(index) {

      this.numLoaded += 1

      if (this.numLoaded >= this.urls.length) {

        this.isLoading = false

        if (this.$images.offsetWidth > this.$container.offsetWidth) {
          this.play()

          // since the animation is percentage-based, more images will cause a
          //  faster scroll speed... let's compensate for that by scalling
          //  animationSpeed down by a factor of the total width
          this.animationSpeed = 100 / this.$images.offsetWidth
        }
      }
    },
  },
}

</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

.carousel-background
  top: 0
  left: 0
  width: 100%
  height: 100%
  position: absolute
  pointer-events: none
  background-image: url(../assets/images/pattern-dark.jpeg)

  &::after
    top: 0
    left: 0
    content: ''
    width: 100%
    height: 100%
    position: absolute
    background: linear-gradient(to top, rgba(black, .25) 0%, transparent 50%, rgba(black, .25) 100%)

  .images
    top: 0
    left: 0
    opacity: 1
    height: 100%
    min-width: 100%
    max-height: 100%
    position: absolute
    text-align: center
    white-space: nowrap
    transition: opacity ease 1s

    img
      height: 100%
      display: inline-block

  &.is-loading
    .images
      opacity: 0

</style>
