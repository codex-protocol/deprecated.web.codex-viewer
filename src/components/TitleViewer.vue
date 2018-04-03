<template>
  <div class="container">
    <title-viewer-header :showBack="titleId >= 0" />
    <router-view name="list" />
    <router-view name="detail" />

    <div id="modals">
      <create-title-modal />
      <transfer-title-modal :titleId="titleId" />
    </div>
    <viewer-footer />
  </div>
</template>

<script>
import CreateTitleModal from './CreateTitleModal'
import TransferTitleModal from './TransferTitleModal'
import TitleDetail from './TitleDetail'
import TitleViewerHeader from './TitleViewerHeader'
import TitleList from './TitleList'
import ViewerFooter from './ViewerFooter'

export default {
  name: 'title-viewer',
  components: {
    CreateTitleModal,
    TransferTitleModal,
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
  methods: {
  },
  computed: {
    titleId() {
      return this.$route.params.titleId
    },
  },
}
</script>

<style scoped>
</style>
