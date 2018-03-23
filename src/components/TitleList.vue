<template>
  <div>
    <div class="list-header">
        <div v-for="columnName in columnNames" v-bind:key="columnName">{{ columnName }}</div>
    </div>
    <div>
      <title-list-item v-for="title in titles"
        v-bind:codex-title="title"
        v-bind:key="title.id"
        v-on:viewToken="viewTokenId"
      />
    </div>
  </div>
</template>

<script>
import TitleListItem from './TitleListItem';
import mockTitlesArray from '../util/constants/mockTitles';

export default {
  name: 'title-list',
  components: {
    TitleListItem,
  },
  data() {
    console.log(JSON.stringify(mockTitlesArray));
    return {
      columnNames: ['Title', 'TitleId', 'Action'],
      titles: mockTitlesArray,
    };
  },
  methods: {
    viewTokenId(tokenId) {
      this.$emit('viewTitleDetail', this.titles[tokenId]);
    },
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
