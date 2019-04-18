<template>
  <b-modal
    :busy="isLoading"
    @ok.prevent="save"
    @hidden="clearModal"
    v-model="modalVisible"
    :ok-title="okButtonTitle"
    id="verifiedUserAndGalleryModal"
    cancel-variant="outline-primary"
    title="Verified Users &amp; Galleries"
  >

    <LoadingOverlay :show="isLoading" type="dark" />

    <b-tabs v-model="tabIndex">
      <b-tab title="Change Verification">

        <p>
          Use this form to "verify" or "un-verify" a user. Note that this
          <em>does not</em> give them a gallery, it only makes their name appear
          in place of their address in a Codex Record's provenance.
        </p>

        <b-form>
          <b-form-group
            label-size="sm"
            label="User Address"
            label-for="userAddress"
          >
            <b-form-input
              required
              id="userAddress"
              v-model="verifyUserForm.userAddress"
            />
          </b-form-group>
          <b-form-group
            label="Name"
            label-size="sm"
            label-for="verifiedUserName"
          >
            <b-form-input
              required
              id="verifiedUserName"
              v-model="verifyUserForm.name"
              :disabled="!verifyUserForm.isVerified"
            />
          </b-form-group>
          <b-form-group
            label-size="sm"
            label="Verified"
            label-for="isVerified"
          >
            <input
              id="isVerified"
              type="checkbox"
              class="toggle-checkbox"
              v-model="verifyUserForm.isVerified"
            />
            <b-form-text>
              Should this user's name be shown instead of their address in provenance events?
            </b-form-text>
          </b-form-group>
        </b-form>
      </b-tab>

      <b-tab title="Create Gallery">

        <p>
          Use this form to create a gallery for the specified user. Note that
          this <em>does not</em> make them a "verified" user, it only enables
          gallery functionality for their account.
        </p>

        <b-form>
          <b-form-group
            label-size="sm"
            label="User Address"
            label-for="ownerAddress"
          >
            <b-form-input
              required
              id="ownerAddress"
              v-model="newGalleryForm.ownerAddress"
            />
          </b-form-group>
          <b-form-group
            label-size="sm"
            label="Gallery Name"
            label-for="galleryName"
          >
            <b-form-input
              required
              id="galleryName"
              v-model="newGalleryForm.name"
            />
          </b-form-group>
          <b-form-group
            label-size="sm"
            label="Gallery Description"
            label-for="galleryDescription"
          >
            <b-form-textarea
              required
              id="galleryDescription"
              v-model="newGalleryForm.description"
            />
          </b-form-group>
          <b-form-group
            label-size="sm"
            label="Share Code"
            label-for="shareCode"
          >
            <b-form-input
              required
              id="shareCode"
              v-model="newGalleryForm.shareCode"
            />
            <b-form-text>
              This should probably be left as the default, but feel free to
              change it if it's weird or too verbose.
            </b-form-text>
          </b-form-group>
          <b-form-group
            label-size="sm"
            label="Sort Order"
            label-for="sortOrder"
          >
            <b-form-input
              required
              type="number"
              id="sortOrder"
              v-model="newGalleryForm.sortOrder"
            />
          </b-form-group>
        </b-form>
      </b-tab>
    </b-tabs>
  </b-modal>
</template>

<script>

import axios from 'axios'
import { mapState } from 'vuex'
import paramCase from 'param-case'

import EventBus from '../../util/eventBus'

import LoadingOverlay from '../util/LoadingOverlay'

export default {

  components: {
    LoadingOverlay,
  },

  data() {
    return {
      tabIndex: 0,
      isLoading: false,
      modalVisible: false,

      verifyUserForm: {
        name: null,
        isVerified: true,
        userAddress: null,
      },

      newGalleryForm: {
        name: null,
        sortOrder: 10,
        shareCode: null,
        description: null,
        ownerAddress: null,
        slideDuration: null,
        userVerifiedName: null,
      },
    }
  },

  computed: {
    ...mapState('auth', ['user']),

    okButtonTitle() {
      switch (this.tabIndex) {
        case 0: return this.verifyUserForm.isVerified ? 'Verify User' : 'Un-verify User'
        case 1: return 'Create Gallery'
        default: return '??'
      }
    },
  },

  watch: {
    'newGalleryForm.name': function updateShareCode(newName) {
      this.newGalleryForm.shareCode = paramCase(newName)
    },
  },

  methods: {

    clearModal() {
      Object.assign(this.$data, this.$options.data.apply(this))
    },

    save() {

      const requestOptions = {}

      switch (this.tabIndex) {
        case 0:
          requestOptions.url = '/admin/verified-user'
          requestOptions.data = this.verifyUserForm
          requestOptions.method = 'put'
          break

        case 1:
          requestOptions.data = this.newGalleryForm
          requestOptions.url = '/admin/gallery'
          requestOptions.method = 'post'
          break

        default:
          return null
      }

      this.isLoading = true

      return axios(requestOptions)
        .then((response) => {
          this.modalVisible = false

          let message = null

          switch (this.tabIndex) {
            case 0:
              message = 'Successfully updated user verification!'
              break

            case 1:
              message = 'Successfully created gallery!'
              break

            default:
              return
          }

          EventBus.$emit('toast:success', message, 5000)

        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not ${this.okButtonTitle.toLowerCase()}: ${error.message}`)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../../assets/variables.styl"

.tab-pane
  padding-top: 1rem

</style>
