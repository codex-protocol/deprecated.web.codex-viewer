<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <AppHeader title="Transfers" />
        <TransferListSubheader :transferDirection="transferDirection" />
        <b-card-group
          v-if="records.length > 0"
          deck
          class="record-list"
        >
          <component
            v-for="record in records"
            :codex-record="record"
            :key="record.tokenId"
            :is="listItemComponent"
          />
        </b-card-group>
        <div v-else>
          You have no {{ transferDirection }} transfers.
          To transfer a record you own, go to that record's detail page.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from '../components/core/AppHeader'
import TransferListSubheader from '../components/TransferListSubheader'
import RecordTransferIncomingListItem from '../components/RecordTransferIncomingListItem'
import RecordTransferOutgoingListItem from '../components/RecordTransferOutgoingListItem'

export default {
  name: 'TransferListView',

  components: {
    AppHeader,
    TransferListSubheader,
    RecordTransferIncomingListItem,
    RecordTransferOutgoingListItem,
  },

  props: {
    transferDirection: {
      type: String,
      required: true,
    },
  },

  computed: {
    records() {
      return this.transferDirection === 'incoming'
        ? this.$store.state.records.lists.incomingTransfers
        : this.$store.state.records.lists.outgoingTransfers
    },

    listItemComponent() {
      return this.transferDirection === 'incoming'
        ? RecordTransferIncomingListItem
        : RecordTransferOutgoingListItem
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.record-list
  display: flex
  flex-wrap: wrap
  margin-left: 0
  margin-right: 0

</style>
