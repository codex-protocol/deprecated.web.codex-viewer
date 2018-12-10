<template>
  <span
    :class="[type, size]"
    class="loading-icon"
  ></span>
</template>

<script>
export default {
  name: 'LoadingIcon',

  props: {
    size: {
      type: String,
      default: 'large',
    },
    type: {
      type: String,
      default: 'transparent',
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../../assets/variables.styl"

.loading-icon
  &::before
    content: ""
    width: 4rem
    height: 4rem
    z-index: 999
    border-radius: 50%
    border-width: .5rem
    border-style: solid
    display: inline-block
    vertical-align: text-bottom
    animation: spin 1s linear infinite

    border-color: rgba($color-primary, .25)
    border-top-color: $color-primary

  &.small
    &::before
      width: 1rem
      height: 1rem
      border-width: .1rem

  &.light
    &::before
      border-color: rgba($color-secondary, .25)
      border-top-color: $color-secondary

  @keyframes spin
    from
      transform: rotate(0deg)

    to
      transform: rotate(360deg)

</style>
