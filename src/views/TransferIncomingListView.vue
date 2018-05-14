<template>
  <div>
    <app-header title="Transfers" />
    <app-sub-header activeTab="incoming" />
    <b-card-group deck class="title-list" v-if="titles.length">
      <title-transfer-list-item v-for="title in titles"
        :codex-title="title"
        :key="title.tokenId"
      />
    </b-card-group>
    <div v-else>
      You have no incoming transfers.
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import AppHeader from '../components/AppHeader'
import AppSubHeader from '../components/AppSubHeader'
import TitleTransferListItem from '../components/TitleTransferListItem'

export default {
  name: 'title-list',
  components: {
    AppHeader,
    AppSubHeader,
    TitleTransferListItem,
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
      axios.get('/user/transfers/incoming?include=metadata').then((response) => {
        const { result, error } = response.data
        if (error) {
          console.log('there was an error fetching incoming transfers', error)
        } else {
          this.titles = result
        }
      }).catch((error) => {
        console.log('there was an error fetching incoming transfers', error)
      })
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.header
  height: 2.5rem
  font-size: 2.5rem
  margin-bottom: 2rem
  color: $color-primary

  display: flex
  align-items: center

  h1
    font-size: 1em
    font-weight: bold
    line-height: 1em
    font-family: $font-family-serif

    margin: 0 .5em 0 0
    padding-right: .5em
    border-right: 1px solid $color-primary

  .network-details
    font-size: .4em
    word-break: break-word

h1, h2
  display: inline

.title-list
  display: flex
  flex-wrap: wrap

</style>
