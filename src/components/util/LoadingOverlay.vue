<template>
  <div
    v-if="show"
    ref="overlay"
    :class="[type, size]"
    class="loading-overlay"
  >
    <LoadingIcon :type="type" :size="size" />
  </div>
</template>

<script>

import LoadingIcon from './LoadingIcon'

export default {

  components: {
    LoadingIcon,
  },

  props: {
    show: {
      type: Boolean,
      default: true, // default is true so you can use v-else on a <LoadingOverlay> without also specifying this prop
    },
    size: {
      type: String,
      default: 'large',
    },
    type: {
      type: String,
      default: 'light',
    },
  },

  mounted() {
    // add a "loading-overlay-container" ref somewhere in the parent component
    //  to have it's position automatically set to "relative" (if it's not
    //  already positioned somehow)
    const loadingOverlayContainer = this.$parent.$refs['loading-overlay-container']
    if (loadingOverlayContainer) {
      if (window.getComputedStyle(loadingOverlayContainer).position === 'static') {
        loadingOverlayContainer.style.position = 'relative'
        this.$refs.overlay.style.position = 'absolute'
      }
    }
  },
}
</script>

<style lang="stylus" scoped>

@import "../../assets/variables.styl"

.loading-overlay
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 998
  display: flex
  position: absolute
  align-items: center
  justify-content: center
  background-color: rgba($color-dark, .8)

  &.light
    background-color: rgba(lighten($color-primary, 50%), .75)

  &.transparent
    background-color: transparent

</style>
