<template>
  <div class="container">
    <title-viewer-header button-name="Create title" />
    <div v-if="typeof titleId !== 'number'">
      <title-list v-bind:titles="titles" />
      <create-title-modal />
    </div>
    <div v-if="typeof titleId === 'number'">
      <title-detail
        v-bind:codex-title="titles[titleId]"
        v-on:transferTitle="transferTitle"
      />
    </div>
    <viewer-footer />
  </div>
</template>

<script>
import CreateTitleModal from './CreateTitleModal'
import TitleDetail from './TitleDetail'
import TitleViewerHeader from './TitleViewerHeader'
import TitleList from './TitleList'
import ViewerFooter from './ViewerFooter'

import mockTitlesArray from '../util/constants/mockTitles'

export default {
  name: 'title-viewer',
  components: {
    CreateTitleModal,
    TitleDetail,
    TitleViewerHeader,
    TitleList,
    ViewerFooter,
  },
  beforeCreate() {
    this.$store.dispatch('registerWeb3')
  },
  mounted() {
    this.$store.dispatch('getContract')
  },
  data() {
    return {
      titles: mockTitlesArray,
    }
  },
  methods: {
    transferTitle() {
      // TODO: Need another modal dialog to prompt for transfer details
      // const account = this.web3.account;
    },
  },
  computed: {
    titleId() {
      return this.$route.params.titleId
    },
  },
}
</script>

<style scoped>
h1 {
  font-weight: normal;
}
</style>
