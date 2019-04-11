<template>
  <div class="record-details container-fluid">

    <LoadingOverlay :show="isLoading" type="dark" />

    <div class="row">
      <div class="col-12">

        <div class="mt-4" v-if="error">
          <p>Error: {{ this.error }}</p>
        </div>

        <div v-if="!error && codexRecord">
          <div class="row">
            <div class="col-12 col-md-5">
              <RecordImageCarousel :codexRecord="codexRecord"/>
            </div>
            <div class="col-12 col-md-7">
              <div>

                <section>
                  <div v-if="codexRecord.metadata">
                    <h1>{{ codexRecord.metadata.name }}</h1>
                    <!-- this can be swapped when the email bug is fixed in the escapeHTML filter -->
                    <div class="description">{{ codexRecord.metadata.description }}</div>
                    <!-- <div class="description" v-html="$options.filters.escapeHtml(codexRecord.metadata.description)"></div> -->
                  </div>
                  <div v-else>
                    <h1>Codex Record #{{ codexRecord.tokenId }}</h1>
                  </div>
                </section>

                <section class="action-buttons">
                  <div class="owner-action-buttons" v-if="isOwner">
                    <b-button variant="primary" v-b-modal.recordManageModal>
                      Edit
                    </b-button>

                    <b-button variant="primary" v-b-modal.approveTransferModal>
                      Transfer
                    </b-button>

                    <b-button variant="primary" v-b-modal.recordPrivacySettings>
                      Settings
                    </b-button>

                    <RecordManageModal :codex-record="codexRecord" />
                    <ApproveTransferModal :codex-record="codexRecord" />
                    <PrivacySettingsModal :codex-record="codexRecord" :onUpdated="onSettingsUpdate" />
                  </div>

                  <div class="public-action-buttons">
                    <b-button @click="copyShareLink" ref="copy-share-link-button">Copy Share Link</b-button>
                    <b-button @click="toggleShowDetails">Toggle Details</b-button>
                  </div>

                  <div class="approved-action-buttons" v-if="isApproved">
                    <b-button variant="primary" v-b-modal.acceptTransferModal>
                      Accept Transfer
                    </b-button>
                    <AcceptTransferModal :codex-record="codexRecord" />
                  </div>

                  <div class="auction-house-action-buttons">
                    <b-button
                      target="_blank"
                      variant="primary"
                      v-if="auctionHouseLinkbackUrl"
                      :href="auctionHouseLinkbackUrl"
                    >
                      View Asset on Auction House
                    </b-button>
                    <b-button
                      variant="primary"
                      v-b-modal.claimRecordModal
                      v-if="codexRecord.isOwnedByAuctionHouse"
                    >
                      Claim This Codex Record
                    </b-button>
                    <ClaimRecordModal :codex-record="codexRecord" />
                  </div>
                </section>

                <section class="details">
                  <RecordBlockchainDetails :show-details="showDetails" :codexRecord="codexRecord" />
                </section>

              </div>
            </div>
          </div>

          <section class="provenance">
            <RecordProvenance :provenance="codexRecord.provenance" />
          </section>

        </div>
      </div> <!-- col-12 -->
    </div> <!-- row -->
  </div> <!-- container-fluid -->
</template>

<script>

import { mapState } from 'vuex'

import { ZeroAddress } from '../util/constants/web3'
import copyToClipboard from '../util/copyToClipboard'

import RecordProvenance from '../components/RecordProvenance'
import LoadingOverlay from '../components/util/LoadingOverlay'
import RecordImageCarousel from '../components/RecordImageCarousel'
import RecordBlockchainDetails from '../components/RecordBlockchainDetails'

import ClaimRecordModal from '../components/modals/ClaimRecordModal'
import RecordManageModal from '../components/modals/RecordManageModal'
import AcceptTransferModal from '../components/modals/AcceptTransferModal'
import ApproveTransferModal from '../components/modals/ApproveTransferModal'
import PrivacySettingsModal from '../components/modals/PrivacySettingsModal'

export default {

  components: {
    LoadingOverlay,
    RecordProvenance,
    RecordImageCarousel,
    RecordBlockchainDetails,

    ClaimRecordModal,
    RecordManageModal,
    AcceptTransferModal,
    ApproveTransferModal,
    PrivacySettingsModal,
  },

  data() {
    return {
      error: null,
      isLoading: false,
      showDetails: false,
    }
  },

  mounted() {
    this.isLoading = true
    // This will try to pull one of the cached records, otherwise it will fetch it from the API
    this.$store.dispatch('records/FETCH_RECORD', this.recordId)
      .catch((error) => {
        this.error = error.message || error.toString()
      })
      .finally(() => {
        this.isLoading = false
      })
  },

  beforeDestroy() {
    this.$store.commit('records/SET_ACTIVE_RECORD', null)
  },

  computed: {
    ...mapState('auth', ['user']),
    ...mapState('app', ['auctionHouses']),
    ...mapState('records', {
      codexRecord: (state) => {
        return state.activeRecord
      },
    }),

    isOwner() {
      return (
        this.user &&
        this.codexRecord.ownerAddress &&
        this.user.address.toLowerCase() === this.codexRecord.ownerAddress.toLowerCase()
      )
    },

    isApproved() {
      return (
        this.user &&
        this.codexRecord.approvedAddress &&
        this.user.address.toLowerCase() === this.codexRecord.approvedAddress.toLowerCase()
      )
    },

    recordId() {
      return this.$route.params.recordId
    },

    isAwaitingApproval() {
      return (
        this.codexRecord.approvedAddress !== null &&
        this.codexRecord.approvedAddress !== ZeroAddress
      )
    },

    auctionHouseLinkbackUrl() {
      return (
        this.codexRecord.metadata &&
        this.codexRecord.metadata.auctionHouseMetadata &&
        this.codexRecord.metadata.auctionHouseMetadata.linkbackUrl
      )
    },
  },

  methods: {
    onSettingsUpdate(codexRecord) {
      this.$store.commit('records/UPDATE_RECORD_IN_LISTS', codexRecord)
    },

    toggleShowDetails() {
      this.showDetails = !this.showDetails
    },

    copyShareLink() {
      copyToClipboard(window.location.href, 'Share link copied to clipboard!')
      this.$refs['copy-share-link-button'].focus()
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

.record-details
  min-height: 100%
  position: relative

h1
  line-height: 1em
  padding-top: 1rem

.description
  overflow-wrap: break-word

  // this can be removed when the email bug is fixed in the escapeHTML filter
  white-space: pre-wrap

.action-buttons
  margin-top: 2rem
  margin-bottom: 1rem

  > div
    display: flex
    flex-wrap: wrap

    .btn
      margin-right: 1rem
      margin-bottom: 1rem

      @media (max-width: $breakpoint-md)
        width: 100%
        margin-right: 0

.provenance
  margin-top: 2rem

</style>
