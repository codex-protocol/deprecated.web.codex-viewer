<template>
  <footer class="mt-5">
    <div class="links">
      <small>
        <a href="#" v-on:click="toggleAccountDetails" class="text-secondary">
          Toggle account details
        </a>
      </small>
      <account-details class="mt-5" v-if="detailsVisible" />
    </div>
  </footer>
</template>

<script>
import AccountDetails from './AccountDetails';

export default {
  name: 'viewer-footer',
  components: {
    AccountDetails,
  },
  data() {
    return {
      detailsVisible: false,
    };
  },
  methods: {
    toggleAccountDetails(event) {
      event.preventDefault();

      this.detailsVisible = !this.detailsVisible;
    },
  },
};
</script>

<style scoped>
.links {
  text-align: center;
}

a:hover {
  text-decoration: none;
}
</style>
