<template>
  <div class="header">
    <h1>{{ title }}</h1>
    <div class="slots">
      <div class="buttons">
        <slot name="buttons"></slot>
      </div>
      <div class="actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  props: {
    title: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../../assets/variables.styl"

.header
  margin-top: 1rem
  margin-bottom: 1rem
  color: $color-primary

  display: flex
  flex-direction: column

  h1
    line-height: 1em
    font-size: 2.5rem
    font-weight: bold
    margin-bottom: 1rem
    font-family: $font-family-serif

    @media screen and (min-width: $breakpoint-sm)
      margin-top: 1rem

  .slots
    display: flex
    align-items: center
    flex-direction: column
    justify-content: space-between

    @media screen and (min-width: $breakpoint-sm)
      flex-direction: row

    >div
      width: 100%
      display: flex
      flex-direction: column

      @media screen and (min-width: $breakpoint-sm)
        width: auto
        flex-direction: row

      >* + *
        margin-top: .5rem

        @media screen and (min-width: $breakpoint-sm)
          margin-top: 0
          margin-left: .5rem

      &+div:not(:empty)
        margin-top: 1rem

        @media screen and (min-width: $breakpoint-sm)
          margin-top: 0rem

</style>
