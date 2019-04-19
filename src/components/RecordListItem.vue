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
      :src="privacyIcon"
      class="icon privacy-icon"
      :title="privacyTooltipText"
    />
    <img
      v-b-tooltip.hover
      class="icon auction-house-icon"
      v-if="codexRecord.isOwnedByAuctionHouse"
      title="Currently owned by an Auction House"
      src="../assets/icons/auction-house-black.svg"
    />
  </b-card>
</template>

<script>
import Raven from 'raven-js'

import isPublicIcon from '../assets/icons/privacy-public.svg'
import isPrivateIcon from '../assets/icons/privacy-private.svg'

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
  text-align: center

.icon
  width: 1em
  height: 1em
  opacity: .25
  vertical-align: middle

</style>
