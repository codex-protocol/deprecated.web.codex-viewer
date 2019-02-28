<template>
  <div class="carousel-background" :class="{ 'is-loading': isLoading, 'running': isRunning }">
    <div class="images">
      <img :src="url" :key="index" v-for="(url, index) in urls">
    </div>
  </div>
</template>

<script>

export default {

  props: {
    urls: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      isRunning: true,
      isLoading: false,
    }
  },

  created() {

    this.isLoading = true

    const promises = this.urls.map((url) => {

      const image = new Image()

      const promise = new Promise((resolve, reject) => {
        image.addEventListener('error', reject)
        image.addEventListener('load', resolve)
      })

      image.src = url

      return promise

    })

    Promise
      .all(promises)
      .finally(() => {
        this.isLoading = false
      })
  },
}

</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

// @TODO: this is totally fucked in Safari...
@keyframes pan
  0%
    transform: translateX(0%)

  50%
    transform: s("translateX(calc(-100% + 100vw - %s))", $side-nav-width)

  100%
    transform: translateX(0%)

.carousel-background
  top: 0
  left: 0
  width: 100%
  height: 100%
  position: absolute
  pointer-events: none
  background-image: url(../assets/images/pattern-dark.jpeg)

  &.running
    .images
      animation-play-state: running

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
    white-space: nowrap
    transition: opacity ease 1s
    animation: pan 60s ease-in-out 0s infinite paused

    @media (min-width: $breakpoint-sm)
      animation: pan 80s ease-in-out 0s infinite paused

    img
      height: 100%

  &.is-loading
    .images
      opacity: 0

</style>
