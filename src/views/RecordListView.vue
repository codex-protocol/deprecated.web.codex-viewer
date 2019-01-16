<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <AppHeader title="Collection">
          <b-button
            variant="primary"
            v-b-modal.createRecordModal
          >
            Add New Asset
          </b-button>

          <b-button
            variant="outline-primary"
            @click="createGiveaway"
            v-if="showCreateGiveawayButton"
          >
            Create Giveaway
          </b-button>
        </AppHeader>
        <b-card-group deck class="record-list">
          <SavvySetupCard v-if="showSavvySetupCard" />

          <template v-if="giveaway">
            <ClaimGiveawayCard :giveaway="giveaway" />
            <GiveawayInfoCard :giveaway="giveaway" />
          </template>

          <!-- If there are no marketing cards displayed the user has no records, show a 'how-to' card -->
          <CreateRecordCard v-if="!giveaway && userRecords.length === 0" />
          <template v-else>
            <RecordListItem
              v-for="record in userRecords"
              :codex-record="record"
              :key="record.tokenId"
            />
          </template>
        </b-card-group>
        <CreateRecordModal />
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
} from 'vuex'

import config from '../util/config'
import EventBus from '../util/eventBus'
import Giveaway from '../util/api/giveaway'

import AppHeader from '../components/core/AppHeader'

import SavvySetupCard from '../components/cards/SavvySetupCard'
import GiveawayInfoCard from '../components/cards/GiveawayInfoCard'
import CreateRecordCard from '../components/cards/CreateRecordCard'
import ClaimGiveawayCard from '../components/cards/ClaimGiveawayCard'


import RecordListItem from '../components/RecordListItem'
import CreateRecordModal from '../components/modals/CreateRecordModal'

export default {

  components: {
    AppHeader,

    SavvySetupCard,
    GiveawayInfoCard,
    CreateRecordCard,
    ClaimGiveawayCard,

    RecordListItem,
    CreateRecordModal,
  },

  computed: {
    ...mapState('app', ['giveaway']),
    ...mapState('auth', ['hideSetup']),
    ...mapState('records', {
      userRecords: (state) => {
        return state.lists.userRecords
      },
    }),
    ...mapGetters('auth', ['isAdmin', 'isNotSavvyUser']),

    showCreateGiveawayButton() {
      return this.isAdmin && !this.giveaway
    },

    showSavvySetupCard() {
      return config.feesEnabled && !this.isNotSavvyUser && !this.hideSetup && !this.giveaway
    },
  },

  methods: {
    createGiveaway() {
      Giveaway.createNewGiveaway()
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not create giveaway: ${error.message}`)
        })
    },
  },
}
</script>

<style lang="stylus" scoped>
.record-list
  display: flex
  flex-wrap: wrap
  align-items: start
</style>
