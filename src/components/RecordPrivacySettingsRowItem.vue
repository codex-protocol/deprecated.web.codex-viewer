<template>
  <b-container class="row-container">
    <b-row>
      <b-col class="image">
        <a href="#" @click.prevent="viewRecord">
          <img :src="codexRecord.metadata | getMainImageUri" />
        </a>
      </b-col>
      <b-col class="name">
        <a href="#" @click.prevent="viewRecord">
          {{ codexRecord.metadata.name }}
        </a>
      </b-col>
      <b-col class="toggle">
        <input
          type="checkbox"
          class="toggle-checkbox"
          v-model="isPublic"
          @change="updateRecord"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from 'vuex'

import EventBus from '../util/eventBus'

export default {

  props: {
    codexRecord: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      isPrivate: this.codexRecord.isPrivate,
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

    updateRecord() {
      return this.$store.dispatch('records/UPDATE_RECORD', {
        codexRecord: this.codexRecord,
        dataToUpdate: {
          isPrivate: this.isPrivate,
        },
      })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not update Record: ${error.message}`)
          this.reset()
        })
    },

    reset() {
      this.isPrivate = this.codexRecord.isPrivate
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.row-container
  max-width: 100%
  min-height: 6rem
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
