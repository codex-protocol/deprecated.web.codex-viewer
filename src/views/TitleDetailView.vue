<template>
  <div class="container">
    <div v-if="codexTitle">
      <div class="flex mb-5">
        <div>
          <img class="mb-3 mr-5" v-if="!this.isPrivate" :src="codexTitle.metadata.files[0].uri" />
          <div class="mb-3 mr-5 private-img" v-else></div>
          <div class="vertical" v-if="isOwner">
            <b-button class="mb-3">
              Initiate metadata modification
            </b-button>

            <b-button class="mb-3" v-b-modal.transferTitleModal>
              Initiate one way transfer
            </b-button>
            <transfer-title-modal :titleId="titleId" />

            <b-button class="mb-3" v-b-modal.approveTransferModal>
              Initiate transfer approval
            </b-button>
            <approve-transfer-modal :titleId="titleId" />

            <b-button class="mb-3" v-b-modal.titlePrivacySettings>
              Privacy settings
            </b-button>
            <privacy-settings-modal :titleId="titleId" />

            <b-button v-if="codexTitle.approvedAddress">
              Remove approver
            </b-button>
          </div>
          <div class="vertical" v-if="isApproved">
            <b-button @click="acceptTransfer">
              Accept title transfer
            </b-button>
          </div>
        </div>
        <div v-if="this.isPrivate" class="top vertical">
          <h1>This title is private</h1>
        </div>
        <div v-else class="top vertical">
          <h1>{{ codexTitle.metadata.name }}</h1>
            <div>{{ codexTitle.metadata.description }}</div>
          <h4>Details</h4>
          <p>Current owner: {{ codexTitle.ownerAddress }}</p>
          <p>Approved owner: {{ codexTitle.approvedAddress }}</p>
          <p>Last updated: {{ this.formatDate(codexTitle.updatedAt) }}</p>
          <h5>Metadata</h5>
          <p>Name hash: {{ codexTitle.nameHash }}</p>
          <p>Description hash: {{ codexTitle.descriptionHash }}</p>
          <p>ProviderId: {{ codexTitle.providerId }}</p>
        </div>
      </div>
      <title-provenance v-if="!this.isPrivate" :provenance="codexTitle.provenance" />
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

import ApproveTransferModal from '../components/modals/ApproveTransferModal'
import PrivacySettingsModal from '../components/modals/PrivacySettingsModal'
import TransferTitleModal from '../components/modals/TransferTitleModal'
import TitleProvenance from '../components/TitleProvenance'

export default {
  name: 'title-detail',
  components: {
    ApproveTransferModal,
    PrivacySettingsModal,
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
    web3() {
      return this.$store.state.web3
    },
    account() {
      return this.web3.account
    },
    isOwner() {
      return this.account === this.codexTitle.ownerAddress
    },
    isApproved() {
      return this.account === this.codexTitle.approvedAddress
    },
    titleId() {
      return this.$route.params.titleId
    },
    contract() {
      return this.web3.contractInstance()
    },
    isPrivate() {
      return this.codexTitle.isPrivate
    },
  },
  created() {
    this.fetchData()
  },
  watch: {
    $route: 'fetchData',
  },
  methods: {
    fetchData() {
      axios.get(`/title/${this.titleId}?include=metadata&include=provenance`).then((response) => {
        const { result, error } = response.data
        if (error) {
          console.log('there was an error calling getTitle', error)
          this.codexTitle = null
          this.error = error
        } else {
          console.log('codexTitle', result)
          console.log('metadata', result.metadata)
          this.codexTitle = result
        }
      }).catch((error) => {
        console.log('there was an error calling getTitle', error)
        this.codexTitle = null
        this.error = error
      })
    },
    acceptTransfer() {
      this.contract.transferFrom(
        this.codexTitle.ownerAddress,
        this.account,
        this.titleId,
        { from: this.account }
      ).then(() => {
        this.modalVisible = false
      })
    },
    formatDate(date) {
      return (new Date(date)).toLocaleString()
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

.private-img {
  width: 500px;
  height: 500px;
  background-color: #32194C;
}
</style>
