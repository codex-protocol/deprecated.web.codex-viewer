<template>
  <div>
    <div class="flex" v-if="codexTitle">
      <div class="vertical">
        <img :src="codexTitle.imageUri" />
        <div class="mt-3">
          <b-button v-if="showTransferButton" v-b-modal.transferTitleModal>Transfer title</b-button>
          <transfer-title-modal :titleId="titleId" />
        </div>
      </div>
      <div class="top">
        <div class="mb-5">
          <h1>{{ codexTitle.name }}</h1>
          <div>{{ codexTitle.description }}</div>
        </div>
        <title-provenance :provenance="codexTitle.provenance" />
      </div>
    </div>
    <div v-else>
      <div v-if="error">
        <p>There was an error loading title with id {{ this.titleId }}</p>
        <p>{{ this.error }}</p>
      </div>
      <div v-else>Loading...</div>
    </div>
  </div>
</template>

<script>
import getTitle from '../util/api/getTitle'
import mockTitlesArray from '../util/constants/mockTitles'

import TransferTitleModal from '../components/TransferTitleModal'
import TitleProvenance from '../components/TitleProvenance'

export default {
  name: 'title-detail',
  components: {
    TransferTitleModal,
    TitleProvenance,
  },
  data() {
    return {
      codexTitle: null,
      error: null,
    }
  },
  computed: {
    showTransferButton() {
      return this.$store.state.web3.account === this.codexTitle.ownerAddress
    },
    useMockData() {
      return this.$store.state.web3.useMockData
    },
    titleId() {
      return this.$route.params.titleId
    },
    authToken() {
      return this.$store.state.auth.token
    },
  },
  created() {
    this.fetchData()
  },
  watch: {
    $route: 'fetchData',
    useMockData: 'fetchData',
  },
  methods: {
    fetchData() {
      if (this.useMockData) {
        this.codexTitle = mockTitlesArray[this.titleId]
        return
      }

      const self = this
      getTitle(this.titleId, this.authToken).then((response) => {
        if (response.error) {
          console.log('there was an error calling getTitle', response.error)
          self.codexTitle = null
          self.error = response.error
        } else {
          console.log('codexTitle', response.result)
          self.codexTitle = response.result
        }
      }).catch((error) => {
        console.log('there was an error calling getTitle', error)
        self.codexTitle = null
        self.error = error
      })
    },
  },
}
</script>

<style scope>
.flex {
  display: flex;
  flex-direction: row;
  align-items: baseline;
}
.top {
  align-self: flex-start;
  width: 100%;
}
.vertical {
  display: flex;
  flex-direction: column;
  align-items: baseline;
}
img {
  max-height: 400px;
  max-width: 400px;
  margin-right: 30px;
}
</style>
