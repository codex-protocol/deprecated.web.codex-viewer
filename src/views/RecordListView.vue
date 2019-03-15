<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <AppHeader title="Collection">
          <template slot="buttons">
            <b-button
              variant="primary"
              v-b-modal.createRecordModal
            >
              Add New Asset
            </b-button>
          </template>
          <template slot="actions" v-if="userRecords.length > 1">
            <RecordSearch
              type="user"
              v-if="userRecords.length >= paginationOptions.pageSize"
            />
            <b-form class="sorting-options">
              <b-form-select
                class="form-control"
                @input="sortingChanged"
                :options="sortingOptions"
                v-model="selectedSortingOption"
              />
            </b-form>
          </template>
        </AppHeader>
        <b-card-group deck class="record-list">
          <SavvySetupCard v-if="showSavvySetupCard" />

          <template v-if="giveaway">
            <ClaimGiveawayCard :giveaway="giveaway" />
            <GiveawayInfoCard :giveaway="giveaway" />
          </template>

          <!-- If there are no marketing cards displayed the user has no records, show a 'how-to' card -->
          <CreateRecordCard v-if="!giveaway && userRecords.length === 0" />

          <RecordListItem
            :key="record.tokenId"
            :codex-record="record"
            v-for="record in userRecords"
          />

        </b-card-group>

        <div class="pagination-controls" v-if="totalRecordCount > paginationOptions.pageSize">
          <b-button
            size="sm"
            class="load-more"
            @click="loadMore()"
            variant="outline-primary"
            :disabled="isLoading || userRecords.length >= totalRecordCount"
          >
            Load More
            <LoadingIcon v-show="isLoading" size="small" />
          </b-button>
        </div>

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

import AppHeader from '../components/core/AppHeader'

import SavvySetupCard from '../components/cards/SavvySetupCard'
import GiveawayInfoCard from '../components/cards/GiveawayInfoCard'
import CreateRecordCard from '../components/cards/CreateRecordCard'
import ClaimGiveawayCard from '../components/cards/ClaimGiveawayCard'

import RecordSearch from '../components/RecordSearch'
import LoadingIcon from '../components/util/LoadingIcon'
import RecordListItem from '../components/RecordListItem'
import CreateRecordModal from '../components/modals/CreateRecordModal'

export default {

  components: {
    AppHeader,

    SavvySetupCard,
    GiveawayInfoCard,
    CreateRecordCard,
    ClaimGiveawayCard,

    LoadingIcon,
    RecordSearch,
    RecordListItem,
    CreateRecordModal,
  },

  data() {
    return {
      isLoading: false,
      selectedSortingOption: '-createdAt',
      sortingOptions: [
        { value: 'createdAt', text: 'Oldest First' },
        { value: '-createdAt', text: 'Newest First' },
        { value: 'metadata.name', text: 'Name (A-Z)' },
        { value: '-metadata.name', text: 'Name (Z-A)' },
      ],
    }
  },

  computed: {
    ...mapState('app', ['giveaway']),
    ...mapState('auth', ['hideSetup']),
    ...mapState('records', ['totalRecordCount', 'paginationOptions']),
    ...mapState('records', {
      userRecords: (state) => {
        return state.lists.userRecords
      },
    }),
    ...mapGetters('auth', ['isNotSavvyUser']),

    showSavvySetupCard() {
      return config.feesEnabled && !this.isNotSavvyUser && !this.hideSetup && !this.giveaway
    },
  },

  methods: {
    loadMore() {
      this.isLoading = true
      return this.$store.dispatch('records/FETCH_NEXT_PAGE')
        .finally(() => {
          this.isLoading = false
        })
    },
    sortingChanged() {
      this.isLoading = true
      return this.$store.dispatch('records/REFRESH_USER_RECORDS', { order: this.selectedSortingOption })
        .finally(() => {
          this.isLoading = false
        })
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

.sorting-options
  @media (min-width: $breakpoint-sm)
    width: 10rem

.record-list
  display: flex
  flex-wrap: wrap

.pagination-controls
  display: flex
  margin: 2rem 0
  justify-content: center

</style>
