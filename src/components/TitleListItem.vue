<template>
  <a class="item" href="#" @click.prevent="viewTitle">
    <div>
      <div class="image-container">
        <img :src="codexTitle.metadata.imageUri" />
      </div>
    </div>
    <div>{{ codexTitle.metadata.name }}</div>
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
  flex-wrap: wrap;
  align-items: center;
}

.item > div {
  text-align: center;
  width: 25%;
}

.item > div:nth-child(2) {
  width: 50%;
}

.image-container {
  height: 80px;
  width: 80px;
  background-color: #5f697a;
  margin: 0 auto;
}

img {
  max-height: 80px;
  max-width: 80px;
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
