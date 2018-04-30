<template>
  <nav>
    <div class="image-container">
      <img src="../assets/logo.svg" />
    </div>
    <b-link to="/my-titles">Wallet</b-link>
    <b-link to="/my-transfers">Transfers</b-link>
    <b-link to="/my-offers">Offers</b-link>
    <a href="#" @click.prevent="logout">Logout</a>
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
  height: 100%
  position: fixed
  top: 0
  left: 0
  background-color: #09091F
  padding-top: 2em
  border-right: 2px solid #09091F

a
  padding: 1em
  padding-left: 2em
  color: $color-white
  display: block
  font-weight: bold
  box-sizing: border-box

  &:hover
    text-decoration: none
    background-color: #5f697a // TODO: move to pallette

.image-container
  width: 100%
  padding: 2em 1em
  background-color: $color-white
</style>
