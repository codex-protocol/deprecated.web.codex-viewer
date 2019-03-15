<template>
  <MetaMaskNotificationModal
    id="bulkRecordMintModal"
    title="Bulk Create Records"
    ok-title="Create"
    cancel-variant="outline-primary"
    :on-shown="focusModal"
    :ok-method="createBulkTransaction"
    :on-clear="clearModal"
    :requires-tokens="true"
    :validate="validate"
    :ok-disabled="disableButton"
    :checkout-quantity="checkoutQuantity"
    :checkout-cost="codxCosts.CodexRecord.mint"
    checkout-action="Create Codex Record"
  >
    <template slot="checkout" v-if="metadata">
      <p>The specified metadata will create {{ this.metadata.length }} Codex Record{{ this.metadata.length === 1 ? '' : 's' }}.</p>
    </template>

    <LoadingOverlay :show="isLoading" type="dark" />

    <b-alert variant="secondary" show>
      @TODO: put info here about the structure of metadata files (and/or link
      out to developer docs)
    </b-alert>

    <b-tabs @input="clearModal">
      <b-tab title="JSON">
        <b-form>
          <b-form-group label="Metadata JSON File" label-for="jsonFile" label-size="sm">
            <b-form-file
              required
              id="jsonFile"
              ref="jsonFile"
              accept="application/json"
              @input="setMetadataFromJSON"
              placeholder="Upload JSON file"
            />
            <b-form-text>
              You can also drag and drop a file onto the picker.
            </b-form-text>
          </b-form-group>
        </b-form>
      </b-tab>

      <b-tab title="XML">
        <b-form>
          <b-form-group label="Metadata XML File" label-for="xmlFile" label-size="sm">
            <b-form-file
              required
              id="xmlFile"
              ref="xmlFile"
              @input="setMetadataFromXML"
              placeholder="Upload XML file"
              accept="text/xml,application/xml"
            />
            <b-form-text>
              You can also drag and drop a file onto the picker.
            </b-form-text>
          </b-form-group>
        </b-form>
      </b-tab>
    </b-tabs>

    <template v-if="metadata">

      <b-alert :show="metadata.length === 0">
        This metadata file appears to be invalid.
      </b-alert>

      <section v-if="metadata.length > 0">
        <p>{{ previewSentence }}</p>

        <div class="metadata-previews">
          <div
            :key="index"
            class="metadata-preview"
            v-for="(metadatum, index) in metadataPreviews"
          >
            <img :src="metadatum.mainImageUrl">
            <span
              class="name"
              v-b-tooltip.hover
              :title="metadatum.description | truncate(50)"
            >
              {{ metadatum.name }}
            </span>
          </div>
        </div>
      </section>
    </template>

  </MetaMaskNotificationModal>
</template>

<script>

import axios from 'axios'
import { mapState } from 'vuex'

import EventBus from '../../util/eventBus'

import LoadingOverlay from '../util/LoadingOverlay'
import MetaMaskNotificationModal from './MetaMaskNotificationModal'

export default {

  components: {
    LoadingOverlay,
    MetaMaskNotificationModal,
  },

  data() {
    return {
      metadata: null,
      isLoading: false,
      maxPreviewRecords: 10,
    }
  },

  methods: {
    focusModal() {
      if (this.$refs.defaultModalFocus) {
        this.$refs.defaultModalFocus.focus()
      }
    },

    clearModal() {
      Object.assign(this.$data, this.$options.data.apply(this))

      if (this.$refs.jsonFile) {
        this.$refs.jsonFile.reset()
      }

      if (this.$refs.xmlFile) {
        this.$refs.xmlFile.reset()
      }
    },

    validate() {
      const errors = []

      if (!this.metadata) {
        errors.push('Metadata is required, please upload a file.')
      }

      return errors
    },

    setMetadataFromJSON(file) {

      if (!file) {
        this.metadata = null
        return
      }

      this.isLoading = true

      const fileReader = new FileReader()

      fileReader.addEventListener('loadend', () => {

        try {

          const parsedJSON = JSON.parse(fileReader.result)

          if (!parsedJSON.metadata || !Array.isArray(parsedJSON.metadata)) {
            EventBus.$emit('toast:error', 'Could not upload file: JSON must have "metadata" array as a top-level key.')
            return
          }

          this.metadata = parsedJSON.metadata

        } catch (error) {
          EventBus.$emit('toast:error', `Could not upload file: ${error.message}`)
        }

        this.isLoading = false

      })

      fileReader.readAsText(file)

    },

    setMetadataFromXML(file) {

      if (!file) {
        this.metadata = null
        return null
      }

      this.isLoading = true

      const formData = new FormData()
      formData.append('metadata', file)

      const requestOptions = {
        url: '/user/bulk-transaction/record-mint/convert/xml',
        method: 'post',
        data: formData,
      }

      return axios(requestOptions)
        .then((response) => {
          this.metadata = response.data.result
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not upload file: ${error.message}`)
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    createBulkTransaction() {

      const requestOptions = {
        url: '/user/bulk-transaction/record-mint',
        method: 'post',
        data: {
          metadata: this.metadata,
        },
      }

      // @NOTE: we don't .catch here so that the error bubbles up to MetaMaskNotificationModal
      return axios(requestOptions)

    },

  },

  computed: {
    ...mapState('auth', ['user']),
    ...mapState('app', ['codxCosts']),

    disableButton() {
      return !this.metadata
    },

    metadataPreviews() {
      return this.metadata.slice(0, this.maxPreviewRecords)
    },

    checkoutQuantity() {
      return (this.metadata || []).length
    },

    previewSentence() {

      if (!this.metadata || this.metadata.length === 0) {
        return 'This metadata file appears to be invalid.'
      }

      if (this.metadata.length === 1) {
        return 'This metadata will create the following Codex Record:'
      }

      if (this.metadata.length < this.maxPreviewRecords) {
        return `This metadata will create the following ${this.metadata.length} Codex Records:`
      }

      return `This metadata will create ${this.metadata.length} Codex Records, here is a preview of the first ${this.maxPreviewRecords}:`
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../../assets/variables.styl"

.tab-pane
  padding-top: 1rem

.checkout-preview
  &+.checkout-preview
    margin-top: 1rem

.metadata-previews
  height: 12rem
  padding: 1rem
  overflow-x: scroll
  white-space: nowrap
  background-color: rgba(white, .1)

  .metadata-preview
    height: 100%
    padding: 1rem
    font-size: small
    position: relative
    text-align: center
    display: inline-block
    background-color: rgba($color-dark, .95)

    &+.metadata-preview
      margin-left: 1rem

    img
      width: 8rem
      height: 100%
      object-fit: contain
      object-position: top

    .name
      left: 0
      bottom: 0
      width: 100%
      padding: .5em
      overflow: hidden
      position: absolute
      white-space: nowrap
      text-overflow: ellipsis
      backdrop-filter: blur(4px)
      background-color: rgba($color-dark, .80)

</style>
