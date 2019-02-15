<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <AppHeader title="Settings &amp; Privacy" />
        <b-tabs>

          <!-- PROFILE TAB -->
          <b-tab title="Profile">

            <section>
              <h4>Account Information</h4>
              <div class="details-table">
                <template v-if="isNotSavvyUser">
                  <div class="name-row" v-if="user.name">
                    <span>Name</span>
                    <span>{{ user.name }}</span>
                  </div>
                  <div>
                    <span>Email Address</span>
                    <span>{{ user.email }}</span>
                  </div>
                </template>
                <div>
                  <span>Ethereum Address</span>
                  <span>{{ user.address }}</span>
                </div>
                <div>
                  <span>Account Created On</span>
                  <span>{{ user.createdAt | formatDate() }}</span>
                </div>
                <div>
                  <span>Number of Records Owned</span>
                  <span>{{ totalRecordCount }}</span>
                </div>
                <div v-if="isNotSavvyUser">
                  <span>CODX Balance</span>
                  <span>{{ availableCODXBalance }}</span>
                </div>
              </div>
            </section>
            <section v-if="isNotSavvyUser">
              <h4>{{ user.isPasswordSet ? 'Change' : 'Set' }} Password</h4>

              <b-form
                class="change-password-form"
                @submit.prevent="changePassword()"
              >

                <LoadingOverlay type="dark" :show="changePasswordForm.isLoadingPasswordChange" />

                <b-alert variant="primary" :show="!user.isPasswordSet">
                  Your account was created via social login. If you'd like to also
                  enable the ability to log in via email &amp; password, you may
                  set a password here.
                </b-alert>

                <b-form-group v-if="user.isPasswordSet">
                  <b-form-input
                    required
                    type="password"
                    placeholder="Old Password"
                    v-model="changePasswordForm.oldPassword"
                  />
                </b-form-group>
                <b-form-group>
                  <b-form-input
                    required
                    type="password"
                    v-model="changePasswordForm.newPassword"
                    placeholder="New Password (4+ characters)"
                  />
                </b-form-group>
                <b-form-group>
                  <b-form-input
                    required
                    type="password"
                    placeholder="Confirm New Password"
                    v-model="changePasswordForm.confirmNewPassword"
                  />
                </b-form-group>
                <div class="form-button-container">
                  <b-button
                    type="submit"
                    variant="primary"
                    class="form-button"
                    :disabled="changePasswordForm.isLoadingPasswordChange"
                  >
                    Save
                  </b-button>
                </div>
              </b-form>
            </section>
          </b-tab>


          <!-- COLLECTION TAB -->
          <b-tab title="Collection">

            <div v-if="userRecords.length === 0">
              You have no Codex Records in your collection!
            </div>

            <div v-else>
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
                  @click="loadMoreRecords()"
                  variant="outline-primary"
                  :disabled="isLoadingRecords || userRecords.length >= totalRecordCount"
                >
                  Load More
                  <LoadingIcon v-show="isLoadingRecords" size="small" />
                </b-button>
              </div>
            </div>
          </b-tab>


          <!-- EMAIL SUBSCRIPTION TAB -->
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

import axios from 'axios'
import { mapState, mapGetters } from 'vuex'

import config from '../util/config'
import EventBus from '../util/eventBus'
import Giveaway from '../util/api/giveaway'
import AppHeader from '../components/core/AppHeader'
import copyToClipboard from '../util/copyToClipboard'
import LoadingIcon from '../components/util/LoadingIcon'
import LoadingOverlay from '../components/util/LoadingOverlay'
import EventEmailSettings from '../components/EventEmailSettings'
import RecordPrivacySettingsRowItem from '../components/RecordPrivacySettingsRowItem'

export default {

  components: {
    AppHeader,
    LoadingIcon,
    LoadingOverlay,
    EventEmailSettings,
    RecordPrivacySettingsRowItem,
  },

  data() {
    return {

      changePasswordForm: {
        oldPassword: null,
        newPassword: null,
        confirmNewPassword: null,
        isLoadingPasswordChange: false,
      },

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
    ...mapGetters('auth', ['isAdmin', 'isNotSavvyUser', 'availableCODXBalance']),
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

    loadMoreRecords() {
      this.isLoadingRecords = true
      return this.$store.dispatch('records/FETCH_NEXT_PAGE')
        .finally(() => {
          this.isLoadingRecords = false
        })
    },

    changePassword() {

      const errors = []

      if (!this.changePasswordForm.newPassword) {
        errors.push('Password is required')
      }

      if (this.changePasswordForm.newPassword !== this.changePasswordForm.confirmNewPassword) {
        errors.push('Passwords fields must match')
      }

      if (this.changePasswordForm.newPassword.length < 4) {
        errors.push('Password must be longer than 4 characters')
      }

      if (errors.length !== 0) {
        EventBus.$emit('toast:error', `Please fix these error(s):\n\n${errors.join('\n\n')}`)
        return null
      }

      this.changePasswordForm.isLoadingPasswordChange = true

      const requestOptions = {
        url: '/user/password',
        data: this.changePasswordForm,
        method: this.user.isPasswordSet ? 'put' : 'post',
      }

      return axios(requestOptions)
        .then((response) => {
          this.changePasswordForm.oldPassword = null
          this.changePasswordForm.newPassword = null
          this.changePasswordForm.confirmNewPassword = null

          if (!this.user.isPasswordSet) {
            this.$store.commit('auth/SET_USER_PROPERTIES', { isPasswordSet: true })
          }

          EventBus.$emit('toast:success', 'Password succesfully changed!', 5000)
          return this.$store.dispatch('auth/SET_AUTH_TOKEN_AND_CLEAR_QUERY_PARAMS', response.data.result.newAuthToken)
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not change password: ${error.message}`)
        })
        .finally(() => {
          this.changePasswordForm.isLoadingPasswordChange = false
        })

    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

.details-table
  @media screen and (max-width: $breakpoint-sm)
    font-size: small

.change-password-form
  width: 100%
  position: relative

  @media screen and (min-width: $breakpoint-sm)
    width: 50%

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
