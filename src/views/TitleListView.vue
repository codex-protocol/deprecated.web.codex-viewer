<template>
  <div>
    <div class="header">
      <div>
        <h1>Your collection</h1>
        <h2 class="spacer"></h2>
        <span><small>{{ web3.account }} ({{ web3.network }})</small></span>
      </div>
      <b-button v-b-modal.createTitleModal>Add new item</b-button>
    </div>
    <div class="title-list" v-if="titles.length">
      <title-list-item v-for="title in titles"
        :codex-title="title"
        :key="title.tokenId"
      />
    </div>
    <div v-else>
      You have no items in your collection!
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import TitleListItem from '../components/TitleListItem'

export default {
  name: 'title-list',
  components: {
    TitleListItem,
  },
  data() {
    return {
      titles: [],
      columnNames: ['Preview', 'Piece title', 'Created at'],
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    web3() {
      return this.$store.state.web3
    },
    authToken() {
      return this.$store.state.auth.token
    },
  },
  methods: {
    fetchData() {
      axios.get('/user/titles?include=metadata').then((response) => {
        const { result, error } = response.data
        if (error) {
          console.log('there was an error calling getTitles', error)
        } else {
          this.titles = result
        }
      }).catch((error) => {
        console.log('there was an error calling getTitles', error)
      })
    },
  },
}
</script>

<style scoped>
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
}

h1, h2 {
  display: inline;
}

.spacer {
  border-left: 1px solid black;
  margin: 0 0.25em;
}

.title-list {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
}

.list-header {
  text-transform: capitalize;
  background-color: #F1F1F1;
  text-align: center;
  padding: 1em;
  font-weight: bold;
  width: 25%;
}

.list-header:nth-child(2) {
  width: 50%;
}
</style>
