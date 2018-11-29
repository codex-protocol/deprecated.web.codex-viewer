<template>
  <b-card
    :img-src="missingImageHelper.getMainImageUri(codexRecord.metadata)"
    img-top
  >
    <div class="accepted-overlay" v-if="this.transferAccepted">
      <p>Transfer Accepted</p>
      <b-button variant="secondary" @click.prevent="viewRecord">View Asset</b-button>
    </div>
    <p class="name"><a href="#" @click.prevent="viewRecord">{{ codexRecord.metadata.name }}</a></p>
    <p class="address">Sent from {{ codexRecord.ownerAddress }}</p>
    <p class="action-buttons">
      <b-button variant="secondary" @click.prevent="acceptTransfer" :disabled="this.isLoading">Accept</b-button>
      <b-button variant="outline-primary" @click.prevent="ignoreTransfer" :disabled="this.isLoading">Ignore</b-button>
    </p>
  </b-card>
</template>

<script>
import { mapState } from 'vuex'

import EventBus from '../util/eventBus'
import missingImageHelper from '../util/missingImageHelper'

export default {
  name: 'RecordTransferIncomingListItem',

  props: {
    codexRecord: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      route: { name: 'record-detail', params: { recordId: this.codexRecord.tokenId } },
      transferAccepted: false,
      isLoading: false,
      missingImageHelper,
    }
  },

  mounted() {
    EventBus.$on('socket:codex-record:transferred:new-owner', this.recordTransferredHandler)
  },

  beforeDestroy() {
    EventBus.$off('socket:codex-record:transferred:new-owner', this.recordTransferredHandler)

    // If the transfer was accepted, remove it from the incoming transfers list
    //  We do this only after leaving the page so that the overlay can still be shown
    if (this.transferAccepted) {
      this.$store.commit('records/REMOVE_RECORD_FROM_LIST', {
        listName: 'incomingTransfers',
        record: this.codexRecord,
      })
    }
  },

  computed: {
    ...mapState('auth', ['user']),
  },

  methods: {
    viewRecord() {
      this.$router.push(this.route)
    },

    // show the "transfer accepted" overlay when the transfer event comes in
    recordTransferredHandler(codexRecord) {
      if (this.codexRecord.tokenId !== codexRecord.tokenId) {
        return
      }

      this.transferAccepted = true
      this.isLoading = false
    },

    acceptTransfer() {
      this.$store.commit('records/SET_SELECTED_RECORD_TO_TRANSFER', {
        codexRecord: this.codexRecord,
        callback: () => {
          this.isLoading = true
        },
      })

      this.$root.$emit('bv::show::modal', 'acceptTransferModal')
    },

    ignoreTransfer() {
      this.isLoading = true

      this.$store.dispatch('records/IGNORE_RECORD', this.codexRecord)
        .then(() => {
          EventBus.$emit('toast:success', 'Transfer ignored successfully!', 5000)
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not ignore transfer: ${error.message}`)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

.card
  card()
  min-width: 180px

  &.is-loading
    opacity: .5

  .accepted-overlay
    display: flex
    align-items: center
    justify-content: center
    flex-direction: column
    position: absolute
    width: 100%
    height: 100%
    top: 0
    left: 0
    background-color: $color-primary

    p
      font-weight: 600

  a
    font-weight: bold
    color: $color-dark

    &:hover
      text-decoration: none

  p
    color: $color-secondary

    &.name
      font-weight: 600

    &.address
      font-weight: 300

  .action-buttons
    button
      width: 100%

      &+button
        margin-top: 1rem

</style>
