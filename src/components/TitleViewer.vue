<template>
  <div class="container">
    <title-viewer-header :showBack="titleId >= 0" />
    <create-title-modal />
    <router-view name="list" :titles="titles"  />
    <router-view name="detail" :codex-title="titles[titleId]" />
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
