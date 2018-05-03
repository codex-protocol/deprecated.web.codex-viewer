<template>
  <div class="title-card" @click.prevent="viewTitle">
    <b-card
      v-if="codexTitle.metadata"
      :img-src="codexTitle.metadata.files[0].uri"
      img-top
    >
      <p>
        <a href="#" @click.prevent="viewTitle">
          {{ codexTitle.metadata.name }}
        </a>
      </p>
      <small>#{{ codexTitle.tokenId }}</small>
    </b-card>

  </div>
</template>

<script>
export default {
  name: 'title-list-item',
  props: ['codexTitle'],
  data() {

    // TODO: Need a way to render titles in collection w/ no metadata (e.g., one was created in a different Provider)
    if (!this.codexTitle.metadata) {
      console.log(JSON.stringify(this.codexTitle))
    }

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
  max-width: 32rem
  margin-bottom: 2em

  .card
    border: none
    cursor: pointer
    border-radius: 0 0 .25rem .25rem

  .card-body
    border-top: 1px solid rgba(black, .1)

    img
      max-width: 100%
      max-height: 100%
      object-fit: contain

    a
      font-weight: bold
      color: $color-dark

    small
      color: $color-light-gray

</style>
