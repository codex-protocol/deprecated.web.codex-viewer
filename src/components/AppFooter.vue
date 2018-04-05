<template>
  <footer class="mt-5">
    <div class="links">
      <small>
        <a href="#" @click="toggleMockData" class="text-secondary">
          {{ mockDataString }}
        </a>
        |
        <a href="#" v-on:click="toggleAccountDetails" class="text-secondary">
          Toggle account details
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
      const state = this.$store.state.useMockData
        ? 'ON'
        : 'OFF'

      return `Toggle mock title data (currently ${state})`
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
  },
}
</script>

<style scoped>
.links {
  text-align: center;
}

.links a {
  margin: 0 5px;
}

a:hover {
  text-decoration: none;
}
</style>
