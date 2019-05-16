<template>
  <b-modal
    @show="beforeShow"
    id="fullscreenImageModal"
    @keydown.native="onKeydown"

    v-model="modalVisible"
    @click.native="modalVisible = useFullscreen ? modalVisible : false"
  >
    <div class="full-screen-image-container" v-if="records">
      <div class="image"
        @touchend="onTouchEnd"
        @touchmove="onTouchMove"
        @touchstart="onTouchStart"
      >
        <LoadingOverlay :show="isLoading" type="dark" />
        <img
          @click.stop
          v-if="images[currentIndex]"
          :src="images[currentIndex].uri"
          v-on-load="() => { imageLoaded(currentIndex) }"
        >
      </div>
      <p
        @click.stop
        class="record-info"
        v-if="mode === 'records' && records[currentIndex] && records[currentIndex].metadata"
      >
        <b-link :to="{ name: 'record-detail', params: { recordId: records[currentIndex].tokenId } }">
          {{ records[currentIndex].metadata.name }}
        </b-link>
      </p>
      <template v-if="images.length > 1">
        <div class="actions">
          <b-button variant="primary" :disabled="!loop && currentIndex === 0" @click.stop="previous">Previous</b-button>
          <b-button variant="primary" :disabled="!loop && currentIndex === images.length - 1" @click.stop="next">Next</b-button>
        </div>
        <p class="keyboard-note">you can also {{ isMobile ? 'swipe' : 'use the arrow keys' }}</p>
      </template>
    </div>
  </b-modal>
</template>

<script>

import is from 'is_js'

import LoadingOverlay from '../util/LoadingOverlay'

import fullscreenHelper from '../../util/fullscreenHelper'

export default {

  components: {
    LoadingOverlay,
  },

  props: {
    loop: {
      type: Boolean,
      default: false,
    },
    useFullscreen: {
      type: Boolean,
      default: false,
    },
    records: {
      type: Array,
      required: true,
    },
    mode: {
      type: String,
      validator: (value) => {
        return value === 'records' || value === 'images'
      },
    },
    startImage: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      currentIndex: 0,
      isLoading: false,
      touchStartX: null,
      touchCurrentX: null,
      modalVisible: false,
      isMobile: is.mobile(),
    }
  },

  computed: {
    images() {
      return this.records.flatMap((record) => {
        if (!record.metadata) return []
        return [record.metadata.mainImage].concat(this.mode === 'records' ? [] : record.metadata.images)
      })
    },
  },

  watch: {
    modalVisible(newValue) {
      if (!newValue) {
        fullscreenHelper.exitFullscreen()
      }
    },
  },

  methods: {
    beforeShow() {
      if (this.useFullscreen) fullscreenHelper.requestFullscreen(document.getElementById('fullscreenImageModal'))
      this.currentIndex = this.images.indexOf(this.startImage)
      if (this.currentIndex === -1) this.currentIndex = 0
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

      if (this.images.length <= 1) return

      this.currentIndex -= 1

      if (this.currentIndex === -1) {
        if (this.loop) this.currentIndex = this.images.length - 1
        else this.currentIndex = 0
      }

      this.isLoading = true
    },

    next() {

      if (this.images.length <= 1) return

      this.currentIndex += 1

      if (this.currentIndex === this.images.length) {
        if (this.loop) this.currentIndex = 0
        else this.currentIndex = this.images.length - 1
      }

      this.isLoading = true
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
        (this.touchStartX > this.touchCurrentX ? this.next : this.previous)()
      }

      this.touchStartX = null
      this.touchCurrentX = null
    },

    imageLoaded(index) {
      this.isLoading = false
      this.$emit('change', index)
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
    position: relative
    align-items: center
    flex-direction: column
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

  .record-info
    padding: 1em
    flex-shrink: 0
    min-width: 50%
    max-width: 100%
    max-height: 5rem
    overflow-y: auto
    font-weight: 700
    text-align: center
    margin: 1rem auto 0
    background-color: rgba(white, .05)

  .actions
    display: flex
    flex-shrink: 0
    margin-top: 1rem
    align-items: center

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
