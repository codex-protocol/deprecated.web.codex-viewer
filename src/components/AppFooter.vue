<template>
  <footer class="text-secondary mt-5">
    <div class="links" v-if="account">
      <small>
        Logged in as {{ account }}
      </small>
    </div>
    <div class="links">
      <small>
        <a href="#" @click="toggleMockData">
          {{ mockDataString }}
        </a>
        |
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
    mockDataString() {
      const state = this.$store.state.web3.useMockData
        ? 'ON'
        : 'OFF'

      return `Toggle mock title data (currently ${state})`
    },
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
    toggleMockData(event) {
      event.preventDefault()

      this.$store.dispatch('toggleMockData')
    },
    logout(event) {
      event.preventDefault()

      this.$store.commit('clearAuthToken')
      this.$router.replace('/login')
    },
  },
}
</script>

<style scoped>
.links {
  text-align: center;
}

.links a {
  margin: 0 5px;
  color: inherit;
}

a:hover {
  text-decoration: none;
}
</style>
