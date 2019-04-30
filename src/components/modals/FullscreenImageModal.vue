<template>
  <b-modal
    @show="beforeShow"
    id="fullscreenImageModal"
    @keydown.native="onKeydown"

    v-model="modalVisible"
    @click.native="modalVisible = false"
  >
    <div class="full-screen-image-container">
      <div class="image">
        <img
          @click.stop
          v-if="images[currentIndex]"
          :src="images[currentIndex].uri"
        >
      </div>
      <div class="buttons" v-if="images.length > 1">
        <b-button variant="primary" @click.stop="previous">Previous</b-button>
        <b-button variant="primary" @click.stop="next">Next</b-button>
      </div>
      <p v-if="!isMobile" class="keyboard-note">you can also use the arrow keys</p>
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
