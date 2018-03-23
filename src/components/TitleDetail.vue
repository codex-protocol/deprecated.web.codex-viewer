<template>
  <div class="flex">
    <img v-bind:src="codexTitle.imageUrl" />
    <div class="top">
      <h1>{{ codexTitle.name }}</h1>
      <div>{{ codexTitle.description }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'title-detail',
  props: ['codexTitle'],
  data() {
    return {
      id: 0,
      name: '',
      description: '',
      imageUrl: '',
    };
  },
};
</script>

<style scope>
.flex {
  display: flex;
  flex-direction: row;
  align-items: baseline;
}
.top {
  align-self: flex-start;
}
img {
  max-height: 400px;
  max-width: 400px;
  margin-right: 30px;
}
</style>
