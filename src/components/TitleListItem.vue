<template>
  <a href="#" class="item" @click.prevent="viewTitle">
    <img :src="codexTitle.imageUri" />
    <div>{{ codexTitle.name }}</div>
    <div>{{ codexTitle.createdAt }}</div>
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

<style scoped>
  .item {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    justify-content: space-around;
  }

  img {
    max-height: 100px;
    max-width: 100px;
  }

  a {
    padding: 10px;
    color: inherit;
    border: 1px solid white;
  }

  a:hover {
    text-decoration: none;
    border: 1px solid lightgray;
  }
</style>
