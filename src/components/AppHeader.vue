<template>
  <div class="container">
    <b-navbar>

    <b-navbar-brand>
      <img src="../assets/logo.svg" />
    </b-navbar-brand>

    <b-navbar-nav class="ml-auto">
      <b-nav-form>
        <b-button class="mr-3" v-if="showBack" @click="goBack">Go back</b-button>
        <b-button v-b-modal.createTitleModal>Create title</b-button>
      </b-nav-form>
    </b-navbar-nav>

    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'app-header',
  props: ['showBack'],
  methods: {
    goBack() {
      if (window.history.length > 1) {
        this.$router.go(-1)
      } else {
        this.$router.push('/')
      }
    },
  },
  computed: {
  },
}
</script>

<style scoped>
</style>
