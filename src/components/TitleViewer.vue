<template>
  <div class="container">
    <title-viewer-header :showBack="titleId >= 0" />
    <router-view name="list" />
    <router-view name="detail" />
    <create-title-modal />
    <viewer-footer />
  </div>
</template>

<script>
import CreateTitleModal from './CreateTitleModal'
import TitleDetail from './TitleDetail'
import TitleViewerHeader from './TitleViewerHeader'
import TitleList from './TitleList'
import ViewerFooter from './ViewerFooter'

export default {
  name: 'title-viewer',
  components: {
    CreateTitleModal,
    TitleDetail,
    TitleViewerHeader,
    TitleList,
    ViewerFooter,
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
