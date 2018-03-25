<template>
  <div>
    <div class="list-header">
        <div v-for="columnName in columnNames" v-bind:key="columnName">{{ columnName }}</div>
    </div>
    <div>
      <title-list-item v-for="title in titles"
        v-bind:codex-title="title"
        v-bind:key="title.id"
      />
    </div>
  </div>
</template>

<script>
import TitleListItem from './TitleListItem';

export default {
  name: 'title-list',
  props: ['titles'],
  components: {
    TitleListItem,
  },
  data() {
    return {
      columnNames: ['Title', 'TitleId', 'Action'],
    };
  },
};
</script>

<style scoped>
.list-header {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  text-transform: capitalize;
  background-color: #F1F1F1;
  padding: 0 6px;
  margin-bottom: 20px;
}
</style>
