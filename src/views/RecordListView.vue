<template>
  <div>
    <app-header title="Collection">
      <b-button
        variant="primary"
        v-b-modal.createRecordModal
      >
        Add New Asset
      </b-button>

      <b-button
        variant="outline-primary"
        v-if="showGiveawaysAdmin"
        @click="createGiveaway"
      >
        Create giveaway
      </b-button>
    </app-header>
    <b-card-group deck class="record-list" v-if="records.length">
      <record-list-item
        v-for="record in records"
        :codex-record="record"
        :key="record.tokenId"
      />
    </b-card-group>
    <b-card-group deck class="record-list giveaway" v-else-if="giveaway">
      <b-card
        :img-src="giveaway.metadata.mainImage ? giveaway.metadata.mainImage.uri : missingImage"
        img-top
      >
        <b-button
          variant="secondary"
          @click="acceptGiveaway"
        >
          Create Record
        </b-button>
      </b-card>
      <b-card class="info">
        <p>
          The first {{ giveaway.numberOfEditions }} users to participate in the Beta will receive an edition of this piece created by our designer Seb!
        </p>
        <p>
          Click the 'Create Record' button to the left to claim yours.
        </p>
      </b-card>
    </b-card-group>
    <div v-else>
      You have no Records in your collection!
    </div>
    <create-record-modal />
  </div>
</template>

<script>
import axios from 'axios'
import missingImage from '../assets/images/missing-image.png'

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
      giveaway: null,
      missingImage,
    }
  },
  computed: {
    account() {
      return this.$store.state.web3.account
    },
    showGiveawaysAdmin() {
      // This is enforced on the API too, but let's hide it from the UI
      return this.account === '0x8c5013e3a10b97f0382f7afdc559c8615047be20'
    },
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
          if (response.data.result.length) {
            // For now, just select the first giveaway that is available
            this.giveaway = response.data.result[0]
          }
        })
    },
    createGiveaway() {
      axios.post('/giveaways')
        .then((response) => {
          console.log(response)
        })
    },
    acceptGiveaway() {
      axios.get(`/user/giveaway/${this.giveaway._id}`)
        .then((response) => {
          // TODO: Toast & notification
          console.log(response)
        })
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.record-list
  display: flex
  flex-wrap: wrap

  div.card
    flex: none
    width: 25%
    text-align: center

.info
  background: $color-dark
  border: 1px solid $color-light

  div
    display: flex
    flex-direction: column
    justify-content: center
</style>
