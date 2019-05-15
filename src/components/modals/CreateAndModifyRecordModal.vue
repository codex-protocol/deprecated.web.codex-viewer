<template>
  <MetaMaskNotificationModal
    :on-show="onShow"
    :title="modalTitle"
    :ok-title="okTitle"
    :validate="validate"
    :on-clear="clearModal"
    :requires-tokens="true"
    :ok-method="saveMetadata"
    :ok-disabled="disableButton"
    :checkout-cost="checkoutCost"
    :checkout-action="checkoutAction"

    id="createAndModifyRecordModal"
    cancel-variant="outline-primary"
  >
    <template slot="checkout">
      <h3>{{ name }}</h3>
      <div class="image-container"><img :src="mainImage.imageTageSource"></div>
      <!-- this can be swapped when the email bug is fixed in the escapeHTML filter -->
      <div class="description">{{ description }}</div>
      <!-- <div class="description" v-html="$options.filters.escapeHtml(description)"></div> -->

      <b-form-group
        label-size="sm"
        label="Additional Images"
        v-if="additionalImages.length !== 0"
      >
        <div class="additional-files">
          <div
            :key="index"
            class="additional-file image-container no-hover"
            v-for="(additionalImage, index) in additionalImages"
          >
            <img :src="additionalImage.imageTageSource" />
          </div>
        </div>
      </b-form-group>

      <b-form-group
        label-size="sm"
        label="Additional Files"
        v-if="additionalFiles.length !== 0"
      >
        <div class="additional-files">
          <div
            :key="index"
            v-if="additionalFile.apiRecord"
            class="additional-file image-container no-hover"
            v-for="(additionalFile, index) in additionalFiles"
          >
            <img v-if="additionalFile.apiRecord.fileType === 'image'" :src="additionalFile.apiRecord.uri" />
            <template v-else-if="additionalFile.apiRecord.fileType === 'video'">
              <img src="../../assets/icons/file-type-video.svg">
              <marquee class="name" scrollamount="2">
                {{ additionalFile.apiRecord.name }}
              </marquee>
            </template>
            <template v-else>
              <img src="../../assets/icons/file-type-document.svg">
              <marquee class="name" scrollamount="2">
                {{ additionalFile.apiRecord.name }}
              </marquee>
            </template>
          </div>
        </div>
      </b-form-group>
    </template>

    <div class="flex-container">
      <!-- MAIN IMAGE -->
      <div>
        <b-form-group
          label-size="sm"
          label="Main Image"
          label-for="mainImageInput"
        >
          <div class="main-image image-container">
            <img :src="mainImage.imageTageSource" />
            <LoadingOverlay type="dark" :show="mainImage.isLoading" />
          </div>
          <b-form-file
            required
            accept="image/*"
            id="mainImageInput"
            ref="mainImageInput"
            @input="mainImageChanged"
            v-model="mainImage.fileObject"
          />
        </b-form-group>
      </div>

      <!-- NAME & DESCRIPTION -->
      <div>
        <b-form-group
          label="Name"
          label-size="sm"
          label-for="name"
        >
          <b-form-input
            required
            id="name"
            type="text"
            class="mb-4"
            v-model="name"
            ref="defaultModalFocus"
            placeholder="e.g. Figure With Horses"
          />
        </b-form-group>
        <b-form-group
          label-size="sm"
          label="Description"
          label-for="description"
        >
          <b-form-textarea
            :rows="4"
            :max-rows="16"
            id="description"
            v-model="description"
            placeholder="A description of this asset"
          />
        </b-form-group>
        <b-form-group
          label-size="sm"
          label-for="isPublic"
          v-if="mode === 'create'"
          label="Share Record Publicly"
        >
          <input
            id="isPublic"
            type="checkbox"
            v-model="isPublic"
            class="toggle-checkbox"
          />
          <b-form-text>
            By making this Codex Record public, anyone can view the name, description and images.
            <span class="public-collection-warning" v-if="user && user.role === 'featured-collection'">
              <br>
              <br>
              <img src="../../assets/icons/warning.svg"> This Codex Record will be {{ isPublic ? 'public' : 'kept private' }} and {{ isPublic ? 'will' : 'will not' }} appear on your Featured Collection page.
            </span>
          </b-form-text>
        </b-form-group>
      </div>
    </div>

    <hr>

    <div class="flex-container">
      <!-- ADDITIONAL IMAGES -->
      <div>
        <b-form-group
          label-size="sm"
          label="Additional Images"
          label-for="additionalImagesInput"
        >
          <div class="additional-files">
            <div
              :key="index"
              class="additional-file image-container"
              v-for="(additionalImage, index) in additionalImages"
            >
              <div
                class="delete-overlay"
                v-if="!additionalImage.isLoading"
                @click="deleteAdditionalImage(additionalImage)"
              >
                <img src="../../assets/icons/delete.svg">
              </div>
              <img :src="additionalImage.imageTageSource" />
              <LoadingOverlay type="dark" size="medium" :show="additionalImage.isLoading" />
            </div>

            <label for="additionalImagesInput" title="Add additional images">
              <div class="add-file-button image-container">
                <img src="../../assets/icons/add.svg">
              </div>
            </label>
            <b-form-file
              multiple
              accept="image/*"
              id="additionalImagesInput"
              ref="additionalImagesInput"
              @input="addAdditionalImages"
              class="additional-files-input"
            />
          </div>
          <b-form-text>
            Attach additional images such photographs from a different angle,
            different versions of the asset over time, etc. Anyone with
            permissions to view this Codex Record can see these images.
          </b-form-text>
        </b-form-group>
      </div>

      <!-- ADDITIONAL FILES -->
      <div>
        <b-form-group
          label-size="sm"
          label="Additional Files"
          label-for="additionalFilesInput"
        >
          <div class="additional-files">
            <div
              :key="index"
              class="additional-file image-container"
              v-for="(additionalFile, index) in additionalFiles"
            >
              <div
                class="delete-overlay"
                v-if="!additionalFile.isLoading"
                @click="deleteAdditionalFile(additionalFile)"
              >
                <img src="../../assets/icons/delete.svg">
              </div>
              <template v-if="additionalFile.apiRecord">
                <img v-if="additionalFile.apiRecord.fileType === 'image'" :src="additionalFile.apiRecord.uri" />
                <template v-else-if="additionalFile.apiRecord.fileType === 'video'">
                  <img src="../../assets/icons/file-type-video.svg">
                  <marquee class="name" scrollamount="2">
                    {{ additionalFile.apiRecord.name }}
                  </marquee>
                </template>
                <template v-else>
                  <img src="../../assets/icons/file-type-document.svg">
                  <marquee class="name" scrollamount="2">
                    {{ additionalFile.apiRecord.name }}
                  </marquee>
                </template>
              </template>
              <LoadingOverlay type="dark" size="medium" :show="additionalFile.isLoading" />
            </div>

            <label for="additionalFilesInput" title="Add additional files">
              <div class="add-file-button image-container">
                <img src="../../assets/icons/add.svg">
              </div>
            </label>
            <b-form-file
              multiple
              id="additionalFilesInput"
              ref="additionalFilesInput"
              @input="addAdditionalFiles"
              class="additional-files-input"
            />
          </div>
          <b-form-text>
            Attach non-image files such as proof of physical ownership,
            appraisal documents, etc. These files can be kept private even if
            this Codex Record is public.
          </b-form-text>
        </b-form-group>

        <b-form-group
          label-size="sm"
          label="Keep Additional Files Private"
          label-for="isHistoricalProvenancePrivate"
          v-if="mode === 'create' && additionalFiles.length !== 0"
        >
          <input
            type="checkbox"
            class="toggle-checkbox"
            id="isHistoricalProvenancePrivate"
            v-model="confirmMintValues.isHistoricalProvenancePrivate"
          />
          <b-form-text>
            Use this to make additional files visible only to the current owner
            of this Codex Record, regardless of the privacy setting selected
            above.
          </b-form-text>
        </b-form-group>
      </div>
    </div>
  </MetaMaskNotificationModal>
</template>

<script>
import debug from 'debug'
import { mapState } from 'vuex'

import File from '../../util/api/file'
import Record from '../../util/api/record'
import EventBus from '../../util/eventBus'
import contractHelper from '../../util/contractHelper'
import { NullDescriptionHash } from '../../util/constants/web3'
import additionalDataHelper from '../../util/additionalDataHelper'

import LoadingOverlay from '../util/LoadingOverlay'
import MetaMaskNotificationModal from './MetaMaskNotificationModal'

const logger = debug('app:component:create-and-modify-record-modal')

class FileClass {

  dataUrl = null
  apiRecord = null
  isLoading = false
  fileObject = null

  constructor({ dataUrl, apiRecord, isLoading, fileObject } = {}) {
    this.dataUrl = dataUrl || this.dataUrl
    this.apiRecord = apiRecord || this.apiRecord
    this.isLoading = isLoading || this.isLoading
    this.fileObject = fileObject || this.fileObject
  }

  get imageTageSource() {
    return this.apiRecord ? this.apiRecord.uri : this.dataUrl
  }

  upload() {

    this.isLoading = true
    this.apiRecord = false

    return File.uploadFiles(this.fileObject)
      .then((uploadedFiles) => {
        this.apiRecord = uploadedFiles[0]
      })
      .catch((error) => {
        this.reset()
        EventBus.$emit('toast:error', `Could not upload file: ${error.message}`)
      })
      .finally(() => {
        this.isLoading = false
      })
  }

  setDataUrl() {

    if (!this.fileObject) return

    const fileReader = new FileReader()

    fileReader.addEventListener('loadend', () => {
      this.dataUrl = fileReader.result
    })

    fileReader.readAsDataURL(this.fileObject)
  }

  reset() {
    this.dataUrl = null
    this.apiRecord = null
    this.isLoading = false
    this.fileObject = null
  }
}

export default {

  components: {
    LoadingOverlay,
    MetaMaskNotificationModal,
  },

  props: {
    mode: {
      type: String,
      required: true,
      validator: (value) => {
        return value === 'create' || value === 'modify'
      },
    },
    codexRecord: {
      type: Object,
    },
  },

  data() {
    return {
      name: null,
      description: null,

      additionalFiles: [],
      additionalImages: [],
      mainImage: new FileClass(),

      // these are only used in the "create" form
      confirmMintValues: {
        isHistoricalProvenancePrivate: true,
        // on 2019-01-31 the default state for this checkbox was made "public"
        //  since most people are making public records (note that the API still
        //  has "private" as the default though)
        isPrivate: false,
      },

      // modal-specific stuff
      okTitle: this.mode === 'create' ? 'Create' : 'Save',
      modalTitle: this.mode === 'create' ? 'Create Record' : 'Modify Record',
      checkoutAction: this.mode === 'create' ? 'Create Codex Record' : 'Modify Codex Record',
    }
  },

  computed: {
    ...mapState('auth', ['user']),
    ...mapState('web3', ['instance']),
    ...mapState('app', ['codxCosts']),

    disableButton() {
      return this.validate().length !== 0
    },

    isPublic: {
      get: function getIsPublic() {
        return !this.confirmMintValues.isPrivate
      },
      set: function setIsPublic(newValue) {
        this.confirmMintValues.isPrivate = !newValue
      },
    },

    checkoutCost() {
      return this.mode === 'create' ? this.codxCosts.CodexRecord.mint : this.codxCosts.CodexRecord.modifyMetadataHashes
    },

  },

  methods: {

    onShow() {
      if (this.$refs.defaultModalFocus) {
        this.$refs.defaultModalFocus.focus()
      }

      if (this.mode === 'create') {
        return
      }

      if (!this.codexRecord || !this.codexRecord.metadata) {
        throw new Error(`CreateAndModifyRecordModal called with mode = ${this.mode} and no codexRecord and/or metadata!`)
      }

      this.name = this.codexRecord.metadata.name
      this.description = this.codexRecord.metadata.description
      this.mainImage = new FileClass({ apiRecord: this.codexRecord.metadata.mainImage })
      this.additionalFiles = this.codexRecord.metadata.files.map((apiRecord) => {
        return new FileClass({ apiRecord })
      })
      this.additionalImages = this.codexRecord.metadata.images.map((apiRecord) => {
        return new FileClass({ apiRecord })
      })

    },

    clearModal() {
      Object.assign(this.$data, this.$options.data.apply(this))
    },

    mainImageChanged() {
      if (!this.mainImage.fileObject) return
      this.mainImage.upload()
      this.mainImage.setDataUrl()
    },

    addAdditionalImages(fileObjects) {

      if (!fileObjects || fileObjects.length === 0) return

      fileObjects.forEach((fileObject) => {

        const newAdditionalImage = new FileClass({ fileObject })

        newAdditionalImage.setDataUrl()
        newAdditionalImage.upload()
          .then(() => {
            if (!newAdditionalImage.apiRecord) {
              this.deleteAdditionalImage(newAdditionalImage)
            }
          })

        this.additionalImages.push(newAdditionalImage)

      })

    },

    addAdditionalFiles(fileObjects) {

      if (!fileObjects || fileObjects.length === 0) return

      fileObjects.forEach((fileObject) => {

        const newAdditionalFile = new FileClass({ fileObject })

        newAdditionalFile.upload()
          .then(() => {
            if (!newAdditionalFile.apiRecord) {
              this.deleteAdditionalFile(newAdditionalFile)
            }
          })

        this.additionalFiles.push(newAdditionalFile)

      })

    },

    deleteAdditionalImage(additionalImage) {
      const indexToRemove = this.additionalImages.indexOf(additionalImage)

      if (indexToRemove !== -1) {
        this.additionalImages.splice(indexToRemove, 1)
      }
    },

    deleteAdditionalFile(additionalFile) {
      const indexToRemove = this.additionalFiles.indexOf(additionalFile)

      if (indexToRemove !== -1) {
        this.additionalFiles.splice(indexToRemove, 1)
      }
    },

    validate() {
      const errors = []

      if (!this.name) {
        errors.push('Name is required')
      }

      if (
        this.mainImage.isLoading ||
        this.additionalFiles.some((additionalFile) => { return additionalFile.isLoading }) ||
        this.additionalImages.some((additionalImage) => { return additionalImage.isLoading })
      ) {
        errors.push('Files are still uploading')
      }

      if (!this.mainImage.apiRecord) {
        errors.push('Main image is required')
      }

      return errors
    },

    saveMetadata() {

      const images = this.additionalImages.map((additionalImage) => {
        return additionalImage.apiRecord
      })

      const files = this.additionalFiles.map((additionalFile) => {
        return additionalFile.apiRecord
      })

      const metadataToSave = {
        files,
        images,
        name: this.name,
        mainImage: this.mainImage.apiRecord,
        description: this.description || null,
      }

      if (this.mode === 'create') {
        metadataToSave.confirmMintValues = this.confirmMintValues
      }

      const promise = this.mode === 'create'
        ? Record.createMetadata(metadataToSave).then(this.createRecord)
        : Record.updateMetadata(this.codexRecord.tokenId, metadataToSave).then(this.modifyRecord)

      return promise
        .catch((error) => {
          logger(`Could not ${this.mode} Codex Record:`, error)

          // @NOTE: we must throw the error here so the MetaMaskNotificationModal
          //  can catch() it too
          throw error
        })
    },

    createRecord(metadata) {
      const account = this.user.address

      const input = [
        account,
        metadata.nameHash,
        metadata.descriptionHash || NullDescriptionHash,
        metadata.fileHashes,
        additionalDataHelper.encode([
          process.env.VUE_APP_METADATA_PROVIDER_ID, // providerId
          metadata.id, // providerMetadataId
        ]),
      ]

      // @NOTE: we don't .catch here so that the error bubbles up to MetaMaskNotificationModal
      return contractHelper('CodexRecord', 'mint', input, this.$store)
        .then(() => {
          EventBus.$emit('events:record-metadata-create', metadata.id)
        })
    },

    modifyRecord(pendingUpdate) {
      const input = [
        this.codexRecord.tokenId,
        pendingUpdate.nameHash,
        pendingUpdate.descriptionHash || NullDescriptionHash,
        pendingUpdate.fileHashes,
        additionalDataHelper.encode([
          process.env.VUE_APP_METADATA_PROVIDER_ID, // providerId
          this.codexRecord.metadata.id, // providerMetadataId
          pendingUpdate.id, // providerMetadataPendingUpdateId
        ]),
      ]

      // @NOTE: we don't .catch here so that the error bubbles up to MetaMaskNotificationModal
      return contractHelper('CodexRecord', 'modifyMetadataHashes', input, this.$store)
        .then(() => {
          EventBus.$emit('events:record-metadata-modify', this.codexRecord.tokenId)
        })
    },

  },
}
</script>

<style lang="stylus" scoped>

@import "../../assets/variables.styl"

.flex-container
  width: 100%
  display: flex
  flex-direction: column
  justify-content: space-between

  @media (min-width: $breakpoint-sm)
    flex-direction: row

    > div
      width: calc(50% - 1rem)

.description
  overflow-wrap: break-word

  // this can be removed when the email bug is fixed in the escapeHTML filter
  white-space: pre-wrap

  &:not(:empty)
    margin-bottom: 1rem

.public-collection-warning
  color: rgba($color-primary, .8)

  img
    width: 1rem
    height: @width
    vertical-align: text-bottom

.main-image
  height: 16rem
  margin-top: 0
  position: relative
  max-height: @height
  min-height: @height

  img
    max-height: 100%

.additional-files-input
  display: none

.additional-files
  display: flex
  flex-wrap: wrap

  .add-file-button
  .additional-file
    width: 5rem
    height: @width
    position: relative
    margin: 0 .5rem .5rem 0

    &:not(.no-hover)
      cursor: pointer

    img
      max-height: 100%

  .additional-file
    display: flex
    flex-direction: column

    &:hover
      .delete-overlay
        display: flex

    .delete-overlay
      width: 100%
      display: none
      height: @width
      padding: .5rem
      position: absolute
      align-items: center
      justify-content: center
      background-color: rgba(darken($color-danger, 25%), .5)

      img
        opacity: .8
        width: 2rem
        height: @width

    .name
      width: 100%
      font-size: small

  .add-file-button
    padding: 0

    &:hover
      background-color: rgba($color-primary, .05)

      img
        opacity: .8

    img
      width: 50%
      opacity: .5
      height: @width

</style>
