<template>
  <a href="#" @click.prevent="viewTitle">
    <b-card
      :img-src="codexTitle.metadata.files[0].uri"
      img-top
    >
      <p>{{ codexTitle.metadata.name }}</p>
    </b-card>

  </a>
</template>

<script>
export default {
  name: 'title-list-item',
  props: ['codexTitle'],
  data() {
    return {
      route: { name: 'title-detail', params: { titleId: this.codexTitle.tokenId } },
    }
  },
  methods: {
    viewTitle() {
      this.$router.push(this.route)
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

img
  max-width: 15em

a
  color: $color-black
  font-weight: bold
  margin: 0.5em

  &:hover
    text-decoration: none
</style>
