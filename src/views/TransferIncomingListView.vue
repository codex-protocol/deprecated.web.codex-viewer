<template>
  <div>
    <div class="header">
      <h1>Transfers</h1>
      <div class="network-details">{{ web3.account }} ({{ web3.network }})</div>
    </div>
    <div class="sub-heading">
      <span class="active">Incoming</span>
      <!--
        // @TODO: Add at a later point.
        <span><b-link to="/transfers/outgoing">Outgoing</b-link></span>
        <span><b-link to="/transfers/completed">Completed</b-link></span>
      -->
    </div>
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

import TitleTransferListItem from '../components/TitleTransferListItem'

export default {
  name: 'title-list',
  components: {
    TitleTransferListItem,
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
  },
  methods: {
    fetchData() {
      axios.get('/user/approved-titles?include=metadata').then((response) => {
        const { result, error } = response.data
        if (error) {
          console.log('there was an error fetching approved transfered titles', error)
        } else {
          this.titles = result
        }
      }).catch((error) => {
        console.log('there was an error fetching approved transfered titles', error)
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
  margin-bottom: 1rem
  color: $color-primary

  display: flex
  align-items: center

  h1
    font-family: $font-family-serif
    font-size: 2.25rem
    font-weight: bold
    line-height: 3.375rem

    margin: 0 1.125rem 0 0
    padding-right: 1.125rem
    border-right: 1px solid $color-primary

  .network-details
    font-size: 1.25rem
    word-break: break-word

.sub-heading
  font-weight: 300
  margin-bottom: 1rem

  span
    display: inline-block
    padding: 0 .25rem

  .active
    color: $color-secondary-accent
    font-weight: 600
    border-bottom: 3px solid $color-secondary-accent

h1, h2
  display: inline

.title-list
  display: flex
  flex-wrap: wrap

</style>
