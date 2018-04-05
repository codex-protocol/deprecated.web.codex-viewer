<template>
  <div>
    <div v-if="titles.length">
      <div class="list-header">
          <div v-for="columnName in columnNames" :key="columnName">{{ columnName }}</div>
      </div>
      <div>
        <title-list-item v-for="title in titles"
          :codex-title="title"
          :key="title.tokenId"
        />
      </div>
    </div>
    <div v-else>
      Loading...
    </div>
  </div>
</template>

<script>
import getTitles from '../util/api/getTitles'
import mockTitlesArray from '../util/constants/mockTitles'

import TitleListItem from '../components/TitleListItem'

export default {
  name: 'title-list',
  components: {
    TitleListItem,
  },
  data() {
    return {
      titles: [],
      columnNames: ['Title', 'TitleId', 'Action'],
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    useMockData() {
      return this.$store.state.web3.useMockData
    },
    web3() {
      return this.$store.state.web3
    },
    authToken() {
      return this.$store.state.auth.token
    },
  },
  watch: {
    useMockData: 'fetchData',
  },
  methods: {
    fetchData() {
      if (this.useMockData) {
        this.titles = mockTitlesArray
        return
      }

      const self = this
      getTitles(this.web3.account, this.authToken).then((response) => {
        if (response.error) {
          console.log('there was an error calling getTitles', response.error)
        } else {
          self.titles = response.result
        }
      }).catch((error) => {
        console.log('there was an error calling getTitles', error)
      })
    },
  },
}
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
