<template>
  <div>
    <app-header title="Collection">
      <b-button variant="primary" v-b-modal.createRecordModal>Add New Asset</b-button>
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
    }
  },
  created() {
    EventBus.$emit('events:view-collection-page')
  },
  methods: {
    getRecords() {
      axios.get('/user/records?include=metadata').then((response) => {
        const { result, error } = response.data
        if (error) {
          console.log('there was an error calling getRecords', error)
        } else {
          this.records = result
        }
      }).catch((error) => {
        console.log('there was an error calling getRecords', error)
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
