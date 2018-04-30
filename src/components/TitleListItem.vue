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
.image-container
  height 80px
  width 80px
  background-color #5f697a
  margin 0 auto

img
  max-width 15em

a
  color inherit
  border 1px solid white
  margin 0.5em

a:hover
  text-decoration none
  border 1px solid lightgray

</style>
