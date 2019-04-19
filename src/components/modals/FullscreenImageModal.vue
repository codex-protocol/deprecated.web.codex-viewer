<template>
  <b-modal
    id="fullscreenImageModal"
  >
    <img :src="image.uri">
  </b-modal>
</template>

<script>

export default {

  props: {
    image: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {

    }
  },

  methods: {

  },
}
</script>

<style lang="stylus" scoped>

@import "../../assets/variables.styl"

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
    background-color: rgba($color-dark, .95)

  .modal-body
    display: flex
    padding: 1rem
    align-items: center
    justify-content: center

    img
      max-width: 100%
      max-height: 100%

</style>
