<template>
  <b-card
    img-top
    v-if="codexRecord.metadata"
    @click.prevent="viewRecord"
    :img-src="codexRecord.metadata | getMainImageUri"
  >
    <p>
      <a href="#" @click.prevent="viewRecord">
        {{ codexRecord.metadata.name }}
      </a>
    </p>
    <small>
      #{{ codexRecord.tokenId }}
    </small>
    <img
    v-b-tooltip.hover
    class="privacy-icon"
    :src="this.privacyIcon"
    :title="this.privacyTooltipText"
    />
  </b-card>
</template>

<script>
import Raven from 'raven-js'

import isPrivateIcon from '../assets/icons/lock.svg'
import isPublicIcon from '../assets/icons/lock-open.svg'

export default {

  props: {
    codexRecord: {
      type: Object,
      required: true,
    },
  },

  data() {
    if (!this.codexRecord.metadata) {
      Raven.captureMessage('found Record with no metadata', this.codexRecord, {
        level: 'warning',
      })
    }

    return {
      isPublicIcon,
      isPrivateIcon,
      route: { name: 'record-detail', params: { recordId: this.codexRecord.tokenId } },
    }
  },

  computed: {
    privacyIcon() {
      return this.codexRecord.isPrivate ? this.isPrivateIcon : this.isPublicIcon
    },
    privacyTooltipText() {
      return this.codexRecord.isPrivate ? 'Private' : 'Public'
    },
  },

  methods: {
    viewRecord() {
      this.$router.push(this.route)
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.card
  card()
  cursor: pointer
  min-width: 180px
  text-align: center

.card-body
  border-top: 1px solid rgba(black, .1)

  a
    font-weight: bold
    color: $color-dark

  small
    color: $color-light-gray

.privacy-icon
  width: 1em
  height: 1em
  // vertical-align: text-top

</style>
