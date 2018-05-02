<template>
  <a class="title-card" href="#" @click.prevent="viewTitle">
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

.title-card
  width: 25%
  margin-bottom: 2em

  .card
    border: none

  img
    max-width: 100%
    max-height: 100%
    object-fit: contain

  a
    font-weight: bold
    color: $color-dark

    &:hover
      text-decoration: none

</style>
