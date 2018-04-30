<template>
  <footer class="text-secondary mt-5">
    <div class="links" v-if="account">
      <small>
        Logged in as {{ account }}
      </small>
    </div>
    <div class="links">
      <small>
        <a href="#" v-on:click="toggleAccountDetails">
          Toggle account details
        </a>
        |
        <a href="#" @click="logout">
          Logout
        </a>
      </small>
      <account-details class="mt-5" v-if="detailsVisible" />
    </div>
  </footer>
</template>

<script>
import AccountDetails from './AccountDetails'

export default {
  name: 'app-footer',
  components: {
    AccountDetails,
  },
  data() {
    return {
      detailsVisible: false,
    }
  },
  computed: {
    account() {
      if (this.$store.state.auth.token) {
        return this.$store.state.web3.account
      }

      return null
    },
  },
  methods: {
    toggleAccountDetails(event) {
      event.preventDefault()

      this.detailsVisible = !this.detailsVisible
    },
    logout(event) {
      event.preventDefault()

      this.$store.dispatch('logout', this.$router)
    },
  },
}
</script>

<style lang="stylus" scoped>
.links
  text-align center

.links a
  margin 0 5px
  color inherit

a:hover
  text-decoration none
</style>
