<template>
  <div class="record-details container-fluid">

    <LoadingOverlay :show="isLoading" type="dark" />

    <FullscreenImageModal :image="fullscreenImage" />

    <div class="row">
      <div class="col-12">

        <b-alert variant="danger" class="mt-4" :show="error">
          Error: {{ this.error }}
        </b-alert>

        <div v-if="!error && codexRecord">
          <div class="row">
            <div class="col-12 col-md-5">

              <!-- @TODO: put the header & description here on mobile (should probably be abstracted into a component) -->

              <!-- MAIN IMAGE -->
              <div class="main-image-container">
                <img
                  class="main-image"
                  v-if="codexRecord.metadata"
                  :src="codexRecord.metadata | getMainImageUri"
                  @click="showImageFullscreen(codexRecord.metadata.mainImage)"
                >
                <img class="private-record-image" src="../assets/images/private-record.png" v-else>

                <b-alert class="mt-4 private-record-alert" variant="secondary" :show="!codexRecord.metadata">
                  <img src="../assets/icons/privacy-private.svg"> This Codex Record is private.
                </b-alert>
              </div>

              <!-- ADDITIONAL IMAGES -->
              <section class="mt-4" v-if="codexRecord.metadata && codexRecord.metadata.images.length !== 0">
                <h4>Additional Images</h4>
                <div class="additional-files">
                  <div
                    :key="index"
                    class="additional-file image-container"
                    @click="showImageFullscreen(additionalImage)"
                    v-for="(additionalImage, index) in codexRecord.metadata.images"
                  >
                    <img :src="additionalImage.uri" />
                  </div>
                </div>
              </section>

              <section class="mt-4" v-if="codexRecord.metadata && codexRecord.metadata.files && codexRecord.metadata.files.length !== 0">
                <h4>
                  Additional Files
                  <img
                    v-if="isOwner"
                    v-b-tooltip.hover
                    :src="historicalProvenancePrivacyIcon"
                    class="historical-provenance-privacy-icon"
                    :title="historicalProvenancePrivacyTooltipText"
                  />
                </h4>
                <div class="additional-files">
                  <b-link
                    :key="index"
                    target="_blank"
                    :href="additionalFile.uri"
                    class="additional-file image-container"
                    v-for="(additionalFile, index) in codexRecord.metadata.files"
                  >
                    <img v-if="additionalFile.fileType === 'image'" :src="additionalFile.uri" />
                    <template v-else-if="additionalFile.fileType === 'video'">
                      <img src="../assets/icons/file-type-video.svg">
                      <marquee class="name" scrollamount="2">
                        {{ additionalFile.name }}
                      </marquee>
                    </template>
                    <template v-else>
                      <img src="../assets/icons/file-type-document.svg">
                      <marquee class="name" scrollamount="2">
                        {{ additionalFile.name }}
                      </marquee>
                    </template>
                  </b-link>
                </div>
              </section>

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

                  <!-- the v-if hides these if the record is private and the user is not approved  -->
                  <div class="auction-house-action-buttons" v-if="codexRecord.metadata">
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

import isHistoricalProvenancePublicIcon from '../assets/icons/privacy-public-light.svg'
import isHistoricalProvenancePrivateIcon from '../assets/icons/privacy-private-light.svg'

import RecordProvenance from '../components/RecordProvenance'
import LoadingOverlay from '../components/util/LoadingOverlay'
import RecordBlockchainDetails from '../components/RecordBlockchainDetails'

import ClaimRecordModal from '../components/modals/ClaimRecordModal'
import RecordManageModal from '../components/modals/RecordManageModal'
import AcceptTransferModal from '../components/modals/AcceptTransferModal'
import ApproveTransferModal from '../components/modals/ApproveTransferModal'
import PrivacySettingsModal from '../components/modals/PrivacySettingsModal'
import FullscreenImageModal from '../components/modals/FullscreenImageModal'

export default {

  components: {
    LoadingOverlay,
    RecordProvenance,
    RecordBlockchainDetails,

    ClaimRecordModal,
    RecordManageModal,
    AcceptTransferModal,
    ApproveTransferModal,
    PrivacySettingsModal,
    FullscreenImageModal,
  },

  data() {
    return {
      error: null,
      isLoading: false,
      showDetails: false,
      fullscreenImage: null,
      isHistoricalProvenancePublicIcon,
      isHistoricalProvenancePrivateIcon,
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

    historicalProvenancePrivacyIcon() {
      if (this.codexRecord.isPrivate || this.codexRecord.isHistoricalProvenancePrivate) {
        return this.isHistoricalProvenancePrivateIcon
      }
      return this.isHistoricalProvenancePublicIcon
    },

    historicalProvenancePrivacyTooltipText() {
      if (this.codexRecord.isPrivate || this.codexRecord.isHistoricalProvenancePrivate) {
        return 'Only Visible to You'
      }
      return 'Visible to Everyone'
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

    showImageFullscreen(image) {
      this.fullscreenImage = image
      this.$root.$emit('bv::show::modal', 'fullscreenImageModal')
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

.main-image-container
  width: 100%
  max-width: 100%
  margin-top: 1rem

  img
    width: 100%

    &.main-image
      cursor: pointer

.private-record-image
  // background-color: $color-secondary

.private-record-alert
  text-align: center

  > img
    width: 1rem
    height: @width
    vertical-align: text-top

.historical-provenance-privacy-icon
  width: 1em
  opacity: .8
  height: @width

  &:hover
    opacity: 1

.additional-files
  display: flex
  flex-wrap: wrap

  .additional-file
    width: 5rem
    height: @width
    cursor: pointer
    position: relative
    margin: 0 .5rem .5rem 0

    img
      max-height: 100%

  .additional-file
    display: flex
    flex-direction: column

    .name
      width: 100%
      font-size: small

</style>
