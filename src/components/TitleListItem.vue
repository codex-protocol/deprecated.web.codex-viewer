<template>
  <div class="item">
    <div class="info">
      <img :src="codexTitle.imageUrl" />
      <div> {{ codexTitle.name }}</div>
    </div>
    <div> {{ codexTitle.id }}</div>
    <b-button class="button" :to="route">View title</b-button>
  </div>
</template>

<script>
export default {
  name: 'title-list-item',
  props: ['codexTitle'],
  data() {
    return {
      route: { name: 'title-detail', params: { titleId: this.codexTitle.id } },
    }
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

  .info {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    justify-content: space-around;
  }

  img {
    max-height: 100px;
    max-width: 100px;
    margin-right: 20px;
  }

  .button {
    background-color: #552B78;
  }
</style>
