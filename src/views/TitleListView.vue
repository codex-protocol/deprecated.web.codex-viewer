<template>
  <div>
    <div class="header">
      <h1>Your wallet</h1>
      <b-button v-b-modal.createTitleModal>Create title</b-button>
    </div>
    <div v-if="titles">
      <div v-if="titles.length">
        <div class="title-list">
            <div class="list-header" v-for="columnName in columnNames" :key="columnName">{{ columnName }}</div>
        </div>
        <title-list-item v-for="title in titles"
          :codex-title="title"
          :key="title.tokenId"
        />
      </div>
      <div v-else>
        You have no titles in your wallet!
      </div>
    </div>
    <div v-else>
      Loading...
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

.title-list {
  display: flex;
  flex-wrap: wrap;

  padding: 0 0.5em;
  margin-bottom: 20px;
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
