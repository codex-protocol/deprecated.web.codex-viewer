<template>
  <div>
    <app-header title="Collection">
      <b-button variant="primary" v-b-modal.createRecordModal>Add New Asset</b-button>
      <b-button variant="outline-primary" @click="createGiveaway">Create giveaway</b-button>
      <b-button variant="outline-primary" @click="acceptGiveaway">Accept giveaway</b-button>
    </app-header>
    <b-card-group deck class="record-list" v-if="records.length">
      <record-list-item v-for="record in records"
        :codex-record="record"
        :key="record.tokenId"
      />
    </b-card-group>
    <div v-else>
      You have no Records in your collection!
    </div>
    <create-record-modal />
  </div>
</template>

<script>
import axios from 'axios'

import AppHeader from '../components/AppHeader'
import RecordListItem from '../components/RecordListItem'
import CreateRecordModal from '../components/modals/CreateRecordModal'
import EventBus from '../util/eventBus'

export default {
  name: 'record-list',
  components: {
    AppHeader,
    RecordListItem,
    CreateRecordModal,
  },
  data() {
    return {
      records: [],
      giveaways: [],
    }
  },
  mounted() {
    // @NOTE: incoming transfers and newly minted Records both have the same
    //  effect of pushing the new record onto this.records, so we use the same
    //  handler for both
    EventBus.$on('socket:mint-confirmed', this.addTransferredRecordHandler)
    EventBus.$on('socket:record-transferred:new-owner', this.addTransferredRecordHandler)
    EventBus.$on('socket:record-transferred:old-owner', this.removeTransferredRecordHandler)
  },
  beforeDestroy() {
    EventBus.$off('socket:mint-confirmed', this.addTransferredRecordHandler)
    EventBus.$off('socket:record-transferred:new-owner', this.addTransferredRecordHandler)
    EventBus.$off('socket:record-transferred:old-owner', this.removeTransferredRecordHandler)
  },
  created() {
    this.getRecords()
    this.getGiveaways()
    EventBus.$emit('events:view-collection-page')
  },
  methods: {
    // add the record to the collection if it was just transferred
    addTransferredRecordHandler(codexRecordToAdd) {
      this.records.push(codexRecordToAdd)
    },
    // add the record from the collection if it was just transferred
    removeTransferredRecordHandler(codexRecordToRemove) {
      this.records = this.records.filter((codexRecord) => {
        return codexRecord.tokenId !== codexRecordToRemove.tokenId
      })
    },
    getRecords() {
      axios.get('/user/records')
        .then((response) => {
          this.records = response.data.result
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not get collection: ${error.message}`)
          console.error('Could not get collection:', error)
        })
    },
    getGiveaways() {
      axios.get('/giveaways')
        .then((response) => {
          this.giveaways = response.data.result
        })
    },
    createGiveaway() {
      axios.post('/giveaways')
        .then((response) => {
          console.log(response)
        })
    },
    acceptGiveaway() {
      axios.get(`/user/giveaway/${this.giveaways[0]._id}`)
        .then((response) => {
          console.log(response)
        })
    },
  },
}
</script>

<style lang="stylus" scoped>
.record-list
  display: flex
  flex-wrap: wrap
</style>
