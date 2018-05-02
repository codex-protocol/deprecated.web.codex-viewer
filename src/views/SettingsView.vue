<template>
  <div>
    <div class="header">
      <div>
        <h1>Settings and Privacy</h1>
        <h2 class="spacer"></h2>
        <span>{{ web3.account }} ({{ web3.network }})</span>
      </div>
    </div>
    <div class="title-list" v-if="titles.length">
      <b-container class="title-settings-row">
          <b-row>
              <b-col class="image"><span class="text">Image</span></b-col>
              <b-col class="name"><span class="text">Asset Name</span></b-col>
              <b-col class="toggle"><span class="text">Details Public</span></b-col>
          </b-row>
      </b-container>
      <title-privacy-settings-row-item v-for="title in titles"
        :codex-title="title"
        :key="title.tokenId"
        :isPrivate="title.isPrivate"
      />
    </div>
    <div v-else>
      You have no items in your collection!
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import TitlePrivacySettingsRowItem from '../components/TitlePrivacySettingsRowItem'

export default {
  name: 'title-list',
  components: {
    TitlePrivacySettingsRowItem,
  },
  data() {
    return {
      titles: [],
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    web3() {
      return this.$store.state.web3
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

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.header
  display: flex
  flex-direction: row
  justify-content: space-between
  align-items: center
  margin-bottom: 1rem

h1, h2
  display: inline

.spacer
  border-left: 1px solid $color-secondary
  margin: 0 0.5rem

.title-list
  display: flex
  flex-wrap: wrap
  flex-direction: row
  align-items: flex-start
  justify-content: space-between
  font-family: 'Montserrat', sans-serif

.title-settings-row
  background-color: $color-light
  height: 3.5rem
  font-size: 0.875rem
  font-weight: 600
  color: $color-primary

  .text
    opacity: 0.5

  .row
    display: flex
    align-items: center
    height: 3.5rem

  .name
    flex-grow: 5

  .toggle
    text-align: center
</style>
