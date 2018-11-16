<template>
  <b-container class="row-container">
    <b-row>
      <b-col class="image">
        <a href="#" @click.prevent="viewRecord">
          <img :src="missingImageHelper.getMainImageUri(codexRecord.metadata)" />
        </a>
      </b-col>
      <b-col class="name">
        <a href="#" @click.prevent="viewRecord">
          {{ codexRecord.metadata.name }}
        </a>
      </b-col>
      <b-col class="toggle" v-if="user && user.isGalleryEnabled">
        <input
          type="checkbox"
          class="toggle-checkbox"
          v-model="isInGallery"
          @change="toggleIsInGallery"
        />
      </b-col>
      <b-col class="toggle">
        <input
          type="checkbox"
          class="toggle-checkbox"
          v-model="isPublic"
          @change="toggleIsPrivate"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from 'vuex'

import EventBus from '../util/eventBus'
import missingImageHelper from '../util/missingImageHelper'

export default {
  name: 'RecordPrivacySettingsRowItem',

  props: {
    codexRecord: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      missingImageHelper,
      isPrivate: this.codexRecord.isPrivate,
      isInGallery: this.codexRecord.isInGallery,
      route: { name: 'record-detail', params: { recordId: this.codexRecord.tokenId } },
    }
  },

  computed: {
    ...mapState('auth', ['user']),

    isPublic: {
      get: function getIsPublic() {
        return !this.isPrivate
      },
      set: function setIsPublic(newValue) {
        this.isPrivate = !newValue
      },
    },
  },

  methods: {
    viewRecord() {
      this.$router.push(this.route)
    },

    toggleIsPrivate() {
      if (this.isPrivate) {
        this.isInGallery = false
      }

      return this.updateRecord()
    },

    toggleIsInGallery() {
      if (this.isInGallery) {
        this.isPrivate = false
      }

      return this.updateRecord()
    },

    updateRecord() {
      this.$store.dispatch('records/UPDATE_RECORD', {
        codexRecord: this.codexRecord,
        dataToUpdate: {
          isPrivate: this.isPrivate,
          isInGallery: this.isInGallery,
        },
      })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not update Record: ${error.message}`)
          this.reset()
        })
    },

    reset() {
      this.isPrivate = this.codexRecord.isPrivate
      this.isInGallery = this.codexRecord.isInGallery
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.row-container
  height: 6rem
  max-width: 100%
  font-weight: 600
  color: $color-gray
  font-size: 0.875rem
  border-top: 1px solid $color-light-gray

.row
  height: 100%
  display: flex
  padding: .5rem 0
  align-items: center

.name
  flex-grow: 5
  font-weight: 300
  text-transform: uppercase

.toggle
  text-align: center

.image
  height: 100%

  img
    max-width: 5rem
    max-height: 100%

a
  color: $color-secondary

  &:hover
    text-decoration: none
</style>
