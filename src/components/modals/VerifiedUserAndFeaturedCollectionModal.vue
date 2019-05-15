<template>
  <b-modal
    :busy="isLoading"
    @ok.prevent="save"
    @hidden="clearModal"
    v-model="modalVisible"
    :ok-title="okButtonTitle"
    cancel-variant="outline-primary"
    id="verifiedUserAndFeaturedCollectionModal"
    title="Verified Users &amp; Featured Collections"
  >

    <LoadingOverlay :show="isLoading" type="dark" />

    <b-tabs v-model="tabIndex">
      <b-tab title="Change Verification">

        <p>
          Use this form to "verify" or "un-verify" a user. Note that this
          <em>does not</em> give them a featured collection, it only makes
          their name appear in place of their address in a Codex Record's
          provenance.
        </p>

        <b-form>
          <b-form-group
            label-size="sm"
            label="User Address"
            label-for="verifiedUserAddress"
          >
            <b-form-input
              required
              id="verifiedUserAddress"
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

      <b-tab title="Create Featured Collection">

        <p>
          Use this form to create a featured collection for the specified user.
          This will list all their public records under "featured collections".
          Note that this <em>does not</em> make them a "verified" user, it only
          enables "featured collection" functionality for their account.
        </p>

        <b-form>
          <b-form-group
            label-size="sm"
            label="User Address"
            label-for="featuredCollectionUserAddress"
          >
            <b-form-input
              required
              id="featuredCollectionUserAddress"
              v-model="newFeaturedCollectionForm.userAddress"
            />
          </b-form-group>
          <b-form-group
            label-size="sm"
            label="Featured Collection Name"
            label-for="featuredCollectionName"
          >
            <b-form-input
              required
              id="featuredCollectionName"
              v-model="newFeaturedCollectionForm.name"
            />
          </b-form-group>
          <b-form-group
            label-size="sm"
            label="Featured Collection Description"
            label-for="featuredCollectionDescription"
          >
            <b-form-textarea
              rows="4"
              required
              id="featuredCollectionDescription"
              v-model="newFeaturedCollectionForm.description"
            />
          </b-form-group>
          <b-form-group
            label-size="sm"
            label="Featured Collection Icon Url"
            label-for="featuredCollectionIconUrl"
          >
            <b-form-input
              required
              id="featuredCollectionIconUrl"
              v-model="newFeaturedCollectionForm.iconUrl"
            />
            <b-form-text>@TODO: make this a file upload</b-form-text>
          </b-form-group>

          <hr>

          <b-form-group
            label-size="sm"
            label="Share Code"
            label-for="shareCode"
          >
            <b-form-input
              required
              id="shareCode"
              v-model="newFeaturedCollectionForm.shareCode"
            />
            <b-form-text>
              This should probably be left as the default, but feel free to
              change it if it's weird or too verbose.
            </b-form-text>
          </b-form-group>
          <b-form-group
            label-size="sm"
            label="User Contact Link"
            label-for="featuredCollectionContactLink"
          >
            <b-form-input
              id="featuredCollectionContactLink"
              v-model="newFeaturedCollectionForm.contactLink"
            />
          </b-form-group>
          <b-form-group
            label-size="sm"
            label="Social Links"
            class="new-featured-collection-social-links"
          >
            <b-form-group
              :key="name"
              label-size="sm"
              :label="name | titleCase"
              :label-for="`featuredCollectionSocialLink_${name}`"
              v-for="(value, name) in newFeaturedCollectionForm.socialLinks"
            >
              <b-form-input
                :id="`featuredCollectionSocialLink_${name}`"
                v-model="newFeaturedCollectionForm.socialLinks[name]"
              />
            </b-form-group>
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

      newFeaturedCollectionForm: {
        name: null,
        shareCode: null,
        contactLink: null,
        description: null,
        userAddress: null,
        userVerifiedName: null,
        iconUrl: 'https://s3-us-west-2.amazonaws.com/codex.registry-production/assets/missing-image.png',

        socialLinks: {
          website: null,
          youtube: null,
          twitter: null,
          facebook: null,
          instagram: null,
        },
      },
    }
  },

  computed: {
    ...mapState('auth', ['user']),

    okButtonTitle() {
      switch (this.tabIndex) {
        case 0: return this.verifyUserForm.isVerified ? 'Verify User' : 'Un-verify User'
        case 1: return 'Create Featured Collection'
        default: return '??'
      }
    },
  },

  watch: {
    'newFeaturedCollectionForm.name': function updateShareCode(newName) {
      this.newFeaturedCollectionForm.shareCode = paramCase(newName)
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
          requestOptions.data = this.newFeaturedCollectionForm
          requestOptions.url = '/admin/featured-collection'
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
              message = 'Successfully created featured collection!'
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

fieldset > div
  padding-left: 1rem
  border-left: 4px solid rgba(white, .1)

</style>

<style lang="stylus">

@import "../../assets/variables.styl"

.new-featured-collection-social-links > div
  padding-left: 1rem
  border-left: 4px solid rgba(white, .1)

</style>
