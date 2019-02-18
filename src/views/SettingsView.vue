<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <AppHeader title="Settings &amp; Privacy" />
        <b-tabs>
          <b-tab title="Profile">
            <div
              v-for="(item, index) in profileProperties"
              :key="index"
            >
              {{ item.text }}: {{ item.formatter ? item.formatter(user[item.property]) : user[item.property] }}
            </div>
          </b-tab>
          <b-tab title="Collection">
            <div v-if="userRecords.length > 0">
              <div class="list-container">
                <b-container>
                  <b-row class="list-header-row">
                    <b-col class="image">Image</b-col>
                    <b-col class="name">Asset Name</b-col>
                    <b-col class="toggle" v-if="user && user.isGalleryEnabled">Include in Gallery</b-col>
                    <b-col class="toggle">Details Public</b-col>
                  </b-row>
                </b-container>
                <RecordPrivacySettingsRowItem
                  :key="record.tokenId"
                  :codex-record="record"
                  v-if="record.metadata"
                  v-for="record in userRecords"
                />
              </div>
              <div class="pagination-controls" v-if="totalRecordCount > paginationOptions.pageSize">
                <b-button
                  size="sm"
                  class="load-more"
                  @click="loadMore()"
                  variant="outline-primary"
                  :disabled="isLoadingRecords || userRecords.length >= totalRecordCount"
                >
                  Load More
                  <LoadingIcon v-show="isLoadingRecords" size="small" />
                </b-button>
              </div>
            </div>
            <div v-else>
              You have no Codex Records in your collection!
            </div>
          </b-tab>

          <b-tab title="Email Subscriptions" v-if="user && user.email">
            <EventEmailSettings />
          </b-tab>


          <!-- ADMIN TAB -->
          <b-tab title="Admin" v-if="isAdmin || alwaysShowAdminSettingsTab">
            <section>
              <h2>Admin Rights</h2>
              <b-form-group
                label="Give this account admin rights"
                label-for="isAdminCheckbox"
                label-size="sm"
              >
                <input
                  id="isAdminCheckbox"
                  type="checkbox"
                  :checked="user.isAdmin"
                  class="toggle-checkbox"
                  @change="toggleIsAdmin(!user.isAdmin)"
                />
              </b-form-group>
            </section>
            <section>
              <h2>Giveaways</h2>
              <b-button
                @click="createGiveaway"
                variant="outline-primary"
              >
                Create Giveaway
              </b-button>
            </section>
            <section>
              <h2>Auth Token</h2>
              <b-button
                class="mb-4"
                variant="outline-primary"
                @click="copyToClipboard(authToken, 'Auth Token copied!')"
                >
                Copy
              </b-button>
              <b-button
                class="mb-4 ml-4"
                variant="outline-primary"
                @click="showAuthToken = !showAuthToken"
              >
                {{ showAuthToken ? 'Hide' : 'Show' }}
              </b-button>
              <div class="auth-token-container" :class="{ 'show': showAuthToken }">
                <code>{{ authToken }}</code>
              </div>
            </section>
          </b-tab>
        </b-tabs>
      </div>
    </div>
  </div>
</template>

<script>

import { mapState, mapGetters } from 'vuex'

import config from '../util/config'
import EventBus from '../util/eventBus'
import Giveaway from '../util/api/giveaway'
import { formatDate } from '../util/dateHelpers'
import AppHeader from '../components/core/AppHeader'
import copyToClipboard from '../util/copyToClipboard'
import LoadingIcon from '../components/util/LoadingIcon'
import EventEmailSettings from '../components/EventEmailSettings'
import RecordPrivacySettingsRowItem from '../components/RecordPrivacySettingsRowItem'

export default {

  components: {
    AppHeader,
    LoadingIcon,
    EventEmailSettings,
    RecordPrivacySettingsRowItem,
  },

  data() {
    const profileProperties = [
      {
        property: 'createdAt',
        text: 'Created at',
        formatter: formatDate,
      },

      {
        property: 'address',
        text: 'Ethereum address',
      },
      {
        property: 'email',
        text: 'Email address',
      },
    ]

    return {
      profileProperties,
      newIsAdmin: false,
      showAuthToken: false,
      isLoadingRecords: false,
      alwaysShowAdminSettingsTab: config.alwaysShowAdminSettingsTab,
    }
  },

  computed: {
    ...mapState('app', ['giveaway']),
    ...mapState('auth', ['user', 'authToken']),
    ...mapState('records', ['totalRecordCount', 'paginationOptions']),
    ...mapGetters('auth', ['isAdmin']),
    ...mapState('records', {
      userRecords: (state) => {
        return state.lists.userRecords
      },
    }),
  },

  methods: {
    copyToClipboard,
    toggleIsAdmin(isAdmin) {
      return this.$store.dispatch('auth/UPDATE_IS_ADMIN', isAdmin)
        .then(() => {
          EventBus.$emit('toast:success', 'Updated isAdmin!', 5000)
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not update isAdmin: ${error.message}`)
        })
    },
    createGiveaway() {
      return Giveaway.createNewGiveaway()
        .then(() => {
          EventBus.$emit('toast:success', 'Created giveaway!', 5000)
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not create giveaway: ${error.message}`)
        })
    },
    loadMore() {
      this.isLoadingRecords = true
      return this.$store.dispatch('records/FETCH_NEXT_PAGE')
        .finally(() => {
          this.isLoadingRecords = false
        })
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.list-container
  display: flex
  flex-wrap: wrap
  flex-direction: row
  align-items: flex-start
  justify-content: space-between

  background-color: white

.list-header-row
  display: flex
  align-items: center

  max-width: 100%
  min-height: 3rem
  font-weight: 600
  color: $color-gray
  font-size: 0.875rem

  .name
    flex-grow: 5

  .toggle
    text-align: center

.tab-pane
  margin-top: 1rem

section
  &+section
    margin-top: 4rem

.auth-token-container
  opacity: 0
  left: 50rem
  padding: 1rem
  position: relative
  border-radius: 4px
  background-color: rgba(#e83e8c, .1)
  transition: opacity ease .1s, left ease .5s

  &.show
    left: 0
    opacity: 1

.pagination-controls
  display: flex
  margin: 2rem 0
  justify-content: center

</style>
