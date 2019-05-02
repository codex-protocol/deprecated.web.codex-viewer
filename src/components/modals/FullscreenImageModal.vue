<template>
  <b-modal
    @show="beforeShow"
    id="fullscreenImageModal"
    @keydown.native="onKeydown"

    v-model="modalVisible"
    @click.native="modalVisible = false"
  >
    <div class="full-screen-image-container">
      <div class="image"
        @touchend="onTouchEnd"
        @touchmove="onTouchMove"
        @touchstart="onTouchStart"
      >
        <img
          @click.stop
          v-if="images[currentIndex]"
          :src="images[currentIndex].uri"
        >
      </div>
      <template v-if="images.length > 1">
        <div class="buttons">
          <b-button variant="primary" @click.stop="previous">Previous</b-button>
          <b-button variant="primary" @click.stop="next">Next</b-button>
        </div>
        <p class="keyboard-note">you can also {{ isMobile ? 'swipe' : 'use the arrow keys' }}</p>
      </template>
    </div>
  </b-modal>
</template>

<script>

import is from 'is_js'

export default {

  props: {
    images: {
      type: Array,
      required: true,
    },
    startIndex: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      touchStartX: null,
      touchCurrentX: null,
      modalVisible: false,
      isMobile: is.mobile(),
      currentIndex: this.startIndex,
    }
  },

  methods: {
    beforeShow() {
      this.currentIndex = this.startIndex
    },

    onKeydown(event) {
      switch (event.code) {
        case 'ArrowLeft':
          this.previous()
          break

        case 'ArrowRight':
          this.next()
          break

        default:
          // do nothing
      }
    },

    previous() {
      if (this.currentIndex === 0) this.currentIndex = this.images.length - 1
      else this.currentIndex -= 1
    },

    next() {
      if (this.currentIndex === this.images.length - 1) this.currentIndex = 0
      else this.currentIndex += 1
    },

    onTouchStart(event) {
      if (!event || !event.touches || !event.touches[0]) return
      this.touchCurrentX = event.touches[0].clientX
      this.touchStartX = event.touches[0].clientX
    },

    onTouchMove(event) {
      if (!event || !event.touches || !event.touches[0]) return
      this.touchCurrentX = event.touches[0].clientX
    },

    onTouchEnd(event) {
      const delta = Math.abs(this.touchStartX - this.touchCurrentX)

      if (delta > 50) {
        this.touchStartX > this.touchCurrentX ? this.next() : this.previous()
      }

      this.touchStartX = null
      this.touchCurrentX = null
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../../assets/variables.styl"

.full-screen-image-container
  width: 100%
  height: 100%

  display: flex
  align-items: center
  flex-direction: column
  justify-content: flex-end

  .image
    width: 100%
    display: flex
    align-items: center
    justify-content: center
    height: calc(100vh - 2rem - 5.5rem) // 2rem = modal padding, 5.5rem enough for the buttons and such

    // if we're not showing the navigation buttons, make the image take up the
    //  full space... all this wierd height calc() stuff is really a workaround
    //  for firefox not displaying this flex layout like chrome & safari
    &:only-child
      height: 100%

    img
      max-width: 100%
      max-height: 100%
      object-fit: contain

  .buttons
    display: flex
    flex-shrink: 0
    margin-top: 1rem

    button + button
      margin-left: 1rem

  .keyboard-note
    flex-shrink: 0
    font-size: small
    margin: .5rem 0 0
    color: $color-gray

</style>

<style lang="stylus">

@import "../../assets/variables.styl"

#fullscreenImageModal

  .close
    top: 1rem
    right: 1rem
    z-index: 100
    font-size: 4rem
    position: absolute

  .modal-header
    padding: 0

  .modal-footer
    display: none

  .modal-body
  .modal-dialog
  .modal-content
    margin: 0
    padding: 0
    width: 100%
    height: 100%
    max-width: 100%
    max-height: 100%

  .modal-content
    backdrop-filter: blur(4px)
    background-color: rgba(darken($color-dark, 25%), .95)

  .modal-body
    padding: 1rem

</style>
