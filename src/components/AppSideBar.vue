<template>
  <nav>
    <div class="image-container">
      <img src="../assets/logos/codex/gold.svg">
    </div>
    <b-link to="/my-titles">
      <img src="../assets/icons/collection.svg">Collection
    </b-link>
    <b-link to="/my-transfers">
      <img src="../assets/icons/transfers.svg">Transfers
    </b-link>
    <b-link to="/my-offers">
      <img src="../assets/icons/offers.svg">Offers
    </b-link>
    <b-link to="/settings">
      <img src="../assets/icons/settings.svg">Settings
    </b-link>
    <span class="spacer"></span>
    <b-link @click.prevent="logout">
      <img src="../assets/icons/logout.svg">Logout
    </b-link>
  </nav>
</template>

<script>
export default {
  name: 'app-side-bar',
  methods: {
    logout() {
      this.$store.dispatch('logout', this.$router)
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

nav
  width: 12rem
  height: 100%
  min-width: @width
  max-width: @width
  background-color: rgba(white, .05)
  border-right: 2px solid rgba(black, .25)

  display: flex
  flex-direction: column

.spacer
  flex-grow: 1

a
  padding: 1rem
  display: block
  line-height: 1rem
  font-weight: bold
  box-sizing: border-box
  color: lighten($color-secondary, 50%)

  &:hover
    text-decoration: none
    background-color: rgba(white, .1)

  img
    margin-right: .5rem

.image-container
  padding: 1rem
  height: 2.5rem
  box-sizing: content-box

  img
    height: 100%

</style>
