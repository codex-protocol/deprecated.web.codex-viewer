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
    }
  },

  methods: {
    imageLoaded(index) {

      this.numLoaded += 1

      if (this.numLoaded >= this.urls.length) {
        this.isLoading = false
        if (this.$refs.images.offsetWidth > this.$refs.container.offsetWidth) {
          this.isRunning = true

          // adjust the animationDuration by some factor of the screen size and
          //  number of images... ¯\_(⊙︿⊙)_/¯
          this.$refs.images.style.animationDuration = `${this.urls.length * (20 - Math.floor(this.$refs.container.offsetWidth / 200))}s`
        }
      }
    },
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
    transform: translateX(calc(-100% + 100vw)) // this kinda fucks up if the width of .images < 100vh with the sidebar open

    // this breaks on mobile since there's no sidebar, it's not that bad on
    //  desktop to just ignore the sidebar width and have the last image get
    //  cutoff a bit
    //
    // transform: s("translateX(calc(-100% + 100vw - %s))", $side-nav-width)

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
    text-align: center
    white-space: nowrap
    transition: opacity ease 1s
    animation: pan 60s ease-in-out 0s infinite paused

    @media (min-width: $breakpoint-sm)
      animation: pan 80s ease-in-out 0s infinite paused

    img
      height: 100%
      display: inline-block

  &.is-loading
    .images
      opacity: 0

</style>
