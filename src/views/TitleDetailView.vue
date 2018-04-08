<template>
  <div class="container">
    <div v-if="codexTitle">
      <div class="flex mb-5">
        <img class="mr-5" :src="codexTitle.imageUri" />
        <div class="top">
          <div class="mb-4">
            <h1>{{ codexTitle.name }}</h1>
            <div>{{ codexTitle.description }}</div>
          </div>
          <div class="vertical" v-if="isOwner">
            <h4>Owner actions</h4>
            <b-button class="mb-3">
              Modify title information
            </b-button>

            <b-button class="mb-3" v-b-modal.transferTitleModal>
              Initiate one way transfer
            </b-button>
            <transfer-title-modal :titleId="titleId" />

            <b-button>
              Initiate transfer approval
            </b-button>
          </div>
        </div>
      </div>
      <title-provenance :provenance="codexTitle.provenance" />
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
import axios from 'axios'
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
    isOwner() {
      return this.$store.state.web3.account === this.codexTitle.ownerAddress
    },
    useMockData() {
      return this.$store.state.web3.useMockData
    },
    titleId() {
      return this.$route.params.titleId
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

      axios.get(`/title/${this.titleId}?include=provenance`).then((response) => {
        const { result, error } = response.data
        if (error) {
          console.log('there was an error calling getTitle', error)
          this.codexTitle = null
          this.error = error
        } else {
          console.log('codexTitle', result)
          this.codexTitle = result
        }
      }).catch((error) => {
        console.log('there was an error calling getTitle', error)
        this.codexTitle = null
        this.error = error
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
  max-height: 500px;
  max-width: 500px;
}
</style>
