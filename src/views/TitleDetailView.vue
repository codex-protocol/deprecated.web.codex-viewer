<template>
  <div>
    <div v-if="codexTitle">
      <div class="flex mb-5">
        <div>
          <img class="mb-3 mr-5" v-if="codexTitle.metadata" :src="codexTitle.metadata.files[0].uri" />
          <div class="mb-3 mr-5 private-img" v-else>
            <p>This Codex Title is private</p>
          </div>
        </div>
        <div class="top vertical">
          <div v-if="codexTitle.metadata">
            <h1>{{ codexTitle.metadata.name }}</h1>
            <div>{{ codexTitle.metadata.description }}</div>
          </div>
          <div v-else>
            <h1>Codex Title #{{ codexTitle.tokenId }}</h1>
          </div>
          <a href="#" @click.prevent="toggleShowDetails">Toggle details</a>
          <title-blockchain-details v-if="showDetails" :codexTitle="codexTitle" />
          <div class="mt-3" v-if="isOwner">
            <b-button class="mr-3" variant="primary">
              Modify
            </b-button>

            <b-button class="mr-3" variant="primary" v-b-modal.approveTransferModal>
              Transfer
            </b-button>

            <b-button class="mr-3" variant="primary" v-b-modal.titlePrivacySettings>
              Settings
            </b-button>

            <b-button variant="primary" v-if="codexTitle.approvedAddress">
              Remove Approver
            </b-button>

            <approve-transfer-modal :titleId="titleId" />
            <privacy-settings-modal :titleId="titleId" :isPrivate="isPrivate" />
          </div>
          <div class="mt-3" v-if="isApproved">
            <b-button @click="acceptTransfer">
              Accept title transfer
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

import callContract from '../util/web3/callContract'

import ApproveTransferModal from '../components/modals/ApproveTransferModal'
import PrivacySettingsModal from '../components/modals/PrivacySettingsModal'
import TitleProvenance from '../components/TitleProvenance'
import TitleBlockchainDetails from '../components/TitleBlockchainDetails'

export default {
  name: 'title-detail',
  components: {
    ApproveTransferModal,
    PrivacySettingsModal,
    TitleProvenance,
    TitleBlockchainDetails,
  },
  data() {
    return {
      codexTitle: null,
      error: null,
      showDetails: false,
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
      return this.account &&
        this.account === this.codexTitle.ownerAddress
    },
    isApproved() {
      return this.account &&
        this.account === this.codexTitle.approvedAddress
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
      const input = [
        this.codexTitle.ownerAddress,
        this.account,
        this.titleId,
      ]

      callContract(this.contract.transferFrom, input, this.web3)
        .then(() => {
          this.modalVisible = false
        })
        .catch((error) => {
          console.log('There was an error accepting the transfer', error)
        })
    },
    toggleShowDetails() {
      this.showDetails = !this.showDetails
    },
  },
}
</script>

<style lang="stylus" scoped>
.flex
  display: flex
  flex-direction: row
  align-items: baseline

.top
  align-self: flex-start
  width: 100%

.vertical
  display: flex
  flex-direction: column
  align-items: baseline

img
  max-height: 30rem

.private-img
  width: 500px
  height: 500px
  background-color: #32194C
  display: flex
  justify-content: center
  align-items: center
  text-align: center

  > p
    padding: 2em
    font-size: 2rem
    color: white
</style>
