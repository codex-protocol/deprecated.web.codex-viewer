<template>
  <nav>
    <div class="logo" v-party-mode-activator>
      <img src="../../assets/logos/codex/gold.svg">
    </div>
    <div class="button-container">
      <b-link
        v-for="(navItem, index) in navItems"
        :key="index"
        :to="navItem.to"
        @click.prevent="navItem.action ? navItem.action() : hideNav()"
        v-if="navItem.condition"
      >
        <img :src="navItem.icon">{{ navItem.text }}
        <b-badge
          variant="danger"
          v-if="navItem.text === 'Transfers' && filteredIncomingTransfers.length > 0"
        >
          {{ filteredIncomingTransfers.length }}
        </b-badge>
      </b-link>
      <hr />
      <div class="contact" v-if="user">
        Logged in as <DisplayName :userObject="user" />
      </div>
      <PrepaidTransactionsControl />
    </div>
  </nav>
</template>

<script>
import {
  mapState,
  mapGetters,
} from 'vuex'

import DisplayName from '../util/DisplayName'
import PrepaidTransactionsControl from '../PrepaidTransactionsControl'

import config from '../../util/config'

import iconHome from '../../assets/icons/home.svg'
import iconCollection from '../../assets/icons/collection.svg'
import iconTransfers from '../../assets/icons/transfers.svg'
import codxIcon from '../../assets/icons/codx-token.svg'
import faucetIcon from '../../assets/icons/faucet.svg'
import starIcon from '../../assets/icons/star.svg'
import galleryIcon from '../../assets/icons/gallery.svg'
import settingsIcon from '../../assets/icons/settings.svg'
import logoutIcon from '../../assets/icons/logout.svg'

export default {
  name: 'AppSideBar',

  props: ['hideNav'],

  components: {
    DisplayName,
    PrepaidTransactionsControl,
  },

  data() {
    return {
      showFaucet: config.showFaucet,
      showCodexGallery: config.showCodexGalleryInSideBar,
    }
  },

  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters('auth', ['isAuthenticated']),
    ...mapGetters('records', ['filteredIncomingTransfers']),

    showManageTokensPage() {
      return this.user && this.user.type === 'savvy' && config.showManageTokensPage
    },

    navItems() {
      return [
        {
          to: '/login',
          condition: !this.isAuthenticated,
          icon: iconHome,
          text: 'Home',
        },
        {
          to: '/collection',
          condition: this.isAuthenticated,
          icon: iconCollection,
          text: 'Collection',
        },
        {
          to: '/transfers',
          condition: this.isAuthenticated,
          icon: iconTransfers,
          text: 'Transfers',
        },
        {
          to: '/manage-tokens',
          condition: this.showManageTokensPage,
          icon: codxIcon,
          text: 'ManageTokens',
        },
        {
          to: '/faucet',
          condition: this.showFaucet,
          icon: faucetIcon,
          text: 'Faucet',
        },
        {
          to: '/extensions',
          condition: this.isAuthenticated,
          icon: starIcon,
          text: 'Extensions',
        },
        {
          to: '/galleries',
          condition: this.showCodexGallery,
          icon: galleryIcon,
          text: 'Galleries',
        },
        {
          to: '/settings',
          condition: this.isAuthenticated,
          icon: settingsIcon,
          text: 'Settings',
        },
        {
          to: '/logout',
          action: this.logout,
          condition: this.isAuthenticated,
          icon: logoutIcon,
          text: 'Logout',
        },
        {
          to: '/login',
          condition: !this.isAuthenticated,
          icon: logoutIcon,
          text: 'Login',
        },
      ]
    },
  },

  methods: {
    logout() {
      this.hideNav()
      this.$store.dispatch('auth/LOGOUT_USER')
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../../assets/variables.styl"

hr
  border-top: 1px solid rgba($color-light, .5)
  margin: 1rem 1rem 0

nav
  display: none
  flex-direction: column
  background-color: rgba(white, .05)
  width: 100%

  @media screen and (min-width: $breakpoint-md)
    display: flex
    width: $side-nav-width
    min-height: 100%
    min-width: @width
    max-width: @width
    overflow-y: auto
    padding-top: 0

a
  padding: 1rem
  display: block
  line-height: 1rem
  color: $color-light
  box-sizing: border-box

  img
    margin-right: .5rem

  &:hover
    text-decoration: none
    background-color: rgba(white, .1)

  &.active
    font-weight: bold
    background-color: rgba(white, .25)

.logo
  height: 4rem
  padding: 1em 0
  text-align: center
  box-sizing: content-box

  img
    height: 100%

.button-container
  flex-grow: 1
  display: flex
  flex-direction: column
  align-items: center

  @media screen and (min-width: $breakpoint-md)
    align-items: normal

  a
    text-align: center
    width: 100%
    margin-bottom: 0.5rem

    @media screen and (min-width: $breakpoint-md)
      text-align: left
      width: auto
      margin-bottom: 0

.badge
  margin-left: .25em
  border-radius: .25em

.contact
  text-align: center
  padding: 1rem
  overflow-wrap: break-word

</style>
