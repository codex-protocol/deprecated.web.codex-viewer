<template>
  <div>
    <div class="header">
      <h1>Collection</h1>
      <div class="network-details">{{ web3.account }} ({{ web3.network }})</div>
      <div class="spacer"></div>
      <b-button variant="primary" v-b-modal.createTitleModal>Add New Asset</b-button>
    </div>
    <b-card-group deck class="title-list" v-if="titles.length">
      <title-list-item v-for="title in titles"
        :codex-title="title"
        :key="title.tokenId"
      />
    </b-card-group>
    <div v-else>
      You have no items in your collection!
    </div>
    <create-title-modal />
  </div>
</template>

<script>
import axios from 'axios'

import TitleListItem from '../components/TitleListItem'
import CreateTitleModal from '../components/modals/CreateTitleModal'

export default {
  name: 'title-list',
  components: {
    TitleListItem,
    CreateTitleModal,
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
    font-family: $font-family-serif
    font-size: 2.25rem
    font-weight: bold
    line-height: 3.375rem

    margin: 0 .5em 0 0
    padding-right: .5em
    border-right: 1px solid $color-primary

  .network-details
    font-size: 1.25rem
    word-break: break-word

  .spacer
    flex-grow: 1

  button
    margin-left: 1em

.title-list
  display: flex
  flex-wrap: wrap

</style>
